import { ArrowRight, Building2, Bug, CircleCheck, House, Rat, SprayCan, Utensils, Warehouse } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { Chip } from "@/components/ui/Pill";
import { Section, sectionTitleId } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/i18n/dictionaries";

const SERVICE_ICONS = [Rat, Bug, SprayCan];
const AUDIENCE_ICONS = [House, Building2, Utensils, Warehouse];

export function Services({ copy }: { copy: Dictionary["services"] }) {
  return (
    <Section id="servicii" tone="surface">
      <SectionHeader id={sectionTitleId("servicii")} layout="split" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="grid gap-6 md:grid-cols-3">
        {copy.items.map((service, i) => (
          <Card as="article" interactive key={service.title} className="group flex flex-col md:p-6 lg:p-8">
            <IconTile icon={SERVICE_ICONS[i]} />
            <h3 className="mt-6 font-display text-h3 text-ink">{service.title}</h3>
            <p className="mt-3 text-ink-muted">{service.description}</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-body-sm text-ink">
                  <Icon icon={CircleCheck} size={18} className="mt-px text-emerald" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              aria-label={`${copy.cta}: ${service.title}`}
              className="mt-auto inline-flex items-center gap-1.5 self-start rounded-sm pt-6 font-semibold text-primary hover:text-primary-strong"
            >
              {copy.cta}
              <Icon icon={ArrowRight} size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
        <span id="audiences-label" className="text-body-sm text-ink-muted">
          {copy.audienceLabel}
        </span>
        <ul aria-labelledby="audiences-label" className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {copy.audiences.map((audience, i) => (
            <li key={audience}>
              <Chip icon={AUDIENCE_ICONS[i]}>{audience}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
