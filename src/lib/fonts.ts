import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// latin-ext carries the Romanian comma-below ș and ț.
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
