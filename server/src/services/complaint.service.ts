import { Complaint } from "../models/complaint.model.js";
import type { CreateComplaintFields } from "../validation/complaint.validation.js";

export type ComplaintJson = {
  id: string;
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  lat: number;
  lng: number;
  images: string[];
  reporterName: { bn: string; en: string };
  reporterPhone: string;
  createdAt: string;
  updatedAt: string;
};

function toJson(doc: {
  _id: unknown;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  lat: number;
  lng: number;
  images: string[];
  reporterNameBn: string;
  reporterNameEn: string;
  reporterPhone: string;
  createdAt: Date;
  updatedAt: Date;
}): ComplaintJson {
  return {
    id: String(doc._id),
    title: { bn: doc.titleBn, en: doc.titleEn },
    description: { bn: doc.descriptionBn, en: doc.descriptionEn },
    lat: doc.lat,
    lng: doc.lng,
    images: doc.images ?? [],
    reporterName: { bn: doc.reporterNameBn, en: doc.reporterNameEn },
    reporterPhone: doc.reporterPhone,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

type LeanComplaint = {
  _id: unknown;
  titleBn?: string;
  titleEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  /** Legacy single-string fields (pre–bilingual schema) */
  title?: string;
  description?: string;
  reporterName?: string;
  lat: number;
  lng: number;
  images?: string[];
  reporterNameBn?: string;
  reporterNameEn?: string;
  reporterPhone: string;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeLean(r: LeanComplaint): Parameters<typeof toJson>[0] {
  const legacyTitle = typeof r.title === "string" ? r.title.trim() : "";
  const legacyDesc = typeof r.description === "string" ? r.description.trim() : "";
  const legacyName = typeof r.reporterName === "string" ? r.reporterName.trim() : "";

  const titleBn = (r.titleBn ?? legacyTitle).trim();
  const titleEn = (r.titleEn ?? legacyTitle).trim();
  const descriptionBn = (r.descriptionBn ?? legacyDesc).trim();
  const descriptionEn = (r.descriptionEn ?? legacyDesc).trim();
  const reporterNameBn = (r.reporterNameBn ?? legacyName).trim();
  const reporterNameEn = (r.reporterNameEn ?? legacyName).trim();

  return {
    _id: r._id,
    titleBn: titleBn || titleEn,
    titleEn: titleEn || titleBn,
    descriptionBn: descriptionBn || descriptionEn,
    descriptionEn: descriptionEn || descriptionBn,
    lat: r.lat,
    lng: r.lng,
    images: r.images ?? [],
    reporterNameBn: reporterNameBn || reporterNameEn,
    reporterNameEn: reporterNameEn || reporterNameBn,
    reporterPhone: r.reporterPhone,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function listComplaints(limit = 500): Promise<ComplaintJson[]> {
  const rows = await Complaint.find()
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 500))
    .lean<LeanComplaint[]>();
  return rows.map((r) => toJson(normalizeLean(r)));
}

export async function createComplaint(
  fields: CreateComplaintFields,
  imageUrls: string[],
): Promise<ComplaintJson> {
  const doc = await Complaint.create({
    titleBn: fields.titleBn,
    titleEn: fields.titleEn,
    descriptionBn: fields.descriptionBn,
    descriptionEn: fields.descriptionEn,
    lat: fields.lat,
    lng: fields.lng,
    images: imageUrls,
    reporterNameBn: fields.nameBn,
    reporterNameEn: fields.nameEn,
    reporterPhone: fields.phone,
  });
  return toJson({
    _id: doc._id,
    titleBn: doc.titleBn,
    titleEn: doc.titleEn,
    descriptionBn: doc.descriptionBn,
    descriptionEn: doc.descriptionEn,
    lat: doc.lat,
    lng: doc.lng,
    images: doc.images,
    reporterNameBn: doc.reporterNameBn,
    reporterNameEn: doc.reporterNameEn,
    reporterPhone: doc.reporterPhone,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}
