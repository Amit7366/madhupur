import mongoose from "mongoose";
import { z } from "zod";
import {
  BLOOD_GROUP_VALUES,
  type BloodGroupValue,
} from "../models/donor.model.js";
import type { BloodUrgency } from "../models/blood-request.model.js";
import { BLOOD_URGENCY_VALUES } from "../models/blood-request.model.js";

const bloodGroupSchema = z.string().refine(
  (v): v is BloodGroupValue =>
    (BLOOD_GROUP_VALUES as readonly string[]).includes(v),
  { message: "Invalid blood group" },
);

const objectIdString = z
  .string()
  .trim()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

export const listBloodDonorsQuerySchema = z.object({
  bloodGroup: bloodGroupSchema.optional(),
  locationId: z.string().trim().min(1).max(64).optional(),
});

const urgencySchema = z
  .string()
  .refine(
    (u): u is BloodUrgency =>
      (BLOOD_URGENCY_VALUES as readonly string[]).includes(u),
    { message: "Invalid urgency" },
  )
  .optional()
  .default("Low");

export const createBloodRequestSchema = z.object({
  requesterId: objectIdString,
  bloodGroup: bloodGroupSchema,
  hospitalName: z.string().trim().min(1).max(200),
  urgency: urgencySchema,
});

export const patchDonorStatusSchema = z.object({
  userId: objectIdString,
  lastDonationDate: z.coerce.date(),
});

export type ListBloodDonorsQuery = z.infer<typeof listBloodDonorsQuerySchema>;
export type CreateBloodRequestBody = z.infer<typeof createBloodRequestSchema>;
export type PatchDonorStatusBody = z.infer<typeof patchDonorStatusSchema>;
