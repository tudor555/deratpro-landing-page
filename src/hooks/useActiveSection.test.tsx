import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./useActiveSection";

let callback: IntersectionObserverCallback;
const observed: Element[] = [];
const disconnect = vi.fn();

function stubObserver() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe(element: Element) {
        observed.push(element);
      }
      disconnect = disconnect;
    },
  );
}

function Probe() {
  return <p data-testid="active">{useActiveSection(["one", "two", "missing"]) ?? "none"}</p>;
}

function renderWithSections() {
  return render(
    <>
      <section id="one" />
      <section id="two" />
      <Probe />
    </>,
  );
}

describe("useActiveSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    observed.length = 0;
  });

  it("watches only the sections that exist", () => {
    stubObserver();
    renderWithSections();
    expect(observed.map((el) => el.id)).toEqual(["one", "two"]);
  });

  it("reports the section crossing the middle of the viewport", () => {
    stubObserver();
    renderWithSections();
    expect(screen.getByTestId("active")).toHaveTextContent("none");

    act(() =>
      callback(
        [
          { isIntersecting: false, target: observed[0] },
          { isIntersecting: true, target: observed[1] },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    expect(screen.getByTestId("active")).toHaveTextContent("two");
  });

  it("stops observing on unmount", () => {
    stubObserver();
    renderWithSections().unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays quiet in browsers without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    renderWithSections();
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });
});
