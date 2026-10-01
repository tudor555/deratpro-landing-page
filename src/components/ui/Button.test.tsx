import { render, screen } from "@testing-library/react";
import { ArrowRight } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link when given an href", () => {
    render(<Button href="#contact">Cere ofertă</Button>);
    expect(screen.getByRole("link", { name: "Cere ofertă" })).toHaveAttribute("href", "#contact");
  });

  it("renders a type=button element by default", () => {
    render(<Button>Trimite</Button>);
    expect(screen.getByRole("button", { name: "Trimite" })).toHaveAttribute("type", "button");
  });

  it("allows submit buttons", () => {
    render(<Button type="submit">Trimite</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("hides icons from assistive tech", () => {
    const { container } = render(<Button trailingIcon={ArrowRight}>Cere ofertă</Button>);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Cere ofertă" })).toBeInTheDocument();
  });

  it("exposes its variant for styling hooks", () => {
    render(<Button variant="secondary">Sună acum</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");
  });
});
