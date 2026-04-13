import type { Metadata } from "next";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { getLocaleFromParams } from "@/lib/i18n-server";
import type { LangRouteParams } from "@/lib/lang-routes";

type MetadataPick = Pick<Metadata, "title" | "description">;

/**
 * DRY `generateMetadata` for `[lang]` pages — returns `{}` when locale is unknown.
 */
export async function pageMetadata(
  params: Promise<LangRouteParams>,
  select: (dict: Dictionary) => MetadataPick,
): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  if (!locale) return {};
  const dict = await getDictionary(locale);
  return select(dict);
}
