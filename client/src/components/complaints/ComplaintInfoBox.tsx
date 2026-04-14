"use client";

import { X } from "lucide-react";
import { complaintLocaleText, type ComplaintDto } from "@/lib/complaint-api";
import { googleMapsDirectionsUrl } from "@/lib/google-maps";
import type { LatLng } from "@/lib/geo";
import type { Locale } from "@/lib/i18n";
import { phoneToTelHref } from "@/lib/phone-tel";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type ComplaintInfoBoxProps = {
  complaint: ComplaintDto;
  locale: Locale;
  origin: LatLng;
  distanceLabel: string;
  strings: {
    close: string;
    callReporter: string;
    directions: string;
    submitted: string;
    photos: string;
  };
  onClose: () => void;
};

export function ComplaintInfoBox({
  complaint,
  locale,
  origin,
  distanceLabel,
  strings,
  onClose,
}: ComplaintInfoBoxProps) {
  const titleText = complaintLocaleText(complaint.title, locale);
  const descFull = complaintLocaleText(complaint.description, locale);
  const desc =
    descFull.length > 180 ? `${descFull.slice(0, 180)}…` : descFull;
  const reporterDisplay = complaintLocaleText(complaint.reporterName, locale);
  const firstImg = complaint.images[0];
  const tel = phoneToTelHref(complaint.reporterPhone);
  const when = new Date(complaint.createdAt);
  const dateStr = Number.isNaN(when.getTime())
    ? ""
    : when.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <div
      className={cn(
        "max-w-[min(100%,20rem)] rounded-2xl border border-slate-200/90 bg-background/95 p-3 shadow-lg backdrop-blur-md dark:border-slate-600/80 dark:bg-slate-950/95",
      )}
      role="dialog"
      aria-label={titleText}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug text-slate-900 dark:text-slate-50">
          {titleText}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={strings.close}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
            focusRing,
          )}
        >
          <X className="size-4" />
        </button>
      </div>
      {firstImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstImg}
          alt=""
          className="mt-2 h-24 w-full rounded-xl object-cover"
        />
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {desc}
      </p>
      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-500">
        {strings.submitted}
        {dateStr ? `: ${dateStr}` : ""} · {distanceLabel}
        {complaint.images.length > 0
          ? ` · ${complaint.images.length} ${strings.photos}`
          : ""}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
        {reporterDisplay}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tel ? (
          <a
            href={tel}
            className={cn(
              "inline-flex items-center rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400",
              focusRing,
            )}
          >
            {strings.callReporter}
          </a>
        ) : null}
        <a
          href={googleMapsDirectionsUrl(
            { lat: complaint.lat, lng: complaint.lng },
            origin,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-white/5",
            focusRing,
          )}
        >
          {strings.directions}
        </a>
      </div>
    </div>
  );
}
