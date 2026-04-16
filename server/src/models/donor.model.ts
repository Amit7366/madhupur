import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const BLOOD_GROUP_VALUES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroupValue = (typeof BLOOD_GROUP_VALUES)[number];

const donorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: BLOOD_GROUP_VALUES,
    },
    lastDonationDate: { type: Date, default: null },
    isAvailable: { type: Boolean, required: true, default: true },
    locationId: { type: String, required: true, trim: true, maxlength: 64 },
    contactHidden: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

/** Supports filtered listings by group + area + availability flags. */
donorSchema.index({ bloodGroup: 1, locationId: 1, isAvailable: 1, lastDonationDate: 1 });
donorSchema.index({ locationId: 1 });

export type DonorDoc = InferSchemaType<typeof donorSchema>;
export type DonorModel = Model<DonorDoc>;

export const Donor: DonorModel =
  mongoose.models.Donor ?? mongoose.model<DonorDoc>("Donor", donorSchema);
