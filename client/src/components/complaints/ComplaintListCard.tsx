"use client";

import { MapPin } from "lucide-react";
import { complaintLocaleText, type ComplaintDto } from "@/lib/complaint-api";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type ComplaintListCardProps = {
  complaint: ComplaintDto;
  locale: Locale;
  selected: boolean;
  distanceLabel: string;
  submittedLabel: string;
  photosLabel: string;
  onSelect: () => void;
};

export function ComplaintListCard({
  complaint,
  locale,
  selected,
  distanceLabel,
  submittedLabel,
  photosLabel,
  onSelect,
}: ComplaintListCardProps) {
  const titleText = complaintLocaleText(complaint.title, locale);
  const descText = complaintLocaleText(complaint.description, locale);
  const when = new Date(complaint.createdAt);
  const dateStr = Number.isNaN(when.getTime())
    ? ""
    : when.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
  const firstImg = complaint.images[0];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full gap-3 rounded-2xl border p-3 text-left transition-colors",
        "[-webkit-tap-highlight-color:transparent] active:scale-[0.99]",
        focusRing,
        selected
          ? "border-indigo-400/90 bg-indigo-50/90 dark:border-indigo-500/60 dark:bg-indigo-950/50"
          : "border-slate-200/90 bg-white hover:bg-slate-50 dark:border-slate-600/70 dark:bg-slate-900/40 dark:hover:bg-white/[0.04]",
      )}
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
        {firstImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImg}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-slate-400">
            <MapPin className="size-6" aria-hidden />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
          {titleText}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
          {descText}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
          {submittedLabel}
          {dateStr ? ` ${dateStr}` : ""} · {distanceLabel}
          {complaint.images.length > 0
            ? ` · ${complaint.images.length} ${photosLabel}`
            : ""}
        </p>
      </div>
    </button>
  );
}
