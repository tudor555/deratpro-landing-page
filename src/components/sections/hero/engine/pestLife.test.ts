import { describe, expect, it } from "vitest";
import { REEMERGE_START, dissolveAmount, newPestLife, updatePestLife } from "./pestLife";

const frame = (t: number, cycle = 0) => ({ t, cycle });

describe("pest life", () => {
  it("stays fully visible until something hits it", () => {
    const life = updatePestLife(newPestLife(), frame(4), false);
    expect(dissolveAmount(life, 4)).toBe(0);
    expect(dissolveAmount(life, 11)).toBe(0);
  });

  it("dissolves over a short window once hit", () => {
    const life = updatePestLife(newPestLife(), frame(6), true);
    expect(dissolveAmount(life, 6)).toBe(0);
    expect(dissolveAmount(life, 6.45)).toBeCloseTo(0.5);
    expect(dissolveAmount(life, 7)).toBe(1);
    expect(dissolveAmount(life, 10)).toBe(1);
  });

  it("ignores repeated hits while dissolving", () => {
    let life = updatePestLife(newPestLife(), frame(6), true);
    life = updatePestLife(life, frame(6.3), true);
    expect(dissolveAmount(life, 6.45)).toBeCloseTo(0.5);
  });

  it("re-materialises during the return phase", () => {
    const life = updatePestLife(newPestLife(), frame(6), true);
    expect(dissolveAmount(life, REEMERGE_START)).toBe(1);
    expect(dissolveAmount(life, 11.25)).toBeCloseTo(0.5);
    expect(dissolveAmount(life, 11.999)).toBeCloseTo(0, 2);
  });

  it("cannot be hit while re-materialising", () => {
    const life = updatePestLife(newPestLife(), frame(11), true);
    expect(life.dissolvedAt).toBeNull();
  });

  it("resets at the start of the next loop", () => {
    const hit = updatePestLife(newPestLife(), frame(6), true);
    const next = updatePestLife(hit, frame(0.1, 1), false);
    expect(next).toEqual({ cycle: 1, dissolvedAt: null });
    expect(dissolveAmount(next, 0.1)).toBe(0);
  });
});
