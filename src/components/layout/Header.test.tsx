import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "./Header";
import { SCROLL_RESTORE_KEY } from "./LanguageSwitch";

const ro = getDictionary("ro");

function renderHeader() {
  return render(<Header lang="ro" copy={ro.header} common={ro.common} />);
}

describe("Header", () => {
  it("links every nav item to its section", () => {
    renderHeader();
    const nav = screen.getByRole("navigation", { name: ro.header.navLabel });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(["#servicii", "#de-ce-noi", "#cum-functioneaza", "#contact"]);
  });

  it("marks the current language and links to the other one", () => {
    renderHeader();
    const switcher = screen.getByRole("group", { name: ro.header.languageLabel });
    expect(within(switcher).getByRole("link", { name: "RO" })).toHaveAttribute("aria-current", "page");
    const english = within(switcher).getByRole("link", { name: "EN" });
    expect(english).toHaveAttribute("href", "/en/");
    expect(english).not.toHaveAttribute("aria-current");
  });

  it("offers a phone link and the quote CTA", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: ro.common.phone })).toHaveAttribute("href", ro.common.phoneHref);
    expect(screen.getByRole("link", { name: ro.header.cta })).toHaveAttribute("href", "#contact");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderHeader();

    const toggle = screen.getByRole("button", { name: ro.header.openMenu });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName(ro.header.closeMenu);
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(menu).toBeVisible();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu after picking a link", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: ro.header.openMenu });
    await user.click(toggle);

    const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    await user.click(within(menu).getByRole("link", { name: "Contact" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("returns to the same spot after switching language", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    sessionStorage.setItem(SCROLL_RESTORE_KEY, "640");
    renderHeader();
    expect(scrollTo).toHaveBeenCalledWith({ top: 640, behavior: "instant" });
    expect(sessionStorage.getItem(SCROLL_RESTORE_KEY)).toBeNull();
    scrollTo.mockRestore();
  });

  it("leaves the scroll alone on a normal visit or when storage is blocked", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderHeader();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    renderHeader();
    expect(scrollTo).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("highlights the nav item of the section on screen", () => {
    let report: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          report = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(
      <>
        <section id="servicii" />
        <Header lang="ro" copy={ro.header} common={ro.common} />
      </>,
    );
    act(() =>
      report(
        [
          { isIntersecting: true, target: document.getElementById("servicii") },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    const nav = screen.getByRole("navigation", { name: ro.header.navLabel });
    expect(within(nav).getByRole("link", { name: "Servicii" })).toHaveClass("text-ink");
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveClass("text-ink-muted");
    vi.unstubAllGlobals();
  });

  it("keeps the mobile menu open for keys other than Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: ro.header.openMenu });
    await user.click(toggle);
    await user.keyboard("{ArrowDown}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
