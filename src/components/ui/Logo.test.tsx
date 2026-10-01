import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOGO_CHECK_PATH, LOGO_HEX_PATH, Logo } from "./Logo";

describe("Logo", () => {
  it("links home with the brand name as its accessible name", () => {
    render(<Logo href="/ro/" />);
    expect(screen.getByRole("link", { name: "DeratPro" })).toHaveAttribute("href", "/ro/");
  });
});

describe("favicon", () => {
  it("draws the same hexagon and check as the logo mark", () => {
    const icon = readFileSync(join(process.cwd(), "src/app/icon.svg"), "utf8");
    expect(icon).toContain(`d="${LOGO_HEX_PATH}"`);
    expect(icon).toContain(`d="${LOGO_CHECK_PATH}"`);
    expect(icon).toContain("#22577a");
  });
});
