import { afterEach, describe, expect, it, vi } from "vitest";
import { supportsWebGL } from "./supportsWebGL";

function stubContexts(available: string[]) {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(((type: string) =>
    available.includes(type) ? {} : null) as HTMLCanvasElement["getContext"]);
}

describe("supportsWebGL", () => {
  afterEach(() => vi.restoreAllMocks());

  it("is true with WebGL 2", () => {
    stubContexts(["webgl2"]);
    expect(supportsWebGL()).toBe(true);
  });

  it("falls back to WebGL 1", () => {
    stubContexts(["webgl"]);
    expect(supportsWebGL()).toBe(true);
  });

  it("is false when the browser offers neither", () => {
    stubContexts([]);
    expect(supportsWebGL()).toBe(false);
  });

  it("is false when asking for a context throws", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(supportsWebGL()).toBe(false);
  });
});
