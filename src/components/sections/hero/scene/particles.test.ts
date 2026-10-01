import type { BufferAttribute } from "three";
import { describe, expect, it } from "vitest";
import { createSpriteBuffers } from "./particles";

describe("createSpriteBuffers", () => {
  it("creates every attribute the sprite shader reads, parked off-screen", () => {
    const buffers = createSpriteBuffers(4, ["#ff0000", "#0000ff"]);
    for (const name of ["position", "aSize", "aAlpha", "aAngle", "aColor"]) {
      expect(buffers.geometry.getAttribute(name)).toBeDefined();
    }
    expect(buffers.geometry.getAttribute("position").count).toBe(4);
    expect([1, 4, 7, 10].map((i) => buffers.position[i])).toEqual([-100, -100, -100, -100]);
    expect(buffers.alpha.every((a) => a === 0)).toBe(true);
  });

  it("cycles through the palette", () => {
    const { color } = createSpriteBuffers(3, ["#ff0000", "#0000ff"]);
    expect(Array.from(color.slice(0, 3))).toEqual([1, 0, 0]);
    expect(Array.from(color.slice(3, 6))).toEqual([0, 0, 1]);
    expect(Array.from(color.slice(6, 9))).toEqual([1, 0, 0]);
  });

  it("flags the animated attributes for upload", () => {
    const buffers = createSpriteBuffers(2, ["#ffffff"]);
    const versions = () =>
      ["position", "aSize", "aAlpha", "aAngle"].map(
        (n) => (buffers.geometry.getAttribute(n) as BufferAttribute).version,
      );
    const before = versions();
    buffers.markDirty();
    expect(versions()).toEqual(before.map((v) => v + 1));
  });
});
