"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ImageIcon,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  X,
} from "lucide-react";
import { MAP_PLACE_FALLBACK_IMAGE } from "@/lib/dummy/map-places";
import {
  googleDirectionsEmbedUrl,
  googleMapsDirectionsUrl,
} from "@/lib/google-maps";
import type { TourismPlaceDto } from "@/lib/tourism-api";
import { fetchTourismPlacesFromApi } from "@/lib/tourism-api";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

type TourismFilter = "all" | "nature" | "heritage" | "stay" | "food";

const NATURE_CAT = new Set<string>(["park", "tourist_spot"]);
const HERITAGE_CAT = new Set<string>(["historical_place"]);
const STAY_CAT = new Set<string>(["resort", "guest_house"]);
const FOOD_CAT = new Set<string>(["restaurant", "hotel_food", "cafe", "fast_food"]);

function placePrimaryText(p: TourismPlaceDto, locale: Locale): string {
  const n = locale === "bn" ? p.name.bn : p.name.en;
  return n.trim() || p.name.en.trim() || p.name.bn.trim();
}

function placeSecondaryText(p: TourismPlaceDto, locale: Locale): string {
  const parts = [
    locale === "bn" ? p.address.bn : p.address.en,
    locale === "bn" ? p.description.bn : p.description.en,
  ];
  return parts.join(" ").toLowerCase();
}

function matchesFilter(p: TourismPlaceDto, f: TourismFilter): boolean {
  if (f === "all") return true;
  const c = p.category;
  if (f === "nature") return NATURE_CAT.has(c);
  if (f === "heritage") return HERITAGE_CAT.has(c);
  if (f === "stay") return STAY_CAT.has(c);
  if (f === "food") return FOOD_CAT.has(c);
  return true;
}

