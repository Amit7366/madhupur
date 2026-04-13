import { MAP_PLACES, type MapPlace } from "@/lib/dummy/map-places";
import {
  mergeSeedPlacesWithApiDtos,
  type ApiPlaceDto,
} from "@/lib/map-place-api";

function serverApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).replace(/\/$/, "");
}

/**
 * Server-only: published places from the Express API, or static `MAP_PLACES` when the API is unreachable or returns an empty list (see `mergeSeedPlacesWithApiDtos`).
 */
export async function loadMapPlacesForPage(): Promise<MapPlace[]> {
  const base = serverApiBase();
  if (!base) return [...MAP_PLACES];
  try {
    const res = await fetch(`${base}/api/v1/places`, {
      cache: "no-store",
    });
    if (!res.ok) return [...MAP_PLACES];
    const json: unknown = await res.json();
    if (
      !json ||
      typeof json !== "object" ||
      !("data" in json) ||
      !Array.isArray((json as { data: unknown }).data)
    ) {
      return [...MAP_PLACES];
    }
    const rows = (json as { data: ApiPlaceDto[] }).data;
    return mergeSeedPlacesWithApiDtos(rows);
  } catch {
    return [...MAP_PLACES];
  }
}
