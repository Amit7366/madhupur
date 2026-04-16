import type { MapPlace, MapPlaceCategory } from "@/lib/dummy/map-places";
import { MAP_PLACE_FALLBACK_IMAGE, MAP_PLACES } from "@/lib/dummy/map-places";

/** Response row from GET /api/v1/places */
export type ApiPlaceDto = {
  id: string;
  /** When set, matches `MAP_PLACES[].id` — map UI uses this as stable `MapPlace.id`. */
  seedKey?: string;
  category: MapPlaceCategory;
  name: { bn: string; en: string };
  address: { bn: string; en: string };
  description: { bn: string; en: string };
  services: { bn: string; en: string };
  hours: { bn: string; en: string };
  image: string;
  hotline?: string;
  dutyPhone?: string;
  dutyOfficer: { bn: string; en: string };
  lat: number;
  lng: number;
  galleryImages?: string[];
  tags?: string[];
};

export type CreatePlacePayload = {
  category: MapPlaceCategory;
  name: { bn: string; en: string };
  address: { bn: string; en: string };
  description: { bn: string; en: string };
  services: { bn: string; en: string };
  hours: { bn: string; en: string };
  image?: string;
  hotline?: string;
  dutyPhone?: string;
  dutyOfficer: { bn: string; en: string };
  lat: number;
  lng: number;
  contributor?: { name?: string; contact?: string };
};

export function apiPlaceToMapPlace(row: ApiPlaceDto): MapPlace {
  return {
    id: row.seedKey?.trim() || row.id,
    category: row.category,
    name: row.name,
    address: row.address,
    description: row.description,
    services: row.services,
    hours: row.hours,
    image: row.image?.trim() || MAP_PLACE_FALLBACK_IMAGE,
    hotline: row.hotline?.trim() || undefined,
    dutyPhone: row.dutyPhone?.trim() || undefined,
    dutyOfficer: row.dutyOfficer,
    lat: row.lat,
    lng: row.lng,
  };
}

export function getPublicApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

/**
 * Merge static baseline with GET /places rows.
 *
 * When the API returns at least one document, the list is **exactly** those rows (DB is source of
 * truth). The old “static fallback for seeds missing from the response” kept demo pins visible
 * after a seed was removed from MongoDB → UI showed more markers than the DB count.
 *
 * When the API returns an empty array (empty DB), fall back to static `MAP_PLACES` for offline demo.
 */
export function mergeSeedPlacesWithApiDtos(rows: ApiPlaceDto[]): MapPlace[] {
  if (rows.length === 0) {
    return [...MAP_PLACES];
  }
  return rows.map(apiPlaceToMapPlace);
}

/** Dispatched after contribute so the map refetches even when SSR cannot reach the API. */
export const MAP_PLACES_REFRESH_EVENT = "madhupur:map-places-refresh";

export function requestMapPlacesRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MAP_PLACES_REFRESH_EVENT));
}

function parsePlacesResponse(json: unknown): ApiPlaceDto[] | null {
  if (
    !json ||
    typeof json !== "object" ||
    !("data" in json) ||
    !Array.isArray((json as { data: unknown }).data)
  ) {
    return null;
  }
  return (json as { data: ApiPlaceDto[] }).data;
}

/**
 * Browser fetch of GET /places merged with static seed. Returns `null` if URL missing or request failed.
 * Use this in the map UI so data matches the contribute form (both use NEXT_PUBLIC_API_URL).
 */
export async function fetchMergedMapPlacesFromApi(): Promise<MapPlace[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  try {
    const res = await fetch(`${base}/api/v1/places`, { cache: "no-store" });
    if (!res.ok) return null;
    const rows = parsePlacesResponse(await res.json());
    if (!rows) return null;
    return mergeSeedPlacesWithApiDtos(rows);
  } catch {
    return null;
  }
}

/** @deprecated Prefer {@link fetchMergedMapPlacesFromApi} for clarity; this returns `[]` when the API is unavailable. */
export async function fetchPlacesFromApi(): Promise<MapPlace[]> {
  const merged = await fetchMergedMapPlacesFromApi();
  return merged ?? [];
}

export type SubmitPlaceResult =
  | { ok: true; data: ApiPlaceDto }
  | { ok: false; status: number; message: string };

function formatApiFailure(json: unknown, status: number): string {
  if (!json || typeof json !== "object") {
    return status === 0      ? "Network error — check NEXT_PUBLIC_API_URL, CORS (CLIENT_ORIGINS), and that the API is running."
      : `HTTP ${status}`;
  }
  const o = json as Record<string, unknown>;
  if (typeof o.error === "string" && o.error.trim()) {
    const err = o.error.trim();
    if (o.details && typeof o.details === "object") {
      try {
        return `${err}: ${JSON.stringify(o.details)}`;
      } catch {
        return err;
      }
    }
    return err;
  }
  return `HTTP ${status}`;
}

export async function submitPlaceToApi(
  body: CreatePlacePayload,
): Promise<SubmitPlaceResult> {
  const base = getPublicApiBaseUrl();
  if (!base) {
    return {
      ok: false,
      status: 0,
      message:
        "NEXT_PUBLIC_API_URL is not set — add it to .env.local (e.g. http://localhost:4000).",
    };
  }
  if (!/^https?:\/\//i.test(base)) {
    return {
      ok: false,
      status: 0,
      message: `API URL must start with http:// or https:// (got: ${base})`,
    };
  }

  const payload = {
    ...body,
    image: body.image?.trim() || undefined,
    hotline: body.hotline?.trim() || undefined,
    dutyPhone: body.dutyPhone?.trim() || undefined,
    contributor:
      body.contributor?.name?.trim() || body.contributor?.contact?.trim()
        ? {
            name: body.contributor?.name?.trim() || undefined,
            contact: body.contributor?.contact?.trim() || undefined,
          }
        : undefined,
  };

  try {
    const res = await fetch(`${base}/api/v1/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: formatApiFailure(json, res.status),
      };
    }

    if (
      !json ||
      typeof json !== "object" ||
      !("data" in json) ||
      !(json as { data: unknown }).data
    ) {
      return {
        ok: false,
        status: res.status,
        message: "Server returned success but no place data.",
      };
    }
    return { ok: true, data: (json as { data: ApiPlaceDto }).data };
  } catch (e) {
    const hint =
      e instanceof TypeError
        ? " (often CORS, wrong URL, or API offline)"
        : "";
    const msg = e instanceof Error ? `${e.message}${hint}` : `Unknown error${hint}`;
    return { ok: false, status: 0, message: msg };
  }
}
