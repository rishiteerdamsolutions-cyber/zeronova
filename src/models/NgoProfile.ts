import mongoose, { Schema, Document, Model } from "mongoose";

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface INgoProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  contactDetails: {
    email?: string;
    phone?: string;
    address?: string;
  };
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NgoProfileSchema = new Schema<INgoProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    contactDetails: {
      email: String,
      phone: String,
      address: String,
    },
    logoUrl: String,
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedAt: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const NgoProfile: Model<INgoProfile> =
  mongoose.models.NgoProfile || mongoose.model<INgoProfile>("NgoProfile", NgoProfileSchema);
