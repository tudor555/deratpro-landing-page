import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { FloatingCall } from "./FloatingCall";

const ro = getDictionary("ro");

describe("FloatingCall", () => {
  it("is a labelled phone link", () => {
    render(<FloatingCall label={ro.floatingCall.label} href={ro.common.phoneHref} />);
    expect(screen.getByRole("link", { name: ro.floatingCall.label })).toHaveAttribute("href", ro.common.phoneHref);
  });
});
