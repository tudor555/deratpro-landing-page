import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";

type IconTileProps = {
  icon: LucideIcon;
  tone?: "light" | "dark";
  className?: string;
};

export function IconTile({ icon, tone = "light", className }: IconTileProps) {
  return (
    <span
      className={cn(
        "inline-flex size-14 shrink-0 items-center justify-center rounded-lg",
        tone === "light" ? "bg-mint-soft text-primary" : "bg-white/12 text-mint-soft",
        className,
      )}
    >
      <Icon icon={icon} size={26} />
    </span>
  );
}
