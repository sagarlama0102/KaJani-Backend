import mongoose, { Document, Schema} from "mongoose";
import { UserType } from "../types/user.type";
const UserSchame: Schema = new Schema<UserType>(
    {
        firstName: { type: String, trim: true },
        lastName: { type: String,  trim: true },
        username: { type: String, unique: true, sparse: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String },           // bcrypt hashed, not required for OAuth
        
        profilePicture: { type: String },
        interests: [{ type: String }],
        provider: {
        type: String,
        enum: ["traditional", "google"],
        required: true,
    },
        firebaseUid: { type: String, sparse: true }, // sparse = allows multiple nulls
        isOnboarded: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isAdmin: { type: Boolean, default: false},
    },
    {
        timestamps:true,
    }
);
export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>('User', UserSchame );