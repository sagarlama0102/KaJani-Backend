import { QueryFilter } from "mongoose";
import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
  // ─── Auth specific ──────────────────────────────────────────────
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByFirebaseUid(firebaseUid: string): Promise<IUser | null>; // 👈 for Google OAuth
  isEmailTaken(email: string): Promise<boolean>;
  isUsernameTaken(username: string): Promise<boolean>;

  // ─── CRUD ───────────────────────────────────────────────────────
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(page: number, size: number, search?: string): Promise<{ users: IUser[]; total: number }>;
  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {

  // ─── Auth specific ──────────────────────────────────────────────

  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  // Used during Google OAuth to find existing Firebase-linked accounts
  async getUserByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
    return UserModel.findOne({ firebaseUid });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    return !!user;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await UserModel.findOne({ username });
    return !!user;
  }

  // ─── CRUD ───────────────────────────────────────────────────────

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("-password"); // never return password
  }

  async getAllUsers(
    page: number,
    size: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }> {
    const filter: QueryFilter<IUser> = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password")
        .skip((page - 1) * size)
        .limit(size),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // return updated document
    ).select("-password");
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}