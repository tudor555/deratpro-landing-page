import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { DEFAULT_CALM } from "../engine/layout";
import { createSceneStore, isSpraying, SceneStoreContext, useSceneStore } from "./store";

describe("scene store", () => {
  it("starts at time zero with empty queues, no pointer and the default calm zone", () => {
    const store = createSceneStore();
    expect(store.elapsed).toBe(0);
    expect(store.calm).toEqual(DEFAULT_CALM);
    expect(store.sparkleQueue).toEqual([]);
    expect(store.trailQueue).toEqual([]);
    expect(store.pointer.inside).toBe(false);
  });

  it("counts as spraying only shortly after the pointer moved inside the hero", () => {
    const store = createSceneStore();
    store.elapsed = 10;
    store.pointer.lastSprayAt = 9.95;
    expect(isSpraying(store)).toBe(false);

    store.pointer.inside = true;
    expect(isSpraying(store)).toBe(true);

    store.elapsed = 10.5;
    expect(isSpraying(store)).toBe(false);
  });

  it("is only available inside the scene", () => {
    expect(() => renderHook(() => useSceneStore())).toThrow(/inside the Clean Sweep scene/);

    const store = createSceneStore();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SceneStoreContext.Provider value={store}>{children}</SceneStoreContext.Provider>
    );
    expect(renderHook(() => useSceneStore(), { wrapper }).result.current).toBe(store);
  });
});
