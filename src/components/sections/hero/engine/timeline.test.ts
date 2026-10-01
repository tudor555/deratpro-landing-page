import { describe, expect, it } from "vitest";
import { LOOP_SECONDS, sampleTimeline } from "./timeline";

describe("sampleTimeline", () => {
  it("loops every 12 seconds and counts cycles", () => {
    expect(LOOP_SECONDS).toBe(12);
    expect(sampleTimeline(3)).toMatchObject({ cycle: 0, t: 3 });
    expect(sampleTimeline(27)).toMatchObject({ cycle: 2, t: 3 });
  });

  it.each([
    [0, "enter"],
    [5.49, "enter"],
    [5.5, "sweep"],
    [8.79, "sweep"],
    [8.8, "clean"],
    [10.49, "clean"],
    [10.5, "return"],
    [11.99, "return"],
  ])("at %ss is in the %s phase", (t, phase) => {
    expect(sampleTimeline(t).phase).toBe(phase);
  });

  it("moves the sweep front from the left edge to the right edge", () => {
    expect(sampleTimeline(5).sweep).toBeNull();
    expect(sampleTimeline(5.5).sweep).toBe(0);
    expect(sampleTimeline(8.8 - 1e-9).sweep).toBeCloseTo(1);
    expect(sampleTimeline(9).sweep).toBeNull();

    const samples = [5.6, 6.5, 7.4, 8.3].map((t) => sampleTimeline(t).sweep!);
    expect([...samples].sort((a, b) => a - b)).toEqual(samples);
  });

  it("brightens the clean light only during the clean moment, peaking midway", () => {
    expect(sampleTimeline(8).beam).toBe(0);
    expect(sampleTimeline(11).beam).toBe(0);
    expect(sampleTimeline(9.65).beam).toBeCloseTo(1);
    expect(sampleTimeline(9.2).beam).toBeGreaterThan(0);
    expect(sampleTimeline(9.2).beam).toBeLessThan(1);
  });
});
