// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LOGO_CHECK_PATH, LOGO_HEX_PATH } from "./Logo";

describe("favicon", () => {
  it("draws the same hexagon and check as the logo mark", () => {
    const icon = readFileSync(new URL("../../app/icon.svg", import.meta.url), "utf8");
    expect(icon).toContain(`d="${LOGO_HEX_PATH}"`);
    expect(icon).toContain(`d="${LOGO_CHECK_PATH}"`);
    expect(icon).toContain("#22577a");
  });
});
