import { ArrowRight, ChevronDown, Phone, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroBackground } from "./HeroBackground";

type HeroProps = {
  copy: Dictionary["hero"];
  common: Dictionary["common"];
};

function BrushUnderline() {
  return (
    <svg
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.28em] w-full text-accent"
    >
      <path
        d="M4 16c38-7 86-11 142-10 52 1 98 5 150 1-40 5-92 9-146 8-52-1-96 1-140 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({ label }: { label: string }) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5 text-accent">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} strokeWidth={1.75} fill="currentColor" aria-hidden="true" />
      ))}
    </span>
  );
}

export function Hero({ copy, common }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[720px] flex-col overflow-hidden bg-background lg:min-h-[max(760px,calc(100svh-72px))]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(199_249_204/0.7)_0%,rgb(199_249_204/0)_65%)]" />
        <HeroBackground />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background sm:h-40" />
      </div>

      <Container className="flex flex-1 flex-col items-center justify-center pt-16 pb-28 text-center lg:pt-20 lg:pb-32">
        <div data-hero-content className="flex max-w-[880px] flex-col items-center">
          <EyebrowPill className="px-3 text-[11px] tracking-[0.08em] whitespace-nowrap sm:px-3.5 sm:text-eyebrow sm:tracking-[0.12em]">
            {copy.eyebrow}
          </EyebrowPill>

          <h1 id="hero-title" className="mt-6 font-display text-display-mobile text-ink text-balance sm:text-[56px] lg:text-display">
            {copy.titleLine1} <br className="hidden sm:block" />
            {copy.titleLine2}{" "}
            <span className="relative inline-block whitespace-nowrap">
              {copy.titleEmphasis}
              <BrushUnderline />
            </span>
          </h1>

          <p className="mt-6 max-w-[640px] text-[17px] leading-relaxed text-ink-muted lg:text-body-lg">{copy.subline}</p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button href="#contact" trailingIcon={ArrowRight} fullWidth className="sm:w-auto">
              {copy.primaryCta}
            </Button>
            <Button href={common.phoneHref} variant="secondary" leadingIcon={Phone} fullWidth className="sm:w-auto">
              {copy.secondaryCta}
            </Button>
          </div>

          <p className="mt-8 flex flex-col items-center gap-2 text-body-sm text-ink-muted sm:flex-row sm:gap-4">
            <span className="inline-flex items-center gap-2">
              <Stars label={copy.ratingLabel} />
              {copy.rating}
            </span>
            <span aria-hidden="true" className="hidden text-line sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon={ShieldCheck} size={16} className="text-secondary" />
              {copy.license}
            </span>
          </p>
        </div>
      </Container>

      <a
        href="#servicii"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-sm text-caption text-ink-muted hover:text-ink lg:flex"
      >
        {copy.scrollHint}
        <Icon icon={ChevronDown} size={20} className="text-secondary motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
