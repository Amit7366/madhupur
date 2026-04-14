function serverApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).replace(/\/$/, "");
}

export type { ComplaintDto } from "@/lib/complaint-api";

function parseRow(raw: unknown): import("@/lib/complaint-api").ComplaintDto | null {
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
  const asBilingual = (v: unknown): { bn: string; en: string } | null => {
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

/**
 * Server-only: complaints list for the complaints page.
 */
export async function loadComplaintsForPage(): Promise<
  import("@/lib/complaint-api").ComplaintDto[]
> {
  const base = serverApiBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/v1/complaints`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    if (
      !json ||
      typeof json !== "object" ||
      !("data" in json) ||
      !Array.isArray((json as { data: unknown }).data)
    ) {
      return [];
    }
    const out: import("@/lib/complaint-api").ComplaintDto[] = [];
    for (const item of (json as { data: unknown[] }).data) {
      const row = parseRow(item);
      if (row) out.push(row);
    }
    return out;
  } catch {
    return [];
  }
}
