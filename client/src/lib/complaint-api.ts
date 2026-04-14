import type { Bilingual } from "@/lib/dummy/map-places";
import type { Locale } from "@/lib/i18n";
import { getPublicApiBaseUrl } from "@/lib/map-place-api";

export type ComplaintDto = {
  id: string;
  title: Bilingual;
  description: Bilingual;
  lat: number;
  lng: number;
  images: string[];
  reporterName: Bilingual;
  reporterPhone: string;
  createdAt: string;
  updatedAt: string;
};

/** Prefer active locale; fall back to the other language if that field is empty. */
export function complaintLocaleText(b: Bilingual, locale: Locale): string {
  const primary = (locale === "bn" ? b.bn : b.en).trim();
  if (primary) return primary;
  return (locale === "bn" ? b.en : b.bn).trim();
}

export const COMPLAINTS_REFRESH_EVENT = "madhupur:complaints-refresh";

export function requestComplaintsRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COMPLAINTS_REFRESH_EVENT));
}

function parseRow(raw: unknown): ComplaintDto | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const lat = typeof o.lat === "number" ? o.lat : null;
  const lng = typeof o.lng === "number" ? o.lng : null;
  const reporterPhone = typeof o.reporterPhone === "string" ? o.reporterPhone : null;
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : null;
  const updatedAt = typeof o.updatedAt === "string" ? o.updatedAt : null;
  if (!id || lat == null || lng == null || !reporterPhone || !createdAt || !updatedAt) {
    return null;
  }

  const asBilingual = (v: unknown): Bilingual | null => {
    if (!v || typeof v !== "object") return null;
    const b = v as Record<string, unknown>;
    const bn = typeof b.bn === "string" ? b.bn : "";
    const en = typeof b.en === "string" ? b.en : "";
    return { bn, en };
  };

  const title = asBilingual(o.title);
  const description = asBilingual(o.description);
  const reporterName = asBilingual(o.reporterName);
  if (!title || !description || !reporterName) return null;

  const images = Array.isArray(o.images)
    ? o.images.filter((x): x is string => typeof x === "string")
    : [];

  return {
    id,
    title,
    description,
    lat,
    lng,
    images,
    reporterName,
    reporterPhone,
    createdAt,
    updatedAt,
  };
}

function parseList(json: unknown): ComplaintDto[] | null {
  if (
    !json ||
    typeof json !== "object" ||
    !("data" in json) ||
    !Array.isArray((json as { data: unknown }).data)
  ) {
    return null;
  }
  const rows: ComplaintDto[] = [];
  for (const item of (json as { data: unknown[] }).data) {
    const row = parseRow(item);
    if (row) rows.push(row);
  }
  return rows;
}

export async function fetchComplaintsFromApi(): Promise<ComplaintDto[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  try {
    const res = await fetch(`${base}/api/v1/complaints`, { cache: "no-store" });
    if (!res.ok) return null;
    return parseList(await res.json());
  } catch {
    return null;
  }
}

export type SubmitComplaintResult =
  | { ok: true; data: ComplaintDto }
  | { ok: false; status: number; message: string };

function formatApiFailure(json: unknown, status: number): string {
  if (!json || typeof json !== "object") {
    return status === 0
      ? "Network error — check API URL and CORS."
      : `HTTP ${status}`;
  }
  const o = json as Record<string, unknown>;
  if (typeof o.error === "string" && o.error.trim()) return o.error.trim();
  return `HTTP ${status}`;
}

export async function submitComplaintFormData(
  formData: FormData,
): Promise<SubmitComplaintResult> {
  const base = getPublicApiBaseUrl();
  if (!base) {
    return {
      ok: false,
      status: 0,
      message: "NEXT_PUBLIC_API_URL is not set.",
    };
  }
  if (!/^https?:\/\//i.test(base)) {
    return {
      ok: false,
      status: 0,
      message: `API URL must start with http(s):// (got: ${base})`,
    };
  }

  try {
    const res = await fetch(`${base}/api/v1/complaints`, {
      method: "POST",
      body: formData,
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
        message: "Server returned success but no data.",
      };
    }
    const row = parseRow((json as { data: unknown }).data);
    if (!row) {
      return {
        ok: false,
        status: res.status,
        message: "Server returned invalid complaint data.",
      };
    }
    return { ok: true, data: row };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, status: 0, message: msg };
  }
}
