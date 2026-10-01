import type { BufferGeometry, Points } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubCanvas2d } from "@/test/canvas2d";
import { renderScene } from "@/test/renderScene";
import { calmDistance } from "../engine/layout";
import { CleanBeam } from "./CleanBeam";
import { Sparkles } from "./Sparkles";
import { SprayMist } from "./SprayMist";

const attribute = (points: Points, name: string) =>
  (points.geometry as BufferGeometry).getAttribute(name).array as Float32Array;

describe("SprayMist", () => {
  beforeEach(() => stubCanvas2d());
  afterEach(() => vi.restoreAllMocks());

  it("shows no sweep mist outside the sweep phase", async () => {
    const { scene, playTo } = await renderScene(<SprayMist sweepCount={60} trailCount={10} />);
    await playTo(3);
    expect(attribute(scene.children[0] as Points, "aAlpha").every((a) => a === 0)).toBe(true);
  });

  it("sweeps a mist band that stays faint over the hero text", async () => {
    const { scene, store, playTo } = await renderScene(<SprayMist sweepCount={160} trailCount={10} />);
    await playTo(7);
    const sweep = scene.children[0] as Points;
    const alpha = attribute(sweep, "aAlpha");
    const position = attribute(sweep, "position");

    const overText: number[] = [];
    const beside: number[] = [];
    for (let i = 0; i < alpha.length; i++) {
      const depth = calmDistance({ x: position[i * 3], y: position[i * 3 + 1] }, store);
      if (depth < -0.1) overText.push(alpha[i]);
      if (depth > 0.04) beside.push(alpha[i]);
    }
    expect(Math.max(...beside)).toBeGreaterThan(0.1);
    expect(overText.length).toBeGreaterThan(0);
    expect(Math.max(...overText)).toBeLessThanOrEqual(0.3 * 0.18 + 1e-6);
  });

  it("turns cursor sprays into a trail that fades away", async () => {
    const { scene, store, playTo } = await renderScene(<SprayMist sweepCount={10} trailCount={20} />);
    store.trailQueue.push({ x: 1, y: 2, z: 0, count: 5 });
    await playTo(0.05);
    const trail = scene.children[1] as Points;
    expect(store.trailQueue).toEqual([]);
    expect(attribute(trail, "aAlpha").filter((a) => a > 0)).toHaveLength(5);

    await playTo(1.5);
    expect(attribute(trail, "aAlpha").every((a) => a === 0)).toBe(true);
  });

  it("frees its buffers, materials and texture on unmount", async () => {
    const { scene, renderer } = await renderScene(<SprayMist sweepCount={10} trailCount={10} />);
    const points = scene.children as Points[];
    const spies = points.flatMap((p) => [vi.spyOn(p.geometry, "dispose"), vi.spyOn(p.material as never, "dispose")]);
    await renderer.unmount();
    spies.forEach((spy) => expect(spy).toHaveBeenCalled());
  });
});

describe("Sparkles", () => {
  beforeEach(() => stubCanvas2d());
  afterEach(() => vi.restoreAllMocks());

  it("bursts where a pest dissolves, drifts up and fades out", async () => {
    const { scene, store, playTo } = await renderScene(<Sparkles count={30} />);
    store.sparkleQueue.push({ x: -3, y: -2, z: 0, count: 8 });
    await playTo(0.05);
    const sparkles = scene.children[0] as Points;
    expect(store.sparkleQueue).toEqual([]);
    expect(attribute(sparkles, "aAlpha").filter((a) => a > 0)).toHaveLength(8);

    const yAt = () => Array.from(attribute(sparkles, "position")).filter((_, i) => i % 3 === 1 && _ > -50);
    const start = Math.max(...yAt());
    await playTo(0.6);
    expect(Math.max(...yAt())).toBeGreaterThan(start);

    await playTo(2);
    expect(attribute(sparkles, "aAlpha").every((a) => a === 0)).toBe(true);
  });

  it("frees its buffers, material and texture on unmount", async () => {
    const { scene, renderer } = await renderScene(<Sparkles count={4} />);
    const points = scene.children[0] as Points;
    const spies = [vi.spyOn(points.geometry, "dispose"), vi.spyOn(points.material as never, "dispose")];
    await renderer.unmount();
    spies.forEach((spy) => expect(spy).toHaveBeenCalled());
  });

  it("recycles the oldest sparkles when the pool is full", async () => {
    const { scene, store, playTo } = await renderScene(<Sparkles count={4} />);
    store.sparkleQueue.push({ x: 0, y: 0, z: 0, count: 6 });
    await playTo(0.05);
    expect(attribute(scene.children[0] as Points, "aAlpha").filter((a) => a > 0)).toHaveLength(4);
  });
});

describe("CleanBeam", () => {
  it("only shines during the clean moment", async () => {
    const { scene, playTo } = await renderScene(<CleanBeam />);
    const beam = scene.children[0];
    await playTo(3);
    expect(beam.visible).toBe(false);
    await playTo(9.6);
    expect(beam.visible).toBe(true);
    await playTo(11);
    expect(beam.visible).toBe(false);
  });

  it("frees its geometry and material on unmount", async () => {
    const { scene, renderer } = await renderScene(<CleanBeam />);
    const mesh = scene.children[0] as unknown as { geometry: { dispose(): void }; material: { dispose(): void } };
    const spies = [vi.spyOn(mesh.geometry, "dispose"), vi.spyOn(mesh.material, "dispose")];
    await renderer.unmount();
    spies.forEach((spy) => expect(spy).toHaveBeenCalled());
  });
});
