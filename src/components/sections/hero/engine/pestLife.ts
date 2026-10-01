import { LOOP_SECONDS, PHASES } from "./timeline";

export const DISSOLVE_SECONDS = 0.9;
export const REEMERGE_START = PHASES.returnStart;

export type PestLife = {
  cycle: number;
  /** Loop time at which the pest was hit, or null while it is intact. */
  dissolvedAt: number | null;
};

export function newPestLife(): PestLife {
  return { cycle: 0, dissolvedAt: null };
}

const smoothstep = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

export function updatePestLife(life: PestLife, frame: { cycle: number; t: number }, hit: boolean): PestLife {
  if (frame.cycle !== life.cycle) return { cycle: frame.cycle, dissolvedAt: null };
  if (hit && life.dissolvedAt === null && frame.t < REEMERGE_START) return { ...life, dissolvedAt: frame.t };
  return life;
}

/** 0 = fully present, 1 = fully dissolved. */
export function dissolveAmount(life: PestLife, t: number): number {
  if (life.dissolvedAt === null) return 0;
  if (t >= REEMERGE_START) return 1 - smoothstep((t - REEMERGE_START) / (LOOP_SECONDS - REEMERGE_START));
  return smoothstep((t - life.dissolvedAt) / DISSOLVE_SECONDS);
}
