import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  reportedUser: mongoose.Types.ObjectId;
  reason: string;
  note?: string;
  status: "pending" | "reviewed";
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    note: { type: String },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);