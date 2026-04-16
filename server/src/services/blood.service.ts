import mongoose, { type FilterQuery } from "mongoose";
import type { BloodRequestDoc, BloodRequestStatus } from "../models/blood-request.model.js";
import { BloodRequest } from "../models/blood-request.model.js";
import { Donor, type DonorDoc } from "../models/donor.model.js";
import { User } from "../models/user.model.js";
import { readDocumentId } from "../lib/mongoose-id.js";
import {
  bloodCoolingCutoff,
  isAvailableFromLastDonation,
} from "../lib/blood-eligibility.js";
import { notifyMatchingDonorsForRequest } from "./blood-notification.service.js";

export type DonorListFilters = Readonly<{
  bloodGroup?: string;
  locationId?: string;
}>;

/** Core eligibility: flagged available AND outside 120-day cooling window. */
export function eligibleDonorsMatchQuery(): FilterQuery<DonorDoc> {
  const cutoff = bloodCoolingCutoff();
  return {
    isAvailable: true,
    $or: [
      { lastDonationDate: { $exists: false } },
      { lastDonationDate: null },
      { lastDonationDate: { $lte: cutoff } },
    ],
  };
}

function listFiltersToQuery(
  filters: DonorListFilters,
): FilterQuery<DonorDoc> {
  const q: FilterQuery<DonorDoc> = {
    ...eligibleDonorsMatchQuery(),
  };
  if (filters.bloodGroup) {
    q.bloodGroup = filters.bloodGroup;
  }
  if (filters.locationId) {
    q.locationId = filters.locationId;
  }
  return q;
}

