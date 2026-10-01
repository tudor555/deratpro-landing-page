import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

describe("Section + SectionHeader", () => {
  it("labels the section with its heading", () => {
    render(
      <Section id="servicii" tone="surface">
        <SectionHeader
          id="servicii-title"
          eyebrow="Servicii"
          title="Tot ce ai nevoie"
          intro="Tratamente profesionale."
        />
      </Section>,
    );

    const region = screen.getByRole("region", { name: "Tot ce ai nevoie" });
    expect(region).toHaveAttribute("id", "servicii");
    expect(screen.getByRole("heading", { level: 2, name: "Tot ce ai nevoie" })).toBeInTheDocument();
    expect(screen.getByText("Servicii")).toBeInTheDocument();
    expect(screen.getByText("Tratamente profesionale.")).toBeInTheDocument();
  });

  it("omits the intro when not given", () => {
    const { container } = render(<SectionHeader id="t" eyebrow="Proces" title="Simplu, în 3 pași" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
