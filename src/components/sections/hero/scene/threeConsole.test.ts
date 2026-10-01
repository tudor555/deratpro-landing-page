import { describe, expect, it, vi } from "vitest";
import { createThreeConsole } from "./threeConsole";

function fakeConsole() {
  return { log: vi.fn(), warn: vi.fn(), error: vi.fn() };
}

describe("createThreeConsole", () => {
  it("drops the Clock deprecation that React Three Fiber 9 triggers internally", () => {
    const base = fakeConsole();
    createThreeConsole(base)("warn", "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.");
    expect(base.warn).not.toHaveBeenCalled();
  });

  it("forwards every other three.js message unchanged", () => {
    const base = fakeConsole();
    const send = createThreeConsole(base);
    send("warn", "THREE.WebGLRenderer: Context Lost.", 42);
    send("error", "THREE.WebGLProgram: Shader Error");
    send("log", "THREE.WebGLRenderer: 186");
    expect(base.warn).toHaveBeenCalledWith("THREE.WebGLRenderer: Context Lost.", 42);
    expect(base.error).toHaveBeenCalledWith("THREE.WebGLProgram: Shader Error");
    expect(base.log).toHaveBeenCalledWith("THREE.WebGLRenderer: 186");
  });

  it("keeps three's stack-trace formatting", () => {
    const base = fakeConsole();
    const trace = { isStackTrace: true, getError: (message: string) => new Error(message) };
    createThreeConsole(base)("error", "THREE.Material: broken", trace);
    expect(base.error).toHaveBeenCalledWith(new Error("THREE.Material: broken"));
  });
});
