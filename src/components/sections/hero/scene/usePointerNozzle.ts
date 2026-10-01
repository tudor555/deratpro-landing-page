"use client";

import { useEffect } from "react";
import type { SceneStore } from "./store";

const TRAIL_PER_MOVE = 3;
const TAP_TRAIL = 36;
const TAP_SPARKLES = 14;

/** Turns pointer movement over the hero into a spray nozzle. Listens on the hero element, never on window. */
export function usePointerNozzle(target: HTMLElement | null, store: SceneStore) {
  useEffect(() => {
    if (!target) return;
    const { pointer } = store;
    let lastX = 0;
    let lastY = 0;

    const locate = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      pointer.ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      pointer.world.set((pointer.ndc.x * store.viewport.width) / 2, (pointer.ndc.y * store.viewport.height) / 2, 0);
      pointer.inside = true;
    };

    const onMove = (event: PointerEvent) => {
      locate(event);
      if (Math.hypot(event.clientX - lastX, event.clientY - lastY) < 2) return;
      lastX = event.clientX;
      lastY = event.clientY;
      pointer.lastSprayAt = store.elapsed;
      store.trailQueue.push({ ...pointer.world, count: TRAIL_PER_MOVE });
    };

    const onDown = (event: PointerEvent) => {
      locate(event);
      pointer.lastSprayAt = store.elapsed;
      store.trailQueue.push({ ...pointer.world, count: TAP_TRAIL });
      store.sparkleQueue.push({ ...pointer.world, count: TAP_SPARKLES });
    };

    const onLeave = () => {
      pointer.inside = false;
      pointer.ndc.set(0, 0);
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerdown", onDown, { passive: true });
    target.addEventListener("pointerleave", onLeave);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [target, store]);
}
