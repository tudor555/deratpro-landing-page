"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Points } from "three";
import { createSpriteBuffers } from "./particles";
import { createPuffTexture, createSpriteMaterial, pointScale } from "./sprites";
import { useSceneStore } from "./store";

const SPARKLE_COLORS = ["#57cc99", "#80ed99", "#c7f9cc", "#80ed99"];

/** Mint sparkles that drift up and fade wherever a pest dissolves or the user taps. */
export function Sparkles({ count }: { count: number }) {
  const store = useSceneStore();

  const pool = useMemo(() => {
    const texture = createPuffTexture();
    const buffers = createSpriteBuffers(count, SPARKLE_COLORS);
    const material = createSpriteMaterial(texture);
    const points = new Points(buffers.geometry, material);
    points.frustumCulled = false;
    return { texture, buffers, material, points, life: new Float32Array(count).fill(1), velocity: new Float32Array(count * 3), cursor: 0 };
  }, [count]);

  useEffect(
    () => () => {
      pool.buffers.geometry.dispose();
      pool.material.dispose();
      pool.texture.dispose();
    },
    [pool],
  );

  useFrame((state, delta) => {
    pool.material.uniforms.uScale.value = pointScale(state.size.height, state.viewport.dpr, 40);
    const b = pool.buffers;

    for (const emission of store.sparkleQueue.splice(0)) {
      for (let k = 0; k < emission.count; k++) {
        const i = pool.cursor;
        pool.cursor = (pool.cursor + 1) % count;
        pool.life[i] = 0;
        b.position[i * 3] = emission.x + (Math.random() - 0.5) * 0.6;
        b.position[i * 3 + 1] = emission.y + (Math.random() - 0.5) * 0.6;
        b.position[i * 3 + 2] = emission.z + (Math.random() - 0.5) * 0.4;
        pool.velocity[i * 3] = (Math.random() - 0.5) * 1.2;
        pool.velocity[i * 3 + 1] = 1 + Math.random() * 2;
        pool.velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
    }

    for (let i = 0; i < count; i++) {
      if (pool.life[i] >= 1) {
        b.alpha[i] = 0;
        continue;
      }
      pool.life[i] = Math.min(1, pool.life[i] + delta * 0.9);
      for (let axis = 0; axis < 3; axis++) b.position[i * 3 + axis] += pool.velocity[i * 3 + axis] * delta;
      pool.velocity[i * 3 + 1] *= 0.985;
      b.size[i] = 0.35 * (1 - pool.life[i] * 0.5);
      b.alpha[i] = Math.sin((1 - pool.life[i]) * Math.PI * 0.5) * 0.95;
    }
    b.markDirty();
  });

  return <primitive object={pool.points} />;
}
