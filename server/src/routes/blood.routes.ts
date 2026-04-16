import { Router } from "express";
import {
  getBloodDonors,
  patchDonorStatus,
  postBloodRequest,
} from "../controllers/blood.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const bloodRouter = Router();

bloodRouter.get("/donors", asyncHandler(getBloodDonors));
bloodRouter.post("/request", asyncHandler(postBloodRequest));
bloodRouter.patch("/donor-status", asyncHandler(patchDonorStatus));
