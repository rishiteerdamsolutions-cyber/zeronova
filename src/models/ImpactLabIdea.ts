import mongoose, { Schema, Document, Model } from "mongoose";

export type IdeaStatus = "pending" | "approved" | "rejected";

export interface IImpactLabIdea extends Document {
  submitterId: mongoose.Types.ObjectId;
  submitterRole: string;
  title: string;
  description: string;
  category?: string;
  status: IdeaStatus;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ImpactLabIdeaSchema = new Schema<IImpactLabIdea>(
  {
    submitterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submitterRole: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedAt: Date,
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ImpactLabIdea: Model<IImpactLabIdea> =
  mongoose.models.ImpactLabIdea ||
  mongoose.model<IImpactLabIdea>("ImpactLabIdea", ImpactLabIdeaSchema);
