import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { Services } from "./Services";

const ro = getDictionary("ro");

describe("Services", () => {
  it("is a labelled section anchored at #servicii", () => {
    render(<Services copy={ro.services} />);
    expect(screen.getByRole("region", { name: ro.services.title })).toHaveAttribute("id", "servicii");
  });

  it("renders one card per service with its checklist and a distinct quote link", () => {
    render(<Services copy={ro.services} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);

    cards.forEach((card, i) => {
      const service = ro.services.items[i];
      expect(within(card).getByRole("heading", { level: 3, name: service.title })).toBeInTheDocument();
      expect(within(card).getByText(service.description)).toBeInTheDocument();
      expect(
        within(card)
          .getAllByRole("listitem")
          .map((li) => li.textContent),
      ).toEqual(service.features);
      const link = within(card).getByRole("link", { name: `${ro.services.cta}: ${service.title}` });
      expect(link).toHaveAttribute("href", "#contact");
    });
  });

  it("lists who DeratPro works for", () => {
    render(<Services copy={ro.services} />);
    const audiences = screen.getByRole("list", { name: ro.services.audienceLabel });
    expect(
      within(audiences)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(ro.services.audiences);
  });
});
