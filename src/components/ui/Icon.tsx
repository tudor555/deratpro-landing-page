import type { LucideIcon } from "lucide-react";

type IconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
};

export function Icon({ icon: Glyph, size = 20, className }: IconProps) {
  return <Glyph size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" className={className} />;
}
