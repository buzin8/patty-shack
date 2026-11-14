import type { Bounds, SeqMeta } from './frameStore';
import type { ClipKey } from './heroTimeline';

/** Source px → canonical px: canon = k * src + (dx, dy). */
export interface Xf { k: number; dx: number; dy: number }
export interface HeroGeometry {
  clip: Record<ClipKey, Xf>;
  posterOpen: Xf;
  posterClose: Xf;
  openBox: Bounds;
  closeBox: Bounds;
  midBox: Bounds;
}

const apply = (x: Xf, b: Bounds): Bounds => [x.k * b[0] + x.dx, x.k * b[1] + x.dy, x.k * b[2] + x.dx, x.k * b[3] + x.dy];


/**
 * Built once at load. Clip A defines the canonical space; B is aligned so its first frame
 * matches A's last frame, C so its first matches B's last; posters align to the frames they replace.
 */
export function buildGeometry(meta: SeqMeta): HeroGeometry {
  const A = meta.clips.A.bounds;
  const B = meta.clips.B.bounds;
  const C = meta.clips.C.bounds;
  // DEBUG PHASE: identical mapping for every clip. All crops are already expressed in the
  // shared 1080x1920 source space, so no per-clip rescale/reposition is applied.
  const xa: Xf = { k: 1, dx: 0, dy: 0 };
  const xb: Xf = { k: 1, dx: 0, dy: 0 };
  const xc: Xf = { k: 1, dx: 0, dy: 0 };
  void A; void B;
  const closeBox = apply(xc, C[C.length - 1]);
  const openBox = A[0];

  const mid: Bounds = [Infinity, Infinity, -Infinity, -Infinity];
  ([['A', xa], ['B', xb], ['C', xc]] as [ClipKey, Xf][]).forEach(([key, x]) => {
    meta.clips[key].bounds.forEach((b) => {
      const c = apply(x, b);
      mid[0] = Math.min(mid[0], c[0]); mid[1] = Math.min(mid[1], c[1]);
      mid[2] = Math.max(mid[2], c[2]); mid[3] = Math.max(mid[3], c[3]);
    });
  });

  return {
    clip: { A: xa, B: xb, C: xc },
    // Measured by pixel registration against the real boundary frames (not by bounding boxes):
    // keyframe-01 is pixel-identical in geometry to A's first frame; keyframe-04 vs C's last
    // frame is 1.5% larger content with a small offset.
    posterOpen: { k: 1, dx: 0, dy: 0 },
    posterClose: { k: 1.015, dx: -4, dy: -9 },
    openBox,
    closeBox,
    midBox: mid,
  };
}

export interface Cam { s: number; tx: number; ty: number }

/** Close-up: width-driven, centred, may bleed off the bottom. Capped to keep posters from over-upscaling. */
export function closeCam(b: Bounds, w: number, h: number, desktop: boolean, posterK: number): Cam {
  const bw = b[2] - b[0];
  const bh = b[3] - b[1];
  const top = h * (desktop ? 0.34 : 0.4);
  let s = ((desktop ? 0.66 : 0.96) * w) / bw;
  s = Math.min(s, (h - top) / (0.55 * bh));
  s = Math.min(s, 1.6 / posterK); // poster px may be enlarged at most 1.6x in CSS px
  return { s, tx: w / 2 - ((b[0] + b[2]) / 2) * s, ty: top - b[1] * s };
}

/** Close-up derived from the fixed mid camera: same canonical space, just a larger scale. */
export function heroCloseCam(
  b: Bounds, mid: Cam, w: number, h: number, desktop: boolean, ref?: Bounds,
): Cam {
  // Both close-ups share one on-screen burger width (that of the end shot), then +15%.
  const base = mid.s * (desktop ? 1.5 : 1.3) * 1.15;
  const refW = ref ? ref[2] - ref[0] : b[2] - b[0];
  const s = (base * refW) / (b[2] - b[0]);
  const top = h * (desktop ? 0.36 : 0.4);
  return { s, tx: w / 2 - ((b[0] + b[2]) / 2) * s, ty: top - b[1] * s };
}

/** Small, centred burger — matches the modest size of the film's first frame. */
export function smallCam(b: Bounds, w: number, h: number, desktop: boolean, ref?: Bounds): Cam {
  const refW = ref ? ref[2] - ref[0] : b[2] - b[0];
  const target = desktop ? Math.min(0.26 * w, 0.5 * h) : 0.62 * w;
  const s = (target / refW) * (ref ? refW / (b[2] - b[0]) : 1);
  // Centre of the visible black frame (clip-path inset: 76px top, 16px/10px bottom).
  const cy = desktop ? (76 + (h - 16)) / 2 : (76 + (h - 10)) / 2;
  return { s, tx: w / 2 - ((b[0] + b[2]) / 2) * s, ty: cy - ((b[1] + b[3]) / 2) * s };
}

/** Fixed mid composition: the union of every exploded frame fits, centred, never moves. */
export function midCam(b: Bounds, w: number, h: number, desktop: boolean): Cam {
  const bw = b[2] - b[0];
  const bh = b[3] - b[1];
  // MID_BOOST: whole middle composition ~14% larger than the previous debug version.
  const MID_BOOST = 1.14;
  const s = MID_BOOST * (desktop
    ? Math.min((0.84 * h) / bh, (0.4 * w) / bw)
    : Math.min((0.6 * h) / bh, (0.94 * w) / bw));
  const cy = h * (desktop ? 0.54 : 0.4);
  return { s, tx: w / 2 - ((b[0] + b[2]) / 2) * s, ty: cy - ((b[1] + b[3]) / 2) * s };
}