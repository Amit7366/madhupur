import { Router } from "express";
import { placeRouter } from "./place.routes.js";

export const apiRouter = Router();

apiRouter.use("/places", placeRouter);
