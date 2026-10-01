import { BadgeCheck, FlaskConical, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { Section, sectionTitleId } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Glow } from "@/components/ui/Glow";
import { HexPattern } from "@/components/ui/HexPattern";
import type { Dictionary } from "@/i18n/dictionaries";

const ITEM_ICONS = [FlaskConical, BadgeCheck];

export function WhyUs({ copy }: { copy: Dictionary["whyUs"] }) {
  const { guarantee, fast } = copy;

  return (
    <Section id="de-ce-noi" tone="background">
      <SectionHeader id={sectionTitleId("de-ce-noi")} eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="grid gap-6 lg:grid-cols-12">
        <article className="relative isolate flex flex-col overflow-hidden rounded-xl bg-primary p-8 text-white shadow-floating sm:p-10 lg:col-span-5">
          <HexPattern />
          <Glow tone="emerald" className="-top-32 -right-32 -z-10 size-96" />
          <IconTile icon={ShieldCheck} tone="dark" />
          <p className="mt-10 font-display text-[64px] leading-none font-extrabold tracking-[-0.04em] sm:text-[88px] lg:mt-auto lg:pt-12">
            {guarantee.value}
          </p>
          <h3 className="mt-4 font-display text-h3">{guarantee.title}</h3>
          <p className="mt-3 text-white/80">{guarantee.text}</p>
          <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white/12 px-3.5 py-2 text-[11px] font-semibold tracking-[0.06em] text-white uppercase sm:text-eyebrow">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald" />
            {guarantee.pill}
          </span>
        </article>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          <Card as="article" className="relative flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-start">
            <IconTile icon={Zap} />
            <div className="sm:pr-28">
              <h3 className="font-display text-h3 text-ink">{fast.title}</h3>
              <p className="mt-3 text-ink-muted">{fast.text}</p>
            </div>
            <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-mint-haze px-3 py-1.5 text-caption font-semibold text-primary sm:top-8 sm:right-8">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald" />
              {fast.pill}
            </span>
          </Card>

          {copy.items.map((item, i) => (
            <Card as="article" key={item.title}>
              <IconTile icon={ITEM_ICONS[i]} />
              <h3 className="mt-6 font-display text-h3 text-ink">{item.title}</h3>
              <p className="mt-3 text-ink-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
