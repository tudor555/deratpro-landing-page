import { describe, expect, it } from "vitest";
import { LOCALES } from "./config";
import { getDictionary } from "./dictionaries";

type Shape = string | number | boolean | null | Shape[] | { [key: string]: Shape };

function describeShape(value: unknown, path = "$"): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((item, i) => describeShape(item, `${path}[${i}]`))];
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .flatMap((key) => [path + "." + key, ...describeShape((value as Record<string, Shape>)[key], `${path}.${key}`)]);
  }
  return [];
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("dictionaries", () => {
  it("returns the dictionary for each locale", () => {
    expect(getDictionary("ro").meta.title).toContain("DeratPro");
    expect(getDictionary("en").meta.title).toContain("DeratPro");
  });

  it("keeps the same keys and list lengths in every locale", () => {
    const [reference, ...others] = LOCALES.map((locale) => describeShape(getDictionary(locale)));
    for (const shape of others) expect(shape).toEqual(reference);
  });

  it.each(LOCALES)("has no empty strings in %s", (locale) => {
    const empty = collectStrings(getDictionary(locale)).filter((text) => text.trim() === "");
    expect(empty).toEqual([]);
  });

  it.each(LOCALES)("keeps em dashes out of the %s copy", (locale) => {
    const withDash = collectStrings(getDictionary(locale)).filter((text) => text.includes("\u2014"));
    expect(withDash).toEqual([]);
  });

  it.each(LOCALES)("spells out services instead of the DDD trade acronym in %s", (locale) => {
    const withAcronym = collectStrings(getDictionary(locale)).filter((text) => /\bDDD\b/.test(text));
    expect(withAcronym).toEqual([]);
  });

  it("names Bihor and Cluj counties as the service area", () => {
    expect(getDictionary("ro").contact.info.area).toBe("Județele Bihor și Cluj");
    expect(getDictionary("en").contact.info.area).toBe("Bihor and Cluj counties");
  });

  it("uses Romanian diacritics with comma-below, never cedilla", () => {
    const text = collectStrings(getDictionary("ro")).join(" ");
    expect(text).not.toMatch(/[şŞţŢ]/);
  });
});
