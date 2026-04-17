import { getPublicApiBaseUrl } from "@/lib/map-place-api";
import type { JobListing } from "@/lib/dummy/job-listings";

function readBilingual(field: unknown): { bn: string; en: string } {
  if (!field || typeof field !== "object") return { bn: "", en: "" };
  const b = field as Record<string, unknown>;
  return {
    bn: typeof b.bn === "string" ? b.bn : "",
    en: typeof b.en === "string" ? b.en : "",
  };
}

function parseJobRow(raw: unknown): JobListing | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const lat = typeof o.lat === "number" ? o.lat : null;
  const lng = typeof o.lng === "number" ? o.lng : null;
  const hrPhone = typeof o.hrPhone === "string" ? o.hrPhone : "";
  const liveApplicants = typeof o.liveApplicants === "number" ? o.liveApplicants : null;
  const totalApplicants = typeof o.totalApplicants === "number" ? o.totalApplicants : null;
  if (id == null || lat == null || lng == null || liveApplicants == null || totalApplicants == null) {
    return null;
  }
  return {
    id,
    lat,
    lng,
    title: readBilingual(o.title),
    company: readBilingual(o.company),
    salaryRange: readBilingual(o.salaryRange),
    description: readBilingual(o.description),
    requirements: readBilingual(o.requirements),
    liveApplicants,
    totalApplicants,
    hrPhone,
  };
}

/**
 * Returns `null` if the API is unreachable or the response is invalid.
 * Returns an empty array when the API succeeds but has no published jobs.
 */
export async function fetchJobsFromApi(): Promise<JobListing[] | null> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) return null;
  try {
    const res = await fetch(`${base}/api/v1/jobs`, { cache: "no-store" });
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
    const out: JobListing[] = [];
    for (const row of (json as { data: unknown[] }).data) {
      const j = parseJobRow(row);
      if (j) out.push(j);
    }
    return out;
  } catch {
    return null;
  }
}

export type SubmitJobApplicationInput = {
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  district?: string;
  coverLetter?: string;
  yearsExperience?: number;
};

export type JobApplicationCreated = {
  id: string;
  jobId: string;
  createdAt: string;
};

export async function submitJobApplication(
  jobId: string,
  input: SubmitJobApplicationInput,
): Promise<
  | { ok: true; data: JobApplicationCreated }
  | { ok: false; status: number; error: string; details?: unknown }
> {
  const base = getPublicApiBaseUrl();
  if (!base || !/^https?:\/\//i.test(base)) {
    return { ok: false, status: 0, error: "API URL not configured" };
  }
  try {
    const res = await fetch(
      `${base}/api/v1/jobs/${encodeURIComponent(jobId)}/applications`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          applicantName: input.applicantName,
          applicantPhone: input.applicantPhone,
          ...(input.applicantEmail?.trim()
            ? { applicantEmail: input.applicantEmail.trim() }
            : {}),
          ...(input.district?.trim() ? { district: input.district.trim() } : {}),
          ...(input.coverLetter?.trim() ? { coverLetter: input.coverLetter.trim() } : {}),
          ...(input.yearsExperience != null && Number.isFinite(input.yearsExperience)
            ? { yearsExperience: input.yearsExperience }
            : {}),
        }),
      },
    );
    const json: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err =
        json &&
        typeof json === "object" &&
        "error" in json &&
        typeof (json as { error: unknown }).error === "string"
          ? (json as { error: string }).error
          : `Request failed (${res.status})`;
      return { ok: false, status: res.status, error: err, details: json };
    }
    if (
      !json ||
      typeof json !== "object" ||
      !("data" in json) ||
      typeof (json as { data: unknown }).data !== "object" ||
      (json as { data: unknown }).data === null
    ) {
      return { ok: false, status: res.status, error: "Invalid response" };
    }
    const data = (json as { data: JobApplicationCreated }).data;
    if (
      typeof data.id !== "string" ||
      typeof data.jobId !== "string" ||
      typeof data.createdAt !== "string"
    ) {
      return { ok: false, status: res.status, error: "Invalid response" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, status: 0, error: "Network error" };
  }
}
