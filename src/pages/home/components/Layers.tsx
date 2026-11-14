import { layers } from '@/mocks/menu';

export default function Layers() {
  return (
    <section className="bg-background-50 wrap py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div data-m="fade"><span className="sticker bg-background-50 text-foreground-950 tilt-l">anatomy</span></div>
          <h2 data-m="up" className="h-section mt-6">Every layer <span className="scribble relative z-0">counts.</span></h2>
          <ol className="mt-10 poster-card px-5" data-m-group>
            {layers.map((l, i) => (
              <li key={l.no} data-m="up" className={`grid grid-cols-[52px_1fr] sm:grid-cols-[60px_1fr_auto] items-center gap-2 h-16 ${i ? 'border-t-2 border-dashed border-foreground-300' : ''}`}>
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-500 text-background-50 display text-sm border-2 border-foreground-950">{l.no}</span>
                <span className="font-bold text-[15px] md:text-base">{l.name}</span>
                <span className="hidden sm:block hand text-sm text-foreground-600 text-right">{l.note}</span>
              </li>
            ))}
          </ol>
        </div>
        <div data-stage="layers" data-m="scale" className="relative lg:col-span-7 order-1 lg:order-2 h-[560px] md:h-[760px] lg:h-[820px] bg-background-100 poster-frame">
          <div className="absolute inset-0 halftone" aria-hidden="true" />
          <img
            src="https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_77fb2d5f.webp"
            alt="Exploded view of every burger layer"
            title="Patty Shack burger layers"
            loading="lazy"
            decoding="async"
            className="relative h-full w-full object-contain object-center"
          />
          <span className="absolute top-6 right-6 sticker-circle w-[110px] h-[110px] bg-accent-500 text-background-50 text-[22px] tilt-r">
            7
            <span className="hand text-[13px] normal-case mt-1">layers of joy</span>
          </span>
        </div>
      </div>
    </section>
  );
}