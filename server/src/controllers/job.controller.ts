import type { Request, Response } from "express";
import { listPublishedJobs } from "../services/job.service.js";

export async function getJobs(_req: Request, res: Response): Promise<void> {
  const data = await listPublishedJobs();
  res.json({ success: true, data });
}
