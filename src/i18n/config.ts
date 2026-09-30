export const LOCALES = ["ro", "en"] as const;

export type Locale = (typeof LOCALES)[number];

// Still undecided which language ships as default; flip this one constant.
export const DEFAULT_LOCALE: Locale = "ro";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeHref(locale: Locale, hash = ""): string {
  return `/${locale}/${hash}`;
}
