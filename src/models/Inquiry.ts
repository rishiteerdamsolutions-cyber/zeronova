import mongoose, { Schema, Document, Model } from "mongoose";

export type InquiryType = "volunteer" | "contact";

export interface IInquiry extends Document {
  ngoId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  type: InquiryType;
  opportunityId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    ngoId: { type: Schema.Types.ObjectId, ref: "NgoProfile", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["volunteer", "contact"], required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: "Opportunity" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
