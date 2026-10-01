import { cn } from "@/lib/cn";

const HEX_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")";

/** Faint hexagon grid for dark brand surfaces. */
export function HexPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 opacity-[0.06]", className)}
      style={{ backgroundImage: HEX_TILE, backgroundSize: "56px 100px" }}
    />
  );
}
