import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** Audience label with a leading icon. */
export function Chip({ icon, children, className }: { icon: LucideIcon; children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full whitespace-nowrap border border-line bg-surface px-4 text-label text-ink",
        className,
      )}
    >
      <Icon icon={icon} size={18} className="text-secondary" />
      {children}
    </span>
  );
}
