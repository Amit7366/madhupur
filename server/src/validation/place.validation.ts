import { z } from "zod";
import { PLACE_CATEGORIES } from "../models/place.model.js";

const bilingual = z.object({
  bn: z.string().max(8000).optional().default(""),
  en: z.string().max(8000).optional().default(""),
});

const contributor = z
  .object({
    name: z.string().max(500).optional(),
    contact: z.string().max(500).optional(),
  })
  .optional();

export const createPlaceBodySchema = z
  .object({
    category: z.enum(PLACE_CATEGORIES),
    name: bilingual,
    address: bilingual,
    description: bilingual,
    services: bilingual,
    hours: bilingual,
    /** Allow any short string — contributors often paste non-URLs; model stores as plain text. */
    image: z.preprocess(
      (v) => (v === "" || v == null ? undefined : v),
      z.string().max(2000).optional(),
    ),
    galleryImages: z.array(z.string().max(2000)).max(24).optional(),
    hotline: z.string().max(80).optional(),
    dutyPhone: z.string().max(80).optional(),
    dutyOfficer: bilingual,
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    contributor: contributor,
    tags: z.array(z.string().max(120)).max(50).optional(),
  })
  .refine((b) => Boolean(b.name.bn?.trim() || b.name.en?.trim()), {
    message: "At least one of name.bn or name.en is required",
    path: ["name"],
  });

export type CreatePlaceBody = z.infer<typeof createPlaceBodySchema>;
