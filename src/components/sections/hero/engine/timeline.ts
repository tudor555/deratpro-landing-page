export const LOOP_SECONDS = 12;

export const PHASES = {
  sweepStart: 5.5,
  cleanStart: 8.8,
  returnStart: 10.5,
} as const;

export type Phase = "enter" | "sweep" | "clean" | "return";

export type TimelineFrame = {
  /** Completed loops so far. */
  cycle: number;
  /** Seconds into the current loop. */
  t: number;
  phase: Phase;
  /** Sweep front progress 0 (left edge) → 1 (right edge); null while no sweep runs. */
  sweep: number | null;
  /** Clean-light intensity 0 → 1 → 0 across the clean moment. */
  beam: number;
  /** Clean-light travel progress 0 → 1 across the clean moment. */
  beamProgress: number;
};

function phaseAt(t: number): Phase {
  if (t < PHASES.sweepStart) return "enter";
  if (t < PHASES.cleanStart) return "sweep";
  if (t < PHASES.returnStart) return "clean";
  return "return";
}

export function sampleTimeline(elapsed: number): TimelineFrame {
  const cycle = Math.floor(elapsed / LOOP_SECONDS);
  const t = elapsed - cycle * LOOP_SECONDS;
  const phase = phaseAt(t);

  const sweep = phase === "sweep" ? (t - PHASES.sweepStart) / (PHASES.cleanStart - PHASES.sweepStart) : null;
  const beamProgress = phase === "clean" ? (t - PHASES.cleanStart) / (PHASES.returnStart - PHASES.cleanStart) : 0;
  const beam = phase === "clean" ? Math.sin(beamProgress * Math.PI) : 0;

  return { cycle, t, phase, sweep, beam, beamProgress };
}
