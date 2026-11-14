import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { signatureBurgers, fullMenu, menuMoreCard } from '@/mocks/menu';

const tilts = ['-rotate-[1.2deg]', 'rotate-[0.8deg]', '-rotate-[0.6deg]'];
const cardW = 'w-[74vw] sm:w-[300px] lg:w-[320px] shrink-0';

export default function SignatureBurgers() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distRef = useRef(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const dist = distRef.current;
      const top = pin.getBoundingClientRect().top;
      const p = dist > 0 ? Math.min(1, Math.max(0, -top / dist)) : 0;
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    };
    const measure = () => {
      distRef.current = Math.max(0, track.scrollWidth - window.innerWidth);
      pin.style.height = `${window.innerHeight + distRef.current}px`;
      update();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const step = (dir: number) => window.scrollBy({ top: dir * 360, behavior: 'smooth' });

  return (
    <section id="menu" className="relative scroll-mt-[76px] bg-background-100 border-t-[2.5px] border-foreground-950" data-product-shop>
      <div className="absolute inset-0 halftone pointer-events-none" aria-hidden="true" />
      <div ref={pinRef} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-[76px]">
          <div className="wrap relative w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
              <div data-m-group>
                <div data-m="fade"><span className="sticker bg-background-50 text-foreground-950 tilt-r">signature picks</span></div>
                <h2 data-m="up" className="h-section mt-5">Pick your <span className="text-primary-500">fire.</span></h2>
              </div>
              <div className="flex gap-3">
                <button type="button" aria-label="Previous" onClick={() => step(-1)} className="w-12 h-12 flex items-center justify-center rounded-full border-[2.5px] border-foreground-950 bg-background-50 hover:bg-primary-500 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-arrow-left-line text-xl" />
                </button>
                <button type="button" aria-label="Next" onClick={() => step(1)} className="w-12 h-12 flex items-center justify-center rounded-full border-[2.5px] border-foreground-950 bg-background-50 hover:bg-primary-500 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-arrow-right-line text-xl" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={trackRef}
            className="relative flex w-max items-stretch gap-6 lg:gap-8 px-4 md:px-[max(24px,calc((100vw-1280px)/2+24px))] py-4 will-change-transform"
          >
            {signatureBurgers.map((b, i) => (
              <article key={b.id} className={`group ${cardW} ${tilts[i % 3]}`}>
                <div className="relative h-full poster-card hard-drop transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="absolute left-4 top-4 z-20 sticker !text-[14px] bg-accent-500 text-background-50 tilt-l">{b.tag}</span>
                  <div data-m="fade" data-m-delay={String((i % 3) * 100)} className={`split-rays split-v${(i % 6) + 1} relative aspect-square w-full overflow-hidden border-b-[2.5px] border-foreground-950 p-[7%] pt-[14%]`}>
                    <img
                      src={b.image}
                      alt={`${b.name} at Patty Shack`}
                      title={`${b.name} — Patty Shack`}
                      decoding="async"
                      className="relative z-10 h-full w-full object-contain object-center drop-shadow-[0_10px_8px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5" data-m="up" data-m-delay={String((i % 3) * 100 + 220)}>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="h-card">{b.name}</h3>
                      <span className="display text-[22px] rounded-full bg-foreground-950 text-background-50 px-3 py-1.5 whitespace-nowrap">{b.price}</span>
                    </div>
                    <p className="mt-3 text-sm leading-[1.6] text-foreground-700 min-h-[45px]">{b.desc}</p>
                  </div>
                </div>
              </article>
            ))}

            <article className={`${cardW} rotate-[0.8deg]`}>
              <Link to="/menu" className="group relative block h-full poster-card hard-drop cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-full flex-col bg-primary-500 text-background-50">
                  <div className="split-rays split-v4 relative aspect-square w-full overflow-hidden border-b-[2.5px] border-foreground-950">
                    <span className="absolute left-4 top-4 z-20 sticker !text-[14px] bg-background-50 text-foreground-950 tilt-r">+ more</span>
                    <img src={signatureBurgers[3].image} alt="Loaded Shack Fries" decoding="async" className="absolute z-10 left-[2%] bottom-[6%] w-[52%] -rotate-[10deg] object-contain transition-transform duration-500 group-hover:-translate-x-2" />
                    <img src={signatureBurgers[5].image} alt="Vanilla Bean Shake" decoding="async" className="absolute z-10 right-[2%] bottom-[8%] w-[40%] rotate-[8deg] object-contain transition-transform duration-500 group-hover:translate-x-2" />
                    <img src={signatureBurgers[0].image} alt="The OG Smash burger" decoding="async" className="absolute z-20 left-1/2 bottom-[2%] w-[58%] -translate-x-1/2 object-contain drop-shadow-[0_10px_8px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="h-card">{menuMoreCard.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fullMenu.map((g) => (
                        <span key={g.group} className="rounded-full border-2 border-background-50/70 px-3 py-1 text-xs font-semibold whitespace-nowrap">{g.group}</span>
                      ))}
                    </div>
                    <span className="mt-auto pt-4 inline-flex items-center justify-between gap-3 font-bold whitespace-nowrap">
                      {menuMoreCard.cta}
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50 text-foreground-950 transition-transform group-hover:translate-x-1">
                        <i className="ri-arrow-right-up-line text-lg" />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </div>

      <div id="full-menu" className="relative scroll-mt-[76px] wrap py-20 md:py-28">
        <div className="poster-card p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {fullMenu.map((g) => (
            <div key={g.group} data-m-group>
              <h3 data-m="fade" className="h-card inline-block rounded-full bg-primary-500 text-background-50 px-4 py-2 border-[2.5px] border-foreground-950">{g.group}</h3>
              <ul className="mt-5">
                {g.items.map((it) => (
                  <li key={it.name} data-m="up" className="flex h-14 items-center justify-between gap-4 border-b-2 border-dashed border-foreground-300 text-[15px]">
                    <span className="font-semibold">{it.name}</span>
                    <span className="display text-lg tabular-nums">{it.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="hand mt-8 text-lg text-foreground-700 tilt-xs inline-block">* all orders taken in-store at Infinity Benchmark, Ground Floor, near RDB Cinema · Sector V</p>
      </div>
    </section>
  );
}
