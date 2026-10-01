import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
// The 3D layer needs WebGL and media queries; it has its own tests.
vi.mock("@/components/sections/hero/HeroBackground", () => ({ HeroBackground: () => null }));

import HomePage from "./page";

const props = (lang: string) => ({ params: Promise.resolve({ lang }) }) as never;

describe("home page", () => {
  it("stacks the five required sections in order between header and footer", async () => {
    render(await HomePage(props("ro")));

    // Section headings use <header> too; only the one outside <main> is the page banner (as in browsers).
    expect(screen.getAllByRole("banner").filter((header) => !header.closest("main"))).toHaveLength(1);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    const regions = within(screen.getByRole("main")).getAllByRole("region");
    expect(regions.map((region) => region.id || region.getAttribute("aria-labelledby"))).toEqual([
      "hero-title",
      "servicii",
      "de-ce-noi",
      "cum-functioneaza",
      "contact",
    ]);
  });

  it("offers a skip link to the main content", async () => {
    render(await HomePage(props("ro")));
    expect(screen.getByRole("link", { name: "Sari la conținut" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("renders the English copy on /en", async () => {
    render(await HomePage(props("en")));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("pest-free");
  });

  it("is a 404 for an unknown language", async () => {
    await expect(HomePage(props("fr"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
