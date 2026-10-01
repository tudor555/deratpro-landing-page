import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE } from "@/i18n/config";
import RootRedirectLayout from "./layout";

describe("root redirect layout", () => {
  it("declares the default language on the redirect page", () => {
    const html = RootRedirectLayout({ children: null } as never) as ReactElement<{ lang: string }>;
    expect(html.props.lang).toBe(DEFAULT_LOCALE);
  });
});
