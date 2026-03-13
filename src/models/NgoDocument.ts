import mongoose, { Schema, Document, Model } from "mongoose";

export type DocVerificationStatus = "pending" | "approved" | "rejected";

export interface INgoDocument extends Document {
  ngoId: mongoose.Types.ObjectId;
  docType: string;
  fileUrl: string;
  verificationStatus: DocVerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NgoDocumentSchema = new Schema<INgoDocument>(
  {
    ngoId: { type: Schema.Types.ObjectId, ref: "NgoProfile", required: true },
    docType: { type: String, required: true },
    fileUrl: { type: String, required: true },
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

export const NgoDocument: Model<INgoDocument> =
  mongoose.models.NgoDocument ||
  mongoose.model<INgoDocument>("NgoDocument", NgoDocumentSchema);
