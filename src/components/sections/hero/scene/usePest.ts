"use client";

import { useRef } from "react";
import type { Object3D } from "three";
import { sweepFrontX } from "../engine/layout";
import { dissolveAmount, newPestLife, updatePestLife } from "../engine/pestLife";
import type { TimelineFrame } from "../engine/timeline";
import type { DissolveUniforms } from "./dissolve";
import { isSpraying, useSceneStore } from "./store";

type Position = { x: number; y: number; z: number };

/**
 * Shared life cycle for every pest: the sweep front or the cursor nozzle dissolves it,
 * it bursts into sparkles, and it re-materialises for the next loop.
 * Returns a per-frame updater that yields the dissolve amount (0 present → 1 gone).
 */
export function usePest(uniforms: DissolveUniforms, hitRadius: number, sparkleCount: number) {
  const store = useSceneStore();
  const life = useRef(newPestLife());

  return (frame: TimelineFrame, position: Position, object: Object3D): number => {
    const front = sweepFrontX(frame.sweep, store.viewport);
    const hitBySweep = front !== null && front >= position.x;
    const { world } = store.pointer;
    const hitByNozzle = isSpraying(store) && Math.hypot(world.x - position.x, world.y - position.y) < hitRadius;

    const wasIntact = life.current.dissolvedAt === null;
    life.current = updatePestLife(life.current, frame, hitBySweep || hitByNozzle);
    if (wasIntact && life.current.dissolvedAt !== null) {
      store.sparkleQueue.push({ ...position, count: sparkleCount });
    }

    const amount = dissolveAmount(life.current, frame.t);
    uniforms.uDissolve.value = amount;
    object.visible = amount < 0.999;
    return amount;
  };
}
