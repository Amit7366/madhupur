"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { isLocale, type Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/use-i18n";

function swapLocaleInPath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${next}`;
  }
  const [first, ...rest] = segments;
  if (isLocale(first)) {
    return rest.length ? `/${next}/${rest.join("/")}` : `/${next}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const other: Locale = locale === "bn" ? "en" : "bn";
  const href = swapLocaleInPath(pathname, other);
  const label = other === "en" ? t("language.switchToEn") : t("language.switchToBn");
  const short = other === "en" ? t("language.enShort") : t("language.bnShort");

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline">
        {t("language.label")}
      </span>
      <Link
        href={href}
        prefetch
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-slate-100",
          "[-webkit-tap-highlight-color:transparent] touch-manipulation",
          "hover:border-indigo-300 hover:bg-indigo-50 hover:shadow active:scale-[0.97] dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/50",
          focusRing,
        )}
        hrefLang={other}
        aria-label={label}
      >
        <Languages className="size-3.5 opacity-70" aria-hidden />
        <span className="max-w-[5.5rem] truncate sm:max-w-none">{short}</span>
      </Link>
    </div>
  );
}
