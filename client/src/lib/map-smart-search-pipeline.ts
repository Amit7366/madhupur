import { buildMapSearchFiltersFromIntent } from "@/lib/map-search-filters";
import { detectMapSearchIntent } from "@/lib/map-search-intent";
import type { MapPlace } from "@/lib/dummy/map-places";
import type { LatLng } from "@/lib/geo";
import {
  buildSmartSearchResponse,
  type SmartSearchResponsePayload,
} from "@/lib/smart-search-response";
import type { MapSearchFiltersResult, MapSearchUserIntent } from "@/lib/map-search-filters";

export type MapSmartSearchRunResult = {
  intent: MapSearchUserIntent;
  filtersAndRanking: MapSearchFiltersResult;
  payload: SmartSearchResponsePayload;
  rankedIds: string[];
  openOnly: boolean;
};

export function runMapSmartSearch(params: {
  query: string;
  places: MapPlace[];
  origin: LatLng;
  now?: Date;
  distanceUnits?: { unitKm: string; unitM: string };
}): MapSmartSearchRunResult {
  const intent = detectMapSearchIntent(params.query);
  const filtersAndRanking = buildMapSearchFiltersFromIntent(intent);
  const payload = buildSmartSearchResponse({
    userInput: params.query.trim(),
    userIntent: intent,
    filtersAndRanking,
    services: params.places,
    currentTime: params.now ?? new Date(),
    userOrigin: params.origin,
    distanceUnits: params.distanceUnits,
  });
  const rankedIds = payload.places.map((p) => p.placeId);
  return {
    intent,
    filtersAndRanking,
    payload,
    rankedIds,
    openOnly: filtersAndRanking.filters.isOpen,
  };
}
