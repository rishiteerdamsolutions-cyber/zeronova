import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOpportunity extends Document {
  ngoId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    ngoId: { type: Schema.Types.ObjectId, ref: "NgoProfile", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Opportunity: Model<IOpportunity> =
  mongoose.models.Opportunity || mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);
