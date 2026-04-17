import type { Request, Response } from "express";
import { createJobApplication } from "../services/job-application.service.js";
import { createJobApplicationBodySchema } from "../validation/job-application.validation.js";

export async function postJobApplication(req: Request, res: Response): Promise<void> {
  const raw = req.params.id;
  const jobId = Array.isArray(raw) ? raw[0] : raw;
  if (!jobId) {
    res.status(400).json({ success: false, error: "Missing job id" });
    return;
  }
  const parsed = createJobApplicationBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
    return;
  }

  const data = await createJobApplication(jobId, parsed.data);
  res.status(201).json({ success: true, data });
}
