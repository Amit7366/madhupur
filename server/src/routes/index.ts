import { Router } from "express";
import { bloodRouter } from "./blood.routes.js";
import { complaintRouter } from "./complaint.routes.js";
import { jobRouter } from "./job.routes.js";
import { placeRouter } from "./place.routes.js";

export const apiRouter = Router();

apiRouter.use("/places", placeRouter);
apiRouter.use("/complaints", complaintRouter);
apiRouter.use("/blood", bloodRouter);
apiRouter.use("/jobs", jobRouter);
