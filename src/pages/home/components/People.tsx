export default function People() {
  return (
    <section className="bg-background-50 wrap pb-16 md:pb-24">
      <div className="relative overflow-hidden poster-frame bg-foreground-950 text-background-50 h-[80svh] min-h-[560px] max-h-[900px]">
        <img
          src="https://readdy.ai/api/search-image?query=Wide%20candid%20lifestyle%20photograph%20of%20friends%20laughing%20and%20eating%20messy%20smash%20burgers%20and%20fries%20around%20a%20crowded%20wooden%20table%20in%20a%20lively%20burger%20bar%20at%20night%2C%20one%20person%20biting%20into%20a%20burger%2C%20warm%20amber%20light%2C%20darker%20lower%20left%20area%2C%20natural%20skin%20tones%2C%20authentic%20real%20moment%2C%20soft%20film%20grain&width=1920&height=1080&seq=fc-people-wide&orientation=landscape"
          alt="Friends sharing burgers at Patty Shack"
          title="Friends eating at Patty Shack"
          width={1920}
          height={1080}
          decoding="async"
          data-m="photo"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <span className="absolute top-6 right-6 sticker bg-background-50 text-foreground-950 tilt-r text-xl">bring your crew!</span>
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12" data-m-group>
          <div data-m="fade" data-m-delay="100" className="self-start mb-5"><span className="sticker bg-accent-500 text-background-50 tilt-l">table talk</span></div>
          <h2 className="display text-[clamp(36px,5.4vw,88px)] leading-[1.05]">
            <span className="block" data-m="up" data-m-delay="100">Come hungry.</span>
            <span className="block" data-m="up" data-m-delay="100">Leave <span className="text-primary-400">happy!</span></span>
          </h2>
        </div>
      </div>
    </section>
  );
}