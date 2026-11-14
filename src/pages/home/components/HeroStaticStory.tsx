import {
  heroKeyframes, heroStoryCopy, heroUpgradePrice, heroUpgradePriceNote,
} from '@/mocks/heroStory';

/** Reduced-motion fallback: four readable static stages, no video playback. */
const rows = [
  { title: 'Smash changes everything.', body: 'Smash burgers. Open flame. Made fresh.', img: heroKeyframes[0] },
  { title: heroStoryCopy.layersTitle, body: heroStoryCopy.layersBody, img: heroKeyframes[1] },
  { title: heroStoryCopy.upgradeTitle, body: `${heroUpgradePrice} — ${heroStoryCopy.upgradeBody}`, img: heroKeyframes[2] },
  { title: heroStoryCopy.finishTitle, body: heroStoryCopy.finishBody, img: heroKeyframes[3] },
];

export default function HeroStaticStory() {
  return (
    <section id="top" className="bg-foreground-950 text-background-50 pt-[96px]">
      {rows.map((r, i) => (
        <div key={r.title} className="wrap grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-10">
          <div className={`md:col-span-6 ${i % 2 ? 'md:order-2' : ''}`}>
            {i === 0 ? <h1 className="display text-[clamp(56px,9vw,150px)]">{r.title}</h1> : <h2 className="display text-[clamp(28px,3.6vw,60px)] leading-[1.05]">{r.title}</h2>}
            <p className="mt-4 text-base md:text-lg text-background-50/80 max-w-[36ch]">{r.body}</p>
            {i === 2 && <p className="mt-2 text-xs text-background-50/50">{heroUpgradePriceNote}</p>}
            {i === 3 && (
              <a href="#menu" className="mt-6 btn-poster btn-berry">
                {heroStoryCopy.finishCta}
              </a>
            )}
          </div>
          <div className="md:col-span-6 flex justify-center">
            <div className="h-[60svh] aspect-[9/16]">
              <img src={r.img} alt={r.title} title={`Patty Shack ${r.title}`} width={1080} height={1920} className="food-blend h-full w-full object-contain" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
