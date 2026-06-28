import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

// ─── Public Routes ────────────────────────────────────────────────
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleSignIn); // 👈 Google OAuth

// ─── Protected Routes ─────────────────────────────────────────────
router.get("/whoami", authorizationMiddleware, authController.getProfile);
router.post(
  "/update-profile",
  authorizationMiddleware,
  uploads.single("profilePicture"),
  authController.updateProfile
);

export default router;