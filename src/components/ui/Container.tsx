import clsx from "clsx";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className={clsx("mx-auto w-full max-w-content", className)}>{children}</div>
    </div>
  );
}
