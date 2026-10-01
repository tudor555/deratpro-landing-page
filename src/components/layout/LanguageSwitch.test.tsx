import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitch, SCROLL_RESTORE_KEY } from "./LanguageSwitch";

// jsdom cannot navigate; stop the link's default action after React has handled the click.
const blockNavigation = (event: Event) => event.preventDefault();

describe("LanguageSwitch", () => {
  beforeEach(() => {
    window.addEventListener("click", blockNavigation);
    vi.stubGlobal("scrollY", 640);
    sessionStorage.clear();
  });

  afterEach(() => {
    window.removeEventListener("click", blockNavigation);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("remembers the scroll position when switching language", async () => {
    render(<LanguageSwitch lang="ro" label="Limba site-ului" />);
    await userEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(sessionStorage.getItem(SCROLL_RESTORE_KEY)).toBe("640");
  });

  it("does nothing when the current language is clicked", async () => {
    render(<LanguageSwitch lang="ro" label="Limba site-ului" />);
    await userEvent.click(screen.getByRole("link", { name: "RO" }));
    expect(sessionStorage.getItem(SCROLL_RESTORE_KEY)).toBeNull();
  });

  it("still switches when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    render(<LanguageSwitch lang="ro" label="Limba site-ului" />);
    await expect(userEvent.click(screen.getByRole("link", { name: "EN" }))).resolves.toBeUndefined();
  });
});
