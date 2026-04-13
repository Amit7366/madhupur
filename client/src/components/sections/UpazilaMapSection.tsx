import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  MADHUPUR_UPAZILA_GOOGLE_MAPS_URL,
  MADHUPUR_UPAZILA_MAP_EMBED_SRC,
} from "@/lib/google-maps";
import type { Locale } from "@/lib/i18n";

type UpazilaMapSectionProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  openInMapsLabel: string;
  iframeTitle: string;
};

export function UpazilaMapSection({
  locale,
  eyebrow,
  title,
  description,
  openInMapsLabel,
  iframeTitle,
}: UpazilaMapSectionProps) {
  return (
    <section className="space-y-5" aria-labelledby="upazila-map-heading">
      <SectionTitle id="upazila-map-heading" eyebrow={eyebrow} title={title} />

      <div
        className={cn(
          "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-stretch lg:gap-8",
        )}
      >
        <div
          className={cn(
            "order-2 flex flex-col justify-between gap-6 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-6 shadow-sm dark:border-slate-700/90 dark:from-slate-900/90 dark:to-slate-950/90 lg:order-1 lg:p-7",
          )}
        >
          <div className="space-y-4">
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/80",
              )}
              aria-hidden
            >
              <MapPin className="size-5 text-indigo-700 dark:text-indigo-300" />
            </div>
            <p
              lang={locale}
              className={cn(
                "text-pretty text-[15px] leading-relaxed text-slate-800 dark:text-slate-100 lg:text-base",
              )}
            >
              {description}
            </p>
          </div>

          <Link
            href={MADHUPUR_UPAZILA_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200/90 bg-indigo-50/80 px-4 py-3 text-sm font-semibold text-indigo-900 transition-colors hover:border-indigo-300 hover:bg-indigo-100/90 dark:border-indigo-800/80 dark:bg-indigo-950/50 dark:text-indigo-100 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/60 sm:w-auto sm:self-start",
              focusRing,
            )}
          >
            {openInMapsLabel}
            <ExternalLink className="size-4 shrink-0 opacity-80" aria-hidden />
          </Link>
        </div>

        <div
          className={cn(
            "order-1 flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-md dark:border-slate-700/80 dark:bg-slate-900/50 lg:order-2 lg:min-h-[min(100%,420px)]",
          )}
        >
          <iframe
            title={iframeTitle}
            src={MADHUPUR_UPAZILA_MAP_EMBED_SRC}
            className="h-full min-h-[300px] w-full flex-1 border-0 lg:min-h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
