import { Link } from 'react-router-dom';
import PageShell from '@/components/feature/PageShell';
import PageHero from '@/components/feature/PageHero';
import { locations } from '@/mocks/locations';

export default function LocationsPage() {
  const loc = locations[0];

  return (
    <PageShell title="Patty Shack at Infinity Benchmark | Sector V Counter & Hours">
      <PageHero
        sticker="locations"
        title={<>Find the <span className="text-accent-500">Shack.</span></>}
        intro={<>One counter, pure smoke and smash. Walk in, order up, <span className="hand text-accent-500 text-xl">eat it hot.</span></>}
      />

      <section className="wrap py-14 md:py-20">
        <article id={loc.id} className="poster-card hard-drop p-5 md:p-7 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-background-50">
          <div className="lg:col-span-7 w-full aspect-[4/3] lg:aspect-[16/11] rounded-2xl overflow-hidden border-[2.5px] border-foreground-950 hard-drop-paper bg-background-200">
            <img
              src={loc.image}
              alt="Patty Shack at Infinity Benchmark near RDB Cinema"
              title="Patty Shack Ground Floor, Infinity Benchmark, Sector V"
              className="h-full w-full object-cover"
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
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-dashed border-foreground-300">
                <div>
                  <span className="display text-[44px] text-accent-500 leading-none">{loc.no}</span>
                  <h2 className="h-section text-2xl md:text-3xl mt-1">{loc.name}</h2>
                </div>
                <span className="sticker !text-[14px] bg-primary-500 text-foreground-950 tilt-r">{loc.status}</span>
              </div>

              <dl className="text-[15px] divide-y-2 divide-dashed divide-foreground-300">
                <div className="grid grid-cols-[100px_1fr] items-start py-4">
                  <dt className="hand text-sm text-foreground-600 pt-0.5">address</dt>
                  <dd className="font-medium text-foreground-900 leading-snug">{loc.address}</dd>
                </div>
                {loc.hours.map((h) => (
                  <div key={h.day} className="grid grid-cols-[100px_1fr] items-center py-3.5">
                    <dt className="hand text-sm text-foreground-600">{h.day}</dt>
                    <dd className="tabular-nums font-semibold">{h.time}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[100px_1fr] items-center py-3.5">
                  <dt className="hand text-sm text-foreground-600">phone</dt>
                  <dd className="font-semibold tabular-nums">
                    <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="hover:text-accent-500 transition-colors">
                      {loc.phone}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center py-3.5">
                  <dt className="hand text-sm text-foreground-600">email</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${loc.email}`} className="hover:text-accent-500 transition-colors">
                      {loc.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 pt-4 flex flex-wrap gap-4">
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-poster btn-berry inline-flex items-center gap-2"
              >
                Get directions <i className="ri-direction-line text-lg" />
              </a>
              <Link to="/contact#book" className="btn-poster btn-paper inline-flex items-center gap-2">
                Book a Table <i className="ri-calendar-event-line text-lg" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* Embedded Google Map */}
      <section className="wrap pb-16 md:pb-24">
        <div className="poster-card hard-drop overflow-hidden border-[2.5px] border-foreground-950">
          <div className="p-4 md:p-6 bg-primary-500 text-background-50 flex items-center justify-between border-b-[2.5px] border-foreground-950">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground-950 text-background-50">
                <i className="ri-map-pin-2-fill text-xl" />
              </span>
              <div>
                <h3 className="h-card text-lg md:text-xl text-background-50">Infinity Benchmark Location Map</h3>
                <p className="text-xs text-background-50/80">Ground Floor · near RDB Cinema · Salt Lake, Kolkata 700091</p>
              </div>
            </div>
            <a
              href={loc.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-poster btn-paper btn-sm"
            >
              Open in Google Maps <i className="ri-external-link-line" />
            </a>
          </div>
          <div className="relative w-full h-[400px] md:h-[500px] bg-background-200">
            <iframe
              title="Patty Shack Infinity Benchmark Map"
              src="https://maps.google.com/maps?q=Infinity+Benchmark,+Sector+V,+Kolkata,+West+Bengal+700091&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[25%] contrast-[110%]"
            />
          </div>
        </div>
      </section>

      <section className="bg-accent-500 text-background-50 border-t-[2.5px] border-foreground-950 wrap py-14 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="h-section">Planning a visit or a party?</h2>
          <p className="mt-2 text-background-50/85">Drop by the counter or reserve a table ahead of time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact#book" className="btn-poster btn-paper">Reserve table <i className="ri-calendar-line" /></Link>
          <Link to="/contact" className="btn-poster btn-paper">Get in touch <i className="ri-arrow-right-line" /></Link>
        </div>
      </section>
    </PageShell>
  );
}
