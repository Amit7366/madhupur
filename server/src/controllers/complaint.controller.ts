import type { Request, Response } from "express";
import { uploadComplaintImages } from "../services/cloudinary-upload.js";
import { createComplaint, listComplaints } from "../services/complaint.service.js";
import { createComplaintFieldsSchema } from "../validation/complaint.validation.js";

function multerFiles(req: Request): Express.Multer.File[] {
  const raw = req.files;
  if (Array.isArray(raw)) return raw;
  return [];
}

export async function getComplaints(req: Request, res: Response): Promise<void> {
  const raw = req.query.limit;
  const limit =
    typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  const safeLimit = Number.isFinite(limit) ? limit : 500;
  const data = await listComplaints(safeLimit);
  res.json({ success: true, data });
}

export async function postComplaint(req: Request, res: Response): Promise<void> {
  const parsed = createComplaintFieldsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  const files = multerFiles(req);
  const buffers = files.map((f) => f.buffer);

  let imageUrls: string[] = [];
  try {
    imageUrls = await uploadComplaintImages(buffers);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Image upload failed";
    res.status(400).json({ success: false, error: message });
    return;
  }

  const created = await createComplaint(parsed.data, imageUrls);
  res.status(201).json({ success: true, data: created });
}
