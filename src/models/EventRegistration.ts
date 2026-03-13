import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId;
  status: string;
  createdAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "registered" },
  },
  { timestamps: true }
);

EventRegistrationSchema.index({ eventId: 1, volunteerId: 1 }, { unique: true });

export const EventRegistration: Model<IEventRegistration> =
  mongoose.models.EventRegistration ||
  mongoose.model<IEventRegistration>("EventRegistration", EventRegistrationSchema);
