// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, localeHref } from "./config";

describe("netlify root redirect", () => {
  it("points / at the default locale", () => {
    const toml = readFileSync(new URL("../../netlify.toml", import.meta.url), "utf8");
    const rootRedirect = toml.match(/from = "\/"\s+to = "([^"]+)"/);
    expect(rootRedirect?.[1]).toBe(localeHref(DEFAULT_LOCALE));
  });
});
