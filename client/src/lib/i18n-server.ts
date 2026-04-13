import { notFound } from "next/navigation";
import {
  createTranslator,
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import type { LangRouteParams } from "@/lib/lang-routes";

/** Resolves locale or `undefined` (safe for `generateMetadata`). */
export async function getLocaleFromParams(
  params: Promise<LangRouteParams>,
): Promise<Locale | undefined> {
  const { lang } = await params;
  return isLocale(lang) ? lang : undefined;
}

export type LangContext = Readonly<{
  locale: Locale;
  dict: Dictionary;
  t: ReturnType<typeof createTranslator>;
}>;

/** Loads dictionary + translator; calls `notFound()` when `[lang]` is invalid. */
export async function getLangContext(
  params: Promise<LangRouteParams>,
): Promise<LangContext> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = await getDictionary(locale);
  return { locale, dict, t: createTranslator(dict) };
}
