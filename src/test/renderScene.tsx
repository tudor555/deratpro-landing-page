import ReactThreeTestRenderer from "@react-three/test-renderer";
import type { ReactNode } from "react";
import type { Scene } from "three";
import { createSceneStore, type SceneStore, SceneStoreContext } from "@/components/sections/hero/scene/store";

/** World size of the hero plane on a 1440×828 desktop hero, as the real canvas reports it. */
export const DESKTOP_VIEWPORT = { width: 20.7, height: 11.65 };

/**
 * Mounts scene components without WebGL and drives scene time by hand, so tests can
 * jump to any moment of the 12-second loop and run every frame callback on the way.
 */
export async function renderScene(node: ReactNode, store: SceneStore = createSceneStore()) {
  if (store.viewport.width === 1) store.viewport = DESKTOP_VIEWPORT;
  const renderer = await ReactThreeTestRenderer.create(
    <SceneStoreContext.Provider value={store}>{node}</SceneStoreContext.Provider>,
  );
  const scene = renderer.scene.instance as Scene;

  async function playTo(seconds: number, step = 0.05) {
    while (store.elapsed < seconds - 1e-9) {
      store.elapsed = Math.min(seconds, store.elapsed + step);
      await renderer.advanceFrames(1, step);
    }
  }

  return { renderer, store, scene, playTo };
}
