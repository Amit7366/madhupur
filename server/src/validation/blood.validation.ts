import mongoose from "mongoose";
import { z } from "zod";
import {
  BLOOD_GROUP_VALUES,
  type BloodGroupValue,
} from "../models/donor.model.js";
import type {
  BloodRequestStatus,
  BloodUrgency,
} from "../models/blood-request.model.js";
import {
  BLOOD_REQUEST_STATUS_VALUES,
  BLOOD_URGENCY_VALUES,
} from "../models/blood-request.model.js";

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
  .default("Emergency");

export const createBloodRequestSchema = z.object({
  patientName: z.string().trim().min(1).max(120),
  hospitalName: z.string().trim().min(1).max(200),
  bloodGroup: bloodGroupSchema,
  unitsNeeded: z.string().trim().min(1).max(32),
  contactPhone: z.string().trim().min(5).max(40),
  neededBy: z.coerce.date(),
  urgency: urgencySchema,
});

export const listBloodRequestsQuerySchema = z.object({
  status: z
    .string()
    .refine(
      (s): s is BloodRequestStatus =>
        (BLOOD_REQUEST_STATUS_VALUES as readonly string[]).includes(s),
      { message: "Invalid status" },
    )
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export const patchDonorStatusSchema = z.object({
  userId: objectIdString,
  lastDonationDate: z.coerce.date(),
});

export type ListBloodDonorsQuery = z.infer<typeof listBloodDonorsQuerySchema>;
export type ListBloodRequestsQuery = z.infer<typeof listBloodRequestsQuerySchema>;
export type CreateBloodRequestBody = z.infer<typeof createBloodRequestSchema>;
export type PatchDonorStatusBody = z.infer<typeof patchDonorStatusSchema>;
