import mongoose, { Document, Schema } from "mongoose";
import { PlanType } from "../types/plan.type";

export interface IPlan extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: "social" | "outdoor" | "sports" | "food" | "educational" | "creative" | "travel";
  coverImage?: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  endDate: string;
  isPublic: boolean;
  maxMembers?: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  creator: mongoose.Types.ObjectId;       
  members: mongoose.Types.ObjectId[];     
  savedBy: mongoose.Types.ObjectId[];  
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["social", "outdoor", "sports", "food", "educational", "creative", "travel"],
    },
    coverImage: { type: String },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    endTime: { type: String, required: true },
    endDate: {type: String, required: true},
    isPublic: { type: Boolean, default: true },
    maxMembers: { type: Number },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const PlanModel = mongoose.model<IPlan>("Plan", PlanSchema);