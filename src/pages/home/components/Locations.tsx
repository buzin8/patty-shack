import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';
import { locations } from '@/mocks/locations';

export default function Locations() {
  const loc = locations[0];

  return (
    <section id="locations" className="scroll-mt-[76px] bg-background-100 border-t-[2.5px] border-foreground-950 wrap py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
        <div className="md:col-span-8" data-m-group>
          <div data-m="fade"><span className="sticker bg-accent-500 text-background-50 tilt-r">sector v</span></div>
          <h2 data-m="up" className="h-section mt-6">Find the <span className="text-primary-500">Shack.</span></h2>
        </div>
        <p data-m="up" data-m-delay="200" className="md:col-span-4 text-base leading-[1.7] text-foreground-700">
          Find us at Infinity Benchmark, Ground Floor, near RDB Cinema in Salt Lake's Sector V. Walk in and <span className="hand text-foreground-950 text-lg">eat it hot.</span>
        </p>
      </div>

      <Reveal>
        <article id={`loc-${loc.id}`} className="poster-card hard-drop p-5 md:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-background-50">
          <div className="lg:col-span-7 w-full aspect-[4/3] lg:aspect-[16/11] rounded-2xl overflow-hidden border-[2.5px] border-foreground-950 hard-drop-paper bg-background-200">
            <img
              src={loc.image}
              alt="Patty Shack at Infinity Benchmark near RDB Cinema"
              title="Patty Shack Ground Floor, Infinity Benchmark, Sector V"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              style={{ objectPosition: 'center 42%' }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/patty_shack.jpg')) {
                  target.src = '/images/patty_shack.jpg';
                }
              }}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-foreground-300">
                <div>
                  <span className="eyebrow text-accent-500">Counter 01</span>
                  <h3 className="h-card text-2xl md:text-3xl mt-1">{loc.name}</h3>
                </div>
                <span className="sticker !text-[13px] bg-accent-500 text-background-50 tilt-r">{loc.status}</span>
              </div>

              <dl className="text-[15px] divide-y-2 divide-dashed divide-foreground-300">
                <div className="grid grid-cols-[90px_1fr] items-start py-3.5">
                  <dt className="hand text-sm text-foreground-600 pt-0.5">address</dt>
                  <dd className="font-medium text-foreground-900 leading-snug">{loc.address}</dd>
                </div>
                {loc.hours.map((h) => (
                  <div key={h.day} className="grid grid-cols-[90px_1fr] items-center py-3">
                    <dt className="hand text-sm text-foreground-600">{h.day}</dt>
                    <dd className="tabular-nums font-semibold">{h.time}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[90px_1fr] items-center py-3">
                  <dt className="hand text-sm text-foreground-600">phone</dt>
                  <dd className="font-semibold tabular-nums">
                    <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="hover:text-accent-500 transition-colors">
                      {loc.phone}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[90px_1fr] items-center py-3">
                  <dt className="hand text-sm text-foreground-600">email</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${loc.email}`} className="hover:text-accent-500 transition-colors">
                      {loc.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 pt-4 flex flex-wrap gap-3">
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-poster btn-berry btn-sm inline-flex items-center gap-2"
              >
                Get directions
                <i className="ri-direction-line text-lg" />
              </a>
              <Link to="/contact#book" className="btn-poster btn-paper btn-sm inline-flex items-center gap-2">
                Book a Table
                <i className="ri-calendar-event-line" />
              </Link>
              <Link to="/locations" className="btn-poster btn-paper btn-sm inline-flex items-center gap-2">
                Full Details
                <i className="ri-arrow-right-up-line" />
              </Link>
            </div>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
