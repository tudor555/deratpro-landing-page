import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { StatsCard } from "./StatsCard";

const ro = getDictionary("ro");

describe("StatsCard", () => {
  it("lists every stat as value with its label", () => {
    render(<StatsCard copy={ro.stats} />);
    const stats = within(screen.getByTestId("stats")).getAllByRole("listitem");
    expect(stats.map((item) => item.textContent)).toEqual([
      "10+ani de experiență",
      "2.500+intervenții realizate",
      "24htimp de răspuns",
      "6 lunigaranție scrisă",
    ]);
  });

  it("lists the certifications under a label", () => {
    render(<StatsCard copy={ro.stats} />);
    const list = screen.getByRole("list", { name: ro.stats.certificationsLabel });
    expect(within(list).getAllByRole("listitem").map((item) => item.textContent)).toEqual(ro.stats.certifications);
  });
});
