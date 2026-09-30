import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & { as?: "article" | "div" | "li"; interactive?: boolean };

export function Card({ as: Tag = "div", interactive = false, className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-line bg-surface p-6 shadow-raised sm:p-8",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-floating motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
      {...rest}
    />
  );
}
