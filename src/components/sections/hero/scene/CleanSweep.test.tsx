import ReactThreeTestRenderer from "@react-three/test-renderer";
import type { Group, Scene } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubCanvas2d } from "@/test/canvas2d";
import { DEFAULT_CALM } from "../engine/layout";
import { sceneQuality } from "../engine/quality";
import { CleanSweep } from "./CleanSweep";

const desktop = sceneQuality(1440);

async function mount(eventTarget: HTMLElement | null = null) {
  const renderer = await ReactThreeTestRenderer.create(
    <CleanSweep quality={desktop} eventTarget={eventTarget} calm={DEFAULT_CALM} />,
  );
  const scene = renderer.scene.instance as Scene;
  const stage = scene.children.find((child) => child.type === "Group") as Group;
  return { renderer, scene, stage };
}

describe("CleanSweep", () => {
  beforeEach(() => stubCanvas2d());
  afterEach(() => vi.restoreAllMocks());

  it("lights the scene and puts every element on stage", async () => {
    const { scene, stage } = await mount();
    expect(scene.children.filter((child) => (child as { isLight?: boolean }).isLight)).toHaveLength(4);
    // mouse, cockroach, mosquito, 4 microbes, sweep mist, cursor trail, sparkles, clean light
    expect(stage.children).toHaveLength(3 + desktop.microbes + 2 + 1 + 1);
  });

  it("caps a long frame gap so the story does not jump ahead", async () => {
    const smooth = await mount();
    await smooth.renderer.advanceFrames(1, 0.1);
    const stalled = await mount();
    await stalled.renderer.advanceFrames(1, 5);
    expect(stalled.stage.children[0].position.x).toBeCloseTo(smooth.stage.children[0].position.x);
  });

  it("tilts the scene toward the pointer", async () => {
    const hero = document.createElement("section");
    hero.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
    const { renderer, stage } = await mount(hero);
    await renderer.advanceFrames(1, 0.016);
    hero.dispatchEvent(new MouseEvent("pointermove", { clientX: 200, clientY: 0 }));
    await renderer.advanceFrames(10, 0.016);
    expect(stage.rotation.y).toBeGreaterThan(0);
    expect(stage.rotation.x).toBeLessThan(0);
  });

  it("moves creatures around a new text box measurement", async () => {
    const { renderer, stage } = await mount();
    await renderer.advanceFrames(2, 0.05);
    const cockroach = stage.children[1];
    // Desktop: side bands are wide enough, so it crawls up the right edge, head up.
    expect(Math.abs(cockroach.rotation.z)).toBeLessThan(0.1);

    const phone = { left: 0.04, right: 0.96, top: 0.08, bottom: 0.86 };
    await renderer.update(<CleanSweep quality={desktop} eventTarget={null} calm={phone} />);
    await renderer.advanceFrames(2, 0.05);
    // Phone: no room at the sides, so it turns to crawl along the top band.
    expect(cockroach.rotation.z).toBeCloseTo(Math.PI / 2, 0);
  });
});
