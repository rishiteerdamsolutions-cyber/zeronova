import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollaborationPost extends Document {
  ngoId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollaborationPostSchema = new Schema<ICollaborationPost>(
  {
    ngoId: { type: Schema.Types.ObjectId, ref: "NgoProfile", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, default: "partnership" },
  },
  { timestamps: true }
);

export const CollaborationPost: Model<ICollaborationPost> =
  mongoose.models.CollaborationPost ||
  mongoose.model<ICollaborationPost>("CollaborationPost", CollaborationPostSchema);
