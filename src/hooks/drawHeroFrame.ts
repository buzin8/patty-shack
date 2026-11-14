import FrameStore from './frameStore';
import { heroSequence } from '@/mocks/heroStory';
import { smallCam, midCam, type Cam, type Xf } from './heroGeometry';
import { camMixAt, clamp, frameAt, postersAt } from './heroTimeline';

// One outer camera for the whole canvas. Every clip and poster shares the same canonical
// (1080x1920) space; the camera only changes at 10–22% (pull back) and 82–95% (push in).
// Between 22% and 82% camMix is exactly 1, so the scale/position are constant.
// Measured burger bounds on the real posters (source px), so centring ignores smoke/crumbs.
const OPEN_BOX = heroSequence.posterBounds.open as [number, number, number, number];
const CLOSE_BOX = heroSequence.posterBounds.close.map((v, i) => v * 1.015 + (i % 2 === 0 ? -4 : -9)) as [number, number, number, number];

let camCache: { key: string; mid: Cam; open: Cam; close: Cam } | null = null;

const mixCam = (a: Cam, b: Cam, t: number): Cam => ({
  s: a.s + (b.s - a.s) * t,
  tx: a.tx + (b.tx - a.tx) * t,
  ty: a.ty + (b.ty - a.ty) * t,
});

function drawPoster(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: Xf, cam: Cam, alpha: number) {
  if (alpha <= 0.001) return;
  ctx.globalAlpha = alpha;
  ctx.drawImage(
    img,
    cam.tx + x.dx * cam.s,
    cam.ty + x.dy * cam.s,
    img.naturalWidth * x.k * cam.s,
    img.naturalHeight * x.k * cam.s,
  );
  ctx.globalAlpha = 1;
}

/** Paints progress p. Returns a state key; nothing is drawn when it equals prevKey. */
export default function drawHeroFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  p: number,
  desktop: boolean,
  store: FrameStore,
  prevKey: string,
): string {
  const meta = store.meta;
  const g = store.geo;
  if (!meta || !g) return prevKey;
  const { clip, t } = frameAt(p);
  const c = meta.clips[clip];
  const want = Math.round(clamp(t) * (c.count - 1));
  store.focus(FrameStore.sheetKey(meta, clip, want));
  const hit = store.frame(clip, want);

  // Layout computed once per viewport size, never during scroll.
  const key = `${w}x${h}|${desktop}`;
  if (!camCache || camCache.key !== key) {
    const mid = midCam(g.midBox, w, h, desktop);
    camCache = {
      key,
      mid,
      open: smallCam(OPEN_BOX, w, h, desktop),
      close: smallCam(CLOSE_BOX, w, h, desktop),
    };
  }
  const mix = Math.round(camMixAt(p) * 1000) / 1000;
  const posters = postersAt(p);
  const pOpen = store.posterOpen ? Math.round(posters.open * 100) / 100 : 0;
  const pClose = store.posterClose ? Math.round(posters.close * 100) / 100 : 0;

  const stateKey = `${w}x${h}@${dpr}|${clip}${hit ? hit.idx : -1}|${mix}|${pOpen}|${pClose}`;
  if (stateKey === prevKey) return prevKey;

  const cam = mix >= 1 ? camCache.mid : mixCam(p < 0.5 ? camCache.open : camCache.close, camCache.mid, mix);
  const { s, tx, ty } = cam;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  // 'high' only when the burger is enlarged; the fixed mid stage draws near native size.
  ctx.imageSmoothingQuality = mix >= 1 ? 'medium' : 'high';

  // Fully covered by a poster → skip the video frame draw entirely.
  if (hit && pOpen < 1 && pClose < 1) {
    const [cx, cy, cw, ch] = c.crop;
    ctx.drawImage(hit.bmp, hit.sx, hit.sy, c.frameW, c.frameH, tx + cx * s, ty + cy * s, cw * s, ch * s);
  }
  if (store.posterOpen) drawPoster(ctx, store.posterOpen, g.posterOpen, cam, pOpen);
  if (store.posterClose) drawPoster(ctx, store.posterClose, g.posterClose, cam, pClose);
  return stateKey;
}