function matchesSearch(p: TourismPlaceDto, q: string, locale: Locale): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
    const hay = [
    placePrimaryText(p, locale),
    placeSecondaryText(p, locale),
    p.category,
    ...(p.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

function allImages(p: TourismPlaceDto): string[] {
  const main = p.image?.trim();
  const rest = p.galleryImages ?? [];
  const out: string[] = [];
  if (main) out.push(main);
  for (const u of rest) {
    if (u && !out.includes(u)) out.push(u);
  }
  if (out.length === 0) out.push(MAP_PLACE_FALLBACK_IMAGE);
  return out;
}

export function TourismExplorer() {
  const { locale, t } = useI18n();
  const [places, setPlaces] = useState<TourismPlaceDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TourismFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TourismPlaceDto | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [showRouteEmbed, setShowRouteEmbed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchTourismPlacesFromApi();
    setPlaces(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    setGalleryIdx(0);
    setShowRouteEmbed(false);
    setUserLoc(null);
    setLocError(null);
  }, [selected]);

  const filtered = useMemo(() => {
    if (!places) return [];
    return places.filter(
      (p) =>
        matchesFilter(p, filter) && matchesSearch(p, search, locale),
    );
  }, [places, filter, search, locale]);

  const suggestions = useMemo(() => {
    if (!places || !search.trim()) return [] as TourismPlaceDto[];
    return places
      .filter((p) => matchesSearch(p, search, locale))
      .slice(0, 6);
  }, [places, search, locale]);

  const requestLocation = useCallback(() => {
    if (!selected) return;
    setLocating(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocating(false);
      setLocError(t("pages.tourism.locationUnsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
        setShowRouteEmbed(true);
      },
      () => {
        setLocating(false);
        setLocError(t("pages.tourism.locationDenied"));
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 120_000 },
    );
  }, [selected, t]);

  const openDirectionsExternal = useCallback(() => {
    if (!selected) return;
    const dest = { lat: selected.lat, lng: selected.lng };
    const url = googleMapsDirectionsUrl(dest, userLoc ?? undefined);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [selected, userLoc]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:p-5">
        <label htmlFor="tourism-search" className="sr-only">
          {t("pages.tourism.searchLabel")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="tourism-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("pages.tourism.searchPlaceholder")}
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900",
              "placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20",
              "dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100",
            )}
            autoComplete="off"
          />
        </div>
        {suggestions.length > 0 && search.trim().length >= 2 ? (
          <ul
            className="mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white text-sm shadow-md dark:border-slate-600 dark:bg-slate-900"
            role="listbox"
          >
            {suggestions.map((p) => (
              <li key={p.id} role="option">
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    setSelected(p);
                    setSearch(placePrimaryText(p, locale));
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {placePrimaryText(p, locale)}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      {p.category.replace(/_/g, " ")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["all", t("pages.tourism.filterAll")],
              ["nature", t("pages.tourism.filterNature")],
              ["heritage", t("pages.tourism.filterHeritage")],
              ["stay", t("pages.tourism.filterStay")],
              ["food", t("pages.tourism.filterFood")],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                focusRing,
                filter === key
                  ? "bg-emerald-800 text-white shadow-sm dark:bg-emerald-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("pages.tourism.loading")}
        </div>
      ) : places === null ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="font-medium text-amber-950 dark:text-amber-100">
            {t("pages.tourism.loadError")}
          </p>
          <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-200/90">
            {t("pages.tourism.apiHint")}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {t("pages.tourism.noResults")}
        </p>
      ) : (
        <motion.ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {filtered.map((p) => {
            const img =
              p.image?.trim() || p.galleryImages?.[0] || MAP_PLACE_FALLBACK_IMAGE;
            return (
              <motion.li
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className={cn(
                    "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-sm transition",
                    "hover:border-emerald-700/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80",
                    focusRing,
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs */}
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      {p.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold leading-snug text-slate-900 dark:text-slate-50">
                      {placePrimaryText(p, locale)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {locale === "bn" ? p.description.bn : p.description.en}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                      <Compass className="h-3.5 w-3.5" />
                      {t("pages.tourism.viewDetails")}
                    </span>
                  </div>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-[240] flex items-end justify-center sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t("pages.tourism.close")}
              className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
              onClick={() => setSelected(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className={cn(
                "relative z-[241] flex max-h-[min(94vh,48rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl",
                "sm:max-h-[min(90vh,44rem)] sm:rounded-2xl dark:border dark:border-slate-700 dark:bg-slate-950",
              )}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="relative shrink-0 bg-slate-900">
                {(() => {
                  const imgs = allImages(selected);
                  const safeIdx = Math.min(galleryIdx, imgs.length - 1);
                  const src = imgs[safeIdx] ?? MAP_PLACE_FALLBACK_IMAGE;
                  return (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="aspect-[16/10] w-full object-cover"
                      />
                      {imgs.length > 1 ? (
                        <>
                          <button
                            type="button"
                            className={cn(
                              "absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm",
                              focusRing,
                            )}
                            onClick={() =>
                              setGalleryIdx((i) => (i - 1 + imgs.length) % imgs.length)
                            }
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className={cn(
                              "absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm",
                              focusRing,
                            )}
                            onClick={() =>
                              setGalleryIdx((i) => (i + 1) % imgs.length)
                            }
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                            {imgs.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full transition",
                                  i === safeIdx ? "bg-white" : "bg-white/40",
                                )}
                                onClick={() => setGalleryIdx(i)}
                              />
                            ))}
                          </div>
                        </>
                      ) : null}
                    </>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className={cn(
                    "absolute right-2 top-2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm",
                    focusRing,
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                  {selected.category.replace(/_/g, " ")}
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {placePrimaryText(selected, locale)}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {locale === "bn" ? selected.address.bn : selected.address.en}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openDirectionsExternal()}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white min-[400px]:flex-none",
                      focusRing,
                    )}
                  >
                    <Navigation className="h-4 w-4" />
                    {t("pages.tourism.openDirections")}
                  </button>
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={locating}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 min-[400px]:flex-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                      focusRing,
                      locating && "opacity-60",
                    )}
                  >
                    {locating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Compass className="h-4 w-4" />
                    )}
                    {t("pages.tourism.routeFromHere")}
                  </button>
                </div>
                {locError ? (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{locError}</p>
                ) : null}

                {showRouteEmbed && userLoc ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      {t("pages.tourism.routePreview")}
                    </p>
                    <iframe
                      title={t("pages.tourism.routePreview")}
                      className="h-56 w-full bg-slate-100 sm:h-64"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={googleDirectionsEmbedUrl(userLoc, {
                        lat: selected.lat,
                        lng: selected.lng,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => openDirectionsExternal()}
                      className="w-full border-t border-slate-200 py-2 text-center text-xs font-semibold text-emerald-800 dark:border-slate-700 dark:text-emerald-300"
                    >
                      {t("pages.tourism.openInGoogleMaps")}
                    </button>
                  </div>
                ) : null}

                <div className="mt-5 space-y-3 text-sm">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("pages.tourism.about")}
                    </h3>
                    <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                      {locale === "bn" ? selected.description.bn : selected.description.en}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("pages.tourism.hours")}
                    </h3>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      {locale === "bn" ? selected.hours.bn : selected.hours.en}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("pages.tourism.services")}
                    </h3>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">
                      {locale === "bn" ? selected.services.bn : selected.services.en}
                    </p>
                  </div>
                </div>

                {allImages(selected).length > 1 ? (
                  <div className="mt-5">
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {t("pages.tourism.gallery")}
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages(selected).map((u, i) => (
                        <button
                          key={u + i}
                          type="button"
                          onClick={() => setGalleryIdx(i)}
                          className={cn(
                            "h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-transparent transition",
                            galleryIdx === i && "ring-emerald-600",
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.hotline ? (
                  <a
                    href={`tel:${selected.hotline.replace(/\s+/g, "")}`}
                    className={cn(
                      "mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100",
                      focusRing,
                    )}
                  >
                    <Phone className="h-4 w-4" />
                    {selected.hotline}
                  </a>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
