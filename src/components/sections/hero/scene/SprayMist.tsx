"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Points } from "three";
import { calmDistance, type SceneLayout, sweepFrontX } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createSpriteBuffers } from "./particles";
import { createPuffTexture, createSpriteMaterial, pointScale } from "./sprites";
import { useSceneStore } from "./store";

const MIST_COLORS = ["#c7f9cc", "#80ed99", "#c7f9cc", "#57cc99", "#a6ecc1", "#38a3a5"];
const BAND_WIDTH = 3.2;
const FOV = 40;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Thins the mist over the hero text so the copy stays readable while the sweep passes. */
function calmFade(x: number, y: number, layout: SceneLayout) {
  return 0.18 + 0.82 * smoothstep(-0.1, 0.04, calmDistance({ x, y }, layout));
}

/** Automatic left-to-right sweep plus the cursor's nozzle trail, both as soft mist puffs. */
export function SprayMist({ sweepCount, trailCount }: { sweepCount: number; trailCount: number }) {
  const store = useSceneStore();
  const texture = useMemo(() => createPuffTexture(), []);

  const sweep = useMemo(() => {
    const buffers = createSpriteBuffers(sweepCount, MIST_COLORS);
    const material = createSpriteMaterial(texture);
    const points = new Points(buffers.geometry, material);
    points.frustumCulled = false;
    const seeds = Array.from({ length: sweepCount }, (_, i) => ({
      lane: (i + Math.random()) / sweepCount,
      phase: Math.random(),
      size: 1.2 + Math.random() * 1.4,
      spin: (Math.random() - 0.5) * 0.6,
    }));
    return { buffers, material, points, seeds };
  }, [sweepCount, texture]);

  const trail = useMemo(() => {
    const buffers = createSpriteBuffers(trailCount, ["#57cc99", "#80ed99", "#38a3a5"]);
    const material = createSpriteMaterial(texture);
    const points = new Points(buffers.geometry, material);
    points.frustumCulled = false;
    const life = new Float32Array(trailCount).fill(1);
    const velocity = new Float32Array(trailCount * 3);
    return { buffers, material, points, life, velocity, cursor: 0 };
  }, [trailCount, texture]);

  useEffect(
    () => () => {
      for (const part of [sweep, trail]) {
        part.buffers.geometry.dispose();
        part.material.dispose();
      }
      texture.dispose();
    },
    [sweep, trail, texture],
  );

  useFrame((state, delta) => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const scale = pointScale(state.size.height, state.viewport.dpr, FOV);
    sweep.material.uniforms.uScale.value = scale;
    trail.material.uniforms.uScale.value = scale;

    // Sweep band trailing behind the moving front, fading in and out at the edges of the phase.
    const front = sweepFrontX(frame.sweep, store.viewport);
    const { height } = store.viewport;
    const phaseFade = frame.sweep === null ? 0 : Math.min(1, frame.sweep / 0.08, (1 - frame.sweep) / 0.08);
    const s = sweep.buffers;
    sweep.seeds.forEach((seed, i) => {
      if (front === null) {
        s.alpha[i] = 0;
        return;
      }
      const age = (seed.phase + time * 0.45) % 1;
      s.position[i * 3] = front - age * BAND_WIDTH + Math.sin(i * 3 + time * 2) * 0.35;
      s.position[i * 3 + 1] = (seed.lane - 0.5) * height * 1.05 + Math.sin(time * 1.6 + i) * 0.35;
      s.position[i * 3 + 2] = Math.cos(i * 2 + time) * 1.4;
      s.size[i] = seed.size * (0.7 + age * 0.6);
      s.alpha[i] =
        Math.sin(age * Math.PI) * 0.3 * phaseFade * calmFade(s.position[i * 3], s.position[i * 3 + 1], store);
      s.angle[i] += seed.spin * delta;
    });
    s.markDirty();

    // Nozzle trail: a ring buffer fed by pointer events.
    const t = trail.buffers;
    for (const emission of store.trailQueue.splice(0)) {
      for (let k = 0; k < emission.count; k++) {
        const i = trail.cursor;
        trail.cursor = (trail.cursor + 1) % trailCount;
        trail.life[i] = 0;
        t.position[i * 3] = emission.x + (Math.random() - 0.5) * 0.25;
        t.position[i * 3 + 1] = emission.y + (Math.random() - 0.5) * 0.25;
        t.position[i * 3 + 2] = emission.z + 0.3;
        trail.velocity[i * 3] = (Math.random() - 0.5) * 1.6;
        trail.velocity[i * 3 + 1] = -0.4 - Math.random() * 1.2;
        trail.velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
    }
    for (let i = 0; i < trailCount; i++) {
      if (trail.life[i] >= 1) {
        t.alpha[i] = 0;
        continue;
      }
      trail.life[i] = Math.min(1, trail.life[i] + delta * 1.3);
      for (let axis = 0; axis < 3; axis++) t.position[i * 3 + axis] += trail.velocity[i * 3 + axis] * delta;
      t.size[i] = 0.5 + trail.life[i] * 1.4;
      t.alpha[i] = (1 - trail.life[i]) * 0.6;
    }
    t.markDirty();
  });

  return (
    <>
      <primitive object={sweep.points} />
      <primitive object={trail.points} />
    </>
  );
}
