import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

const fonts = vi.hoisted(() => ({
  Inter: vi.fn(() => ({ variable: "--font-inter" })),
  Plus_Jakarta_Sans: vi.fn(() => ({ variable: "--font-jakarta" })),
}));
vi.mock("next/font/google", () => fonts);
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import RootLayout, { dynamicParams, generateMetadata, generateStaticParams } from "./layout";

const fontOptionsAtImport = [...fonts.Inter.mock.calls, ...fonts.Plus_Jakarta_Sans.mock.calls] as unknown as Array<
  [{ subsets: string[] }]
>;

const props = (lang: string) => ({ params: Promise.resolve({ lang }), children: null }) as never;

describe("[lang] layout", () => {
  it("pre-renders exactly Romanian and English, nothing else", () => {
    expect(generateStaticParams()).toEqual([{ lang: "ro" }, { lang: "en" }]);
    expect(dynamicParams).toBe(false);
  });

  it("gives each language its own title, description and language links", async () => {
    const ro = await generateMetadata(props("ro"));
    expect(ro.title).toContain("Deratizare");
    expect(ro.alternates).toEqual({ canonical: "/ro/", languages: { ro: "/ro/", en: "/en/" } });

    const en = await generateMetadata(props("en"));
    expect(en.title).toContain("Rodent control");
    expect(en.alternates?.canonical).toBe("/en/");
  });

  it("returns no metadata for an unknown language", async () => {
    expect(await generateMetadata(props("fr"))).toEqual({});
  });

  it("sets the page language and both font variables", async () => {
    const html = (await RootLayout(props("en"))) as ReactElement<{ lang: string; className: string }>;
    expect(html.props.lang).toBe("en");
    expect(html.props.className).toBe("--font-inter --font-jakarta");
  });

  it("is a 404 for an unknown language", async () => {
    await expect(RootLayout(props("fr"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("loads the font subset that carries Romanian ș and ț", () => {
    expect(fontOptionsAtImport).toHaveLength(2);
    for (const [options] of fontOptionsAtImport) expect(options.subsets).toContain("latin-ext");
  });
});
