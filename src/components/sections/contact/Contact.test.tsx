import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { Contact } from "./Contact";

const ro = getDictionary("ro");

describe("Contact", () => {
  it("is a labelled section anchored at #contact", () => {
    render(<Contact copy={ro.contact} common={ro.common} />);
    expect(screen.getByRole("region", { name: ro.contact.title })).toHaveAttribute("id", "contact");
  });

  it("holds the quote form", () => {
    render(<Contact copy={ro.contact} common={ro.common} />);
    expect(screen.getByRole("button", { name: ro.contact.form.submit })).toBeInTheDocument();
  });

  it("offers direct contact details next to the form", () => {
    render(<Contact copy={ro.contact} common={ro.common} />);
    expect(screen.getByRole("heading", { level: 3, name: ro.contact.info.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ro.common.phone })).toHaveAttribute("href", ro.common.phoneHref);
    expect(screen.getByRole("link", { name: ro.common.email })).toHaveAttribute("href", `mailto:${ro.common.email}`);
    expect(screen.getByText(ro.contact.info.hours)).toBeInTheDocument();
    expect(screen.getByText(ro.contact.info.emergencies)).toBeInTheDocument();
    expect(screen.getByText(ro.contact.info.area)).toBeInTheDocument();
  });
});
