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

function formatCategoryLabel(category: string): string {
  return category.replace(/_/g, " ");
}

/** Repeating 5-cell bento: large 2×2, tall 1×2, three singles (3-column dense grid). */
function bentoLayoutClass(index: number): string {
  const i = index % 5;
  if (i === 0) {
    return "md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-[clamp(260px,34vw,440px)]";
  }
  if (i === 1) {
    return "md:col-span-1 md:row-span-2 min-h-[220px] md:min-h-[clamp(260px,34vw,440px)]";
  }
  return "min-h-[200px] md:min-h-[clamp(180px,24vw,280px)]";
}

function displayTitleFont(locale: Locale): string {
  return locale === "bn" ? "font-tourism-display-bn" : "font-tourism-display";
}

function cardTagline(p: TourismPlaceDto, locale: Locale): string {
  const cat = formatCategoryLabel(p.category);
  const desc = (locale === "bn" ? p.description.bn : p.description.en).trim();
  if (!desc) return cat;
  const short = desc.length > 80 ? `${desc.slice(0, 77)}…` : desc;
  return `${cat} · ${short}`;
}

function isSpecialOfferCategory(category: string): boolean {
  return category === "resort" || category === "guest_house";
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
    <div className="space-y-10">
      <div
        className={cn(
          "rounded-3xl border border-slate-200/90 bg-white/80 p-4 shadow-lg shadow-slate-900/[0.06] backdrop-blur-xl",
          "dark:border-slate-600/50 dark:bg-slate-900/70 sm:p-6",
        )}
      >
        <label htmlFor="tourism-search" className="sr-only">
          {t("pages.tourism.searchLabel")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="tourism-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("pages.tourism.searchPlaceholder")}
            className={cn(
              "w-full rounded-2xl border border-slate-200/90 bg-white/90 py-3.5 pl-11 pr-4 text-sm text-slate-900",
              "placeholder:text-slate-400 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25",
              "dark:border-slate-600 dark:bg-slate-950/80 dark:text-slate-100",
            )}
            autoComplete="off"
          />
        </div>
        {suggestions.length > 0 && search.trim().length >= 2 ? (
          <ul
            className="mt-3 max-h-56 overflow-auto rounded-2xl border border-slate-200/80 bg-white/95 text-sm shadow-xl backdrop-blur-md dark:border-slate-600 dark:bg-slate-900/95"
            role="listbox"
          >
            {suggestions.map((p) => (
              <li key={p.id} role="option">
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-amber-50/80 dark:hover:bg-slate-800/80"
                  onClick={() => {
                    setSelected(p);
                    setSearch(placePrimaryText(p, locale));
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <span
                      className={cn(
                        "font-medium text-slate-900 dark:text-slate-100",
                        displayTitleFont(locale),
                      )}
                    >
                      {placePrimaryText(p, locale)}
                    </span>
                    <span className="mt-0.5 block text-xs capitalize text-slate-500 dark:text-slate-400">
                      {formatCategoryLabel(p.category)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
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
                "rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition",
                focusRing,
                filter === key
                  ? "bg-amber-600 text-white shadow-md shadow-amber-900/20 dark:bg-amber-600"
                  : "border border-slate-200/90 bg-white/70 text-slate-700 hover:border-amber-300/60 hover:bg-amber-50/50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-amber-500/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!loading && places && places.length > 0 ? (
        <header className="space-y-2 px-0.5">
          <h2
            className={cn(
              displayTitleFont(locale),
              "text-[1.65rem] font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white",
            )}
          >
            {t("pages.tourism.collectionTitle")}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400">
            {t("pages.tourism.collectionSubtitle")}
          </p>
        </header>
      ) : null}

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
          className="grid grid-cols-1 gap-2 sm:gap-3 md:auto-rows-[minmax(0,1fr)] md:grid-cols-3 md:grid-flow-dense"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {filtered.map((p, index) => {
            const img =
              p.image?.trim() || p.galleryImages?.[0] || MAP_PLACE_FALLBACK_IMAGE;
            const i = index % 5;
            const isFeaturedTile = i === 0 || i === 1;
            const showEditorsPick = i === 0;
            const showSpecial = isSpecialOfferCategory(p.category);
            return (
              <motion.li
                key={p.id}
                className={bentoLayoutClass(index)}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className={cn(
                    "group relative flex h-full min-h-[inherit] w-full overflow-hidden rounded-2xl text-left",
                    "shadow-lg shadow-slate-900/15 ring-1 ring-black/10 transition duration-500",
                    "hover:shadow-2xl hover:ring-amber-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:ring-white/10",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs */}
                  <img
                    src={img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
                    {showEditorsPick ? (
                      <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-sm dark:bg-white/90">
                        {t("pages.tourism.editorsPick")}
                      </span>
                    ) : (
                      <span />
                    )}
                    {showSpecial ? (
                      <span className="rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                        {t("pages.tourism.specialOffer")}
                      </span>
                    ) : null}
                  </div>
                  <div className="relative mt-auto flex flex-col justify-end p-4 sm:p-5 md:p-6">
                    {isFeaturedTile ? (
                      <p
                        className="font-tourism-script text-2xl leading-none text-amber-200/95 sm:text-3xl"
                        aria-hidden
                      >
                        {t("pages.tourism.explore")}
                      </p>
                    ) : null}
                    <p
                      className={cn(
                        "mt-1 line-clamp-2 text-xs italic text-white/85 sm:text-sm md:line-clamp-2",
                        displayTitleFont(locale),
                      )}
                    >
                      {cardTagline(p, locale)}
                    </p>
                    <h3
                      className={cn(
                        "mt-2 text-xl font-semibold leading-[1.15] tracking-tight text-white sm:text-2xl md:text-3xl",
                        displayTitleFont(locale),
                      )}
                    >
                      {placePrimaryText(p, locale)}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
                      <Compass className="h-3.5 w-3.5 opacity-90" />
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
            className="fixed inset-0 z-[240] flex items-end justify-center sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t("pages.tourism.close")}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className={cn(
                "relative z-[241] flex max-h-[min(94vh,52rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-zinc-50 shadow-2xl ring-1 ring-black/10",
                "sm:max-h-[min(92vh,48rem)] sm:max-w-2xl sm:rounded-[1.75rem] lg:max-w-4xl dark:bg-zinc-950 dark:ring-white/10",
              )}
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
            >
              <div className="relative h-[min(42vh,320px)] shrink-0 overflow-hidden bg-slate-900 sm:h-[min(46vh,380px)] lg:h-[min(48vh,420px)]">
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
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                        aria-hidden
                      />
                      {imgs.length > 1 ? (
                        <>
                          <button
                            type="button"
                            className={cn(
                              "absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55",
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
                              "absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55",
                              focusRing,
                            )}
                            onClick={() =>
                              setGalleryIdx((i) => (i + 1) % imgs.length)
                            }
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      ) : null}
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-stretch">
                        {imgs.length > 1 ? (
                          <div className="flex justify-center gap-1.5 pb-1">
                            {imgs.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                className={cn(
                                  "h-2 w-2 rounded-full transition",
                                  i === safeIdx ? "bg-white" : "bg-white/35 hover:bg-white/55",
                                )}
                                onClick={() => setGalleryIdx(i)}
                              />
                            ))}
                          </div>
                        ) : null}
                        <div className="p-5 sm:p-8 lg:p-10">
                        {isSpecialOfferCategory(selected.category) ? (
                          <span className="mb-2 inline-block rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                            {t("pages.tourism.specialOffer")}
                          </span>
                        ) : null}
                        <p className="font-tourism-script text-3xl text-amber-200/95 sm:text-4xl">
                          {t("pages.tourism.explore")}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                          {formatCategoryLabel(selected.category)}
                        </p>
                        <h2
                          className={cn(
                            "mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl",
                            displayTitleFont(locale),
                          )}
                        >
                          {placePrimaryText(selected, locale)}
                        </h2>
                        <p className="mt-3 flex items-start gap-2 text-sm text-white/85">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-200/90" />
                          {locale === "bn" ? selected.address.bn : selected.address.en}
                        </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className={cn(
                    "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50",
                    focusRing,
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 lg:px-10">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openDirectionsExternal()}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:bg-amber-500 min-[420px]:flex-none",
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
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300/60 hover:bg-amber-50/40 min-[420px]:flex-none dark:border-slate-600 dark:bg-zinc-900 dark:text-slate-100 dark:hover:border-amber-500/40",
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
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm dark:border-slate-700">
                    <p className="bg-slate-100/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
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
                      className="w-full border-t border-slate-200 py-3 text-center text-xs font-bold uppercase tracking-wide text-amber-700 dark:border-slate-700 dark:text-amber-400"
                    >
                      {t("pages.tourism.openInGoogleMaps")}
                    </button>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-6 text-sm sm:grid-cols-1 lg:grid-cols-3 lg:gap-8">
                  <div className="lg:col-span-2 lg:space-y-6">
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {t("pages.tourism.about")}
                      </h3>
                      <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
                        {locale === "bn" ? selected.description.bn : selected.description.en}
                      </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {t("pages.tourism.hours")}
                        </h3>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">
                          {locale === "bn" ? selected.hours.bn : selected.hours.en}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {t("pages.tourism.services")}
                        </h3>
                        <p className="mt-2 text-slate-700 dark:text-slate-300">
                          {locale === "bn" ? selected.services.bn : selected.services.en}
                        </p>
                      </div>
                    </div>
                  </div>

                  {allImages(selected).length > 1 ? (
                    <div className="lg:col-span-1">
                      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {t("pages.tourism.gallery")}
                      </h3>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                        {allImages(selected).map((u, i) => (
                          <button
                            key={u + i}
                            type="button"
                            onClick={() => setGalleryIdx(i)}
                            className={cn(
                              "aspect-[4/3] overflow-hidden rounded-xl ring-2 ring-transparent transition hover:opacity-95",
                              galleryIdx === i && "ring-amber-500",
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={u} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {selected.hotline ? (
                  <a
                    href={`tel:${selected.hotline.replace(/\s+/g, "")}`}
                    className={cn(
                      "mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300/50 hover:bg-amber-50/30 dark:border-slate-600 dark:text-slate-100 dark:hover:border-amber-500/30",
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
