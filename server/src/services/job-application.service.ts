import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { JobApplication } from "../models/job-application.model.js";
import type { CreateJobApplicationBody } from "../validation/job-application.validation.js";

function httpError(message: string, status: number): Error {
  return Object.assign(new Error(message), { status });
}

export type JobApplicationCreatedDto = {
  id: string;
  jobId: string;
  createdAt: string;
};

export async function createJobApplication(
  jobId: string,
  body: CreateJobApplicationBody,
): Promise<JobApplicationCreatedDto> {
  if (!mongoose.isValidObjectId(jobId)) {
    throw httpError("Invalid job id", 400);
  }

  const exists = await Job.findOne({ _id: jobId, published: true }).select("_id").lean();
  if (!exists) {
    throw httpError("Job not found or not accepting applications", 404);
  }

  const email = body.applicantEmail ?? "";
  const district = body.district?.trim() ?? "";
  const cover = body.coverLetter?.trim() ?? "";
  const years = body.yearsExperience;

  const row: Record<string, unknown> = {
    job: jobId,
    applicantName: body.applicantName.trim(),
    applicantPhone: body.applicantPhone.trim(),
    applicantEmail: email,
    district,
    coverLetter: cover,
  };
  if (years !== undefined) {
    row.yearsExperience = years;
  }

  try {
    const docs = await JobApplication.create([row]);
    const doc = docs[0];
    await Job.updateOne({ _id: jobId, published: true }, { $inc: { totalApplicants: 1 } });
    return {
      id: String(doc._id),
      jobId,
      createdAt: doc.createdAt.toISOString(),
    };
  } catch (e) {
    if (e instanceof MongoServerError && e.code === 11000) {
      throw httpError(
        "You have already submitted an application for this job with this phone number.",
        409,
      );
    }
    throw e;
  }
}
