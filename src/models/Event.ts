import mongoose, { Schema, Document, Model } from "mongoose";

export type EventStatus = "pending" | "approved" | "rejected";

export interface IEvent extends Document {
  ngoId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  status: EventStatus;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    ngoId: { type: Schema.Types.ObjectId, ref: "NgoProfile", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    imageUrl: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: Date,
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
