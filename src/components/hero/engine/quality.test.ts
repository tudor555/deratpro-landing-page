import { describe, expect, it } from "vitest";
import { sceneQuality } from "./quality";

describe("sceneQuality", () => {
  it("caps the pixel ratio at 1.5", () => {
    expect(sceneQuality(1440).dpr).toEqual([1, 1.5]);
    expect(sceneQuality(390).dpr).toEqual([1, 1.5]);
  });

  it("uses fewer and smaller elements on phones", () => {
    const phone = sceneQuality(390);
    const desktop = sceneQuality(1440);
    expect(phone.mistParticles).toBeLessThan(desktop.mistParticles);
    expect(phone.trailParticles).toBeLessThan(desktop.trailParticles);
    expect(phone.sparkles).toBeLessThan(desktop.sparkles);
    expect(phone.microbes).toBeLessThan(desktop.microbes);
    expect(phone.creatureScale).toBeLessThan(desktop.creatureScale);
  });
});
