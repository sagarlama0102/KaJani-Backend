import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO, GoogleAuthSchema, UpdateUserDTO, CompleteProfileDTO, ChangePasswordDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import z from "zod";

let userService = new UserService();

export class AuthController {

  // ─── Traditional Register ───────────────────────────────────────
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Traditional Login ──────────────────────────────────────────
  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const loginData: LoginUserDTO = parsedData.data;
      const { token, user } = await userService.loginUser(loginData);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Complete Profile (Name Capture step) ────────────────────────
async completeProfile(req: Request, res: Response) {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }
    const parsedData = CompleteProfileDTO.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: z.prettifyError(parsedData.error),
      });
    }
    const { token, user } = await userService.completeProfile(userId, parsedData.data);
    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: user,
      token,
    });
  } catch (error: Error | any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

  // ─── Google OAuth ───────────────────────────────────────────────
  async googleSignIn(req: Request, res: Response) {
    try {
      const parsedData = GoogleAuthSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const { token, user } = await userService.googleSignIn(parsedData.data);
      return res.status(200).json({
        success: true,
        message: "Google sign-in successful",
        data: user,
        token,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get Current User ───────────────────────────────────────────
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id.toString();
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }
      const user = await userService.getCurrentUser(userId);
      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Update Profile ─────────────────────────────────────────────
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id.toString();
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });
      }
      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      if (req.file) {
        parsedData.data.profilePicture = req.file.path;
      }
      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Delete Account ─────────────────────────────────────────────
  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const result = await userService.deleteAccount(userId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Change Password ────────────────────────────────────────────
async changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id.toString();
    const parsedData = ChangePasswordDTO.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: z.prettifyError(parsedData.error),
      });
    }
    const result = await userService.changePassword(
      userId,
      parsedData.data.currentPassword,
      parsedData.data.newPassword,
    );
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
}   
