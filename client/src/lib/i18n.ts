import type en from "@/locales/en.json";

/** JSON shape shared by `en.json` and `bn.json`. */
export type Dictionary = typeof en;

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "bn":
      return (await import("@/locales/bn.json")).default;
    default:
      return (await import("@/locales/en.json")).default;
  }
}

/**
 * Resolve a dotted path like `nav.home` against a loaded dictionary.
 * Falls back to the path string if the key is missing.
 */
export function translate(dict: Dictionary, path: string): string {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = dict;
  for (const key of parts) {
    if (current !== null && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

/**
 * Server or client: bind `t("nav.home")` to a dictionary instance.
 * In client components under `[lang]`, prefer `useI18n()` from `@/lib/use-i18n`.
 */
export function createTranslator(dict: Dictionary) {
  return (path: string) => translate(dict, path);
}
