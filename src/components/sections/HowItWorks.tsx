import { ClipboardCheck, Clock, Phone, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Section, sectionTitleId } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/i18n/dictionaries";

const STEP_ICONS = [Phone, ClipboardCheck, Sparkles];

export function HowItWorks({ copy }: { copy: Dictionary["process"] }) {
  return (
    <Section id="cum-functioneaza" tone="surface">
      <SectionHeader id={sectionTitleId("cum-functioneaza")} eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <ol className="relative flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:gap-6">
        <span
          aria-hidden="true"
          className="absolute top-[140px] right-[16.67%] left-[16.67%] hidden border-t-2 border-dashed border-secondary lg:block"
        />
        {copy.steps.map((step, i) => (
          <li
            key={step.title}
            className="relative grid grid-cols-[56px_1fr] gap-x-5 lg:flex lg:flex-col lg:items-center lg:text-center"
          >
            {i < copy.steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-14 -bottom-10 left-[27px] border-l-2 border-dashed border-secondary lg:hidden"
              />
            )}
            <span className="relative row-span-3 flex size-14 items-center justify-center rounded-full border-[1.5px] border-secondary bg-surface text-primary shadow-raised lg:order-2 lg:mt-4">
              <Icon icon={STEP_ICONS[i]} size={24} />
            </span>
            <span
              aria-hidden="true"
              className="font-display text-[56px] leading-none font-extrabold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_var(--color-secondary)] lg:order-1 lg:text-numeral"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-h3 text-ink lg:order-3 lg:mt-6">{step.title}</h3>
            <p className="mt-2 max-w-[300px] text-ink-muted lg:order-4 lg:mt-3">{step.text}</p>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-14 flex w-fit items-center gap-2 rounded-2xl bg-mint-haze px-4 py-2.5 text-body-sm text-ink sm:rounded-full">
        <Icon icon={Clock} size={18} className="shrink-0 text-secondary" />
        {copy.note}
      </p>
    </Section>
  );
}
