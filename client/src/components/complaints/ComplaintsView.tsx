"use client";

import dynamic from "next/dynamic";
import { Megaphone, Minus, Navigation, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ComplaintInfoBox } from "@/components/complaints/ComplaintInfoBox";
import { ComplaintListCard } from "@/components/complaints/ComplaintListCard";
import { ComplaintSubmitModal } from "@/components/complaints/ComplaintSubmitModal";
import type { ComplaintsLeafletMapHandle } from "@/components/complaints/ComplaintsLeafletMap";
import { EmptyState } from "@/components/content/EmptyState";
import {
  COMPLAINTS_REFRESH_EVENT,
  fetchComplaintsFromApi,
  type ComplaintDto,
} from "@/lib/complaint-api";
import { getPublicApiBaseUrl } from "@/lib/map-place-api";
import { MAP_DEFAULT_CENTER } from "@/lib/dummy/map-places";
import { formatDistanceKm, haversineKm, latLngBounds, type LatLng } from "@/lib/geo";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

const ComplaintsLeafletMap = dynamic(
  () =>
    import("@/components/complaints/ComplaintsLeafletMap").then(
      (m) => m.ComplaintsLeafletMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-[1] h-full w-full animate-pulse bg-slate-300/35 dark:bg-slate-800/40" />
    ),
  },
);

const MAP_INFOBOX_GAP_PX = 52;
const MAP_INFOBOX_EDGE_PAD = 12;
const POLL_MS = 45_000;

function clampInfoboxPosition(
  shellW: number,
  shellH: number,
  anchorX: number,
  anchorY: number,
  boxW: number,
  boxH: number,
) {
  const pad = MAP_INFOBOX_EDGE_PAD;
  const gap = MAP_INFOBOX_GAP_PX;
  let left = anchorX - boxW / 2;
  left = Math.max(pad, Math.min(left, shellW - boxW - pad));
  let top = anchorY - gap - boxH;
  top = Math.max(pad, Math.min(top, shellH - boxH - pad));
  return { left, top };
}

type MobileTab = "map" | "list";

type GeoStatus = "loading" | "ok" | "denied" | "error" | "unsupported";

type ComplaintsStrings = {
  listHeading: string;
  mapTab: string;
  listTab: string;
  fabLabel: string;
  fabHint: string;
  mapAttribution: string;
  zoomIn: string;
  zoomOut: string;
  recenter: string;
  geoLoading: string;
  geoDenied: string;
  geoError: string;
  geoUnsupported: string;
  geoFallbackNote: string;
  emptyTitle: string;
  emptyDescription: string;
  unitKm: string;
  unitM: string;
  submitted: string;
  photos: string;
  callReporter: string;
  directions: string;
  closePanel: string;
};

type ComplaintsViewProps = {
  complaints: ComplaintDto[];
  locale: Locale;
  strings: ComplaintsStrings;
};

