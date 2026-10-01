import { Phone } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

export function FloatingCall({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="fixed right-5 bottom-5 z-40 flex size-15 items-center justify-center rounded-full bg-primary text-white shadow-floating transition-colors hover:bg-primary-strong lg:hidden"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full shadow-halo [animation-duration:2.4s] motion-safe:animate-ping"
      />
      <Icon icon={Phone} size={26} className="relative" />
    </a>
  );
}
