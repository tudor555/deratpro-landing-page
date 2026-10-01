"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSceneActive } from "@/hooks/useSceneActive";
import { cn } from "@/lib/cn";
import { type CalmRect, DEFAULT_CALM } from "./engine/layout";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { supportsWebGL } from "./supportsWebGL";

const HeroScene = lazy(() => import("./HeroScene"));

/** The hero text box as fractions of the hero, so the scene can keep creatures and mist off the copy. */
function measureCalm(section: HTMLElement): CalmRect {
  const content = section.querySelector("[data-hero-content]");
  const hero = section.getBoundingClientRect();
  if (!content || hero.width === 0 || hero.height === 0) return DEFAULT_CALM;
  const box = content.getBoundingClientRect();
  return {
    left: (box.left - hero.left) / hero.width,
    right: (box.right - hero.left) / hero.width,
    top: (box.top - hero.top) / hero.height,
    bottom: (box.bottom - hero.top) / hero.height,
  };
}

/**
 * Decorative 3D layer behind the hero text. Waits for the browser to go idle so it never
 * competes with the headline paint, and stays off for reduced motion or missing WebGL.
 */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const active = useSceneActive(ref);
  const [eventTarget, setEventTarget] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [calm, setCalm] = useState<CalmRect>(DEFAULT_CALM);

  useEffect(() => {
    if (reduceMotion || !supportsWebGL()) return;
    const start = () => {
      const section = ref.current?.closest("section") ?? null;
      if (section) setCalm(measureCalm(section));
      setEventTarget(section);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 200);
    return () => clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (!eventTarget || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setCalm(measureCalm(eventTarget)));
    observer.observe(eventTarget);
    return () => observer.disconnect();
  }, [eventTarget]);

  const mounted = eventTarget !== null && !reduceMotion;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("absolute inset-0 transition-opacity duration-1000", visible ? "opacity-100" : "opacity-0")}
    >
      {mounted && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <HeroScene active={active} eventTarget={eventTarget} calm={calm} onReady={() => setVisible(true)} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
