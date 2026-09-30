import { describe, expect, it } from "vitest";
import { LOOP_SECONDS } from "./timeline";
import { isInCalmZone, microbeAnchors, mosquitoPath, mousePath, roachPath } from "./layout";

// World-space size of the z=0 plane for a 40° camera at z=16.
const DESKTOP = { width: 20.7, height: 11.65 };
const MOBILE = { width: 5.36, height: 11.65 };

function samples() {
  return Array.from({ length: LOOP_SECONDS * 10 }, (_, i) => i / 10);
}

describe("calm zone", () => {
  it("covers the central 60% × 50% of the hero", () => {
    expect(isInCalmZone({ x: 0, y: 0 }, DESKTOP)).toBe(true);
    expect(isInCalmZone({ x: DESKTOP.width * 0.29, y: DESKTOP.height * 0.24 }, DESKTOP)).toBe(true);
    expect(isInCalmZone({ x: DESKTOP.width * 0.31, y: 0 }, DESKTOP)).toBe(false);
    expect(isInCalmZone({ x: 0, y: -DESKTOP.height * 0.26 }, DESKTOP)).toBe(false);
  });
});

describe.each([
  ["desktop", DESKTOP],
  ["mobile", MOBILE],
])("creature paths on %s", (_, viewport) => {
  it("keep the mouse out of the calm zone", () => {
    for (const t of samples()) expect(isInCalmZone(mousePath(t, viewport), viewport)).toBe(false);
  });

  it("keep the cockroach out of the calm zone", () => {
    for (const t of samples()) expect(isInCalmZone(roachPath(t, viewport), viewport)).toBe(false);
  });

  it("keep the mosquito out of the calm zone", () => {
    for (const t of samples()) expect(isInCalmZone(mosquitoPath(t * 3.7, viewport), viewport)).toBe(false);
  });

  it("park every microbe outside the calm zone", () => {
    for (const microbe of microbeAnchors(viewport, 4)) expect(isInCalmZone(microbe, viewport)).toBe(false);
  });
});

describe("microbeAnchors", () => {
  it("returns the requested number of microbes", () => {
    expect(microbeAnchors(DESKTOP, 4)).toHaveLength(4);
    expect(microbeAnchors(MOBILE, 2)).toHaveLength(2);
  });
});