export function ComplaintsView({
  complaints: initialComplaints,
  locale,
  strings,
}: ComplaintsViewProps) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<ComplaintDto[]>(initialComplaints);

  useEffect(() => {
    setComplaints(initialComplaints);
  }, [initialComplaints]);

  const refetch = useCallback(() => {
    void fetchComplaintsFromApi().then((rows) => {
      if (rows != null) setComplaints(rows);
    });
  }, []);

  useEffect(() => {
    refetch();
    const onRefresh = () => refetch();
    window.addEventListener(COMPLAINTS_REFRESH_EVENT, onRefresh);
    const onVisible = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onVisible);
    let pollId: number | undefined;
    const base = getPublicApiBaseUrl();
    if (typeof window !== "undefined" && base && /^https?:\/\//i.test(base)) {
      pollId = window.setInterval(refetch, POLL_MS);
    }
    return () => {
      window.removeEventListener(COMPLAINTS_REFRESH_EVENT, onRefresh);
      document.removeEventListener("visibilitychange", onVisible);
      if (pollId !== undefined) window.clearInterval(pollId);
    };
  }, [refetch]);

  const [mobileTab, setMobileTab] = useState<MobileTab>("map");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("loading");
  const [infoboxComplaint, setInfoboxComplaint] = useState<ComplaintDto | null>(
    null,
  );
  const [submitOpen, setSubmitOpen] = useState(false);
  const leafletRef = useRef<ComplaintsLeafletMapHandle>(null);
  const mapShellRef = useRef<HTMLDivElement | null>(null);
  const infoboxWrapRef = useRef<HTMLDivElement | null>(null);
  const [infoboxAnchor, setInfoboxAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [infoboxLayout, setInfoboxLayout] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      queueMicrotask(() => setGeoStatus("unsupported"));
      return;
    }
    setGeoStatus("loading");
    let gotFix = false;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        gotFix = true;
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoStatus("ok");
      },
      (err) => {
        if (gotFix) return;
        setUserPos(null);
        if (err.code === 1) setGeoStatus("denied");
        else setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const origin: LatLng = userPos ?? MAP_DEFAULT_CENTER;
  const userLocationActive = geoStatus === "ok" && userPos != null;

  const sorted = useMemo(() => {
    const distSort = (a: ComplaintDto, b: ComplaintDto) =>
      haversineKm(origin, a) - haversineKm(origin, b);
    return [...complaints].sort(distSort);
  }, [complaints, origin]);

  const selectedId = useMemo(() => {
    if (!sorted.length) return null;
    if (pickedId && sorted.some((c) => c.id === pickedId)) return pickedId;
    return sorted[0].id;
  }, [sorted, pickedId]);

  const bounds = useMemo(() => {
    const pts: LatLng[] = sorted.map((c) => ({ lat: c.lat, lng: c.lng }));
    pts.push(origin);
    return latLngBounds(pts);
  }, [sorted, origin]);

  const selected = useMemo(() => {
    if (!sorted.length) return null;
    if (selectedId && sorted.some((c) => c.id === selectedId)) {
      return sorted.find((c) => c.id === selectedId) ?? sorted[0];
    }
    return sorted[0];
  }, [sorted, selectedId]);

  const distanceLabelFor = useCallback(
    (c: ComplaintDto) => {
      const km = haversineKm(origin, c);
      return formatDistanceKm(km, strings.unitKm, strings.unitM);
    },
    [origin, strings.unitKm, strings.unitM],
  );

  const selectComplaint = useCallback((c: ComplaintDto) => {
    setPickedId(c.id);
    setInfoboxComplaint(c);
  }, []);

  const onInfoboxAnchor = useCallback(
    (pt: { x: number; y: number } | null) => {
      setInfoboxAnchor(pt);
    },
    [],
  );

  useEffect(() => {
    if (
      infoboxComplaint &&
      !sorted.some((c) => c.id === infoboxComplaint.id)
    ) {
      setInfoboxComplaint(null);
    }
  }, [sorted, infoboxComplaint]);

  useEffect(() => {
    if (!infoboxComplaint) setInfoboxLayout(null);
  }, [infoboxComplaint]);

  useLayoutEffect(() => {
    if (!infoboxComplaint || !infoboxAnchor || !mapShellRef.current) return;
    const shell = mapShellRef.current;
    const wrap = infoboxWrapRef.current;
    if (!wrap) return;

    const ax = infoboxAnchor.x;
    const ay = infoboxAnchor.y;

    const apply = () => {
      const { width: bw, height: bh } = wrap.getBoundingClientRect();
      if (bw < 2 || bh < 2) return;
      setInfoboxLayout(
        clampInfoboxPosition(
          shell.clientWidth,
          shell.clientHeight,
          ax,
          ay,
          bw,
          bh,
        ),
      );
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrap);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [infoboxComplaint, infoboxAnchor]);

  const geoMessage = useMemo(() => {
    switch (geoStatus) {
      case "loading":
        return strings.geoLoading;
      case "denied":
        return strings.geoDenied;
      case "error":
        return strings.geoError;
      case "unsupported":
        return strings.geoUnsupported;
      default:
        return null;
    }
  }, [geoStatus, strings]);

  const showFallbackNote =
    geoStatus !== "loading" && geoStatus !== "ok" && geoMessage;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex rounded-2xl border border-slate-200/90 p-1 dark:border-slate-600/70 lg:hidden">
        <button
          type="button"
          className={cn(
            "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
            mobileTab === "map"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 dark:text-slate-400",
            focusRing,
          )}
          onClick={() => setMobileTab("map")}
        >
          {strings.mapTab}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
            mobileTab === "list"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 dark:text-slate-400",
            focusRing,
          )}
          onClick={() => setMobileTab("list")}
        >
          {strings.listTab}
        </button>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-3 lg:max-w-[58%]",
            mobileTab !== "map" && "hidden lg:flex",
          )}
        >
          {geoStatus === "loading" ? (
          <p className="text-xs text-slate-600 dark:text-slate-400" role="status">
            {strings.geoLoading}
          </p>
        ) : showFallbackNote ? (
          <p className="text-xs text-amber-800 dark:text-amber-200/90" role="status">
            {geoMessage} {strings.geoFallbackNote}
          </p>
        ) : null}

          <div
          ref={mapShellRef}
          className={cn(
            "relative isolate h-[min(52vh,420px)] min-h-[min(52vh,420px)] cursor-default overflow-hidden rounded-[1.35rem] border border-slate-200/90 shadow-md dark:border-slate-700/70 dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]",
            "bg-slate-200/80 dark:bg-slate-900",
          )}
        >
          <ComplaintsLeafletMap
            ref={leafletRef}
            className="absolute inset-0 z-[1] h-full w-full"
            complaints={sorted}
            origin={origin}
            bounds={bounds}
            userLocationActive={userLocationActive}
            selectedId={selectedId}
            infoboxComplaint={infoboxComplaint}
            tileAttribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            onSelectComplaint={selectComplaint}
            onMapBackgroundClick={() => setInfoboxComplaint(null)}
            onInfoboxAnchor={onInfoboxAnchor}
          />

          <div
            className="absolute right-3 top-3 z-[1000] flex flex-col gap-1.5 rounded-2xl border border-slate-200/90 bg-background/90 p-1 shadow-md backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-950/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={strings.zoomIn}
              onClick={() => leafletRef.current?.zoomIn()}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 dark:text-slate-200 dark:hover:bg-white/10",
                focusRing,
              )}
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              aria-label={strings.zoomOut}
              onClick={() => leafletRef.current?.zoomOut()}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 dark:text-slate-200 dark:hover:bg-white/10",
                focusRing,
              )}
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              aria-label={strings.recenter}
              onClick={() => {
                leafletRef.current?.recenter();
                if (!userLocationActive && sorted[0]) {
                  setPickedId(sorted[0].id);
                  setInfoboxComplaint(sorted[0]);
                }
              }}
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-indigo-700 transition-colors hover:bg-indigo-100 active:scale-95 dark:text-indigo-300 dark:hover:bg-indigo-950/60",
                focusRing,
              )}
            >
              <Navigation className="size-4" />
            </button>
          </div>

          <p className="pointer-events-none absolute bottom-2 left-3 right-3 z-[1000] truncate text-center text-[10px] font-medium text-slate-600/90 dark:text-slate-400/90">
            {strings.mapAttribution}
          </p>

          {infoboxComplaint && infoboxAnchor ? (
            <div className="pointer-events-none absolute inset-0 z-[1100]">
              <div
                ref={infoboxWrapRef}
                className="pointer-events-auto absolute max-h-[calc(100%-1.5rem)] overflow-y-auto overscroll-contain"
                style={
                  infoboxLayout
                    ? { left: infoboxLayout.left, top: infoboxLayout.top }
                    : {
                        left: infoboxAnchor.x,
                        top: infoboxAnchor.y,
                        transform: "translate(-50%, calc(-100% - 3.25rem))",
                      }
                }
              >
                <ComplaintInfoBox
                  complaint={infoboxComplaint}
                  locale={locale}
                  origin={origin}
                  distanceLabel={distanceLabelFor(infoboxComplaint)}
                  strings={{
                    close: strings.closePanel,
                    callReporter: strings.callReporter,
                    directions: strings.directions,
                    submitted: strings.submitted,
                    photos: strings.photos,
                  }}
                  onClose={() => setInfoboxComplaint(null)}
                />
              </div>

            </div>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 lg:max-w-[42%]",
          mobileTab !== "list" && "hidden lg:flex",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-slate-50">
            {strings.listHeading}
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-400">
            {sorted.length}
          </span>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title={strings.emptyTitle}
            description={strings.emptyDescription}
            icon={Megaphone}
            className="min-h-[200px] py-10"
          />
        ) : (
          <ul className="flex max-h-[min(52vh,480px)] flex-col gap-2 overflow-y-auto overscroll-y-contain pb-2 lg:max-h-[calc(100vh-220px)]">
            {sorted.map((c) => (
              <li key={c.id}>
                <ComplaintListCard
                  complaint={c}
                  locale={locale}
                  selected={Boolean(selected && selected.id === c.id)}
                  onSelect={() => selectComplaint(c)}
                  distanceLabel={distanceLabelFor(c)}
                  submittedLabel={strings.submitted}
                  photosLabel={strings.photos}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>

      <button
        type="button"
        aria-label={strings.fabLabel}
        title={strings.fabHint}
        onClick={() => setSubmitOpen(true)}
        className={cn(
          "fixed bottom-24 right-5 z-[90] inline-flex min-h-14 items-center gap-2 rounded-full border-2 border-indigo-600 bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-500",
          focusRing,
        )}
      >
        <Megaphone className="size-5 shrink-0" aria-hidden />
        <span className="hidden min-[400px]:inline">{strings.fabLabel}</span>
      </button>

      <ComplaintSubmitModal
        open={submitOpen}
        onClose={() => {
          setSubmitOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
