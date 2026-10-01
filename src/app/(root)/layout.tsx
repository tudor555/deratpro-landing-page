import { DEFAULT_LOCALE } from "@/i18n/config";

// Minimal root layout: this group only holds the redirect from / to the default language.
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>{children}</body>
    </html>
  );
}
