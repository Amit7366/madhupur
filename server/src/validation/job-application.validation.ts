import { z } from "zod";

const phoneLike = z
  .string()
  .trim()
  .min(8, "Phone is too short")
  .max(40, "Phone is too long");

export const createJobApplicationBodySchema = z.object({
  applicantName: z.string().trim().min(2, "Name is too short").max(200),
  applicantPhone: phoneLike,
  applicantEmail: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : String(v).trim()),
    z.string().email("Invalid email").max(200).optional(),
  ),
  district: z.string().trim().max(200).optional(),
  coverLetter: z.string().trim().max(6000).optional(),
  yearsExperience: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().int().min(0).max(60).optional()),
});

export type CreateJobApplicationBody = z.infer<typeof createJobApplicationBodySchema>;
