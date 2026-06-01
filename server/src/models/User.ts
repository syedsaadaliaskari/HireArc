import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "SEEKER" | "EMPLOYER";
  bio?: string;
  skills?: string[];
  avatar?: string;
  company?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["SEEKER", "EMPLOYER"], default: "SEEKER" },
    bio: { type: String },
    skills: [{ type: String }],
    avatar: { type: String },
    company: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
