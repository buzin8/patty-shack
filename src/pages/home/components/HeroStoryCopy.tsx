import type { ReactNode } from 'react';
import { heroStoryCopy, heroUpgradePrice, heroUpgradePriceNote } from '@/mocks/heroStory';

interface HeroStoryCopyProps {
  /** Registers each copy block so the scroll loop can set its opacity directly (0 opening, 1 layers, 2 upgrade, 3 finish, 4 cta). */
  register: (i: number) => (el: HTMLElement | null) => void;
}

const block = 'hero-copy absolute inset-0';
const titleCls = 'display hero-glass text-[38px] md:text-[clamp(46px,5.6vw,96px)] leading-[1.02]';

interface SplitProps {
  full: string;
  split: string[];
  sticker: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

/** Title split across both sides of the burger: first half left, second half right. */
function SplitTitle({ full, split, sticker, left, right }: SplitProps) {
  return (
    <div className="wrap flex h-full flex-col justify-end md:justify-center pb-10 md:pb-0 md:pt-[76px]">
      <h2 className="sr-only">{full}</h2>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_26%_minmax(0,1fr)] items-center gap-4 md:max-w-[1180px] md:mx-auto md:w-full" aria-hidden="true">
        <div className="min-w-0 md:text-right md:flex md:flex-col md:items-end">
          {sticker}
          <div className={`${titleCls} mt-4`}>{split[0]}</div>
          {left}
        </div>
        <div className="hidden md:block" />
        <div className="min-w-0 md:text-left md:flex md:flex-col md:items-start">
          <div className={`${titleCls} md:mt-8`}>{split[1]}</div>
          {right}
        </div>
      </div>
    </div>
  );
}

export default function HeroStoryCopy({ register }: HeroStoryCopyProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* 01 — Opening */}
      <div ref={register(0)} className={block}>
        <div className="absolute inset-x-0 top-[calc(50%+33px)] md:top-[calc(50%+30px)] -translate-y-1/2 flex justify-center">
        <h1 className="relative whitespace-nowrap cover-title hero-glass text-[22vw] md:text-[17vw]">
          <span className="sr-only">Smash changes everything — </span>SMASH!
        <span className="burst-sticker absolute z-10 -left-[4%] -top-[18%] w-[96px] h-[96px] md:w-[136px] md:h-[136px] lg:w-[156px] lg:h-[156px]" aria-hidden="true">
          <span className="burst-shape absolute inset-0 bg-background-50" />
          <span className="burst-shape absolute inset-[7px] bg-accent-500" />
          <span className="absolute inset-[26px] rounded-full border-[2px] border-dashed border-background-50/70" />
          <span className="burst-shape burst-gloss absolute inset-[7px]" />
          <span className="absolute inset-0 flex flex-col items-center justify-center text-center text-background-50">
            <span className="display text-[30px] lg:text-[34px] leading-none">100%</span>
            <span className="hand text-[13px] lg:text-[14px] leading-tight mt-1">fresh chicken</span>
          </span>
        </span>
        </h1>
        </div>
        <div className="wrap flex h-full flex-col justify-between pt-[100px] md:pt-[112px] pb-6 md:pb-10">
          <div className="relative text-center">
            <span className="sticker bg-background-50 text-foreground-950 tilt-l">Smash · Flame · Fresh</span>
          </div>
          <div className="flex w-full items-end justify-end gap-6 md:gap-8">
            <span className="hand inline-flex items-center gap-2 text-[18px] text-background-50 whitespace-nowrap tilt-xs">
              scroll for the good part
              <span className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-down-line" /></span>
            </span>
          </div>
        </div>
      </div>

      {/* 02 — Layers */}
      <div ref={register(1)} className={block}>
        <SplitTitle
          full={heroStoryCopy.layersTitle}
          split={heroStoryCopy.layersSplit}
          sticker={<span className="sticker bg-accent-500 text-background-50 tilt-l">#02 layers</span>}
          right={<p className="mt-3 md:mt-5 text-sm md:text-lg text-background-50/85 max-w-[26ch]">{heroStoryCopy.layersBody}</p>}
        />
      </div>

      {/* 03 — Upgrade */}
      <div ref={register(2)} className={block}>
        <SplitTitle
          full={heroStoryCopy.upgradeTitle}
          split={heroStoryCopy.upgradeSplit}
          sticker={<span className="sticker bg-background-50 text-foreground-950 tilt-r">#03 upgrade</span>}
          left={(
            <div className="mt-4 md:mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="sticker-circle w-[84px] h-[84px] md:w-[104px] md:h-[104px] bg-accent-500 text-background-50 text-[24px] md:text-[30px] tilt-l">{heroUpgradePrice}</span>
              <span className="hand text-sm text-background-50/70 max-w-[18ch]">{heroUpgradePriceNote}</span>
            </div>
          )}
          right={<p className="mt-3 md:mt-5 text-sm md:text-lg text-background-50/85 max-w-[26ch]">{heroStoryCopy.upgradeBody}</p>}
        />
      </div>

      {/* 04 — Finish */}
      <div ref={register(3)} className={block}>
        <SplitTitle
          full={heroStoryCopy.finishTitle}
          split={heroStoryCopy.finishSplit}
          sticker={<span className="sticker bg-accent-500 text-background-50 tilt-r">#04 the finish</span>}
          left={<p className="mt-3 md:mt-5 text-sm md:text-lg text-background-50/85 max-w-[24ch]">{heroStoryCopy.finishBody}</p>}
        />
      </div>
    </div>
  );
}
