"use client";

import clsx from "clsx";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { type Locale, localeHref } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useActiveSection } from "@/hooks/useActiveSection";
import { LanguageSwitch, SCROLL_RESTORE_KEY } from "./LanguageSwitch";

type HeaderProps = {
  lang: Locale;
  copy: Dictionary["header"];
  common: Dictionary["common"];
};

function useRestoreScrollAfterLanguageSwitch() {
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
      if (saved === null) return;
      sessionStorage.removeItem(SCROLL_RESTORE_KEY);
      window.scrollTo({ top: Number(saved), behavior: "instant" });
    } catch {
      // Ignore blocked storage.
    }
  }, []);
}

export function Header({ lang, copy, common }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const active = useActiveSection(copy.nav.map((item) => item.href.slice(1)));
  useRestoreScrollAfterLanguageSwitch();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/72 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-18">
        <Logo href={localeHref(lang)} />

        <nav aria-label={copy.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {copy.nav.map((item) => {
              const current = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={clsx(
                      "relative rounded-sm py-2 text-[15px] font-medium transition-colors hover:text-ink",
                      current ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-emerald transition-opacity",
                        current ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <LanguageSwitch lang={lang} label={copy.languageLabel} />
          <a
            href={common.phoneHref}
            className="hidden items-center gap-2 rounded-sm text-[15px] font-semibold text-primary hover:text-primary-strong lg:inline-flex"
          >
            <Icon icon={Phone} size={18} />
            {common.phone}
          </a>
          <Button href="#contact" size="md" className="hidden sm:inline-flex">
            {copy.cta}
          </Button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-mint-haze lg:hidden"
          >
            <Icon icon={menuOpen ? X : Menu} size={24} />
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div id={menuId} className="border-t border-line bg-surface shadow-floating lg:hidden">
          <nav aria-label={copy.navLabel} className="px-4 py-4 sm:px-6">
            <ul className="flex flex-col">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="flex h-12 items-center rounded-md px-3 text-body-md font-medium text-ink hover:bg-mint-haze"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
              <Button href={common.phoneHref} variant="secondary" leadingIcon={Phone} fullWidth onClick={closeMenu}>
                {common.phone}
              </Button>
              <Button href="#contact" fullWidth onClick={closeMenu}>
                {copy.cta}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
