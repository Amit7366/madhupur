import type { MapPlaceCategory } from "@/lib/dummy/map-places";

/**
 * Output of smart intent detection (Bangla/English) before this layer.
 * `keywords` are kept for future scoring; this module focuses on filters + ranking.
 */
export type MapSearchUserIntent = {
  category: MapPlaceCategory;
  emergency: boolean;
  keywords: string[];
  needsOpenNow: boolean;
};

/** Fixed ranking keys for map list / search results (nearest first, then tie-breakers). */
export const MAP_SEARCH_RANKING = [
  "distance",
  "emergency",
  "isOpen",
  "rating",
] as const;

export type MapSearchRankingKey = (typeof MAP_SEARCH_RANKING)[number];

export type MapSearchFiltersResult = {
  filters: {
    category: MapPlaceCategory;
    /** When true, restrict to places treated as open now (downstream may parse hours). */
    isOpen: boolean;
    /** When true, prioritize places with emergency-related services. */
    emergency: boolean;
  };
  ranking: readonly MapSearchRankingKey[];
};

/**
 * Converts detected user intent into filter flags and a stable ranking order.
 *
 * Rules:
 * - `category` is always passed through.
 * - `needsOpenNow === true` ⇒ `filters.isOpen === true`.
 * - `emergency` is passed through for prioritization (pair with ranking).
 */
export function buildMapSearchFiltersFromIntent(
  intent: MapSearchUserIntent,
): MapSearchFiltersResult {
  return {
    filters: {
      category: intent.category,
      isOpen: intent.needsOpenNow === true,
      emergency: intent.emergency === true,
    },
    ranking: [...MAP_SEARCH_RANKING],
  };
}

/** Same as {@link buildMapSearchFiltersFromIntent}, serialized as JSON (no whitespace). */
export function mapSearchFiltersToJsonString(
  intent: MapSearchUserIntent,
): string {
  return JSON.stringify(buildMapSearchFiltersFromIntent(intent));
}
