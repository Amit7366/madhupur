import { getPublicApiBaseUrl } from "@/lib/map-place-api";

export type BloodDonorApiRow = Readonly<{
  id: string;
  bloodGroup: string;
  locationId: string;
  contactHidden: boolean;
  user: Readonly<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
  }>;
}>;

export type BloodRequestApiRow = Readonly<{
  id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  unitsNeeded: string;
  neededBy: string;
  urgency: string;
  status: string;
  createdAt: string;
  requester: Readonly<{
    name: string;
    phone?: string;
  }>;
}>;

export const BLOOD_BANK_REFRESH_EVENT = "madhupur:blood-bank-refresh";

export function requestBloodBankRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BLOOD_BANK_REFRESH_EVENT));
}

function parseDonor(raw: unknown): BloodDonorApiRow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const bloodGroup = typeof o.bloodGroup === "string" ? o.bloodGroup : null;
  const locationId = typeof o.locationId === "string" ? o.locationId : null;
  const contactHidden = typeof o.contactHidden === "boolean" ? o.contactHidden : null;
  const user = o.user;
  if (!id || !bloodGroup || !locationId || contactHidden == null || !user || typeof user !== "object")
    return null;
  const u = user as Record<string, unknown>;
  const uid = typeof u.id === "string" ? u.id : null;
  const name = typeof u.name === "string" ? u.name : null;
  if (!uid || name == null) return null;
  const row: BloodDonorApiRow = {
    id,
    bloodGroup,
    locationId,
    contactHidden,
    user: {
      id: uid,
      name,
      ...(typeof u.email === "string" && u.email ? { email: u.email } : {}),
      ...(typeof u.phone === "string" && u.phone ? { phone: u.phone } : {}),
    },
  };
  return row;
}

function parseRequest(raw: unknown): BloodRequestApiRow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const patientName = typeof o.patientName === "string" ? o.patientName : null;
  const bloodGroup = typeof o.bloodGroup === "string" ? o.bloodGroup : null;
  const hospitalName = typeof o.hospitalName === "string" ? o.hospitalName : null;
  const unitsNeeded = typeof o.unitsNeeded === "string" ? o.unitsNeeded : null;
  const neededBy = typeof o.neededBy === "string" ? o.neededBy : null;
  const urgency = typeof o.urgency === "string" ? o.urgency : null;
  const status = typeof o.status === "string" ? o.status : null;
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : null;
  const requester = o.requester;
  if (
    !id ||
    !patientName ||
    !bloodGroup ||
    !hospitalName ||
    !unitsNeeded ||
    !neededBy ||
    !urgency ||
    !status ||
    !createdAt ||
    !requester ||
    typeof requester !== "object"
  ) {
    return null;
  }
  const r = requester as Record<string, unknown>;
  const rName = typeof r.name === "string" ? r.name : null;
  if (rName == null) return null;
  return {
    id,
    patientName,
    bloodGroup,
    hospitalName,
    unitsNeeded,
    neededBy,
    urgency,
    status,
    createdAt,
    requester: {
      name: rName,
      ...(typeof r.phone === "string" && r.phone ? { phone: r.phone } : {}),
    },
  };
}

function parseDonorList(json: unknown): BloodDonorApiRow[] | null {
  if (
    !json ||
    typeof json !== "object" ||
    !("data" in json) ||
    !Array.isArray((json as { data: unknown }).data)
  ) {
    return null;
  }
  const out: BloodDonorApiRow[] = [];
  for (const item of (json as { data: unknown[] }).data) {
    const row = parseDonor(item);
    if (row) out.push(row);
  }
  return out;
}

function parseRequestList(json: unknown): BloodRequestApiRow[] | null {
  if (
    !json ||
    typeof json !== "object" ||
    !("data" in json) ||
    !Array.isArray((json as { data: unknown }).data)
  ) {
    return null;
  }
  const out: BloodRequestApiRow[] = [];
  for (const item of (json as { data: unknown[] }).data) {
    const row = parseRequest(item);
    if (row) out.push(row);
  }
  return out;
}

export type BloodDonorQuery = Readonly<{
  bloodGroup?: string;
  locationId?: string;
}>;

export async function fetchBloodDonorsFromApi(
  query: BloodDonorQuery = {},
): Promise<BloodDonorApiRow[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  const sp = new URLSearchParams();
  if (query.bloodGroup) sp.set("bloodGroup", query.bloodGroup);
  if (query.locationId) sp.set("locationId", query.locationId);
  const qs = sp.toString();
  const url = `${base}/api/v1/blood/donors${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseDonorList(await res.json());
  } catch {
    return null;
  }
}

export async function fetchBloodRequestsFromApi(options?: {
  status?: string;
  limit?: number;
}): Promise<BloodRequestApiRow[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  const sp = new URLSearchParams();
  if (options?.status) sp.set("status", options.status);
  if (options?.limit != null) sp.set("limit", String(options.limit));
  const qs = sp.toString();
  const url = `${base}/api/v1/blood/requests${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseRequestList(await res.json());
  } catch {
    return null;
  }
}

export type SubmitBloodRequestPayload = Readonly<{
  patientName: string;
  hospitalName: string;
  bloodGroup: string;
  unitsNeeded: string;
  contactPhone: string;
  neededBy: string;
  urgency: string;
}>;

export type SubmitBloodRequestResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export async function submitBloodRequest(
  payload: SubmitBloodRequestPayload,
): Promise<SubmitBloodRequestResult> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) {
    return {
      ok: false,
      status: 0,
      message: "NEXT_PUBLIC_API_URL is not set or invalid.",
    };
  }
  try {
    const res = await fetch(`${base}/api/v1/blood/request`, {
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
      const msg =
        json && typeof json === "object" && typeof (json as { error?: string }).error === "string"
          ? (json as { error: string }).error
          : `HTTP ${res.status}`;
      return { ok: false, status: res.status, message: msg };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { ok: false, status: 0, message: msg };
  }
}
