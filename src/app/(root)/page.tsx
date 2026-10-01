import { DEFAULT_LOCALE, localeHref } from "@/i18n/config";

const target = localeHref(DEFAULT_LOCALE);

// Every page lives under /[lang]. A meta refresh (not redirect()) keeps the forward working
// in the static export without JavaScript; Netlify also redirects / server-side.
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <link rel="canonical" href={target} />
      <a href={target}>DeratPro</a>
    </>
  );
}
