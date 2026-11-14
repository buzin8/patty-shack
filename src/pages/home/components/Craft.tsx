const stats = [
  ['260°', 'Steel temp'],
  ['90s', 'Per side'],
  ['0', 'Freezers'],
];

export default function Craft() {
  return (
    <section id="craft" className="relative scroll-mt-[76px] bg-foreground-950 text-background-50 wrap py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 halftone-light pointer-events-none" aria-hidden="true" />
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 relative">
          <div data-m="enter" className="h-[420px] md:h-[580px] lg:h-[660px] poster-frame !border-background-50 hard-drop-berry">
            <img
              src="https://readdy.ai/api/search-image?query=Extreme%20close%20up%20of%20smashed%20beef%20patties%20searing%20on%20black%20steel%20griddle%20with%20dark%20crispy%20caramelized%20crust%2C%20bubbling%20fat%2C%20rising%20smoke%2C%20dramatic%20high%20contrast%20warm%20light%20against%20deep%20black%20shadows%2C%20real%20documentary%20food%20photography&width=1300&height=1500&seq=fc-craft-sear&orientation=portrait"
              alt="Chicken smash patties searing on a hot steel griddle"
              title="Smash patties searing at Patty Shack"
              width={1300}
              height={1500}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <span className="sticker absolute -bottom-4 left-6 bg-background-50 text-foreground-950 tilt-l text-xl">tssssss...</span>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8" data-m-group>
          <div data-m="fade" className="self-start"><span className="sticker bg-accent-500 text-background-50 !border-background-50 tilt-r">the craft</span></div>
          <h2 className="h-statement">
            <span className="block" data-m="up">Built in</span>
            <span className="block" data-m="up">the <span className="text-primary-500">heat.</span></span>
          </h2>
          <p data-m="up" className="max-w-[420px] text-base leading-[1.7] text-background-50/80">
            Fresh chicken, freshly ground and seasoned every morning. Smashed hard onto 260°C steel so the edges go lacy and crispy. Finished over charcoal for that smoke you can taste.
          </p>
          <dl data-m="up" className="grid grid-cols-3 gap-3 max-w-[480px]">
            {stats.map(([v, l], i) => (
              <div key={l} className={`rounded-[22px] border-[2.5px] border-background-50 px-4 py-4 text-center ${i === 1 ? 'bg-primary-500' : ''}`}>
                <dt className="display text-[clamp(28px,2.8vw,40px)]" data-count>{v}</dt>
                <dd className="hand text-sm text-background-50/80 mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}