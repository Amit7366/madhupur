"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneCallLink } from "@/components/map/PhoneCallLink";
import type { MapPlace } from "@/lib/dummy/map-places";
import { placeText } from "@/lib/dummy/map-places";
import type { LatLng } from "@/lib/geo";
import { googleDirectionsEmbedUrl } from "@/lib/google-maps";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type PlaceRouteModalProps = {
  open: boolean;
  onClose: () => void;
  place: MapPlace | null;
  origin: LatLng;
  locale: Locale;
  strings: {
    close: string;
    openDirections: string;
    mapPreviewHint: string;
    directionsEmbedHint: string;
    backToPreview: string;
    openRoute: string;
    labelDescription: string;
    labelServices: string;
    labelHours: string;
    labelHotline: string;
    labelDutyPhone: string;
    labelDutyOfficer: string;
    labelBangla: string;
    labelEnglish: string;
    callNumber: string;
  };
};

function InfoRow({
  label,
  value,
  dir = "auto",
}: {
  label: string;
  value: string;
  dir?: "ltr" | "auto";
}) {
  if (!value.trim()) return null;
  return (
    <div className="space-y-0.5">
      <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className="text-sm leading-snug text-slate-800 dark:text-slate-200"
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}

function PhoneInfoRow({
  label,
  value,
  callLabel,
}: {
  label: string;
  value: string;
  callLabel: string;
}) {
  if (!value.trim()) return null;
  return (
    <div className="space-y-0.5">
      <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="flex items-center gap-2 text-sm leading-snug text-slate-800 dark:text-slate-200">
        <PhoneCallLink display={value} label={callLabel} className="size-8" />
        <span dir="ltr" className="min-w-0 break-all">
          {value}
        </span>
      </dd>
    </div>
  );
}

export function PlaceRouteModal({
  open,
  onClose,
  place,
  origin,
  locale,
  strings,
}: PlaceRouteModalProps) {
  const [directionsMode, setDirectionsMode] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setDirectionsMode(false);
  }, [open]);

  const directionsUrl =
    place != null
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${place.lat},${place.lng}&travelmode=driving`
      : "";

  const placePreviewEmbedUrl =
    place != null
      ? `https://maps.google.com/maps?q=${place.lat},${place.lng}&z=15&output=embed`
      : "";

  const directionsEmbedUrl =
    place != null ? googleDirectionsEmbedUrl(origin, place) : "";

  const iframeSrc = directionsMode ? directionsEmbedUrl : placePreviewEmbedUrl;

  const primaryName = place != null ? placeText(place.name, locale) : "";
  const secondaryName =
    place != null ? placeText(place.name, locale === "bn" ? "en" : "bn") : "";

  return (
    <AnimatePresence>
      {open && place ? (
        <>
          <motion.button
            type="button"
            aria-label={strings.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="route-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-[121] max-h-[min(92vh,720px)] w-[min(96vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain",
              "rounded-2xl border border-slate-200/90 bg-background shadow-2xl dark:border-slate-700/70",
            )}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200/80 bg-background/95 px-4 py-3 backdrop-blur-md dark:border-slate-700/60 dark:bg-background/95">
              <div className="min-w-0 pr-2">
                <h2
                  id="route-modal-title"
                  className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-50"
                >
                  {primaryName}
                </h2>
                {secondaryName !== primaryName ? (
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {secondaryName}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={strings.close}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
                  focusRing,
                )}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-5 p-4 lg:grid-cols-2 lg:gap-6 lg:p-5">
              <div className="flex min-w-0 flex-col gap-4">
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-600/50 dark:bg-slate-900/60">
                  {/* External Unsplash URLs — avoid next/image remote config */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={place.image}
                    alt=""
                    className="h-48 w-full object-cover sm:h-56"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {locale === "bn" ? strings.labelBangla : strings.labelEnglish}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {placeText(place.address, locale)}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {locale === "bn" ? strings.labelEnglish : strings.labelBangla}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {placeText(place.address, locale === "bn" ? "en" : "bn")}
                  </p>
                </div>

                <dl className="flex flex-col gap-3">
                  <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-600/40 dark:bg-white/[0.03]">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {strings.labelDescription}
                    </p>
                    <InfoRow label={strings.labelBangla} value={place.description.bn} />
                    <div className="mt-2">
                      <InfoRow label={strings.labelEnglish} value={place.description.en} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {strings.labelServices}
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {place.services.bn}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {place.services.en}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {strings.labelHours}
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {place.hours.bn}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {place.hours.en}
                    </p>
                  </div>
                  {place.hotline ? (
                    <PhoneInfoRow
                      label={strings.labelHotline}
                      value={place.hotline}
                      callLabel={strings.callNumber}
                    />
                  ) : null}
                  {place.dutyPhone ? (
                    <PhoneInfoRow
                      label={strings.labelDutyPhone}
                      value={place.dutyPhone}
                      callLabel={strings.callNumber}
                    />
                  ) : null}
                  <div className="space-y-0.5">
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {strings.labelDutyOfficer}
                    </dt>
                    <dd className="space-y-1 text-sm leading-snug text-slate-800 dark:text-slate-200">
                      <p>{place.dutyOfficer.bn}</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {place.dutyOfficer.en}
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-600/60 dark:bg-slate-900/80">
                  <iframe
                    key={directionsMode ? "directions" : "place"}
                    title={
                      directionsMode
                        ? strings.directionsEmbedHint
                        : strings.mapPreviewHint
                    }
                    className={cn(
                      "h-auto w-full border-0",
                      directionsMode
                        ? "aspect-video min-h-[280px] sm:min-h-[340px]"
                        : "aspect-[4/3] min-h-[220px] sm:min-h-[280px]",
                    )}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={iframeSrc}
                  />
                </div>
                <p className="text-center text-[11px] leading-snug text-slate-500 dark:text-slate-500">
                  {directionsMode
                    ? strings.directionsEmbedHint
                    : strings.mapPreviewHint}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {!directionsMode ? (
                    <button
                      type="button"
                      onClick={() => setDirectionsMode(true)}
                      className={cn(
                        "flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 active:scale-[0.99] dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:min-w-[12rem]",
                        focusRing,
                      )}
                    >
                      {strings.openRoute}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDirectionsMode(false)}
                      className={cn(
                        "flex w-full flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:min-w-[10rem]",
                        focusRing,
                      )}
                    >
                      {strings.backToPreview}
                    </button>
                  )}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex w-full flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-sm font-semibold text-indigo-900 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-100 dark:hover:bg-indigo-900/60 sm:min-w-[12rem]",
                      focusRing,
                    )}
                  >
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                    {strings.openDirections}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
