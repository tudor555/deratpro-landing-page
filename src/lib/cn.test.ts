import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("lets later display utilities win", () => {
    expect(cn("inline-flex", "hidden sm:inline-flex")).toBe("hidden sm:inline-flex");
  });

  it("keeps custom text sizes and text colours side by side", () => {
    expect(cn("text-eyebrow text-primary", "text-ink")).toBe("text-eyebrow text-ink");
    expect(cn("text-body-sm text-ink", "lg:text-display")).toBe("text-body-sm text-ink lg:text-display");
    expect(cn("text-h2-mobile", "text-h3")).toBe("text-h3");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});
