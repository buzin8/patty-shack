import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroFoodStage from './HeroFoodStage';
import HeroStoryCopy from './HeroStoryCopy';
import HeroStaticStory from './HeroStaticStory';
import FrameStore from '@/hooks/frameStore';
import drawHeroFrame from '@/hooks/drawHeroFrame';
import { copyAt, stepAt } from '@/hooks/heroTimeline';
import { inEditorFrame, isSmoothScrollActive } from '@/hooks/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export default function Hero() {
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const desktop = useMedia('(min-width: 768px)');
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const storeRef = useRef<FrameStore | null>(null);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const copyCache = useRef<number[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stepCache = useRef(-1);
  const raysRef = useRef<HTMLDivElement>(null);
  const raysCache = useRef(-1);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const lastTs = useRef(0);
  const rafRef = useRef(0);
  const drawKey = useRef('');
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const desktopRef = useRef(desktop);
  desktopRef.current = desktop;

  const register = useCallback((i: number) => (el: HTMLElement | null) => { copyRefs.current[i] = el; }, []);

  // One rAF per frame at most; DOM/canvas are touched only when values actually change.
  const render = useCallback((ts: number) => {
    rafRef.current = 0;
    // Inertial smoothing: discrete mouse-wheel steps glide toward the target like a trackpad.
    const dt = lastTs.current ? Math.min(64, ts - lastTs.current) : 16;
    lastTs.current = ts;
    const target = targetRef.current;
    const diff = target - progressRef.current;
    if (Math.abs(diff) < 0.0002) {
      progressRef.current = target;
      lastTs.current = 0;
    } else {
      // Page scroll is already smoothed globally; only a light follow here to avoid double lag.
      const tau = isSmoothScrollActive() ? 45 : 140;
      progressRef.current += diff * (1 - Math.exp(-dt / tau));
      rafRef.current = requestAnimationFrame(render);
    }
    const p = progressRef.current;
    copyAt(p).forEach((raw, i) => {
      const o = Math.round(raw * 100) / 100;
      const el = copyRefs.current[i];
      if (!el || copyCache.current[i] === o) return;
      copyCache.current[i] = o;
      el.style.opacity = String(o);
      el.style.transform = i < 4 ? `translate3d(0, ${(1 - o) * 18}px, 0)` : '';
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      el.setAttribute('aria-hidden', o > 0.5 ? 'false' : 'true');
    });
    // Rays clear from the centre outward over the first stretch of scroll.
    const rt = Math.round(Math.min(1, Math.max(0, p / 0.1)) * 100) / 100;
    if (rt !== raysCache.current && raysRef.current) {
      raysCache.current = rt;
      raysRef.current.style.setProperty('--rt', String(rt));
      raysRef.current.style.opacity = String(1 - rt * rt);
    }
    const step = stepAt(p);
    if (step !== stepCache.current) {
      stepCache.current = step;
      dotRefs.current.forEach((d, i) => { if (d) d.dataset.active = String(i === step); });
    }
    const ctx = ctxRef.current;
    const store = storeRef.current;
    if (!ctx || !store) return;
    const { w, h, dpr } = sizeRef.current;
    if (!w || !h) return;
    drawKey.current = drawHeroFrame(ctx, w, h, dpr, p, desktopRef.current, store, drawKey.current);
  }, []);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
  }, [render]);

  // One store per mount: progressive download, bounded decode cache.
  useEffect(() => {
    if (reduced) return undefined;
    const store = new FrameStore(window.matchMedia('(min-width: 768px)').matches ? 5 : 4);
    store.onChange = () => { drawKey.current = ''; schedule(); };
    storeRef.current = store;
    store.init().then(() => setReady(true)).catch(() => setFailed(true));
    return () => { store.dispose(); storeRef.current = null; };
  }, [reduced, schedule]);

  // Canvas sized to its display box; DPR capped by device class and total pixel budget.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    ctxRef.current = canvas.getContext('2d', { alpha: false });
    let lastW = -1;
    let lastH = -1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      // Ignore no-op observer callbacks (e.g. during pin) so the canvas is never reset mid-scroll.
      if (Math.round(r.width) === lastW && Math.round(r.height) === lastH) return;
      lastW = Math.round(r.width);
      lastH = Math.round(r.height);
      // Frames are ~0.5x source; rendering beyond ~1.5x DPR only adds fill cost, not detail.
      // Editor preview runs nested in another page, so keep the canvas lighter there.
      const cap = inEditorFrame ? 1 : 1.5;
      let dpr = Math.min(window.devicePixelRatio || 1, cap);
      const budget = inEditorFrame ? 1_600_000 : 3_200_000;
      if (r.width * r.height * dpr * dpr > budget) dpr = Math.sqrt(budget / (r.width * r.height));
      sizeRef.current = { w: r.width, h: r.height, dpr };
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      drawKey.current = '';
      schedule();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      // Release the canvas backing memory when the hero leaves the page
      canvas.width = 0;
      canvas.height = 0;
      ctxRef.current = null;
    };
  }, [schedule, reduced, failed]);

  // Scroll position is the only clock: pin + scrub, no snap, no autoplay.
  useEffect(() => {
    if (reduced || failed || !sectionRef.current || !stageRef.current) return undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=550%',
        pin: stageRef.current,
        scrub: true,
        snap: false as any,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { targetRef.current = self.progress; schedule(); },
        onRefresh: (self) => { targetRef.current = self.progress; progressRef.current = self.progress; schedule(); },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [reduced, failed, schedule]);

  useEffect(() => { drawKey.current = ''; schedule(); }, [ready, desktop, schedule]);

  if (reduced || failed) return <HeroStaticStory />;

  return (
    <section id="top" ref={sectionRef} className="relative text-background-50 bg-primary-500">
      <div ref={stageRef} className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-primary-500">
        <div className="hero-frame absolute inset-0" style={{ backgroundColor: '#000' }}>
        <HeroFoodStage canvasRef={canvasRef} />
        <div ref={raysRef} className="hero-rays pointer-events-none absolute inset-0 z-[15]" aria-hidden="true" />
        <HeroStoryCopy register={register} />
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              data-active={i === 0 ? 'true' : 'false'}
              className="hero-dot block w-[3px] h-6 rounded-full"
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}