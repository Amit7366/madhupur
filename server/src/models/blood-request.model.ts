import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const BLOOD_URGENCY_VALUES = ["Low", "High", "Emergency"] as const;
export type BloodUrgency = (typeof BLOOD_URGENCY_VALUES)[number];

export const BLOOD_REQUEST_STATUS_VALUES = [
  "Open",
  "Fulfilled",
  "Cancelled",
] as const;
export type BloodRequestStatus = (typeof BLOOD_REQUEST_STATUS_VALUES)[number];

const bloodRequestSchema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Patient needing blood (may differ from requester name). */
    patientName: { type: String, required: true, trim: true, maxlength: 120 },
    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },
    hospitalName: { type: String, required: true, trim: true, maxlength: 200 },
    unitsNeeded: { type: String, required: true, trim: true, maxlength: 32 },
    neededBy: { type: Date, required: true },
    urgency: {
      type: String,
      required: true,
      enum: BLOOD_URGENCY_VALUES,
      default: "Low",
    },
    status: {
      type: String,
      required: true,
      enum: BLOOD_REQUEST_STATUS_VALUES,
      default: "Open",
    },
  },
  { timestamps: true },
);

bloodRequestSchema.index({ status: 1, bloodGroup: 1, createdAt: -1 });
bloodRequestSchema.index({ requesterId: 1, createdAt: -1 });

export type BloodRequestDoc = InferSchemaType<typeof bloodRequestSchema>;
export type BloodRequestModel = Model<BloodRequestDoc>;

export const BloodRequest: BloodRequestModel =
  mongoose.models.BloodRequest ??
  mongoose.model<BloodRequestDoc>("BloodRequest", bloodRequestSchema);
