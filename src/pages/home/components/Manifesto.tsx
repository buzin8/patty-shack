export default function Manifesto() {
  return (
    <section id="story" className="relative scroll-mt-[76px] bg-primary-500 wrap py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 relative" data-m-group>
          <div data-m="fade"><span className="sticker bg-accent-500 text-background-50 tilt-l">our story</span></div>
          <h2 className="h-statement mt-6 max-w-[1100px]">
            <span className="block" data-m="up">No shortcuts.</span>
            <span className="block" data-m="up">Just the <span className="scribble scribble-paper relative z-0">good stuff</span><span className="text-accent-500">!</span></span>
          </h2>
          <span className="hidden md:flex sticker-circle absolute right-0 top-4 w-[132px] h-[132px] bg-foreground-950 text-background-50 text-[24px] tilt-r">
            Made
            <span className="text-primary-400">daily</span>
            <span className="hand text-[13px] normal-case mt-1">since day one</span>
          </span>
        </div>
        <div data-m="enter-l" className="lg:col-span-7 h-[340px] md:h-[520px] lg:h-[600px] poster-frame hard-drop">
          <img
            src="https://readdy.ai/api/search-image?query=Chef%20hands%20pressing%20and%20flipping%20smash%20burger%20patties%20on%20a%20hot%20steel%20flat%20top%20griddle%20with%20sizzling%20smoke%20and%20steam%2C%20gritty%20real%20kitchen%2C%20warm%20tungsten%20light%2C%20documentary%20food%20photography&width=900&height=1040&seq=fc-chef-flip&orientation=portrait"
            alt="Chef smashing burger patties on a hot griddle"
            title="Chef smashing patties at Patty Shack"
            width={900}
            height={1040}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end gap-8" data-m-group>
          <div data-m="enter-r" data-m-delay="150">
          <div className="relative h-[240px] md:h-[300px] poster-frame hard-drop-paper rotate-[2deg]">
            <img
              src="https://readdy.ai/api/search-image?query=Editorial%20close%20up%20photograph%20of%20a%20cook%20hand%20placing%20a%20slice%20of%20American%20cheese%20onto%20sizzling%20smashed%20beef%20patties%20on%20a%20dark%20steel%20griddle%2C%20rising%20steam%2C%20warm%20natural%20kitchen%20light%2C%20real%20documentary%20food%20photography%2C%20soft%20film%20grain&width=800&height=600&seq=fc-story-prep&orientation=landscape"
              alt="Amul cheese melting over smash patties"
              title="Amul cheese on smash patties at Patty Shack"
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </div>
          </div>
          <p data-m="up" data-m-delay="150" className="text-base md:text-lg leading-[1.7] text-foreground-950">
            We smash it hot, grill it hard, and serve it exactly how it should be. <span className="hand text-accent-500 text-xl">Messy hands. Happy people.</span>
          </p>
          <div data-m="up" data-m-delay="150" className="self-start">
            <a href="#craft" className="btn-poster btn-paper btn-sm">
              How we cook
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-fire-line" /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
