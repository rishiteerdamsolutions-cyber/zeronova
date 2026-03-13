import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVolunteerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  displayName?: string;
  skills: string[];
  interests: string[];
  experience: string;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerProfileSchema = new Schema<IVolunteerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName: String,
    skills: [{ type: String }],
    interests: [{ type: String }],
    experience: { type: String, default: "" },
  },
  { timestamps: true }
);

export const VolunteerProfile: Model<IVolunteerProfile> =
  mongoose.models.VolunteerProfile ||
  mongoose.model<IVolunteerProfile>("VolunteerProfile", VolunteerProfileSchema);
