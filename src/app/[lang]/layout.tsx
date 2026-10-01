import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { inter, jakarta } from "@/lib/fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localeHref(lang),
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, localeHref(locale)])),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