export type DonorPublicRow = Readonly<{
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

function toPublicDonor(
  doc: DonorDoc & { _id: mongoose.Types.ObjectId; userId?: unknown },
): DonorPublicRow | null {
  const u = doc.userId as
    | { _id: mongoose.Types.ObjectId; name?: string; email?: string; phone?: string }
    | null
    | undefined;
  if (!u || !u._id) return null;
  const base = {
    id: String(doc._id),
    bloodGroup: doc.bloodGroup,
    locationId: doc.locationId,
    contactHidden: doc.contactHidden,
    user: {
      id: String(u._id),
      name: u.name ?? "",
    },
  };
  if (doc.contactHidden) {
    return { ...base, user: { ...base.user } };
  }
  return {
    ...base,
    user: {
      ...base.user,
      ...(u.email ? { email: u.email } : {}),
      ...(u.phone ? { phone: u.phone } : {}),
    },
  };
}

/**
 * Optimized listing: indexed fields first in filter; lean() for read-only DTOs.
 */
export async function listEligibleDonors(
  filters: DonorListFilters,
): Promise<DonorPublicRow[]> {
  const query = listFiltersToQuery(filters);
  const cursor = Donor.find(query)
    .populate({
      path: "userId",
      model: User,
      select: "name email phone",
    })
    .lean();

  const docs = await cursor.exec();
  const rows: DonorPublicRow[] = [];
  for (const raw of docs) {
    const row = toPublicDonor(
      raw as DonorDoc & { _id: mongoose.Types.ObjectId; userId?: unknown },
    );
    if (row) rows.push(row);
  }
  return rows;
}

function normalizeContactPhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

/**
 * Links emergency requests to a User by phone (upsert). Display name uses patientName as a stand-in
 * when no separate requester name is collected.
 */
export async function findOrCreateRequesterUserId(
  contactPhone: string,
  displayName: string,
): Promise<mongoose.Types.ObjectId> {
  const phone = normalizeContactPhone(contactPhone);
  const name = displayName.trim().slice(0, 120);
  const doc = await User.findOneAndUpdate(
    { phone },
    { $set: { phone, name } },
    { upsert: true, new: true, runValidators: true },
  ).exec();
  if (!doc) {
    throw new BloodServiceError("USER_UPSERT_FAILED", 500);
  }
  return new mongoose.Types.ObjectId(readDocumentId(doc as unknown as mongoose.Document));
}

export type CreateBloodRequestInput = Readonly<{
  patientName: string;
  hospitalName: string;
  bloodGroup: string;
  unitsNeeded: string;
  contactPhone: string;
  neededBy: Date;
  urgency: BloodRequestDoc["urgency"];
}>;

export async function createBloodRequest(
  input: CreateBloodRequestInput,
): Promise<BloodRequestDoc> {
  const requesterId = await findOrCreateRequesterUserId(
    input.contactPhone,
    input.patientName,
  );

  const created = await BloodRequest.create({
    requesterId,
    patientName: input.patientName.trim(),
    bloodGroup: input.bloodGroup,
    hospitalName: input.hospitalName.trim(),
    unitsNeeded: input.unitsNeeded.trim(),
    neededBy: input.neededBy,
    urgency: input.urgency,
    status: "Open",
  });

  const matching = await Donor.find({
    ...eligibleDonorsMatchQuery(),
    bloodGroup: input.bloodGroup,
  })
    .select("_id userId")
    .lean();

  await notifyMatchingDonorsForRequest(
    readDocumentId(created as unknown as mongoose.Document),
    matching.length,
  );

  return created;
}

export type BloodRequestPublicRow = Readonly<{
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

function toPublicBloodRequest(
  raw: BloodRequestDoc & {
    _id: mongoose.Types.ObjectId;
    requesterId?: unknown;
    patientName?: string;
    unitsNeeded?: string;
    neededBy?: Date;
  },
): BloodRequestPublicRow {
  const r = raw.requesterId as
    | { _id: mongoose.Types.ObjectId; name?: string; phone?: string }
    | null
    | undefined;
  const neededRaw = raw.neededBy;
  const neededBy =
    neededRaw instanceof Date
      ? neededRaw.toISOString()
      : neededRaw != null
        ? String(neededRaw)
        : new Date(0).toISOString();
  const createdAt =
    raw.createdAt instanceof Date
      ? raw.createdAt.toISOString()
      : String(raw.createdAt ?? new Date().toISOString());
  return {
    id: String(raw._id),
    patientName: raw.patientName ?? "—",
    bloodGroup: raw.bloodGroup,
    hospitalName: raw.hospitalName,
    unitsNeeded: raw.unitsNeeded ?? "—",
    neededBy,
    urgency: raw.urgency,
    status: raw.status,
    createdAt,
    requester: {
      name: r?.name ?? "",
      ...(r?.phone ? { phone: r.phone } : {}),
    },
  };
}

export async function listBloodRequests(options: {
  status?: BloodRequestStatus;
  limit?: number;
}): Promise<BloodRequestPublicRow[]> {
  const limit = Math.min(Math.max(options.limit ?? 80, 1), 200);
  const q: FilterQuery<BloodRequestDoc> = {};
  if (options.status) {
    q.status = options.status;
  }

  const docs = await BloodRequest.find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "requesterId",
      model: User,
      select: "name phone",
    })
    .lean()
    .exec();

  const out: BloodRequestPublicRow[] = [];
  for (const d of docs) {
    out.push(
      toPublicBloodRequest(
        d as BloodRequestDoc & {
          _id: mongoose.Types.ObjectId;
          requesterId?: unknown;
        },
      ),
    );
  }
  return out;
}

export type PatchDonorStatusInput = Readonly<{
  userId: string;
  lastDonationDate: Date;
}>;

export class BloodServiceError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number, message?: string) {
    super(message ?? code);
    this.name = "BloodServiceError";
    this.code = code;
    this.status = status;
  }
}

export async function updateDonorLastDonation(
  input: PatchDonorStatusInput,
): Promise<DonorDoc> {
  if (!mongoose.Types.ObjectId.isValid(input.userId)) {
    throw new BloodServiceError("INVALID_USER_ID", 400);
  }
  const uid = new mongoose.Types.ObjectId(input.userId);
  const nextAvailable = isAvailableFromLastDonation(input.lastDonationDate);

  const updated = await Donor.findOneAndUpdate(
    { userId: uid },
    {
      $set: {
        lastDonationDate: input.lastDonationDate,
        isAvailable: nextAvailable,
      },
    },
    { new: true, runValidators: true },
  ).exec();

  if (!updated) {
    throw new BloodServiceError("DONOR_NOT_FOUND", 404);
  }

  return updated;
}
