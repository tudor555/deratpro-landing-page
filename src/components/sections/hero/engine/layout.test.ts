import { describe, expect, it } from "vitest";
import { LOOP_SECONDS } from "./timeline";
import {
  type CalmRect,
  DEFAULT_CALM,
  calmDistance,
  type SceneLayout,
  isInCalmRect,
  microbeAnchors,
  mosquitoPath,
  mousePath,
  roachPath,
  sweepFrontX,
} from "./layout";

// World-space size of the z=0 plane for a 40° camera at z=16, plus the measured hero text box.
const DESKTOP: SceneLayout = {
  viewport: { width: 20.7, height: 11.65 },
  calm: { left: 0.215, right: 0.785, top: 0.1, bottom: 0.63 },
};
const TABLET: SceneLayout = {
  viewport: { width: 12.4, height: 11.65 },
  calm: { left: 0.08, right: 0.92, top: 0.09, bottom: 0.65 },
};
const PHONE: SceneLayout = {
  viewport: { width: 5.85, height: 11.65 },
  calm: { left: 0.04, right: 0.96, top: 0.08, bottom: 0.86 },
};

function samples() {
  return Array.from({ length: LOOP_SECONDS * 10 }, (_, i) => i / 10);
}

describe("isInCalmRect", () => {
  const { viewport } = DESKTOP;
  const calm: CalmRect = { left: 0.25, right: 0.75, top: 0.25, bottom: 0.75 };
  const layout = { viewport, calm };

  it("maps hero fractions to world space with y pointing up", () => {
    expect(isInCalmRect({ x: 0, y: 0 }, layout)).toBe(true);
    expect(isInCalmRect({ x: viewport.width * 0.24, y: viewport.height * 0.24 }, layout)).toBe(true);
    expect(isInCalmRect({ x: viewport.width * 0.26, y: 0 }, layout)).toBe(false);
    expect(isInCalmRect({ x: 0, y: viewport.height * 0.26 }, layout)).toBe(false);
  });

  it("can pad the rect so creatures keep some distance", () => {
    expect(isInCalmRect({ x: viewport.width * 0.26, y: 0 }, layout, 0.02)).toBe(true);
  });

  it("defaults to the central 60% × 50% before the text is measured", () => {
    expect(DEFAULT_CALM).toEqual({ left: 0.2, right: 0.8, top: 0.25, bottom: 0.75 });
  });
});

describe.each([
  ["desktop", DESKTOP],
  ["tablet", TABLET],
  ["phone", PHONE],
])("on %s", (_, layout) => {
  const clear = (point: { x: number; y: number }) => expect(isInCalmRect(point, layout, 0.02)).toBe(false);

  it("keeps the mouse clear of the text", () => {
    for (const t of samples()) clear(mousePath(t, layout));
  });

  it("keeps the cockroach clear of the text", () => {
    for (const t of samples()) clear(roachPath(t, layout));
  });

  it("keeps the mosquito clear of the text", () => {
    for (const t of samples()) clear(mosquitoPath(t * 3.7, layout));
  });

  it("parks every microbe clear of the text", () => {
    for (const microbe of microbeAnchors(layout, 4)) clear(microbe);
  });

  it("keeps every creature inside the hero", () => {
    const { width, height } = layout.viewport;
    const inside = ({ x, y }: { x: number; y: number }) => {
      expect(Math.abs(y)).toBeLessThan(height / 2);
      expect(x).toBeLessThan(width / 2 + 0.01);
    };
    for (const t of samples()) {
      inside(roachPath(t, layout));
      inside(mosquitoPath(t * 3.7, layout));
    }
    microbeAnchors(layout, 4).forEach(inside);
  });
});

describe("mousePath", () => {
  it("enters from off-screen left, rests, then bolts right", () => {
    const start = mousePath(0, DESKTOP);
    const resting = mousePath(4, DESKTOP);
    const fleeing = mousePath(7, DESKTOP);
    expect(start.x).toBeLessThan(-DESKTOP.viewport.width / 2);
    expect(resting.moving).toBe(false);
    expect(fleeing.x).toBeGreaterThan(resting.x);
    expect(fleeing.moving).toBe(true);
  });
});

describe("roachPath", () => {
  it("crawls up the right band on desktop", () => {
    const a = roachPath(1, DESKTOP);
    const b = roachPath(5, DESKTOP);
    expect(a.x).toBeGreaterThan(0);
    expect(b.y).toBeGreaterThan(a.y);
    expect(b.heading).toBeCloseTo(0);
  });

  it("crawls left along the top band when there is no room at the sides", () => {
    const a = roachPath(1, PHONE);
    const b = roachPath(5, PHONE);
    expect(b.x).toBeLessThan(a.x);
    expect(b.heading).toBeCloseTo(Math.PI / 2);
  });
});

describe("microbeAnchors", () => {
  it("returns the requested number of microbes", () => {
    expect(microbeAnchors(DESKTOP, 4)).toHaveLength(4);
    expect(microbeAnchors(PHONE, 1)).toHaveLength(1);
  });
});

describe("sweepFrontX", () => {
  it("is absent while no sweep runs", () => {
    expect(sweepFrontX(null, DESKTOP.viewport)).toBeNull();
  });

  it("travels from just off the left edge to just off the right edge", () => {
    expect(sweepFrontX(0, DESKTOP.viewport)).toBeLessThan(-DESKTOP.viewport.width / 2);
    expect(sweepFrontX(1, DESKTOP.viewport)).toBeGreaterThan(DESKTOP.viewport.width / 2);
    expect(sweepFrontX(0.5, DESKTOP.viewport)).toBeCloseTo(0);
  });
});

describe("calmDistance", () => {
  it("is negative inside the text box and positive outside", () => {
    expect(calmDistance({ x: 0, y: 0 }, DESKTOP)).toBeLessThan(0);
    expect(calmDistance({ x: DESKTOP.viewport.width * 0.45, y: 0 }, DESKTOP)).toBeGreaterThan(0);
  });
});
