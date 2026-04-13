"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import bn from "@/locales/bn.json";
import en from "@/locales/en.json";
import {
  createTranslator,
  defaultLocale,
  type Dictionary,
  type Locale,
  isLocale,
} from "@/lib/i18n";

const bundled: Record<Locale, Dictionary> = { en, bn };

/**
 * Reads the active locale from the `[lang]` route segment and exposes `t` + `dict`.
 * Keeps JSON in sync with `getDictionary` on the server.
 */
export function useI18n() {
  const params = useParams();
  const raw = params?.lang;
  const locale: Locale =
    typeof raw === "string" && isLocale(raw) ? raw : defaultLocale;

  return useMemo(() => {
    const dict = bundled[locale];
    return {
      locale,
      dict,
      t: createTranslator(dict),
    };
  }, [locale]);
}
