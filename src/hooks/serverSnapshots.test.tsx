import { useRef } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useSceneActive } from "./useSceneActive";

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const active = useSceneActive(ref);
  return <div ref={ref}>{`${reduce ? "reduce" : "full"} ${active ? "active" : "paused"}`}</div>;
}

describe("hooks during the static build", () => {
  it("render nothing animated before the browser takes over", () => {
    // Pre-rendered HTML must never start the 3D scene: assume reduced motion and a paused scene.
    expect(renderToString(<Probe />)).toContain("reduce paused");
  });
});
