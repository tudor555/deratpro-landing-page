"use client";

import clsx from "clsx";
import { LOCALES, type Locale, localeHref } from "@/i18n/config";

export const SCROLL_RESTORE_KEY = "deratpro:scroll-y";

type LanguageSwitchProps = {
  lang: Locale;
  label: string;
  className?: string;
};

function rememberScroll() {
  try {
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY));
  } catch {
    // Storage can be blocked; switching still works, it just starts at the top.
  }
}

export function LanguageSwitch({ lang, label, className }: LanguageSwitchProps) {
  return (
    <div role="group" aria-label={label} className={clsx("flex h-8 items-center rounded-full bg-line/60 p-0.5", className)}>
      {LOCALES.map((locale) => {
        const current = locale === lang;
        return (
          <a
            key={locale}
            href={localeHref(locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={current ? "page" : undefined}
            onClick={current ? undefined : rememberScroll}
            className={clsx(
              "flex h-7 min-w-10 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold uppercase transition-colors",
              current ? "bg-surface text-ink shadow-raised" : "text-ink-muted hover:text-ink",
            )}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
