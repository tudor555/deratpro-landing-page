import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Object3D } from "three";
import { beforeEach, describe, expect, it } from "vitest";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms } from "./dissolve";
import { createSceneStore, type SceneStore, SceneStoreContext } from "./store";
import { usePest } from "./usePest";

let store: SceneStore;

function setup(hitRadius = 1) {
  const uniforms = createDissolveUniforms();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SceneStoreContext.Provider value={store}>{children}</SceneStoreContext.Provider>
  );
  const { result } = renderHook(() => usePest(uniforms, hitRadius, 12), { wrapper });
  return { update: result.current, uniforms, object: new Object3D() };
}

describe("usePest", () => {
  beforeEach(() => {
    store = createSceneStore();
    store.viewport = { width: 20, height: 10 };
  });

  it("stays intact before the sweep", () => {
    const { update, uniforms, object } = setup();
    expect(update(sampleTimeline(3), { x: -8, y: -3, z: 0 }, object)).toBe(0);
    expect(uniforms.uDissolve.value).toBe(0);
    expect(object.visible).toBe(true);
    expect(store.sparkleQueue).toEqual([]);
  });

  it("dissolves into sparkles once the mist front reaches it, then hides", () => {
    const { update, uniforms, object } = setup();
    const position = { x: -8, y: -3, z: 0 };

    // The sweep starts at 5.5s off the left edge; at 5.6s it has not reached x = -8 yet.
    update(sampleTimeline(5.6), position, object);
    expect(store.sparkleQueue).toEqual([]);

    update(sampleTimeline(6), position, object);
    expect(store.sparkleQueue).toEqual([{ ...position, count: 12 }]);

    update(sampleTimeline(6.4), position, object);
    expect(uniforms.uDissolve.value).toBeGreaterThan(0);

    update(sampleTimeline(7), position, object);
    expect(uniforms.uDissolve.value).toBe(1);
    expect(object.visible).toBe(false);
    expect(store.sparkleQueue).toHaveLength(1);
  });

  it("dissolves when the spraying cursor gets close", () => {
    const { update } = setup(1);
    store.elapsed = 2;
    store.pointer.inside = true;
    store.pointer.lastSprayAt = 2;
    store.pointer.world.set(5.5, 0, 0);

    update(sampleTimeline(2), { x: 5, y: 0, z: 0 }, new Object3D());
    expect(store.sparkleQueue).toHaveLength(1);
  });

  it("ignores a cursor that is too far away or not spraying", () => {
    const { update } = setup(1);
    store.elapsed = 2;
    store.pointer.inside = true;
    store.pointer.lastSprayAt = 2;
    store.pointer.world.set(9, 0, 0);
    update(sampleTimeline(2), { x: 5, y: 0, z: 0 }, new Object3D());

    store.pointer.world.set(5, 0, 0);
    store.pointer.lastSprayAt = 0;
    update(sampleTimeline(2), { x: 5, y: 0, z: 0 }, new Object3D());

    expect(store.sparkleQueue).toEqual([]);
  });
});
