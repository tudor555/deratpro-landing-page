import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, LOCALES, isLocale, localeHref } from "./config";

describe("i18n config", () => {
  it("supports Romanian and English", () => {
    expect(LOCALES).toEqual(["ro", "en"]);
  });

  it("uses a supported default locale", () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });

  it.each([
    ["ro", true],
    ["en", true],
    ["fr", false],
    ["RO", false],
    ["", false],
  ])("isLocale(%j) is %s", (value, expected) => {
    expect(isLocale(value)).toBe(expected);
  });

  it("builds locale home links with a trailing slash", () => {
    expect(localeHref("en")).toBe("/en/");
    expect(localeHref("ro", "#contact")).toBe("/ro/#contact");
  });
});
