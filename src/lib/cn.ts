import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom type scale so `text-eyebrow` is a size, not a colour.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "display-mobile",
        "h2",
        "h2-mobile",
        "h3",
        "stat",
        "numeral",
        "eyebrow",
        "body-lg",
        "body-md",
        "body-sm",
        "caption",
        "label",
        "button",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
