import clsx from "clsx";
import { EyebrowPill } from "./EyebrowPill";

type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  layout?: "center" | "split";
};

export function SectionHeader({ id, eyebrow, title, intro, layout = "center" }: SectionHeaderProps) {
  const heading = (
    <h2 id={id} className="mt-4 font-display text-h2-mobile text-ink text-balance lg:text-h2">
      {title}
    </h2>
  );

  if (layout === "split") {
    return (
      <header className="mb-12 grid gap-4 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-7">
          <EyebrowPill>{eyebrow}</EyebrowPill>
          {heading}
        </div>
        {intro && <p className="text-body-md text-ink-muted lg:col-span-5 lg:text-lg">{intro}</p>}
      </header>
    );
  }

  return (
    <header className={clsx("mx-auto mb-12 max-w-3xl text-center lg:mb-16")}>
      <EyebrowPill>{eyebrow}</EyebrowPill>
      {heading}
      {intro && <p className="mx-auto mt-4 max-w-2xl text-body-md text-ink-muted lg:text-lg">{intro}</p>}
    </header>
  );
}
