import type { ReactNode } from 'react';

interface PageHeroProps {
  sticker: string;
  title: ReactNode;
  intro: ReactNode;
}

export default function PageHero({ sticker, title, intro }: PageHeroProps) {
  return (
    <section className="relative bg-primary-500 border-b-[2.5px] border-foreground-950 wrap py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 halftone pointer-events-none" aria-hidden="true" />
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8">
          <span className="sticker bg-accent-500 text-background-50 tilt-l">{sticker}</span>
          <h1 className="h-statement mt-6">{title}</h1>
        </div>
        <p className="md:col-span-4 text-base md:text-lg leading-[1.7] text-foreground-950">{intro}</p>
      </div>
    </section>
  );
}