import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { Dictionary } from "@/i18n/dictionaries";

export function StatsCard({ copy }: { copy: Dictionary["stats"] }) {
  return (
    <div className="relative z-10 -mt-10 lg:-mt-16">
      <Container>
        <ul
          data-testid="stats"
          className="grid grid-cols-2 rounded-xl bg-surface shadow-floating lg:grid-cols-4 lg:px-12 lg:py-10"
        >
          {copy.items.map((stat, index) => (
            <li
              key={stat.label}
              className={cn(
                "flex flex-col items-center justify-center gap-2 border-line px-4 py-6 text-center lg:py-0",
                index % 2 === 0 && "border-r",
                index < 2 && "border-b lg:border-b-0",
                index === 1 && "lg:border-r",
              )}
            >
              <span className="font-display text-[36px] leading-none font-extrabold tracking-tight text-primary lg:text-stat">
                {stat.value}
                {stat.suffix && <span className="text-accent-strong">{stat.suffix}</span>}
              </span>
              <span className="text-body-sm text-ink-muted">{stat.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-4">
          <span
            id="certifications-label"
            className="text-caption font-medium tracking-[0.08em] text-ink-muted uppercase"
          >
            {copy.certificationsLabel}
          </span>
          <ul aria-labelledby="certifications-label" className="flex flex-wrap justify-center gap-2">
            {copy.certifications.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
