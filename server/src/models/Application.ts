import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  coverLetter?: string;
  cvPath?: string;
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    coverLetter: { type: String },
    cvPath: { type: String },
  },
  { timestamps: true },
);

ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IApplication>("Application", ApplicationSchema);
