import type { Request, Response } from "express";
import type mongoose from "mongoose";
import { readDocumentId } from "../lib/mongoose-id.js";
import {
  BloodServiceError,
  createBloodRequest,
  listBloodRequests,
  listEligibleDonors,
  updateDonorLastDonation,
} from "../services/blood.service.js";
import {
  createBloodRequestSchema,
  listBloodDonorsQuerySchema,
  listBloodRequestsQuerySchema,
  patchDonorStatusSchema,
} from "../validation/blood.validation.js";

export async function getBloodDonors(req: Request, res: Response): Promise<void> {
  const parsed = listBloodDonorsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  const filters: { bloodGroup?: string; locationId?: string } = {};
  if (parsed.data.bloodGroup) filters.bloodGroup = parsed.data.bloodGroup;
  if (parsed.data.locationId) filters.locationId = parsed.data.locationId;

  const data = await listEligibleDonors(filters);
  res.json({ success: true, data });
}

export async function getBloodRequests(req: Request, res: Response): Promise<void> {
  const parsed = listBloodRequestsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  const data = await listBloodRequests({
    status: parsed.data.status,
    limit: parsed.data.limit,
  });
  res.json({ success: true, data });
}

export async function postBloodRequest(req: Request, res: Response): Promise<void> {
  const parsed = createBloodRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const created = await createBloodRequest({
      patientName: parsed.data.patientName,
      hospitalName: parsed.data.hospitalName,
      bloodGroup: parsed.data.bloodGroup,
      unitsNeeded: parsed.data.unitsNeeded,
      contactPhone: parsed.data.contactPhone,
      neededBy: parsed.data.neededBy,
      urgency: parsed.data.urgency,
    });
    res.status(201).json({
      success: true,
      data: {
        id: readDocumentId(created as unknown as mongoose.Document),
        requesterId: String(created.requesterId),
        patientName: created.patientName,
        bloodGroup: created.bloodGroup,
        hospitalName: created.hospitalName,
        unitsNeeded: created.unitsNeeded,
        neededBy:
          created.neededBy instanceof Date
            ? created.neededBy.toISOString()
            : String(created.neededBy),
        urgency: created.urgency,
        status: created.status,
        createdAt: created.createdAt,
      },
    });
  } catch (e) {
    if (e instanceof BloodServiceError) {
      res.status(e.status).json({ success: false, error: e.code });
      return;
    }
    throw e;
  }
}

export async function patchDonorStatus(req: Request, res: Response): Promise<void> {
  const parsed = patchDonorStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const updated = await updateDonorLastDonation({
      userId: parsed.data.userId,
      lastDonationDate: parsed.data.lastDonationDate,
    });
    res.json({
      success: true,
      data: {
        id: readDocumentId(updated as unknown as mongoose.Document),
        userId: String(updated.userId),
        bloodGroup: updated.bloodGroup,
        lastDonationDate: updated.lastDonationDate,
        isAvailable: updated.isAvailable,
        locationId: updated.locationId,
        contactHidden: updated.contactHidden,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (e) {
    if (e instanceof BloodServiceError) {
      res.status(e.status).json({ success: false, error: e.code });
      return;
    }
    throw e;
  }
}
