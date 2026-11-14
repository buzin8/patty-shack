const words = ['Smashed hot', 'Served loud', 'No compromise'];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display text-[clamp(26px,3vw,44px)] whitespace-nowrap px-8">{w}</span>
          <span className="w-8 h-8 flex items-center justify-center text-foreground-950 shrink-0"><i className="ri-star-fill text-2xl" /></span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Smashed hot, served loud, no compromise" className="relative bg-background-50 py-6 overflow-hidden">
      <div className="-rotate-[1.5deg] bg-primary-500 text-background-50 border-y-[2.5px] border-foreground-950 py-4 md:py-5 -mx-4">
        <div className="marquee-track flex w-max">
          <Row />
          <Row />
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}