"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { MAP_DEFAULT_CENTER } from "@/lib/dummy/map-places";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type ContributeMapPickStrings = {
  title: string;
  hint: string;
  confirm: string;
  cancel: string;
  close: string;
  attribution: string;
};

type ContributeMapPickModalProps = {
  open: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  strings: ContributeMapPickStrings;
  onConfirm: (lat: number, lng: number) => void;
  /** Use a high z-index when this picker opens on top of another modal (e.g. complaints form). */
  stackClassName?: string;
};

export function ContributeMapPickModal({
  open,
  onClose,
  initialLat,
  initialLng,
  strings,
  onConfirm,
  stackClassName = "z-[70]",
}: ContributeMapPickModalProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [ready, setReady] = useState(false);

  const tearDown = useCallback(() => {
    roRef.current?.disconnect();
    roRef.current = null;
    mapRef.current?.remove();
    mapRef.current = null;
    markerRef.current = null;
    setReady(false);
  }, []);

  useEffect(() => {
    if (!open) {
      tearDown();
      return;
    }

    let cancelled = false;
    setReady(false);

    const frame = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el || cancelled) return;

      void (async () => {
        try {
          const L = (await import("leaflet")).default;
          await import("leaflet/dist/leaflet.css");
          await import("@/components/map/leaflet-map.css");
          if (cancelled || !containerRef.current) return;

          const startLat = initialLat ?? MAP_DEFAULT_CENTER.lat;
          const startLng = initialLng ?? MAP_DEFAULT_CENTER.lng;

          const map = L.map(el, {
            zoomControl: true,
            preferCanvas: true,
          }).setView([startLat, startLng], 15);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: strings.attribution,
          }).addTo(map);

          const icon = L.divIcon({
            className: "contribute-map-pick-pin",
            html: `<div style="width:28px;height:28px;border-radius:9999px;background:#0ea5e9;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);"></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          });

          const marker = L.marker([startLat, startLng], {
            icon,
            draggable: true,
          }).addTo(map);
          markerRef.current = marker;
          mapRef.current = map;

          map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
            marker.setLatLng(e.latlng);
          });

          const fixSize = () => {
            if (cancelled || !mapRef.current) return;
            map.invalidateSize({ animate: false });
          };

          roRef.current = new ResizeObserver(fixSize);
          roRef.current.observe(el);

          const scheduleFixSize = () => {
            fixSize();
            requestAnimationFrame(fixSize);
            window.setTimeout(fixSize, 120);
            window.setTimeout(fixSize, 350);
          };

          map.whenReady(() => {
            if (cancelled) return;
            scheduleFixSize();
            setReady(true);
          });
        } catch {
          if (!cancelled) setReady(false);
        }
      })();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      tearDown();
    };
  }, [open, initialLat, initialLng, strings.attribution, tearDown]);

  const handleConfirm = () => {
    const m = markerRef.current;
    if (!m) return;
    const { lat, lng } = m.getLatLng();
    onConfirm(lat, lng);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-end justify-center sm:items-center sm:p-4",
        stackClassName,
      )}
      role="presentation"
    >
      <button
        type="button"
        aria-label={strings.close}
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex max-h-[min(88dvh,640px)] w-full max-w-lg flex-col overflow-hidden",
          "rounded-t-3xl border border-slate-200 bg-background shadow-2xl dark:border-slate-700 sm:rounded-3xl",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h2
              id={titleId}
              className="text-base font-bold text-slate-900 dark:text-slate-50"
            >
              {strings.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              {strings.hint}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
              focusRing,
            )}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="relative h-[min(52vh,360px)] min-h-[220px] w-full bg-slate-200 dark:bg-slate-800">
          <div ref={containerRef} className="absolute inset-0" />
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!ready}
            className={cn(
              "rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50",
              focusRing,
            )}
          >
            {strings.confirm}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
              focusRing,
            )}
          >
            {strings.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
