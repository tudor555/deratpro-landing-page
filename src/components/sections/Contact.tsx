import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Section, sectionTitleId } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Glow, HexPattern } from "@/components/ui/Surfaces";
import { ContactForm } from "@/features/contact/ContactForm";
import type { Dictionary } from "@/i18n/dictionaries";

type ContactProps = {
  copy: Dictionary["contact"];
  common: Dictionary["common"];
};

function InfoRow({ icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <Icon icon={icon} size={22} className="mt-0.5 shrink-0 text-mint-soft" />
      <div>
        <dt className="text-caption font-semibold tracking-[0.1em] text-white/70 uppercase">{label}</dt>
        <dd className="mt-1 text-white">{children}</dd>
      </div>
    </div>
  );
}

export function Contact({ copy, common }: ContactProps) {
  const { info } = copy;

  return (
    <Section id="contact" tone="background" className="overflow-hidden">
      <Glow className="top-1/2 left-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/3" />
      <SectionHeader id={sectionTitleId("contact")} eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="relative grid overflow-hidden rounded-2xl bg-surface shadow-floating lg:grid-cols-12">
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <ContactForm copy={copy.form} />
        </div>

        <aside
          aria-labelledby="contact-info-title"
          className="relative isolate overflow-hidden bg-primary p-6 text-white sm:p-10 lg:col-span-5 lg:p-12"
        >
          <HexPattern />
          <Glow tone="emerald" className="-right-40 -bottom-40 -z-10 size-[420px]" />
          <h3 id="contact-info-title" className="font-display text-h3">
            {info.title}
          </h3>
          <dl className="mt-8 flex flex-col gap-7">
            <InfoRow icon={Phone} label={info.phoneLabel}>
              <a
                href={common.phoneHref}
                className="rounded-sm font-display text-[28px] leading-tight font-bold hover:text-mint-soft"
              >
                {common.phone}
              </a>
            </InfoRow>
            <InfoRow icon={Mail} label={info.emailLabel}>
              <a href={`mailto:${common.email}`} className="rounded-sm break-all hover:text-mint-soft">
                {common.email}
              </a>
            </InfoRow>
            <InfoRow icon={Clock} label={info.hoursLabel}>
              <span className="block">{info.hours}</span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-mint-soft">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald" />
                {info.emergencies}
              </span>
            </InfoRow>
            <InfoRow icon={MapPin} label={info.areaLabel}>
              {info.area}
            </InfoRow>
          </dl>
        </aside>
      </div>
    </Section>
  );
}
