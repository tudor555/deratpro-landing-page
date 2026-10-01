import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createSceneStore, type SceneStore } from "./store";
import { usePointerNozzle } from "./usePointerNozzle";

let hero: HTMLElement;
let store: SceneStore;

function pointer(type: string, clientX = 0, clientY = 0) {
  hero.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
}

describe("usePointerNozzle", () => {
  beforeEach(() => {
    hero = document.createElement("section");
    hero.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
    store = createSceneStore();
    store.viewport = { width: 20, height: 10 };
    store.elapsed = 3;
  });

  it("maps the pointer to the scene and sprays a short mist trail", () => {
    renderHook(() => usePointerNozzle(hero, store));
    pointer("pointermove", 150, 25);

    expect(store.pointer.inside).toBe(true);
    expect(store.pointer.ndc.toArray()).toEqual([0.5, 0.5]);
    expect(store.pointer.world.toArray()).toEqual([5, 2.5, 0]);
    expect(store.pointer.lastSprayAt).toBe(3);
    expect(store.trailQueue).toEqual([{ x: 5, y: 2.5, z: 0, count: 3 }]);
  });

  it("ignores tiny jitters below two pixels", () => {
    renderHook(() => usePointerNozzle(hero, store));
    pointer("pointermove", 100, 50);
    pointer("pointermove", 101, 50);
    expect(store.trailQueue).toHaveLength(1);
  });

  it("sprays a burst with sparkles on tap", () => {
    renderHook(() => usePointerNozzle(hero, store));
    pointer("pointerdown", 100, 50);
    expect(store.trailQueue).toEqual([{ x: 0, y: 0, z: 0, count: 36 }]);
    expect(store.sparkleQueue).toEqual([{ x: 0, y: 0, z: 0, count: 14 }]);
  });

  it("recentres and stops spraying when the pointer leaves the hero", () => {
    renderHook(() => usePointerNozzle(hero, store));
    pointer("pointermove", 150, 25);
    pointer("pointerleave");
    expect(store.pointer.inside).toBe(false);
    expect(store.pointer.ndc.toArray()).toEqual([0, 0]);
  });

  it("stops listening on unmount and does nothing without a target", () => {
    const { unmount } = renderHook(() => usePointerNozzle(hero, store));
    unmount();
    pointer("pointermove", 150, 25);
    expect(store.trailQueue).toEqual([]);

    expect(() => renderHook(() => usePointerNozzle(null, store))).not.toThrow();
  });
});
