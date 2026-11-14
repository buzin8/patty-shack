import { heroSequence } from '@/mocks/heroStory';
import type { ClipKey } from './heroTimeline';
import { buildGeometry, type HeroGeometry } from './heroGeometry';

export type Bounds = [number, number, number, number];
export interface ClipMeta {
  count: number;
  crop: [number, number, number, number];
  frameW: number;
  frameH: number;
  cols: number;
  perSheet: number;
  sheets: number;
  bounds: Bounds[];
}
export interface SeqMeta { scale: number; clips: Record<ClipKey, ClipMeta> }
export interface FrameHit { bmp: ImageBitmap; sx: number; sy: number; idx: number }

const ORDER: string[] = (['A', 'B', 'C'] as ClipKey[])
  .flatMap((k) => heroSequence.sheets[k].map((_, i) => `${k}${i}`));

const loadImage = async (src: string) => {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  return img;
};


// Compressed sheets are shared across mounts so revisiting the home page never re-downloads them.
const sharedBlobs = new Map<string, Blob>();

/**
 * Bounded frame cache. All sheets are downloaded once as compressed Blobs (~6 MB total),
 * but only a few are decoded to GPU-friendly ImageBitmaps at any time (LRU, closed on eviction).
 */
export default class FrameStore {
  meta: SeqMeta | null = null;

  geo: HeroGeometry | null = null;

  private focusKey = '';

  posterOpen: HTMLImageElement | null = null;

  posterClose: HTMLImageElement | null = null;

  onChange: () => void = () => {};

  private blobs = sharedBlobs;

  private bitmaps = new Map<string, ImageBitmap>();

  private pending = new Set<string>();

  private lru: string[] = [];

  private want = new Set<string>();

  private alive = true;

  constructor(private maxDecoded: number) {}

  /** Resolves once the opening poster + meta are ready (first paint). */
  async init() {
    const [res, open] = await Promise.all([fetch(heroSequence.meta), loadImage(heroSequence.posters.open)]);
    const meta = (await res.json()) as SeqMeta;
    this.geo = buildGeometry(meta);
    this.meta = meta;
    this.posterOpen = open;
    this.progressive();
  }

  private async progressive() {
    for (let i = 0; i < ORDER.length; i += 1) {
      if (!this.alive) return;
      const key = ORDER[i];
      if (this.blobs.has(key)) {
        if (this.want.has(key)) this.decode(key);
        // eslint-disable-next-line no-continue
        continue;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const r = await fetch(heroSequence.sheets[key[0] as ClipKey][Number(key.slice(1))]);
        // eslint-disable-next-line no-await-in-loop
        if (r.ok) this.blobs.set(key, await r.blob());
        if (this.want.has(key)) this.decode(key);
      } catch { /* hold nearest frame */ }
      if (i === 2) {
        loadImage(heroSequence.posters.close).then((img) => { this.posterClose = img; this.onChange(); }).catch(() => {});
      }
    }
  }

  static sheetKey(meta: SeqMeta, clip: ClipKey, idx: number) {
    return `${clip}${Math.floor(idx / meta.clips[clip].perSheet)}`;
  }

  /** Declare which sheets matter now (current + upcoming). Others become evictable. */
  request(keys: string[]) {
    this.want = new Set(keys);
    keys.forEach((k) => this.decode(k));
  }

  neighbours(key: string) {
    const i = ORDER.indexOf(key);
    return [ORDER[i - 1], ORDER[i + 1], ORDER[i + 2]].filter(Boolean);
  }

  /** Called every draw; does cache work only when the visible sheet changes (decode ahead, off the hot path). */
  focus(key: string) {
    if (key === this.focusKey) return;
    this.focusKey = key;
    this.request([key, ...this.neighbours(key)]);
  }

  private touch(key: string) {
    this.lru = this.lru.filter((k) => k !== key);
    this.lru.push(key);
  }

  private decode(key: string) {
    if (this.bitmaps.has(key)) { this.touch(key); return; }
    const blob = this.blobs.get(key);
    if (!blob || this.pending.has(key)) return;
    this.pending.add(key);
    createImageBitmap(blob)
      .then((bmp) => {
        if (!this.alive) { bmp.close(); return; }
        this.bitmaps.set(key, bmp);
        this.touch(key);
        this.evict();
        this.onChange();
      })
      .catch(() => {})
      .finally(() => this.pending.delete(key));
  }

  private evict() {
    while (this.bitmaps.size > this.maxDecoded) {
      const victim = this.lru.find((k) => !this.want.has(k)) ?? this.lru[0];
      if (!victim) break;
      this.bitmaps.get(victim)?.close();
      this.bitmaps.delete(victim);
      this.lru = this.lru.filter((k) => k !== victim);
    }
  }

  /** Exact frame if decoded, otherwise the nearest decoded frame of the same clip. */
  frame(clip: ClipKey, idx: number): FrameHit | null {
    const meta = this.meta;
    if (!meta) return null;
    const c = meta.clips[clip];
    for (let d = 0; d < c.count; d += 1) {
      const cands = d === 0 ? [idx] : [idx - d, idx + d];
      for (let j = 0; j < cands.length; j += 1) {
        const i = cands[j];
        if (i >= 0 && i < c.count) {
          const s = Math.floor(i / c.perSheet);
          const bmp = this.bitmaps.get(`${clip}${s}`);
          if (bmp) {
            const local = i - s * c.perSheet;
            return {
              bmp, idx: i, sx: (local % c.cols) * c.frameW, sy: Math.floor(local / c.cols) * c.frameH,
            };
          }
        }
      }
    }
    return null;
  }

  dispose() {
    this.alive = false;
    this.bitmaps.forEach((b) => b.close());
    this.bitmaps.clear();
    this.lru = [];
    this.posterOpen = null;
    this.posterClose = null;
  }
}