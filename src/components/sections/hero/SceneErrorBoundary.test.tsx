import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

function Broken(): never {
  throw new Error("WebGL context lost");
}

describe("SceneErrorBoundary", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the scene while it works", () => {
    render(
      <SceneErrorBoundary>
        <p>scene</p>
      </SceneErrorBoundary>,
    );
    expect(screen.getByText("scene")).toBeInTheDocument();
  });

  it("drops a failing scene quietly so the static hero background stays", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <SceneErrorBoundary>
        <Broken />
      </SceneErrorBoundary>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith("Hero scene disabled:", expect.any(Error));
  });
});
