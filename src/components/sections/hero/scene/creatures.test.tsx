import type { Mesh, Object3D } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubCanvas2d } from "@/test/canvas2d";
import { renderScene } from "@/test/renderScene";
import { Cockroach } from "./Cockroach";
import { Microbes } from "./Microbes";
import { Mosquito } from "./Mosquito";
import { Mouse } from "./Mouse";

function firstMesh(root: Object3D): Mesh {
  let found: Mesh | undefined;
  root.traverse((child) => {
    if (!found && (child as Mesh).isMesh) found = child as Mesh;
  });
  return found!;
}

describe.each([
  ["Mouse", () => <Mouse scale={0.9} />],
  ["Cockroach", () => <Cockroach scale={0.9} />],
  ["Mosquito", () => <Mosquito scale={0.9} />],
])("%s", (_, element) => {
  beforeEach(() => {
    stubCanvas2d();
  });
  afterEach(() => vi.restoreAllMocks());

  it("is on stage before the sweep", async () => {
    const { scene, playTo } = await renderScene(element());
    await playTo(3);
    expect(scene.children[0].visible).toBe(true);
  });

  it("is dissolved by the sweep, bursting into sparkles, and gone during the clean moment", async () => {
    const { scene, store, playTo } = await renderScene(element());
    await playTo(9.5);
    expect(scene.children[0].visible).toBe(false);
    expect(store.sparkleQueue.length).toBeGreaterThanOrEqual(1);
  });

  it("re-materialises for the next loop", async () => {
    const { scene, playTo } = await renderScene(element());
    await playTo(12.5);
    expect(scene.children[0].visible).toBe(true);
  });

  it("frees its GPU resources when unmounted", async () => {
    const { scene, renderer, playTo } = await renderScene(element());
    await playTo(0.1);
    const dispose = vi.spyOn(firstMesh(scene.children[0]).geometry, "dispose");
    await renderer.unmount();
    expect(dispose).toHaveBeenCalled();
  });
});

describe("Mouse motion", () => {
  beforeEach(() => stubCanvas2d());
  afterEach(() => vi.restoreAllMocks());

  it("walks in from the left, then stops to sniff", async () => {
    const { scene, playTo } = await renderScene(<Mouse scale={0.9} />);
    await playTo(0.5);
    const entering = scene.children[0].position.x;
    await playTo(3);
    const resting = scene.children[0].position.x;
    await playTo(4);
    expect(resting).toBeGreaterThan(entering);
    expect(scene.children[0].position.x).toBeCloseTo(resting);
  });
});

describe("Cockroach motion", () => {
  afterEach(() => vi.restoreAllMocks());

  it("crawls upward along the right edge", async () => {
    const { scene, playTo } = await renderScene(<Cockroach scale={0.9} />);
    await playTo(1);
    const low = scene.children[0].position.y;
    await playTo(5);
    expect(scene.children[0].position.x).toBeGreaterThan(0);
    expect(scene.children[0].position.y).toBeGreaterThan(low);
  });
});

describe("Mosquito motion", () => {
  beforeEach(() => stubCanvas2d());
  afterEach(() => vi.restoreAllMocks());

  it("turns to face the way it flies", async () => {
    const { scene, playTo } = await renderScene(<Mosquito scale={0.9} />);
    const root = scene.children[0];
    const headings = new Set<number>();
    for (let t = 0.5; t <= 4; t += 0.5) {
      await playTo(t);
      headings.add(Math.sign(Math.cos(root.rotation.y)));
    }
    // Facing right has cos(heading) > 0, facing left < 0: over a few seconds it does both.
    expect(headings).toEqual(new Set([1, -1]));
  });
});

describe("Microbes", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the requested number of microbes", async () => {
    const { scene } = await renderScene(<Microbes count={3} scale={0.9} />);
    expect(scene.children).toHaveLength(3);
  });

  it("shrink and pop when the mist reaches them", async () => {
    const { scene, store, playTo } = await renderScene(<Microbes count={2} scale={0.9} />);
    await playTo(3);
    expect(scene.children.every((microbe) => microbe.visible)).toBe(true);
    await playTo(9.5);
    expect(scene.children.every((microbe) => !microbe.visible)).toBe(true);
    expect(store.sparkleQueue).toHaveLength(2);
  });
});
