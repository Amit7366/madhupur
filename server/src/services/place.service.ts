import type { FilterQuery } from "mongoose";
import {
  Place,
  type PlaceCategory,
  type PlaceDocument,
} from "../models/place.model.js";
import type { CreatePlaceBody } from "../validation/place.validation.js";

/** Categories surfaced on the tourism explorer (approved places only). */
export const TOURISM_PLACE_CATEGORIES: readonly PlaceCategory[] = [
  "tourist_spot",
  "park",
  "resort",
  "guest_house",
  "historical_place",
  "restaurant",
  "hotel_food",
  "cafe",
  "fast_food",
] as const;

export type PlacePublicDto = {
  id: string;
  /** Present when row was seeded from frontend baseline (`MAP_PLACES`). */
  seedKey?: string;
  category: PlaceCategory;
  name: { bn: string; en: string };
  address: { bn: string; en: string };
  description: { bn: string; en: string };
  services: { bn: string; en: string };
  hours: { bn: string; en: string };
  image: string;
  galleryImages: string[];
  hotline?: string;
  dutyPhone?: string;
  dutyOfficer: { bn: string; en: string };
  lat: number;
  lng: number;
  tags: string[];
  source: string;
  moderationStatus: string;
  createdAt: string;
  updatedAt: string;
};

function toDto(doc: PlaceDocument): PlacePublicDto {
  const seedKey =
    doc.seedKey && typeof doc.seedKey === "string" ? doc.seedKey : undefined;
  return {
    id: doc._id.toString(),
    seedKey,
    category: doc.category as PlaceCategory,
    name: doc.name,
    address: doc.address,
    description: doc.description,
    services: doc.services,
    hours: doc.hours,
    image: doc.image ?? "",
    galleryImages: Array.isArray(doc.galleryImages)
      ? doc.galleryImages.filter((u): u is string => typeof u === "string" && u.length > 0)
      : [],
    hotline: doc.hotline ?? undefined,
    dutyPhone: doc.dutyPhone ?? undefined,
    dutyOfficer: doc.dutyOfficer,
    lat: doc.lat,
    lng: doc.lng,
    tags: doc.tags ?? [],
    source: doc.source,
    moderationStatus: doc.moderationStatus,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function listPublishedPlaces(params?: {
  category?: PlaceCategory;
  tourism?: boolean;
}): Promise<PlacePublicDto[]> {
  const q: FilterQuery<PlaceDocument> = {
    moderationStatus: "approved",
  };
  if (params?.tourism) {
    q.category = { $in: [...TOURISM_PLACE_CATEGORIES] };
  } else if (params?.category) {
    q.category = params.category;
  }
  const docs = await Place.find(q).sort({ updatedAt: -1 }).exec();
  return docs.map((d) => toDto(d));
}

export async function createPlaceFromCommunity(
  body: CreatePlaceBody,
): Promise<PlacePublicDto> {
  const doc = await Place.create({
    category: body.category,
    name: body.name,
    address: body.address,
    description: body.description,
    services: body.services,
    hours: body.hours,
    image: body.image?.trim() || "",
    galleryImages: body.galleryImages ?? [],
    hotline: body.hotline?.trim() || undefined,
    dutyPhone: body.dutyPhone?.trim() || undefined,
    dutyOfficer: body.dutyOfficer,
    lat: body.lat,
    lng: body.lng,
    contributor: body.contributor,
    tags: body.tags ?? [],
    source: "community",
    moderationStatus: "approved",
  });
  return toDto(doc);
}
