// Patty Shack — Hero scroll story configuration (media + copy).
// All media is 1080x1920 (9:16), hosted at stable project asset URLs.

export const heroKeyframes = [
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/e765afa4-c96d-4140-b568-996d9fa59b61_open.webp',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_keyframe-02.png',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_keyframe-03.png',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/e765afa4-c96d-4140-b568-996d9fa59b61_close.webp',
];

// Video i transitions stage i -> stage i+1. first/last are the real extracted boundary frames.
export const heroVideos = [
  {
    id: 'A-separate',
    src: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_A-separate.mp4',
    first: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_A-separate-first.webp',
    last: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_A-separate-last.webp',
  },
  {
    id: 'B-upgrade',
    src: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_B-upgrade.mp4',
    first: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_B-upgrade-first.webp',
    last: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_B-upgrade-last.webp',
  },
  {
    id: 'C-assemble',
    src: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_C-assemble.mp4',
    first: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_C-assemble-first.webp',
    last: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_C-assemble-last.webp',
  },
];

// Static frame shown while resting on each stage (stage 0 = keyframe, others = real last frame of incoming video).
export const heroStageStills = [
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/e765afa4-c96d-4140-b568-996d9fa59b61_open.webp',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_A-separate-last.webp',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_B-upgrade-last.webp',
  'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/c43cc31a-337d-4a80-a20a-6e7f2a99547e_C-assemble-last.webp',
];

export const heroSequence = {
  meta: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_meta.json',
  sheets: {
    A: [
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-A0.webp',
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-A1.webp',
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-A2.webp',
    ],
    B: [
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-B0.webp',
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-B1.webp',
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-B2.webp',
    ],
    C: [
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-C0.webp',
      'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/cbdc90f7-305e-43cc-aa98-fda0e5bfcc52_sheet-C1.webp',
    ],
  },
  posters: {
    open: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/e765afa4-c96d-4140-b568-996d9fa59b61_open.webp',
    close: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/e765afa4-c96d-4140-b568-996d9fa59b61_close.webp',
  },
  posterBounds: {
    open: [291, 511, 786, 1106],
    close: [231, 530, 835, 1300],
  },
};

// Upgrade display price
export const heroUpgradePrice = '+₹49';
export const heroUpgradePriceNote = 'Upgrade with smoked bacon & charred jalapeños';

export const heroStoryCopy = {
  layersTitle: 'Nothing to hide.',
  layersSplit: ['Nothing', 'to hide.'],
  upgradeSplit: ['Make it', 'louder.'],
  finishSplit: ['Your burger.', 'Turned up.'],
  layersBody: 'Two smashed patties. Two layers of melted Amul cheese.',
  upgradeTitle: 'Make it louder.',
  upgradeBody: 'Smoked bacon. Charred jalapeños. Caramelized onions. Shack sauce.',
  finishTitle: 'Your burger. Turned up.',
  finishBody: 'More smoke. More heat. Smashed fresh at Patty Shack.',
  finishCta: 'Explore the Menu',
};
