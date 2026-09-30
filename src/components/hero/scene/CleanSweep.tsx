"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { type Group, MathUtils } from "three";
import type { CalmRect } from "../engine/layout";
import type { SceneQuality } from "../engine/quality";
import { CleanBeam } from "./CleanBeam";
import { Cockroach } from "./Cockroach";
import { Microbes } from "./Microbes";
import { Mosquito } from "./Mosquito";
import { Mouse } from "./Mouse";
import { Sparkles } from "./Sparkles";
import { SprayMist } from "./SprayMist";
import { createSceneStore, SceneStoreContext, useSceneStore } from "./store";
import { usePointerNozzle } from "./usePointerNozzle";

const MAX_FRAME_SECONDS = 0.1;

/** Advances scene time and syncs the viewport. Rendered first so every other frame callback sees fresh values. */
function SceneClock() {
  const store = useSceneStore();
  useFrame((state, delta) => {
    store.elapsed += Math.min(delta, MAX_FRAME_SECONDS);
    store.viewport = { width: state.viewport.width, height: state.viewport.height };
  });
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight color="#fff8ee" intensity={2.2} position={[10, 14, 12]} />
      <directionalLight color="#57cc99" intensity={2.4} position={[-12, -8, -6]} />
      <pointLight color="#dda15e" intensity={18} distance={25} position={[0, -6, 6]} />
    </>
  );
}

function Parallax({ children }: { children: React.ReactNode }) {
  const store = useSceneStore();
  const group = useRef<Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const { ndc } = store.pointer;
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, ndc.x * 0.12, 0.05);
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, -ndc.y * 0.08, 0.05);
  });
  return <group ref={group}>{children}</group>;
}

type CleanSweepProps = {
  quality: SceneQuality;
  eventTarget: HTMLElement | null;
  calm: CalmRect;
};

export function CleanSweep({ quality, eventTarget, calm }: CleanSweepProps) {
  const [store] = useState(createSceneStore);
  usePointerNozzle(eventTarget, store);

  useEffect(() => {
    store.calm = calm;
  }, [store, calm]);

  return (
    <SceneStoreContext.Provider value={store}>
      <SceneClock />
      <Lights />
      <Parallax>
        <Mouse scale={quality.creatureScale} />
        <Cockroach scale={quality.creatureScale} />
        <Mosquito scale={quality.creatureScale} />
        <Microbes count={quality.microbes} scale={quality.creatureScale} />
        <SprayMist sweepCount={quality.mistParticles} trailCount={quality.trailParticles} />
        <Sparkles count={quality.sparkles} />
        <CleanBeam />
      </Parallax>
    </SceneStoreContext.Provider>
  );
}
