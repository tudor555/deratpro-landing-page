import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  id: string;
  tone: "background" | "surface";
  className?: string;
  children: ReactNode;
};

export function sectionTitleId(id: string) {
  return `${id}-title`;
}

export function Section({ id, tone, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={sectionTitleId(id)}
      className={cn("relative py-18 lg:py-32", tone === "surface" ? "bg-surface" : "bg-background", className)}
    >
      <Container className="relative">{children}</Container>
    </section>
  );
}
