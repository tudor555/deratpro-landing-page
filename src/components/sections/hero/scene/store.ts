import { createContext, useContext } from "react";
import { Vector2, Vector3 } from "three";
import { type CalmRect, DEFAULT_CALM, type Viewport } from "../engine/layout";

export type Emission = { x: number; y: number; z: number; count: number };

/** Mutable per-frame state shared by the scene; kept out of React state so frames never re-render. */
export type SceneStore = {
  /** Scene time in seconds; only advances while the render loop runs. */
  elapsed: number;
  viewport: Viewport;
  /** The hero text box, which creatures and mist keep clear of. */
  calm: CalmRect;
  pointer: {
    ndc: Vector2;
    world: Vector3;
    inside: boolean;
    lastSprayAt: number;
  };
  sparkleQueue: Emission[];
  trailQueue: Emission[];
};

export function createSceneStore(): SceneStore {
  return {
    elapsed: 0,
    viewport: { width: 1, height: 1 },
    calm: DEFAULT_CALM,
    pointer: { ndc: new Vector2(), world: new Vector3(), inside: false, lastSprayAt: -Infinity },
    sparkleQueue: [],
    trailQueue: [],
  };
}

const SPRAY_LINGER_SECONDS = 0.15;

export function isSpraying(store: SceneStore): boolean {
  return store.pointer.inside && store.elapsed - store.pointer.lastSprayAt < SPRAY_LINGER_SECONDS;
}

export const SceneStoreContext = createContext<SceneStore | null>(null);

export function useSceneStore(): SceneStore {
  const store = useContext(SceneStoreContext);
  if (!store) throw new Error("useSceneStore must be used inside the Clean Sweep scene");
  return store;
}
