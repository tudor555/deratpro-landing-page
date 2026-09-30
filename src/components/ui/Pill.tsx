import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { Icon } from "./Icon";

export function Badge({ children, tone = "light" }: { children: string; tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return (
      <span className="inline-flex h-7 items-center rounded-full border border-white/20 px-3 text-caption text-white/72">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-body-sm text-ink-muted">
      <Icon icon={BadgeCheck} size={16} className="text-secondary" />
      {children}
    </span>
  );
}

export function Chip({ icon, children, className }: { icon: LucideIcon; children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-4 text-label text-ink",
        className,
      )}
    >
      <Icon icon={icon} size={18} className="text-secondary" />
      {children}
    </span>
  );
}
