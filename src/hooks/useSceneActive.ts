"use client";

import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** True while the element is on screen and the tab is visible: the only time a render loop is worth running. */
export function useSceneActive(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return inView && tabVisible;
}
