import { Job } from "../models/job.model.js";

export type JobPublicDto = {
  id: string;
  seedKey?: string;
  title: { bn: string; en: string };
  company: { bn: string; en: string };
  salaryRange: { bn: string; en: string };
  description: { bn: string; en: string };
  requirements: { bn: string; en: string };
  liveApplicants: number;
  totalApplicants: number;
  hrPhone: string;
  lat: number;
  lng: number;
};

function bilingual(
  v: { bn?: string; en?: string } | undefined,
): { bn: string; en: string } {
  return { bn: v?.bn ?? "", en: v?.en ?? "" };
}

function leanToDto(d: {
  _id: unknown;
  seedKey?: string | null;
  title?: { bn?: string; en?: string };
  company?: { bn?: string; en?: string };
  salaryRange?: { bn?: string; en?: string };
  description?: { bn?: string; en?: string };
  requirements?: { bn?: string; en?: string };
  liveApplicants?: number;
  totalApplicants?: number;
  hrPhone?: string;
  lat?: number;
  lng?: number;
}): JobPublicDto {
  return {
    id: String(d._id),
    seedKey: d.seedKey ?? undefined,
    title: bilingual(d.title),
    company: bilingual(d.company),
    salaryRange: bilingual(d.salaryRange),
    description: bilingual(d.description),
    requirements: bilingual(d.requirements),
    liveApplicants: d.liveApplicants ?? 0,
    totalApplicants: d.totalApplicants ?? 0,
    hrPhone: d.hrPhone ?? "",
    lat: d.lat ?? 0,
    lng: d.lng ?? 0,
  };
}

export async function listPublishedJobs(): Promise<JobPublicDto[]> {
  const docs = await Job.find({ published: true }).sort({ createdAt: -1 }).lean();
  return docs.map(leanToDto);
}
