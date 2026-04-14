import { z } from "zod";

function trimStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export const createComplaintFieldsSchema = z
  .object({
    titleBn: z.preprocess(trimStr, z.string().max(200)),
    titleEn: z.preprocess(trimStr, z.string().max(200)),
    descriptionBn: z.preprocess(trimStr, z.string().max(8000)),
    descriptionEn: z.preprocess(trimStr, z.string().max(8000)),
    lat: z.coerce.number().gte(-90).lte(90),
    lng: z.coerce.number().gte(-180).lte(180),
    nameBn: z.preprocess(trimStr, z.string().max(120)),
    nameEn: z.preprocess(trimStr, z.string().max(120)),
    phone: z.preprocess(trimStr, z.string().min(5).max(40)),
  })
  .refine((d) => d.titleBn.length > 0 || d.titleEn.length > 0, {
    message: "At least one title (Bangla or English) is required",
    path: ["titleBn"],
  })
  .refine((d) => d.descriptionBn.length > 0 || d.descriptionEn.length > 0, {
    message: "At least one description (Bangla or English) is required",
    path: ["descriptionBn"],
  })
  .refine((d) => d.nameBn.length > 0 || d.nameEn.length > 0, {
    message: "At least one reporter name (Bangla or English) is required",
    path: ["nameBn"],
  });

export type CreateComplaintFields = z.infer<typeof createComplaintFieldsSchema>;
