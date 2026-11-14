// Pure timeline math for the Hero scroll story. One progress value (0–1) drives everything.
// 0–10 still close-up · 10–22 camera pulls back · 22–82 three clips under a FIXED camera ·
// 82–95 camera pushes in · 95–100 hold + release.

export type ClipKey = 'A' | 'B' | 'C';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Smoothstep: no overshoot, no spring.
const ease = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

/** Which clip and fractional position is visible. Camera never moves while these play. */
export function frameAt(p: number): { clip: ClipKey; t: number } {
  if (p < 0.22) return { clip: 'A', t: 0 };
  // Back-to-back clips: no dead scroll between them, so A's last frame flows straight into B, B into C.
  if (p < 0.42) return { clip: 'A', t: (p - 0.22) / 0.20 };
  if (p < 0.63) return { clip: 'B', t: (p - 0.42) / 0.21 };
  if (p < 0.82) return { clip: 'C', t: (p - 0.63) / 0.19 };
  return { clip: 'C', t: 1 };
}

/** The ONLY camera control: 0 = close-up, 1 = fixed mid composition. */
export function camMixAt(p: number) {
  return p < 0.5 ? seg(p, 0.10, 0.22) : 1 - seg(p, 0.82, 0.95);
}

/** Sharp poster opacity over its geometry-aligned frame. */
export function postersAt(p: number) {
  return { open: 1 - seg(p, 0.17, 0.22), close: seg(p, 0.82, 0.87) };
}

/** Opacity of each copy block: [opening, layers, upgrade, finish, cta]. */
export function copyAt(p: number): number[] {
  return [
    1 - seg(p, 0.06, 0.12),
    seg(p, 0.24, 0.30) * (1 - seg(p, 0.38, 0.42)),
    seg(p, 0.42, 0.47) * (1 - seg(p, 0.60, 0.64)),
    seg(p, 0.66, 0.72),
    seg(p, 0.90, 0.95),
  ];
}

export function stepAt(p: number) {
  if (p < 0.22) return 0;
  if (p < 0.42) return 1;
  if (p < 0.64) return 2;
  return 3;
}