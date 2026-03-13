import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "admin" | "ngo" | "volunteer" | "innovator";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  role: UserRole;
  profileRef?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["admin", "ngo", "volunteer", "innovator"] },
    profileRef: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
