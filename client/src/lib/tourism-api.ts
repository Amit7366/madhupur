import type { ApiPlaceDto } from "@/lib/map-place-api";
import { getPublicApiBaseUrl } from "@/lib/map-place-api";

export type TourismPlaceDto = ApiPlaceDto;

function normalizeGallery(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((u): u is string => typeof u === "string" && u.length > 0);
}

function parsePlace(raw: unknown): TourismPlaceDto | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const category = typeof o.category === "string" ? o.category : null;
  const lat = typeof o.lat === "number" ? o.lat : null;
  const lng = typeof o.lng === "number" ? o.lng : null;
  const image = typeof o.image === "string" ? o.image : "";
  if (!id || !category || lat == null || lng == null) return null;

  const bilingual = (key: string) => {
    const v = o[key];
    if (!v || typeof v !== "object") return { bn: "", en: "" };
    const b = v as Record<string, unknown>;
    return {
      bn: typeof b.bn === "string" ? b.bn : "",
      en: typeof b.en === "string" ? b.en : "",
    };
  };

  return {
    id,
    seedKey: typeof o.seedKey === "string" ? o.seedKey : undefined,
    category: category as TourismPlaceDto["category"],
    name: bilingual("name"),
    address: bilingual("address"),
    description: bilingual("description"),
    services: bilingual("services"),
    hours: bilingual("hours"),
    dutyOfficer: bilingual("dutyOfficer"),
    image,
    galleryImages: normalizeGallery(o.galleryImages),
    hotline: typeof o.hotline === "string" ? o.hotline : undefined,
    dutyPhone: typeof o.dutyPhone === "string" ? o.dutyPhone : undefined,
    lat,
    lng,
    tags: Array.isArray(o.tags)
      ? o.tags.filter((x): x is string => typeof x === "string")
      : undefined,
  };
}

export async function fetchTourismPlacesFromApi(): Promise<TourismPlaceDto[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  try {
    const res = await fetch(`${base}/api/v1/places?tourism=1`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (
      !json ||
      typeof json !== "object" ||
      !("data" in json) ||
      !Array.isArray((json as { data: unknown }).data)
    ) {
      return null;
    }
    const out: TourismPlaceDto[] = [];
    for (const row of (json as { data: unknown[] }).data) {
      const p = parsePlace(row);
      if (p) out.push(p);
    }
    return out;
  } catch {
    return null;
  }
}
