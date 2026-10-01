import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, localeHref } from "@/i18n/config";
import RootPage from "./page";

describe("root page", () => {
  it("forwards / to the default language without needing JavaScript", () => {
    render(<RootPage />);
    const refresh = document.querySelector('meta[http-equiv="refresh"]');
    expect(refresh).toHaveAttribute("content", `0; url=${localeHref(DEFAULT_LOCALE)}`);
  });

  it("offers a plain link in case the refresh is blocked", () => {
    render(<RootPage />);
    expect(screen.getByRole("link", { name: "DeratPro" })).toHaveAttribute("href", localeHref(DEFAULT_LOCALE));
  });
});
