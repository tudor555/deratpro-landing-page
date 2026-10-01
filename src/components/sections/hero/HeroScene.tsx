"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import type { CalmRect } from "./engine/layout";
import { sceneQuality } from "./engine/quality";
import { CleanSweep } from "./scene/CleanSweep";
import { installThreeConsole } from "./scene/threeConsole";

// Runs once when this lazy chunk loads, before the canvas creates React Three Fiber's store.
installThreeConsole();

type HeroSceneProps = {
  active: boolean;
  eventTarget: HTMLElement | null;
  calm: CalmRect;
  onReady: () => void;
};

/** The "Clean Sweep" canvas. Loaded lazily and only on the client. */
export default function HeroScene({ active, eventTarget, calm, onReady }: HeroSceneProps) {
  const [quality] = useState(() => sceneQuality(window.innerWidth));

  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ fov: 40, position: [0, 0, 16], near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={onReady}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <CleanSweep quality={quality} eventTarget={eventTarget} calm={calm} />
    </Canvas>
  );
}
