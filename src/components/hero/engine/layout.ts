import { PHASES } from "./timeline";

/** Size of the z=0 plane in world units. */
export type Viewport = { width: number; height: number };
export type Point = { x: number; y: number };

/** The centre area kept clear for the headline and CTAs, as a share of the hero. */
export const CALM_ZONE = { width: 0.6, height: 0.5 } as const;

export function isInCalmZone({ x, y }: Point, { width, height }: Viewport): boolean {
  return Math.abs(x) < (width * CALM_ZONE.width) / 2 && Math.abs(y) < (height * CALM_ZONE.height) / 2;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));

/** Scurries in along the bottom edge, stops to sniff, then bolts right. */
export function mousePath(t: number, { width, height }: Viewport): Point & { moving: boolean } {
  const y = -height * 0.36;
  const start = -width / 2 - 1.5;
  const rest = -width * 0.33;
  if (t < 2.5) return { x: lerp(start, rest, t / 2.5), y, moving: true };
  if (t < PHASES.sweepStart - 0.1) return { x: rest, y, moving: false };
  return { x: rest + (t - (PHASES.sweepStart - 0.1)) * width * 0.18, y, moving: true };
}

/** Crawls up the right edge. */
export function roachPath(t: number, { width, height }: Viewport): Point {
  const x = width / 2 - Math.max(0.7, width * 0.08);
  return { x, y: lerp(-height * 0.4, height * 0.12, t / 6.8) };
}

/** Flies a wobbly path along the top edge. Takes total elapsed time so it never jumps at loop boundaries. */
export function mosquitoPath(elapsed: number, { width, height }: Viewport): Point {
  return {
    x: -width * 0.18 + Math.sin(elapsed * 1.8) * width * 0.24,
    y: height * 0.34 + Math.cos(elapsed * 2.6) * height * 0.035,
  };
}

export type MicrobeAnchor = Point & { z: number; scale: number; color: string; speed: number };

const MICROBE_SLOTS: Array<Omit<MicrobeAnchor, "x" | "y"> & { fx: number; fy: number }> = [
  { fx: -0.36, fy: 0.3, z: 0, scale: 0.65, color: "#57cc99", speed: 1.2 },
  { fx: 0.4, fy: -0.3, z: 0.2, scale: 0.58, color: "#38a3a5", speed: 1.4 },
  { fx: -0.41, fy: 0.12, z: 0.8, scale: 0.45, color: "#80ed99", speed: 1.6 },
  { fx: 0.36, fy: -0.4, z: -0.5, scale: 0.42, color: "#57cc99", speed: 1.8 },
];

/** Microbes wobble in the corners; the first slots are the most visible, so phones keep those. */
export function microbeAnchors({ width, height }: Viewport, count: number): MicrobeAnchor[] {
  return MICROBE_SLOTS.slice(0, count).map(({ fx, fy, ...rest }) => ({ ...rest, x: fx * width, y: fy * height }));
}
