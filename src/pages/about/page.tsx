import { Link } from 'react-router-dom';
import PageShell from '@/components/feature/PageShell';
import PageHero from '@/components/feature/PageHero';
import { aboutValues, aboutTimeline } from '@/mocks/pages';

export default function AboutPage() {
  return (
    <PageShell title="Our Story | Patty Shack Smash Burger & Grill">
      <PageHero
        sticker="our story"
        title={<>No shortcuts.<br />Just the good stuff<span className="text-accent-500">!</span></>}
        intro={<>We smash it hot, grill it hard, and serve it how it should be. <span className="hand text-accent-500 text-xl">Messy hands. Happy people.</span></>}
      />

      <section className="wrap py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 aspect-[4/5] poster-frame hard-drop">
          <img
            src="https://readdy.ai/api/search-image?query=Documentary%20photograph%20of%20a%20small%20burger%20kitchen%20crew%20laughing%20behind%20a%20steel%20counter%20with%20an%20open%20charcoal%20grill%2C%20smoke%20rising%2C%20warm%20amber%20tungsten%20light%2C%20mustard%20yellow%20tiled%20wall%20background%2C%20soft%20film%20grain%20editorial%20style&width=900&height=1120&seq=fc-about-crew&orientation=portrait"
            alt="The Patty Shack kitchen crew"
            title="Patty Shack kitchen crew at the grill"
            width={900}
            height={1120}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div className="lg:col-span-6">
          <h2 className="h-section">Born on the <span className="text-accent-500">streets of Kolkata.</span></h2>
          <p className="mt-5 text-base leading-[1.8] text-foreground-800">
            Patty Shack began as one grill, one flat top and a line around the block in Kolkata. We kept the menu short so every burger could be nailed: fresh chicken minced and seasoned every morning, smashed paper-thin on 260°C steel, smothered with molten Amul cheese, and finished over open charcoal flame.
          </p>
          <ol className="mt-8">
            {aboutTimeline.map((t) => (
              <li key={t.year} className="grid grid-cols-[80px_1fr] gap-4 py-4 border-t-2 border-dashed border-foreground-300">
                <span className="display text-[22px] text-accent-500">{t.year}</span>
                <span className="text-[15px] font-medium">{t.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background-100 border-y-[2.5px] border-foreground-950 wrap py-14 md:py-20">
        <h2 className="h-section mb-10">House rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutValues.map((v, i) => (
            <article key={v.no} className={`poster-card hard-drop p-6 ${i === 1 ? 'rotate-[1deg]' : '-rotate-[0.6deg]'}`}>
              <span className="sticker-circle w-14 h-14 bg-primary-500 text-foreground-950 text-[18px]">{v.no}</span>
              <h3 className="h-card mt-5">{v.title}</h3>
              <p className="mt-3 text-sm leading-[1.7] text-foreground-700">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap py-14 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h2 className="h-section">Hungry yet?</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/menu" className="btn-poster btn-berry">See the menu</Link>
          <Link to="/locations" className="btn-poster btn-paper">Find the Shack</Link>
        </div>
      </section>
    </PageShell>
  );
}
