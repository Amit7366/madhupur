"use client";

import {
  Clock,
  Info,
  MapPin,
  Navigation,
  Phone,
  Share2,
  X,
} from "lucide-react";
import type { MapPlace } from "@/lib/dummy/map-places";
import { placeText } from "@/lib/dummy/map-places";
import type { Locale } from "@/lib/i18n";
import { phoneToTelHref } from "@/lib/phone-tel";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { MAP_PIN_THEME } from "@/components/map/map-pin-theme";

type MapPlaceInfoBoxProps = {
  place: MapPlace;
  locale: Locale;
  categoryLabel: string;
  distanceLabel: string;
  servicesLine: string;
  strings: {
    close: string;
    details: string;
    directions: string;
    share: string;
    call: string;
    copyAddress: string;
  };
  onClose: () => void;
  onOpenDetails: () => void;
};

export function MapPlaceInfoBox({
  place,
  locale,
  categoryLabel,
  distanceLabel,
  servicesLine,
  strings,
  onClose,
  onOpenDetails,
}: MapPlaceInfoBoxProps) {
  const theme = MAP_PIN_THEME[place.category];
  const title = placeText(place.name, locale);
  const phone = place.hotline?.trim() || place.dutyPhone?.trim() || "";
  const telHref = phone ? phoneToTelHref(phone) : null;

  const share = async () => {
    const text = `${title}\n${placeText(place.address, locale)}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
    } catch {
      /* user cancelled or clipboard blocked */
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(placeText(place.address, locale));
    } catch {
      /* ignore */
    }
  };

  const btnBase =
    "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center text-[11px] font-semibold leading-tight transition-colors sm:text-xs";

  return (
    <div
      className="pointer-events-auto w-[min(18.5rem,calc(100vw-2.5rem))] select-none"
      role="dialog"
      aria-label={title}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-600/80 dark:bg-slate-900">
        <div
          className={cn(
            "relative flex items-start justify-between gap-2 px-3.5 pb-3 pt-3 text-white",
            theme.header,
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold opacity-95">
              <MapPin className="size-3.5 shrink-0 opacity-90" aria-hidden />
              <span className="truncate">{categoryLabel}</span>
            </p>
            <p className="mt-1 text-base font-bold leading-snug tracking-tight">
              {title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={strings.close}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/15 text-white hover:bg-black/25",
              focusRing,
            )}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="space-y-3 px-3.5 py-3">
          <div className="flex items-start justify-between gap-2 text-sm text-slate-800 dark:text-slate-100">
            <p className="min-w-0 flex-1 leading-snug">{servicesLine}</p>
            <p
              className="flex shrink-0 items-center gap-1 text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400"
              dir="ltr"
            >
              <Clock className="size-3.5 shrink-0 opacity-70" aria-hidden />
              {distanceLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenDetails}
              className={cn(
                btnBase,
                "bg-sky-100 text-sky-800 hover:bg-sky-200/90 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60",
                focusRing,
              )}
            >
              <Navigation className="size-4 text-sky-600 dark:text-sky-400" />
              {strings.directions}
            </button>
            <button
              type="button"
              onClick={onOpenDetails}
              className={cn(
                btnBase,
                "bg-indigo-100 text-indigo-900 hover:bg-indigo-200/90 dark:bg-indigo-950/50 dark:text-indigo-200 dark:hover:bg-indigo-900/60",
                focusRing,
              )}
            >
              <Info className="size-4 text-indigo-600 dark:text-indigo-400" />
              {strings.details}
            </button>
            <button
              type="button"
              onClick={() => void share()}
              className={cn(
                btnBase,
                "bg-violet-100 text-violet-900 hover:bg-violet-200/90 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50",
                focusRing,
              )}
            >
              <Share2 className="size-4 text-violet-600 dark:text-violet-400" />
              {strings.share}
            </button>
            {telHref ? (
              <a
                href={telHref}
                className={cn(
                  btnBase,
                  "bg-emerald-100 text-emerald-900 hover:bg-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/50",
                  focusRing,
                )}
              >
                <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
                {strings.call}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => void copyAddress()}
                className={cn(
                  btnBase,
                  "bg-slate-100 text-slate-800 hover:bg-slate-200/90 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80",
                  focusRing,
                )}
              >
                <MapPin className="size-4 text-slate-600 dark:text-slate-400" />
                {strings.copyAddress}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Pointer tail */}
           <div className="flex justify-center">
        <div className={theme.boxTail} aria-hidden />
      </div>
    </div>
  );
}
