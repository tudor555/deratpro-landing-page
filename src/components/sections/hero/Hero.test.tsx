import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { Hero } from "./Hero";

// The 3D layer has its own tests; here it would only need WebGL and media-query stubs.
vi.mock("./HeroBackground", () => ({ HeroBackground: () => null }));

const ro = getDictionary("ro");

describe("Hero", () => {
  it("shows the company promise as the page heading", () => {
    render(<Hero copy={ro.hero} common={ro.common} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Casa sau afacerea ta, fără dăunători. Garantat.",
    );
  });

  it("names the company inside the hero", () => {
    render(<Hero copy={ro.hero} common={ro.common} />);
    const hero = screen.getByRole("region", { name: /Casa sau afacerea ta/ });
    expect(within(hero).getByText("DeratPro")).toBeVisible();
    expect(within(hero).getByText(/oferă intervenții profesionale/)).toHaveTextContent(
      "DeratPro oferă intervenții profesionale pentru case, birouri și spații comerciale",
    );
  });

  it("sends the primary CTA to the contact form and the secondary one to the phone", () => {
    render(<Hero copy={ro.hero} common={ro.common} />);
    expect(screen.getByRole("link", { name: ro.hero.primaryCta })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: ro.hero.secondaryCta })).toHaveAttribute("href", ro.common.phoneHref);
  });

  it("describes the star rating for screen readers", () => {
    render(<Hero copy={ro.hero} common={ro.common} />);
    expect(screen.getByRole("img", { name: ro.hero.ratingLabel })).toBeInTheDocument();
    expect(screen.getByText(ro.hero.license)).toBeInTheDocument();
  });

  it("links the scroll hint to the services section", () => {
    render(<Hero copy={ro.hero} common={ro.common} />);
    expect(screen.getByRole("link", { name: ro.hero.scrollHint })).toHaveAttribute("href", "#servicii");
  });
});
