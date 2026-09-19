import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, GoogleAuthType, CompleteProfileDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { HttpError } from "../errors/http-error";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";
import { IUser } from "../models/user.model";

let userRepository = new UserRepository();

export class UserService {

  // ─── Helper: generate JWT ───────────────────────────────────────
  private generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      provider: user.provider,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  }

  // ─── Helper: format user response (never expose password) ───────
  private formatUser(user: IUser) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      interests: user.interests,
      provider: user.provider,
      isOnboarded: user.isOnboarded,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };
  }

  // ─── Traditional Register ───────────────────────────────────────
  async createUser(data: CreateUserDTO) {
    // Check email
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(409, "Email already in use");
    }


    // Hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10);

    // Create user
    const newUser = await userRepository.createUser({
      
      email: data.email,
      password: hashedPassword,
      provider: "traditional",
      isOnboarded: false,
      isActive: true,
    });

    const token = this.generateToken(newUser);

    return { token, user: this.formatUser(newUser) };
  }

  // ─── Traditional Login ──────────────────────────────────────────
  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    if(user.isDeleted){
      throw new HttpError(403, "This account has been deleted");
    }

    // Google OAuth users don't have a password
    if (!user.password) {
      throw new HttpError(400, "This account uses Google sign-in. Please sign in with Google.");
    }

    // Compare password
    const validPassword = await bcryptjs.compare(data.password, user.password);
    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = this.generateToken(user);

    return { token, user: this.formatUser(user) };
  }

  // ─── Google OAuth ───────────────────────────────────────────────
  async googleSignIn(data: GoogleAuthType) {
    // 1. Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(data.idToken);
    } catch (error) {
      console.log('Firebase token error:', error);
      throw new HttpError(401, "Invalid or expired Google token");
    }

    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      throw new HttpError(400, "No email found in Google account");
    }

    // 2. Check if user already exists
    let user = await userRepository.getUserByEmail(email);

    if (!user) {
      // 3a. New user — create in MongoDB
      const nameParts = (name || "").split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Generate unique username from email
      const baseUsername = email.split("@")[0];
      const usernameTaken = await userRepository.isUsernameTaken(baseUsername);
      const username = usernameTaken
        ? `${baseUsername}_${Date.now()}`
        : baseUsername;

      user = await userRepository.createUser({
        firstName,
        lastName,
        email,
        username,
        profilePicture: picture,
        firebaseUid: uid,
        provider: "google",
        isOnboarded: true,
        isActive: true,
      });
    } else if (!user.firebaseUid) {
      // 3b. Existing traditional user signing in with Google
      // Link their Firebase UID to their account
      user = await userRepository.updateUser(
        user._id.toString(),
        { firebaseUid: uid }
      ) as IUser;
    }

    const token = this.generateToken(user);

    return { token, user: this.formatUser(user) };
  }

  // ─── Complete Profile (Name Capture step) ────────────────────────
async completeProfile(userId: string, data: CompleteProfileDTO) {
  const usernameCheck = await userRepository.getUserByUsername(data.username);
  if (usernameCheck) {
    throw new HttpError(409, "Username already in use");
  }

  const updatedUser = await userRepository.updateUser(userId, {
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    isOnboarded: true,   
  });

  if (!updatedUser) {
    throw new HttpError(404, "User not found");
  }

  const token = this.generateToken(updatedUser);
  return { token, user: this.formatUser(updatedUser) };
}

  // ─── Get Current User ───────────────────────────────────────────
  async getCurrentUser(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return { user: this.formatUser(user) };
  }

  // ─── Update User ────────────────────────────────────────────────
  async updateUser(userId: string, data: UpdateUserDTO) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // never let these be changed via profile update — they're system-managed
  delete (data as any).isOnboarded;
  delete (data as any).isActive;
  delete (data as any).isAdmin;
  delete (data as any).provider;
    if(data.username && data.username !== user.username){
      const taken = await userRepository.getUserByUsername(data.username);
      if(taken) throw new HttpError (409, "Username already in use");
    }
  

    const updatedUser = await userRepository.updateUser(userId, data);
    if (!updatedUser) {
      throw new HttpError(500, "Failed to update user");
    }

    return { user: this.formatUser(updatedUser) };
  }

  // ─── Delete User ────────────────────────────────────────────────
  async deleteUser(id: string) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const deleted = await userRepository.deleteUser(id);
    if (!deleted) {
      throw new HttpError(500, "Failed to delete user");
    }

    return { message: "User deleted successfully" };
  }

  async deleteAccount(userId: string) {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (user.isDeleted) {
    throw new HttpError(400, "Account already deleted");
  }

  // Scrub personal data + soft-delete. Keeps the row so their past
  // participation still resolves (as "Deleted User") instead of breaking.
  await userRepository.updateUser(userId, {
    email: `deleted_${userId}@deleted.kajani`,
    username: null as any,
    firstName: "Deleted",
    lastName: "User",
    profilePicture: null as any,
    password: null as any,
    firebaseUid: null as any,
    isDeleted: true,
    isActive: false,
  });

  return { message: "Account deleted successfully" };
}
}