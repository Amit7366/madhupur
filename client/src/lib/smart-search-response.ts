import {
  placeText,
  type MapPlace,
} from "@/lib/dummy/map-places";
import type { Locale } from "@/lib/i18n";
import {
  formatDistanceKm,
  haversineKm,
  type LatLng,
} from "@/lib/geo";
import type {
  MapSearchFiltersResult,
  MapSearchUserIntent,
} from "@/lib/map-search-filters";

export type SmartSearchPipelineInput = {
  userInput: string;
  userIntent: MapSearchUserIntent;
  filtersAndRanking: MapSearchFiltersResult;
  /** Full place list (e.g. MAP_PLACES). */
  services: MapPlace[];
  currentTime: Date;
  /** User or map default center for distance. */
  userOrigin: LatLng;
  /** Distance units; defaults to Bangla কিমি / মি. */
  distanceUnits?: { unitKm: string; unitM: string };
};

export type SmartSearchPlaceRow = {
  /** Stable id into `MAP_PLACES` / map state */
  placeId: string;
  name: string;
  distance: string;
  isOpen: boolean;
  phone: string;
  lat: number;
  lng: number;
};

export type SmartSearchAction =
  | { type: "call"; label: string; phone: string }
  | { type: "direction"; label: string; lat: number; lng: number };

export type SmartSearchResponsePayload = {
  message: string;
  places: SmartSearchPlaceRow[];
  actions: SmartSearchAction[];
};

/** Bangla copy (escaped for stable source encoding). */
const BN = {
  none:
    "\u0986\u09aa\u09a8\u09be\u09b0 \u09b6\u09b0\u09cd\u09a4\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09ae\u09bf\u09b2\u09c7 \u098f\u09ae\u09a8 \u0995\u09bf\u099b\u09c1 \u09aa\u09be\u0993\u09af\u09bc\u09be \u09af\u09be\u09af\u09bc\u09a8\u09bf\u0964 \u0985\u09a8\u09cd\u09af \u09ac\u09bf\u09ad\u09be\u0997 \u09ac\u09be \u09ae\u09be\u09a8\u099a\u09bf\u09a4\u09cd\u09b0\u09c7 \u09a6\u09c7\u0996\u09c7 \u09a8\u09bf\u09a8\u0964",
  urgentPrefix:
    "\u099c\u09b0\u09c1\u09b0\u09bf \u09aa\u09cd\u09a0\u09df\u09cb\u099c\u09a8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09a6\u09cd\u09b0\u09c1\u09a4 \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8\u0964 \u0995\u09be\u099b\u09c7\u09b0 \u098f\u0995\u099f\u09bf \u09ac\u09bf\u0995\u09b2\u09cd\u09aa:",
  foundPrefix: "\u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09be\u099b\u09c7 ",
  foundMid:
    "\u099f\u09bf \u0989\u09aa\u09af\u09c1\u0995\u09cd\u09a4 \u09b8\u09cd\u09a5\u09be\u09a8 \u0986\u099b\u09c7\u0964 \u09b8\u09ac\u099a\u09c7\u09af\u09bc\u09c7 \u0995\u09be\u099b\u09c7: ",
  lateNight:
    " \u09b0\u09be\u09a4\u09c7\u09b0 \u09b8\u09ae\u09af\u09bc \u09e8\u09ef \u0998\u09a3\u09cd\u09f0\u09be/\u099a\u09b2\u09ae\u09be\u09a8 \u09b8\u09c7\u09ac\u09be\u0995\u09c7 \u0985\u0997\u09cd\u09b0\u09be\u09a7\u09bf\u0995\u09be\u09b0 \u09a6\u09c7\u09af\u09bc\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964",
} as const;

