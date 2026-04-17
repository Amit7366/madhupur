/**
 * Shape of a job row from `GET /api/v1/jobs` (and shared UI typing).
 */
export type JobListing = {
  id: string;
  lat: number;
  lng: number;
  title: { en: string; bn: string };
  /** Industrialist / employer */
  company: { en: string; bn: string };
  salaryRange: { en: string; bn: string };
  /** Shown on cards as “live” interest */
  liveApplicants: number;
  /** Shown in detail modal */
  totalApplicants: number;
  hrPhone: string;
  description: { en: string; bn: string };
  requirements: { en: string; bn: string };
};
