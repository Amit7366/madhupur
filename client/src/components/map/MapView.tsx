"use client";

import { MapPin, Minus, Navigation, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapFilters,
  type MapFilterSubtype,
  type MapFilterValue,
} from "@/components/map/MapFilters";
import { MapSmartSearchBar } from "@/components/map/MapSmartSearchBar";
import { MapPlaceInfoBox } from "@/components/map/MapPlaceInfoBox";
import { PlaceCard } from "@/components/map/PlaceCard";
import { PlaceRouteModal } from "@/components/map/PlaceRouteModal";
import { EmptyState } from "@/components/content/EmptyState";
import {
  MAP_DEFAULT_CENTER,
  placeText,
  type MapPlace,
} from "@/lib/dummy/map-places";
import {
  CATEGORIES_BY_GROUP,
  categoryToGroup,
  type MapFilterGroupId,
} from "@/lib/map-category-groups";
import { mapCategoryIcon } from "@/lib/map-category-icons";
import type { Locale } from "@/lib/i18n";
import {
  formatDistanceKm,
  haversineKm,
  latLngBounds,
  type LatLng,
} from "@/lib/geo";
import type { MadhupurLeafletMapHandle } from "@/components/map/MadhupurLeafletMap";
import { googleMapsDirectionsUrl } from "@/lib/google-maps";
import { runMapSmartSearch } from "@/lib/map-smart-search-pipeline";
import { phoneToTelHref } from "@/lib/phone-tel";
import {
  estimatePlaceOpenNow,
  type SmartSearchResponsePayload,
} from "@/lib/smart-search-response";
import {
  fetchMergedMapPlacesFromApi,
  getPublicApiBaseUrl,
  MAP_PLACES_REFRESH_EVENT,
} from "@/lib/map-place-api";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

const LeafletMap = dynamic(
  () =>
    import("@/components/map/MadhupurLeafletMap").then(
      (m) => m.MadhupurLeafletMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-[1] h-full w-full animate-pulse bg-slate-300/35 dark:bg-slate-800/40" />
    ),
  },
);

/** Gap between pin anchor and bottom of the info card (matches prior 3.25rem). */
const MAP_INFOBOX_GAP_PX = 52;
const MAP_INFOBOX_EDGE_PAD = 12;

/** Poll GET /places so removals / adds from elsewhere show up without reload. */
const PLACES_POLL_MS = 45_000;

type SmartSearchSession = {
  payload: SmartSearchResponsePayload;
  rankedIds: string[];
  openOnly: boolean;
};

