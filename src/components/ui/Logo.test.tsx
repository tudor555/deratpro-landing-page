import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("links home with the brand name as its accessible name", () => {
    render(<Logo href="/ro/" />);
    expect(screen.getByRole("link", { name: "DeratPro" })).toHaveAttribute("href", "/ro/");
  });
});
