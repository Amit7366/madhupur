"use client";

import { useI18n } from "@/lib/use-i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

/** Moves into view on keyboard focus only — first tab stop for screen reader users. */
export function SkipToContent() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className={cn(
        "fixed left-4 top-0 z-[200] translate-y-[-130%] rounded-lg border border-slate-200 bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-md transition-transform duration-200 ease-out dark:border-slate-600",
        "focus:translate-y-4",
        focusRing,
      )}
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
