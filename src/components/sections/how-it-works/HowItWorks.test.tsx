import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { HowItWorks } from "./HowItWorks";

const ro = getDictionary("ro");

describe("HowItWorks", () => {
  it("is a labelled section anchored at #cum-functioneaza", () => {
    render(<HowItWorks copy={ro.process} />);
    expect(screen.getByRole("region", { name: ro.process.title })).toHaveAttribute("id", "cum-functioneaza");
  });

  it("renders the steps as an ordered list", () => {
    render(<HowItWorks copy={ro.process} />);
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    steps.forEach((step, i) => {
      expect(within(step).getByRole("heading", { level: 3, name: ro.process.steps[i].title })).toBeInTheDocument();
      expect(within(step).getByText(ro.process.steps[i].text)).toBeInTheDocument();
    });
  });

  it("keeps decorative numerals out of the accessibility tree", () => {
    render(<HowItWorks copy={ro.process} />);
    expect(screen.getByText("01")).toHaveAttribute("aria-hidden", "true");
  });

  it("closes with the average response time", () => {
    render(<HowItWorks copy={ro.process} />);
    expect(screen.getByText(ro.process.note)).toBeInTheDocument();
  });
});
