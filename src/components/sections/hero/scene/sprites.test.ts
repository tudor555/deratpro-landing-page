import { AdditiveBlending, CanvasTexture, NormalBlending, Texture } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stubCanvas2d } from "@/test/canvas2d";
import { createPuffTexture, createSpriteMaterial, pointScale } from "./sprites";

describe("sprites", () => {
  afterEach(() => vi.restoreAllMocks());

  it("draws a soft puff texture from overlapping radial gradients", () => {
    const getContext = stubCanvas2d();
    const texture = createPuffTexture();
    expect(texture).toBeInstanceOf(CanvasTexture);
    const context = getContext.mock.results[0].value as Record<string, ReturnType<typeof vi.fn>>;
    expect(context.createRadialGradient).toHaveBeenCalledTimes(6);
  });

  it("uses normal blending by default, since additive light vanishes on the light hero", () => {
    const material = createSpriteMaterial(new Texture());
    expect(material.blending).toBe(NormalBlending);
    expect(material.transparent).toBe(true);
    expect(material.depthWrite).toBe(false);
    expect(createSpriteMaterial(new Texture(), true).blending).toBe(AdditiveBlending);
  });

  it("converts world size to pixels for the camera's field of view", () => {
    expect(pointScale(900, 1, 90)).toBeCloseTo(450);
    expect(pointScale(900, 2, 90)).toBeCloseTo(900);
  });
});
