import { Router } from "express";
import { complaintRouter } from "./complaint.routes.js";
import { placeRouter } from "./place.routes.js";

export const apiRouter = Router();

apiRouter.use("/places", placeRouter);
apiRouter.use("/complaints", complaintRouter);
