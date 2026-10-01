import { cn } from "@/lib/cn";

type GlowProps = {
  className?: string;
  tone?: "mint" | "emerald";
};

/** Soft radial light; position and size it with className. */
export function Glow({ className, tone = "mint" }: GlowProps) {
  const color = tone === "mint" ? "rgb(199 249 204 / 0.7)" : "rgb(87 204 153 / 0.45)";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
    />
  );
}
