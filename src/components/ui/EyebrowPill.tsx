import { cn } from "@/lib/cn";

export function EyebrowPill({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-mint-haze px-3.5 py-2 text-eyebrow text-primary uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald" />
      {children}
    </span>
  );
}
