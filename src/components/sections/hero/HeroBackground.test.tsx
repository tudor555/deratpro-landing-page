import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const webgl = vi.hoisted(() => ({ supported: true }));

vi.mock("./supportsWebGL", () => ({ supportsWebGL: () => webgl.supported }));
vi.mock("./HeroScene", () => ({
  default: ({ calm }: { calm: unknown }) => <div data-testid="hero-scene" data-calm={JSON.stringify(calm)} />,
}));

import { HeroBackground } from "./HeroBackground";

function stubMotionPreference(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reduce, addEventListener: () => {}, removeEventListener: () => {} })),
  );
}

async function renderBackground() {
  render(
    <section data-testid="hero">
      <HeroBackground />
      <div data-hero-content />
    </section>,
  );
  // Let the idle-time mount fallback (200ms) fire.
  await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
}

describe("HeroBackground", () => {
  beforeEach(() => {
    webgl.supported = true;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("mounts the 3D scene when motion is allowed and WebGL works", async () => {
    stubMotionPreference(false);
    await renderBackground();
    expect(await screen.findByTestId("hero-scene")).toBeInTheDocument();
  });

  it("tells the scene where the hero text sits so creatures keep clear of it", async () => {
    stubMotionPreference(false);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const rect = (left: number, top: number, right: number, bottom: number) =>
        ({ left, top, right, bottom, width: right - left, height: bottom - top }) as DOMRect;
      if (this.hasAttribute("data-hero-content")) return rect(200, 80, 800, 480);
      if (this.tagName === "SECTION") return rect(0, 0, 1000, 800);
      return rect(0, 0, 0, 0);
    });

    await renderBackground();
    const calm = JSON.parse((await screen.findByTestId("hero-scene")).dataset.calm!);
    expect(calm).toEqual({ left: 0.2, right: 0.8, top: 0.1, bottom: 0.6 });
  });

  it("keeps the static background for reduced-motion users", async () => {
    stubMotionPreference(true);
    await renderBackground();
    expect(screen.queryByTestId("hero-scene")).not.toBeInTheDocument();
  });

  it("keeps the static background when WebGL is unavailable", async () => {
    stubMotionPreference(false);
    webgl.supported = false;
    await renderBackground();
    expect(screen.queryByTestId("hero-scene")).not.toBeInTheDocument();
  });
});
