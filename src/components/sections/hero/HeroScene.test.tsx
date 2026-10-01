import { render, screen } from "@testing-library/react";
import { type ReactNode, useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_CALM } from "./engine/layout";

const installThreeConsole = vi.hoisted(() => vi.fn());
vi.mock("./scene/threeConsole", () => ({ installThreeConsole }));

// Real WebGL is unavailable in jsdom; the scene itself is tested with the R3F test renderer.
vi.mock("@react-three/fiber", () => ({
  Canvas: ({
    children,
    dpr,
    frameloop,
    onCreated,
  }: {
    children: ReactNode;
    dpr: number[];
    frameloop: string;
    onCreated: () => void;
  }) => {
    useEffect(() => onCreated(), [onCreated]);
    return (
      <div data-testid="canvas" data-dpr={dpr.join(",")} data-frameloop={frameloop}>
        {children}
      </div>
    );
  },
}));
vi.mock("./scene/CleanSweep", () => ({
  CleanSweep: ({ quality }: { quality: { microbes: number } }) => (
    <span data-testid="clean-sweep" data-microbes={quality.microbes} />
  ),
}));

import HeroScene from "./HeroScene";

// Mock call history is cleared before each test, so record what happened at import time.
const consoleInstallsAtImport = installThreeConsole.mock.calls.length;

describe("HeroScene", () => {
  it("routes three.js logging through the filter as soon as the chunk loads", () => {
    expect(consoleInstallsAtImport).toBe(1);
  });

  it("caps the pixel ratio and renders only while active", () => {
    const onReady = vi.fn();
    const { rerender } = render(<HeroScene active eventTarget={null} calm={DEFAULT_CALM} onReady={onReady} />);
    const canvas = screen.getByTestId("canvas");
    expect(canvas).toHaveAttribute("data-dpr", "1,1.5");
    expect(canvas).toHaveAttribute("data-frameloop", "always");
    expect(onReady).toHaveBeenCalled();

    rerender(<HeroScene active={false} eventTarget={null} calm={DEFAULT_CALM} onReady={onReady} />);
    expect(screen.getByTestId("canvas")).toHaveAttribute("data-frameloop", "never");
  });

  it("picks the scene quality from the screen width once", () => {
    vi.stubGlobal("innerWidth", 390);
    render(<HeroScene active eventTarget={null} calm={DEFAULT_CALM} onReady={() => {}} />);
    expect(screen.getByTestId("clean-sweep")).toHaveAttribute("data-microbes", "1");
    vi.unstubAllGlobals();
  });
});
