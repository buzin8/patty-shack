import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export const inEditorFrame = (() => {
  if (typeof window === 'undefined') return false;
  try { return window.self !== window.top; } catch { return true; }
})();

export function isSmoothScrollActive() {
  return lenis !== null;
}

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // lerp-based smoothing stays fluid even when frames are delayed (e.g. editor preview)
  lenis = new Lenis({ lerp: inEditorFrame ? 0.12 : 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(500, 33);
}

export function stopSmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

// Never use lenis.stop(): it sets overflow:clip on <html>, hiding the scrollbar and shifting layout.
export function pauseSmoothScroll() {}

export function resumeSmoothScroll() {}

export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

export function smoothScrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -8, duration: 1.2, force: true });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}