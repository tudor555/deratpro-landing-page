import { cn } from "@/lib/cn";

type LogoProps = {
  href: string;
  tone?: "default" | "inverse";
  className?: string;
};

// Shared with src/app/icon.svg so the favicon is always the logo mark.
export const LOGO_HEX_PATH = "M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25Z";
export const LOGO_CHECK_PATH = "m11 16.2 3.4 3.4 6.6-7";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={cn("size-8 shrink-0", className)}>
      <path d={LOGO_HEX_PATH} fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path
        d={LOGO_CHECK_PATH}
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ href, tone = "default", className }: LogoProps) {
  const inverse = tone === "inverse";
  return (
    <a href={href} className={cn("inline-flex items-center gap-2.5 rounded-sm", className)}>
      <LogoMark className={inverse ? "text-secondary" : "text-primary"} />
      <span className="font-display text-[22px] leading-none font-extrabold tracking-tight">
        <span className={inverse ? "text-white" : "text-ink"}>Derat</span>
        <span className={inverse ? "text-mint-soft" : "text-primary"}>Pro</span>
      </span>
    </a>
  );
}
