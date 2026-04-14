import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const complaintSchema = new Schema(
  {
    titleBn: { type: String, required: true, trim: true, maxlength: 200 },
    titleEn: { type: String, required: true, trim: true, maxlength: 200 },
    descriptionBn: { type: String, required: true, trim: true, maxlength: 8000 },
    descriptionEn: { type: String, required: true, trim: true, maxlength: 8000 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    images: [{ type: String, trim: true }],
    reporterNameBn: { type: String, required: true, trim: true, maxlength: 120 },
    reporterNameEn: { type: String, required: true, trim: true, maxlength: 120 },
    reporterPhone: { type: String, required: true, trim: true, maxlength: 40 },
  },
  { timestamps: true },
);

complaintSchema.index({ createdAt: -1 });

export type ComplaintDoc = InferSchemaType<typeof complaintSchema>;

export type ComplaintModel = Model<ComplaintDoc>;

export const Complaint: ComplaintModel =
  mongoose.models.Complaint ??
  mongoose.model<ComplaintDoc>("Complaint", complaintSchema);
