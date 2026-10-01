import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Pill";
import { type Locale, localeHref } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

const linkClass = "rounded-sm text-[15px] text-white/72 transition-colors hover:text-white";

function Column({ title, children, asNav = true }: { title: string; children: ReactNode; asNav?: boolean }) {
  const list = <ul className="mt-4 flex flex-col gap-3">{children}</ul>;
  const heading = <p className="text-label text-white">{title}</p>;
  return asNav ? (
    <nav aria-label={title}>
      {heading}
      {list}
    </nav>
  ) : (
    <div>
      {heading}
      {list}
    </div>
  );
}

export function Footer({ lang, dict }: FooterProps) {
  const { footer, common } = dict;

  return (
    <footer className="bg-ink pt-16 pb-28 text-white lg:pt-20 lg:pb-8">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Logo href={localeHref(lang)} tone="inverse" />
            <p className="mt-4 max-w-xs text-[15px] text-white/72">{footer.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {footer.badges.map((badge) => (
                <li key={badge}>
                  <Badge tone="dark">{badge}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <Column title={footer.servicesTitle}>
              {dict.services.items.map((item) => (
                <li key={item.title}>
                  <a href="#servicii" className={linkClass}>
                    {item.title}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="lg:col-span-2">
            <Column title={footer.companyTitle}>
              {dict.header.nav.slice(1).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="lg:col-span-3">
            <Column title={footer.contactTitle} asNav={false}>
              <li>
                <a href={common.phoneHref} className={linkClass}>
                  {common.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${common.email}`} className={linkClass}>
                  {common.email}
                </a>
              </li>
              <li className="text-[15px] text-white/72">{dict.contact.info.area}</li>
            </Column>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-white/12 pt-8 text-center text-body-sm text-white/60 lg:flex-row lg:justify-between lg:text-left">
          <p>
            {footer.copyright}{" "}
            <a
              href={footer.creditHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm text-white/72 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {footer.credit}
            </a>
          </p>
          <p>{footer.legal}</p>
        </div>
      </Container>
    </footer>
  );
}
