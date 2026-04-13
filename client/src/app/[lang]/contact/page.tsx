import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n";
import type { LangPageProps } from "@/lib/lang-routes";

export default async function LegacyContactPage({ params }: LangPageProps) {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  redirect(`/${lang}/contacts`);
}
