import type { Request, Response } from "express";
import { PLACE_CATEGORIES } from "../models/place.model.js";
import {
  createPlaceFromCommunity,
  listPublishedPlaces,
} from "../services/place.service.js";
import {
  createPlaceBodySchema,
} from "../validation/place.validation.js";

export async function getPlaces(req: Request, res: Response): Promise<void> {
  const tourismRaw = req.query.tourism;
  const tourism =
    tourismRaw === "1" ||
    tourismRaw === "true" ||
    tourismRaw === "yes";

  const raw = req.query.category;
  const category =
    typeof raw === "string" && (PLACE_CATEGORIES as readonly string[]).includes(raw)
      ? (raw as (typeof PLACE_CATEGORIES)[number])
      : undefined;

  const data = tourism
    ? await listPublishedPlaces({ tourism: true })
    : await listPublishedPlaces({ category });
  res.json({ success: true, data });
}

export async function postPlace(req: Request, res: Response): Promise<void> {
  const parsed = createPlaceBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }
  const created = await createPlaceFromCommunity(parsed.data);
  res.status(201).json({ success: true, data: created });
}
