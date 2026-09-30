import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { Footer } from "./Footer";

const ro = getDictionary("ro");

function renderFooter() {
  return render(<Footer lang="ro" dict={ro} />);
}

describe("Footer", () => {
  it("is the page content info with brand, tagline and badges", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "DeratPro" })).toHaveAttribute("href", "/ro/");
    expect(within(footer).getByText(ro.footer.tagline)).toBeInTheDocument();
    for (const badge of ro.footer.badges) expect(within(footer).getByText(badge)).toBeInTheDocument();
  });

  it("links services and company pages to their sections", () => {
    renderFooter();
    const services = screen.getByRole("navigation", { name: ro.footer.servicesTitle });
    expect(within(services).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      ro.services.items.map((item) => [item.title, "#servicii"]),
    );
    const company = screen.getByRole("navigation", { name: ro.footer.companyTitle });
    expect(within(company).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual([
      "#de-ce-noi",
      "#cum-functioneaza",
      "#contact",
    ]);
  });

  it("repeats the direct contact details", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: ro.common.phone })).toHaveAttribute("href", ro.common.phoneHref);
    expect(within(footer).getByRole("link", { name: ro.common.email })).toHaveAttribute("href", `mailto:${ro.common.email}`);
    expect(within(footer).getByText(ro.contact.info.area)).toBeInTheDocument();
  });

  it("states that the company is fictional", () => {
    renderFooter();
    expect(screen.getByText(ro.footer.copyright)).toBeInTheDocument();
    expect(screen.getByText(ro.footer.legal)).toBeInTheDocument();
  });
});
