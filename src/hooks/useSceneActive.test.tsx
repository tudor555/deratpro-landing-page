import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { useSceneActive } from "./useSceneActive";

let observerCallback: IntersectionObserverCallback;
const disconnect = vi.fn();

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useSceneActive(ref);
  return <div ref={ref}>{active ? "active" : "paused"}</div>;
}

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
}

function intersect(isIntersecting: boolean) {
  act(() => observerCallback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));
}

describe("useSceneActive", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          observerCallback = cb;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    setVisibility("visible");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("runs while the hero is on screen and the tab is visible", () => {
    render(<Probe />);
    intersect(true);
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("pauses when the hero scrolls out of view", () => {
    render(<Probe />);
    intersect(true);
    intersect(false);
    expect(screen.getByText("paused")).toBeInTheDocument();
  });

  it("pauses while the tab is hidden", () => {
    render(<Probe />);
    intersect(true);
    act(() => setVisibility("hidden"));
    expect(screen.getByText("paused")).toBeInTheDocument();
    act(() => setVisibility("visible"));
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("stops observing on unmount", () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays paused when there is no element to watch", () => {
    function Detached() {
      const active = useSceneActive({ current: null });
      return <p>{active ? "active" : "paused"}</p>;
    }
    render(<Detached />);
    expect(screen.getByText("paused")).toBeInTheDocument();
  });
});
