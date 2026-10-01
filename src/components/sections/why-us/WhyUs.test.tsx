import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { WhyUs } from "./WhyUs";

const ro = getDictionary("ro");

describe("WhyUs", () => {
  it("is a labelled section anchored at #de-ce-noi", () => {
    render(<WhyUs copy={ro.whyUs} />);
    expect(screen.getByRole("region", { name: ro.whyUs.title })).toHaveAttribute("id", "de-ce-noi");
  });

  it("leads with the written guarantee", () => {
    render(<WhyUs copy={ro.whyUs} />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual([
      ro.whyUs.guarantee.title,
      ro.whyUs.fast.title,
      ...ro.whyUs.items.map((item) => item.title),
    ]);
    expect(screen.getByText(ro.whyUs.guarantee.value)).toBeInTheDocument();
    expect(screen.getByText(ro.whyUs.guarantee.pill)).toBeInTheDocument();
  });

  it("shows the emergency pill on the fast-response card", () => {
    render(<WhyUs copy={ro.whyUs} />);
    expect(screen.getByText(ro.whyUs.fast.pill)).toBeInTheDocument();
    expect(screen.getByText(ro.whyUs.fast.text)).toBeInTheDocument();
  });
});
