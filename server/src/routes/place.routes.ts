import { Router } from "express";
import { getPlaces, postPlace } from "../controllers/place.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const placeRouter = Router();

placeRouter.get("/", asyncHandler(getPlaces));
placeRouter.post("/", asyncHandler(postPlace));
