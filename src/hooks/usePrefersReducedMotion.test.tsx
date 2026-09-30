import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function Probe() {
  return <p>{usePrefersReducedMotion() ? "reduce" : "full"}</p>;
}

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: initial,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
  };
  vi.stubGlobal("matchMedia", vi.fn(() => mql));
  return (matches: boolean) => {
    mql.matches = matches;
    listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
  };
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reflects the user's motion preference and follows changes", () => {
    const change = mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByText("reduce")).toBeInTheDocument();
    act(() => change(false));
    expect(screen.getByText("full")).toBeInTheDocument();
  });
});
