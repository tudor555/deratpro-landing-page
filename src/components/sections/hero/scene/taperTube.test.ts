import { LineCurve3, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { taperTube } from "./taperTube";

describe("taperTube", () => {
  it("shrinks the radius linearly from start to end", () => {
    const segments = 4;
    const radial = 6;
    const geometry = taperTube(new LineCurve3(new Vector3(0, 0, 0), new Vector3(10, 0, 0)), segments, 0.5, 0.1, radial);
    const pos = geometry.attributes.position;
    const ringRadius = (ring: number) => Math.hypot(pos.getY(ring * (radial + 1)), pos.getZ(ring * (radial + 1)));

    expect(ringRadius(0)).toBeCloseTo(0.5);
    expect(ringRadius(2)).toBeCloseTo(0.3);
    expect(ringRadius(segments)).toBeCloseTo(0.1);
    expect(geometry.attributes.normal).toBeDefined();
  });
});
