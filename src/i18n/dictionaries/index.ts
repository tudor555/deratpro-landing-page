import type { Locale } from "../config";
import { en } from "./en";
import { ro, type Dictionary } from "./ro";

const dictionaries: Record<Locale, Dictionary> = { ro, en };

export type { Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
