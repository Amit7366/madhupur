"use client";

import type { KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import type { MapPlace } from "@/lib/dummy/map-places";
import { placeText } from "@/lib/dummy/map-places";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { PhoneCallLink } from "@/components/map/PhoneCallLink";

type PlaceCardProps = {
  place: MapPlace;
  icon: LucideIcon;
  selected: boolean;
  onSelect: () => void;
  locale: Locale;
  /** Shown when location is known (user or fallback center). */
  distanceLabel?: string | null;
  callLabel: string;
};

export function PlaceCard({
  place,
  icon: Icon,
  selected,
  onSelect,
  locale,
  distanceLabel,
  callLabel,
}: PlaceCardProps) {
  const phones = [place.hotline, place.dutyPhone].filter(
    (p): p is string => Boolean(p && p.trim()),
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={selected}
      className={cn(
        "flex w-full min-w-0 cursor-pointer gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 sm:p-4",
        "[-webkit-tap-highlight-color:transparent] touch-manipulation",
        focusRing,
        selected
          ? "border-indigo-400/50 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500/40 dark:bg-indigo-950/40 dark:ring-indigo-400/25"
          : "border-slate-200/90 bg-[var(--surface)] hover:border-slate-300 hover:bg-slate-50/90 active:scale-[0.99] dark:border-slate-700/70 dark:hover:border-slate-600 dark:hover:bg-white/[0.04]",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12",
          selected
            ? "bg-indigo-500/20 text-indigo-900 dark:text-indigo-200"
            : "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-slate-200",
        )}
      >
        <Icon className="size-5 sm:size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex items-start gap-2">
          <span className="min-w-0 flex-1 space-y-1">
            <span className="font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {placeText(place.name, locale)}
            </span>
            {distanceLabel ? (
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                  selected
                    ? "bg-indigo-600/15 text-indigo-900 dark:text-indigo-200"
                    : "bg-slate-200/90 text-slate-700 dark:bg-white/10 dark:text-slate-300",
                )}
                dir="ltr"
              >
                {distanceLabel}
              </span>
            ) : null}
          </span>
          <ChevronRight
            className={cn(
              "mt-0.5 size-4 shrink-0 opacity-40 transition-transform duration-200",
              selected && "translate-x-0.5 text-indigo-700 opacity-100 dark:text-indigo-300",
            )}
          />
        </span>
        <span className="flex items-start gap-1.5 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
          <MapPin className="mt-0.5 size-3.5 shrink-0 opacity-60" />
          <span className="leading-snug">{placeText(place.address, locale)}</span>
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {placeText(place.services, locale)}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-slate-500 sm:text-xs dark:text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 shrink-0" />
            <span>{placeText(place.hours, locale)}</span>
          </span>
          {phones.length > 0 ? (
            <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {phones.map((num) => (
                <span
                  key={num}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100/90 pr-1 dark:bg-white/[0.06]"
                >
                  <PhoneCallLink
                    display={num}
                    label={callLabel}
                    stopPropagation
                    className="size-7 sm:size-8"
                  />
                  <span dir="ltr" className="pr-1.5 font-medium text-slate-600 dark:text-slate-400">
                    {num}
                  </span>
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </span>
    </div>
  );
}
