import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  salary?: string;
  skills?: string[];
  postedBy: mongoose.Types.ObjectId;
  status: "OPEN" | "CLOSED";
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    location: { type: String, required: true },
    salary: { type: String },
    skills: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
  },
  { timestamps: true },
);

export default mongoose.model<IJob>("Job", JobSchema);
