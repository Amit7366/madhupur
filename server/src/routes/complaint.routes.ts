import { Router } from "express";
import multer from "multer";
import { getComplaints, postComplaint } from "../controllers/complaint.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const complaintRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

complaintRouter.get("/", asyncHandler(getComplaints));
complaintRouter.post("/", upload.array("images", 10), asyncHandler(postComplaint));