function clampMapInfoboxPosition(
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

type GeoStatus = "loading" | "ok" | "denied" | "error" | "unsupported";

type MapViewProps = {
  places: MapPlace[];
  locale: Locale;
  strings: {
    filters: Record<MapFilterValue, string>;
    filterGroups: Record<MapFilterGroupId, string>;
    allTypesInSection: string;
    filterGroupAria: string;
    filterSubtypeAria: string;
    nearYou: string;
    mapInfoBoxDetails: string;
    mapInfoBoxDirections: string;
    mapInfoBoxShare: string;
    mapInfoBoxCall: string;
    mapInfoBoxCopyAddress: string;
    emptyTitle: string;
    emptyDescription: string;
    mapAttribution: string;
    zoomIn: string;
    zoomOut: string;
    recenter: string;
    geoLoading: string;
    geoDenied: string;
    geoError: string;
    geoUnsupported: string;
    geoFallbackNote: string;
    unitKm: string;
    unitM: string;
    routeModalClose: string;
    routeModalOpenDirections: string;
    routeModalMapPreviewHint: string;
    routeModalDirectionsHint: string;
    routeModalBackToPreview: string;
    openRoute: string;
    routeModalLabelDescription: string;
    routeModalLabelServices: string;
    routeModalLabelHours: string;
    routeModalLabelHotline: string;
    routeModalLabelDutyPhone: string;
    routeModalLabelDutyOfficer: string;
    routeModalLabelBangla: string;
    routeModalLabelEnglish: string;
    callNumber: string;
    mapSearchPlaceholder: string;
    mapSearchInputAria: string;
    mapSearchSubmitAria: string;
    mapSearchClearAria: string;
    mapSearchVoiceAria: string;
    mapSearchVoiceStopAria: string;
    mapSearchVoiceUnsupported: string;
    mapSearchVoiceListening: string;
    mapSearchDismiss: string;
  };
};

export function MapView({ places: placesFromServer, locale, strings }: MapViewProps) {
  /**
   * Single source for map pins + “Places near you” list. Hydrated from SSR, then replaced
   * by GET /api/v1/places (merged with static seed) whenever we refetch.
   */
  const [places, setPlaces] = useState<MapPlace[]>(placesFromServer);

  useEffect(() => {
    setPlaces(placesFromServer);
  }, [placesFromServer]);

  const refetchPlacesFromApi = useCallback(() => {
    void fetchMergedMapPlacesFromApi().then((merged) => {
      if (merged != null) setPlaces(merged);
    });
  }, []);

  useEffect(() => {
    refetchPlacesFromApi();

    const onLiveRefresh = () => refetchPlacesFromApi();
    window.addEventListener(MAP_PLACES_REFRESH_EVENT, onLiveRefresh);

    const onVisible = () => {
      if (document.visibilityState === "visible") refetchPlacesFromApi();
    };
    document.addEventListener("visibilitychange", onVisible);

    const base = getPublicApiBaseUrl();
    let pollId: number | undefined;
    if (base && /^https?:\/\//i.test(base)) {
      pollId = window.setInterval(refetchPlacesFromApi, PLACES_POLL_MS);
    }

    return () => {
      window.removeEventListener(MAP_PLACES_REFRESH_EVENT, onLiveRefresh);
      document.removeEventListener("visibilitychange", onVisible);
      if (pollId !== undefined) window.clearInterval(pollId);
    };
  }, [refetchPlacesFromApi]);

  const [filterGroup, setFilterGroup] = useState<MapFilterGroupId>("all");
  const [filterSubtype, setFilterSubtype] = useState<MapFilterSubtype>("all");
  /** User-picked pin/card; falls back to nearest when filter changes or pick is invalid. */
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("loading");
  const [modalPlace, setModalPlace] = useState<MapPlace | null>(null);
  const [infoboxPlace, setInfoboxPlace] = useState<MapPlace | null>(null);
  const leafletRef = useRef<MadhupurLeafletMapHandle>(null);
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
  const [smartSession, setSmartSession] = useState<SmartSearchSession | null>(
    null,
  );

  const shortServicesLine = useCallback((place: MapPlace) => {
    const raw = placeText(place.services, locale).replace(/\s+/g, " ").trim();
    if (raw.length <= 72) return raw;
    return `${raw.slice(0, 72)}…`;
  }, [locale]);

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

  const categoryFiltered = useMemo(() => {
    if (filterGroup === "all") return places;
    const cats = CATEGORIES_BY_GROUP[filterGroup];
    if (filterSubtype === "all") {
      const set = new Set(cats);
      return places.filter((p) => set.has(p.category));
    }
    return places.filter((p) => p.category === filterSubtype);
  }, [places, filterGroup, filterSubtype]);

  const filteredForDisplay = useMemo(() => {
    if (!smartSession?.openOnly) return categoryFiltered;
    const now = new Date();
    return categoryFiltered.filter((p) => estimatePlaceOpenNow(p, now));
  }, [categoryFiltered, smartSession]);

  const sortedFiltered = useMemo(() => {
    const distSort = (a: MapPlace, b: MapPlace) =>
      haversineKm(origin, a) - haversineKm(origin, b);
    const list = [...filteredForDisplay];
    const ids = smartSession?.rankedIds;
    if (!ids?.length) return list.sort(distSort);
    const order = new Map(ids.map((id, i) => [id, i]));
    return list.sort((a, b) => {
      const ia = order.get(a.id);
      const ib = order.get(b.id);
      if (ia !== undefined && ib !== undefined) return ia - ib;
      if (ia !== undefined) return -1;
      if (ib !== undefined) return 1;
      return distSort(a, b);
    });
  }, [filteredForDisplay, smartSession, origin]);

  const selectedId = useMemo(() => {
    if (!sortedFiltered.length) return null;
    if (pickedId && sortedFiltered.some((p) => p.id === pickedId)) {
      return pickedId;
    }
    return sortedFiltered[0].id;
  }, [sortedFiltered, pickedId]);

  const bounds = useMemo(() => {
    const pts: LatLng[] = filteredForDisplay.map((p) => ({
      lat: p.lat,
      lng: p.lng,
    }));
    pts.push(origin);
    return latLngBounds(pts);
  }, [filteredForDisplay, origin]);

  const selected = useMemo(() => {
    if (!sortedFiltered.length) return null;
    if (selectedId && sortedFiltered.some((p) => p.id === selectedId)) {
      return sortedFiltered.find((p) => p.id === selectedId) ?? sortedFiltered[0];
    }
    return sortedFiltered[0];
  }, [sortedFiltered, selectedId]);

  const distanceLabelFor = useCallback(
    (place: MapPlace) => {
      const km = haversineKm(origin, place);
      return formatDistanceKm(km, strings.unitKm, strings.unitM);
    },
    [origin, strings.unitKm, strings.unitM],
  );

  const selectPlace = useCallback((place: MapPlace) => {
    setPickedId(place.id);
    setInfoboxPlace(place);
  }, []);

  const handleSmartSearch = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) {
        setSmartSession(null);
        return;
      }
      const { payload, rankedIds, openOnly, filtersAndRanking } =
        runMapSmartSearch({
          query: q,
          places,
          origin,
          distanceUnits: { unitKm: strings.unitKm, unitM: strings.unitM },
        });
      const cat = filtersAndRanking.filters.category;
      setFilterGroup(categoryToGroup(cat));
      setFilterSubtype(cat);
      setSmartSession({ payload, rankedIds, openOnly });
      const firstId = payload.places[0]?.placeId;
      if (firstId) {
        const p = places.find((x) => x.id === firstId);
        if (p) {
          setPickedId(p.id);
          setInfoboxPlace(p);
        }
      } else {
        setInfoboxPlace(null);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => leafletRef.current?.recenter());
      });
    },
    [places, origin, strings.unitKm, strings.unitM],
  );

  const onInfoboxAnchor = useCallback(
    (pt: { x: number; y: number } | null) => {
      setInfoboxAnchor(pt);
    },
    [],
  );

  const openDetailsModal = useCallback((place: MapPlace) => {
    setModalPlace(place);
    setInfoboxPlace(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || modalPlace) return;
      setInfoboxPlace(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalPlace]);

  useEffect(() => {
    if (
      infoboxPlace &&
      !sortedFiltered.some((p) => p.id === infoboxPlace.id)
    ) {
      setInfoboxPlace(null);
    }
  }, [sortedFiltered, infoboxPlace]);

  useEffect(() => {
    if (!infoboxPlace) setInfoboxLayout(null);
  }, [infoboxPlace]);

  useLayoutEffect(() => {
    if (!infoboxPlace || !infoboxAnchor || !mapShellRef.current) return;
    const shell = mapShellRef.current;
    const wrap = infoboxWrapRef.current;
    if (!wrap) return;

    const ax = infoboxAnchor.x;
    const ay = infoboxAnchor.y;

    const apply = () => {
      const { width: bw, height: bh } = wrap.getBoundingClientRect();
      if (bw < 2 || bh < 2) return;
      setInfoboxLayout(
        clampMapInfoboxPosition(
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
  }, [infoboxPlace, infoboxAnchor, locale]);

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
    <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:max-w-[58%]">
        <MapFilters
          group={filterGroup}
          subtype={filterSubtype}
          onGroupChange={(g) => {
            setSmartSession(null);
            setFilterGroup(g);
            setFilterSubtype("all");
          }}
          onSubtypeChange={(s) => {
            setSmartSession(null);
            setFilterSubtype(s);
          }}
          groupLabels={strings.filterGroups}
          categoryLabels={strings.filters}
          allTypesInSectionLabel={strings.allTypesInSection}
          groupAriaLabel={strings.filterGroupAria}
          subtypeAriaLabel={strings.filterSubtypeAria}
        />

        <MapSmartSearchBar
          locale={locale}
          strings={{
            placeholder: strings.mapSearchPlaceholder,
            inputAria: strings.mapSearchInputAria,
            submitAria: strings.mapSearchSubmitAria,
            clearAria: strings.mapSearchClearAria,
            voiceAria: strings.mapSearchVoiceAria,
            voiceStopAria: strings.mapSearchVoiceStopAria,
            voiceUnsupported: strings.mapSearchVoiceUnsupported,
            voiceListening: strings.mapSearchVoiceListening,
          }}
          onSearch={handleSmartSearch}
        />

        {smartSession ? (
          <div
            className="rounded-2xl border border-amber-200/90 bg-amber-50/95 p-3 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40"
            role="region"
            aria-label={strings.mapSearchInputAria}
          >
            <div className="flex gap-2">
              <p className="min-w-0 flex-1 text-sm text-amber-950 dark:text-amber-100">
                {smartSession.payload.message}
              </p>
              <button
                type="button"
                onClick={() => setSmartSession(null)}
                aria-label={strings.mapSearchDismiss}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg text-amber-800 hover:bg-amber-200/70 dark:text-amber-200 dark:hover:bg-amber-900/60",
                  focusRing,
                )}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            {smartSession.payload.actions.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {smartSession.payload.actions.map((a, idx) => {
                  if (a.type === "call") {
                    const href = phoneToTelHref(a.phone);
                    if (!href) return null;
                    return (
                      <a
                        key={`call-${idx}-${a.phone}`}
                        href={href}
                        className={cn(
                          "inline-flex items-center rounded-full border border-amber-300/90 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-100 dark:hover:bg-amber-900/50",
                          focusRing,
                        )}
                      >
                        {a.label}
                      </a>
                    );
                  }
                  const dest = { lat: a.lat, lng: a.lng };
                  return (
                    <a
                      key={`dir-${idx}-${a.lat}-${a.lng}`}
                      href={googleMapsDirectionsUrl(dest, origin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center rounded-full border border-amber-300/90 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-100 dark:hover:bg-amber-900/50",
                        focusRing,
                      )}
                    >
                      {a.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

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
          <LeafletMap
            ref={leafletRef}
            className="absolute inset-0 z-[1] h-full w-full"
            places={sortedFiltered}
            origin={origin}
            bounds={bounds}
            userLocationActive={userLocationActive}
            selectedId={selectedId}
            infoboxPlace={infoboxPlace}
            tileAttribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            onSelectPlace={selectPlace}
            onMapBackgroundClick={() => setInfoboxPlace(null)}
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
                if (userLocationActive) return;
                if (sortedFiltered[0]) {
                  setPickedId(sortedFiltered[0].id);
                  setInfoboxPlace(sortedFiltered[0]);
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

          {infoboxPlace && infoboxAnchor ? (
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
                <MapPlaceInfoBox
                  place={infoboxPlace}
                  locale={locale}
                  categoryLabel={strings.filters[infoboxPlace.category]}
                  distanceLabel={distanceLabelFor(infoboxPlace)}
                  servicesLine={shortServicesLine(infoboxPlace)}
                  strings={{
                    close: strings.routeModalClose,
                    details: strings.mapInfoBoxDetails,
                    directions: strings.mapInfoBoxDirections,
                    share: strings.mapInfoBoxShare,
                    call: strings.mapInfoBoxCall,
                    copyAddress: strings.mapInfoBoxCopyAddress,
                  }}
                  onClose={() => setInfoboxPlace(null)}
                  onOpenDetails={() => openDetailsModal(infoboxPlace)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 lg:max-w-[42%]">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-slate-50">
            {strings.nearYou}
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-400">
            {sortedFiltered.length}
          </span>
        </div>

        {sortedFiltered.length === 0 ? (
          <EmptyState
            title={strings.emptyTitle}
            description={strings.emptyDescription}
            icon={MapPin}
            className="min-h-[200px] py-10"
          />
        ) : (
          <ul className="flex max-h-[min(52vh,480px)] flex-col gap-2 overflow-y-auto overscroll-y-contain pb-2 lg:max-h-[calc(100vh-220px)]">
            {sortedFiltered.map((place) => (
              <li key={place.id}>
                <PlaceCard
                  place={place}
                  icon={mapCategoryIcon(place.category)}
                  selected={Boolean(selected && selected.id === place.id)}
                  onSelect={() => selectPlace(place)}
                  locale={locale}
                  distanceLabel={distanceLabelFor(place)}
                  callLabel={strings.callNumber}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <PlaceRouteModal
        open={modalPlace != null}
        onClose={() => setModalPlace(null)}
        place={modalPlace}
        origin={origin}
        locale={locale}
        strings={{
          close: strings.routeModalClose,
          openDirections: strings.routeModalOpenDirections,
          mapPreviewHint: strings.routeModalMapPreviewHint,
          directionsEmbedHint: strings.routeModalDirectionsHint,
          backToPreview: strings.routeModalBackToPreview,
          openRoute: strings.openRoute,
          labelDescription: strings.routeModalLabelDescription,
          labelServices: strings.routeModalLabelServices,
          labelHours: strings.routeModalLabelHours,
          labelHotline: strings.routeModalLabelHotline,
          labelDutyPhone: strings.routeModalLabelDutyPhone,
          labelDutyOfficer: strings.routeModalLabelDutyOfficer,
          labelBangla: strings.routeModalLabelBangla,
          labelEnglish: strings.routeModalLabelEnglish,
          callNumber: strings.callNumber,
        }}
      />
    </div>
  );
}
