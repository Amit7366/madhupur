import { Router } from "express";
import { postJobApplication } from "../controllers/job-application.controller.js";
import { getJobs } from "../controllers/job.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const jobRouter = Router();

jobRouter.get("/", asyncHandler(getJobs));
jobRouter.post("/:id/applications", asyncHandler(postJobApplication));