function containsBanglaScript(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

function textBlob(place: MapPlace): string {
  return `${place.description.bn} ${place.description.en} ${place.services.bn} ${place.services.en} ${place.hours.bn} ${place.hours.en}`.toLowerCase();
}

function mentions24h(place: MapPlace): boolean {
  const t = textBlob(place);
  return (
    /24\s*h|24h|24\/7|round[\s-]*the[\s-]*clock/i.test(t) ||
    /(\u09e8\u09ef|\u09ef\u09e6)\s*\u0998\u09a3\u09cd\u09f0\u09be/.test(t) ||
    /\u099a\u09ac\u09cd\u09ac\u09bf\u09b6\s*\u0998\u09a3\u09cd\u09f0\u09be/.test(t) ||
    /\b16263\b/.test(t)
  );
}

function mentionsEmergency(place: MapPlace): boolean {
  return /emergency|urgent|ambulance|জরুরি|জরুরী|\u098f\u09ae\u09cd\u09ac\u09c1\u09b2\u09c7\u09a8\u09b8/i.test(
    textBlob(place),
  );
}

function isLateNightLocal(now: Date): boolean {
  const h = now.getHours();
  return h >= 23 || h < 5;
}

/**
 * Heuristic “open now” from text + coarse time-of-day (no structured hours).
 */
export function estimatePlaceOpenNow(place: MapPlace, now: Date): boolean {
  if (mentions24h(place)) return true;
  if (place.category === "hospital" && mentionsEmergency(place)) return true;

  const h = now.getHours();
  if (h >= 8 && h < 20) return true;

  if (h >= 20 || h < 8) {
    if (mentions24h(place)) return true;
    if (place.category === "hospital") return true;
    if (place.category === "police") return true;
    if (place.category === "fire_service") return true;
    if (place.category === "pharmacy") return true;
    if (place.category === "ambulance") return true;
    if (place.category === "fuel_station") return true;
    if (place.category === "atm") return true;
    return false;
  }

  return true;
}

function nightServiceScore(place: MapPlace, now: Date): number {
  if (!isLateNightLocal(now)) return 0;
  return mentions24h(place) ? 2 : mentionsEmergency(place) ? 1 : 0;
}

function emergencyRankScore(place: MapPlace, now: Date): number {
  return (mentionsEmergency(place) ? 1 : 0) + nightServiceScore(place, now);
}

function openRankScore(place: MapPlace, now: Date): number {
  return estimatePlaceOpenNow(place, now) ? 1 : 0;
}

function ratingTieBreak(place: MapPlace): number {
  let h = 0;
  for (let i = 0; i < place.id.length; i++) {
    h = (h * 31 + place.id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 1000;
}

function pickDisplayLocale(userInput: string): Locale {
  return containsBanglaScript(userInput) ? "bn" : "en";
}

function primaryPhone(place: MapPlace): string {
  return (place.hotline?.trim() || place.dutyPhone?.trim() || "").trim();
}

/**
 * Filter, rank (distance → emergency → open → rating), take top 2–3, build message + actions.
 */
export function buildSmartSearchResponse(
  input: SmartSearchPipelineInput,
): SmartSearchResponsePayload {
  const {
    userInput,
    userIntent: _userIntent,
    filtersAndRanking,
    services,
    currentTime,
    userOrigin,
    distanceUnits,
  } = input;
  void _userIntent;

  const filters = filtersAndRanking.filters;
  const unitKm = distanceUnits?.unitKm ?? "\u0995\u09bf\u09ae\u09bf";
  const unitM = distanceUnits?.unitM ?? "\u09ae\u09bf";
  const lang = pickDisplayLocale(userInput);
  const useBn = lang === "bn";
  const lateNight = isLateNightLocal(currentTime);

  let candidates = services.filter((p) => p.category === filters.category);

  if (filters.isOpen) {
    candidates = candidates.filter((p) => estimatePlaceOpenNow(p, currentTime));
  }

  const distKm = (p: MapPlace) => haversineKm(userOrigin, p);

  const sorted = [...candidates].sort((a, b) => {
    const da = distKm(a);
    const db = distKm(b);
    if (Math.abs(da - db) > 1e-6) return da - db;

    const ea = emergencyRankScore(a, currentTime);
    const eb = emergencyRankScore(b, currentTime);
    if (eb !== ea) return eb - ea;

    const oa = openRankScore(a, currentTime);
    const ob = openRankScore(b, currentTime);
    if (ob !== oa) return ob - oa;

    return ratingTieBreak(b) - ratingTieBreak(a);
  });

  const resultCount =
    sorted.length === 0 ? 0 : sorted.length === 1 ? 1 : Math.min(3, sorted.length);
  const effectiveTop = sorted.slice(0, resultCount);

  let message: string;
  if (effectiveTop.length === 0) {
    message = useBn ? BN.none : "No nearby services match your filters. Try another category or the map.";
  } else {
    const first = effectiveTop[0];
    const name = placeText(first.name, lang);
    const d0 = formatDistanceKm(distKm(first), unitKm, unitM);

    if (filters.emergency) {
      message = useBn
        ? `${BN.urgentPrefix} ${name} (${d0})\u0964`
        : `Urgent situation — contact help quickly. A nearby option: ${name} (${d0}).`;
    } else {
      message = useBn
        ? `${BN.foundPrefix} ${effectiveTop.length}${BN.foundMid} ${name} (${d0})\u0964`
        : `Found ${effectiveTop.length} suitable place(s). Nearest: ${name} (${d0}).`;
    }

    if (lateNight && effectiveTop.some((p) => mentions24h(p)) && useBn) {
      message += BN.lateNight;
    } else if (lateNight && effectiveTop.some((p) => mentions24h(p)) && !useBn) {
      message += " Late night: 24/7 services are prioritized.";
    }
  }

  const places: SmartSearchPlaceRow[] = effectiveTop.map((p) => {
    const phone = primaryPhone(p);
    return {
      placeId: p.id,
      name: placeText(p.name, lang),
      distance: formatDistanceKm(distKm(p), unitKm, unitM),
      isOpen: estimatePlaceOpenNow(p, currentTime),
      phone: phone || "",
      lat: p.lat,
      lng: p.lng,
    };
  });

  const callLabel = useBn ? "\u0995\u09b2 \u0995\u09b0\u09c1\u09a8" : "Call";
  const dirLabel = useBn
    ? "\u09a6\u09bf\u0995 \u09a8\u09bf\u09b0\u09cd\u09a6\u09c7\u09b6\u09a8\u09be"
    : "Directions";

  const actions: SmartSearchAction[] = [];
  for (const p of effectiveTop) {
    const phone = primaryPhone(p);
    if (phone) {
      actions.push({ type: "call", label: callLabel, phone });
    }
    actions.push({
      type: "direction",
      label: dirLabel,
      lat: p.lat,
      lng: p.lng,
    });
  }

  return { message, places, actions };
}

export function smartSearchResponseToJson(
  input: SmartSearchPipelineInput,
): string {
  return JSON.stringify(buildSmartSearchResponse(input));
}
