import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const bilingualSchema = new Schema(
  {
    bn: { type: String, required: true, default: "" },
    en: { type: String, required: true, default: "" },
  },
  { _id: false },
);

const jobSchema = new Schema(
  {
    /** Stable key for idempotent seeds (matches prior client `id`). */
    seedKey: { type: String, sparse: true, unique: true, index: true },
    title: { type: bilingualSchema, required: true },
    company: { type: bilingualSchema, required: true },
    salaryRange: { type: bilingualSchema, required: true },
    description: { type: bilingualSchema, required: true },
    requirements: { type: bilingualSchema, required: true },
    liveApplicants: { type: Number, required: true, min: 0 },
    totalApplicants: { type: Number, required: true, min: 0 },
    hrPhone: { type: String, required: true, trim: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

jobSchema.index({ createdAt: -1 });

export type JobDocument = InferSchemaType<typeof jobSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Job: Model<JobDocument> =
  mongoose.models.Job ?? mongoose.model<JobDocument>("Job", jobSchema);
