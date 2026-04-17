import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantName: { type: String, required: true, trim: true, maxlength: 200 },
    applicantPhone: { type: String, required: true, trim: true, maxlength: 40 },
    applicantEmail: { type: String, trim: true, maxlength: 200, default: "" },
    district: { type: String, trim: true, maxlength: 200, default: "" },
    coverLetter: { type: String, trim: true, maxlength: 6000, default: "" },
    yearsExperience: { type: Number, min: 0, max: 60, required: false },
  },
  { timestamps: true },
);

/** One application per phone number per job posting. */
jobApplicationSchema.index({ job: 1, applicantPhone: 1 }, { unique: true });
jobApplicationSchema.index({ createdAt: -1 });

export type JobApplicationDocument = InferSchemaType<typeof jobApplicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const JobApplication: Model<JobApplicationDocument> =
  mongoose.models.JobApplication ??
  mongoose.model<JobApplicationDocument>("JobApplication", jobApplicationSchema);
