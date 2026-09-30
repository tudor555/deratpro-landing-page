import { PHASES } from "./timeline";

/** Size of the z=0 plane in world units. */
export type Viewport = { width: number; height: number };
/** The hero text box as fractions of the hero, measured from the top-left corner. */
export type CalmRect = { left: number; right: number; top: number; bottom: number };
export type SceneLayout = { viewport: Viewport; calm: CalmRect };
export type Point = { x: number; y: number };

/** Used until the real text box is measured: the central 60% × 50%. */
export const DEFAULT_CALM: CalmRect = { left: 0.2, right: 0.8, top: 0.25, bottom: 0.75 };

/** Side bands narrower than this are too tight for a creature, so it moves to the top/bottom bands. */
const MIN_SIDE_BAND = 0.12;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

function toWorld(fx: number, fy: number, { width, height }: Viewport): Point {
  return { x: (fx - 0.5) * width, y: (0.5 - fy) * height };
}

function toFraction({ x, y }: Point, { width, height }: Viewport) {
  return { fx: x / width + 0.5, fy: 0.5 - y / height };
}

function hasSideBands(calm: CalmRect) {
  return calm.left >= MIN_SIDE_BAND && 1 - calm.right >= MIN_SIDE_BAND;
}

const topBand = (calm: CalmRect) => calm.top / 2;
const bottomBand = (calm: CalmRect) => Math.min(calm.bottom + (1 - calm.bottom) * 0.45, 0.93);

export function isInCalmRect(point: Point, { viewport, calm }: SceneLayout, pad = 0): boolean {
  const { fx, fy } = toFraction(point, viewport);
  return fx > calm.left - pad && fx < calm.right + pad && fy > calm.top - pad && fy < calm.bottom + pad;
}

/** Signed distance to the text box in hero fractions: negative inside, positive outside. */
export function calmDistance(point: Point, { viewport, calm }: SceneLayout): number {
  const { fx, fy } = toFraction(point, viewport);
  return Math.max(calm.left - fx, fx - calm.right, calm.top - fy, fy - calm.bottom);
}

/** Scurries in along the bottom band, stops to sniff, then bolts right. */
export function mousePath(t: number, { viewport, calm }: SceneLayout): Point & { moving: boolean } {
  const fy = bottomBand(calm);
  const rest = 0.17;
  const at = (fx: number, moving: boolean) => ({ ...toWorld(fx, fy, viewport), moving });
  if (t < 2.5) return at(lerp(-0.08, rest, t / 2.5), true);
  if (t < PHASES.sweepStart - 0.1) return at(rest, false);
  return at(rest + (t - (PHASES.sweepStart - 0.1)) * 0.18, true);
}

/** Crawls up the right band, or along the top band on narrow screens. `heading` is its z rotation. */
export function roachPath(t: number, { viewport, calm }: SceneLayout): Point & { heading: number } {
  const progress = t / 6.8;
  if (hasSideBands(calm)) {
    const fx = calm.right + (1 - calm.right) * 0.55;
    return { ...toWorld(fx, lerp(0.82, 0.4, progress), viewport), heading: 0 };
  }
  return { ...toWorld(lerp(0.97, 0.62, progress), topBand(calm), viewport), heading: Math.PI / 2 };
}

/** Flies a wobbly loop high in the left band. Takes total elapsed time so it never jumps at loop boundaries. */
export function mosquitoPath(elapsed: number, { viewport, calm }: SceneLayout): Point {
  if (hasSideBands(calm)) {
    const fx = calm.left * 0.5 + Math.sin(elapsed * 1.8) * calm.left * 0.3;
    return toWorld(fx, 0.22 + Math.cos(elapsed * 2.6) * 0.05, viewport);
  }
  const fx = 0.22 + Math.sin(elapsed * 1.8) * 0.15;
  return toWorld(fx, topBand(calm) + Math.cos(elapsed * 2.6) * 0.01, viewport);
}

export type MicrobeAnchor = Point & { z: number; scale: number; color: string; speed: number };

type Slot = { fx: number; fy: number };
const MICROBE_LOOKS = [
  { z: 0, scale: 0.65, color: "#57cc99", speed: 1.2 },
  { z: 0.2, scale: 0.58, color: "#38a3a5", speed: 1.4 },
  { z: 0.8, scale: 0.45, color: "#80ed99", speed: 1.6 },
  { z: -0.5, scale: 0.42, color: "#57cc99", speed: 1.8 },
];

function microbeSlots(calm: CalmRect): Slot[] {
  const bottom = bottomBand(calm);
  if (hasSideBands(calm)) {
    return [
      { fx: calm.left * 0.55, fy: 0.46 },
      { fx: 1 - (1 - calm.right) * 0.45, fy: 0.2 },
      { fx: calm.left * 0.35, fy: 0.64 },
      { fx: 0.8, fy: Math.min(bottom + 0.03, 0.93) },
    ];
  }
  return [
    { fx: 0.86, fy: bottom },
    { fx: 0.7, fy: Math.min(bottom + 0.02, 0.93) },
    { fx: 0.08, fy: bottom },
    { fx: 0.95, fy: topBand(calm) },
  ];
}

/** Microbes wobble in the corners; the first slots are the most visible, so phones keep those. */
export function microbeAnchors({ viewport, calm }: SceneLayout, count: number): MicrobeAnchor[] {
  return microbeSlots(calm)
    .slice(0, count)
    .map(({ fx, fy }, i) => ({ ...MICROBE_LOOKS[i], ...toWorld(fx, fy, viewport) }));
}

/** World x of the mist front for a sweep progress, starting and ending just off-screen. */
export function sweepFrontX(sweep: number | null, { width }: Viewport): number | null {
  if (sweep === null) return null;
  const margin = 1;
  return lerp(-width / 2 - margin, width / 2 + margin, sweep);
}
