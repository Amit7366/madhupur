import { Router } from "express";
import {
  getBloodDonors,
  getBloodRequests,
  patchDonorStatus,
  postBloodRequest,
} from "../controllers/blood.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const bloodRouter = Router();

bloodRouter.get("/donors", asyncHandler(getBloodDonors));
bloodRouter.get("/requests", asyncHandler(getBloodRequests));
bloodRouter.post("/request", asyncHandler(postBloodRequest));
bloodRouter.patch("/donor-status", asyncHandler(patchDonorStatus));
