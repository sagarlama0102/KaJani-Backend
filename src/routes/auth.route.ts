import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { authLimiter } from "../middlewares/rate-limit.middleware";

const authController = new AuthController();
const router = Router();

// ─── Public Routes ────────────────────────────────────────────────
router.post("/register", authLimiter, authController.register);
router.post("/login",authLimiter, authController.login);
router.post("/google",authLimiter, authController.googleSignIn); //


// ─── Protected Routes ─────────────────────────────────────────────
router.get("/whoami", authorizationMiddleware, authController.getProfile);
router.post(
  "/complete-profile",
  authorizationMiddleware,
  authController.completeProfile
);
router.post(
  "/update-profile",
  authorizationMiddleware,
  uploads.single("profilePicture"),
  authController.updateProfile
);
router.delete("/account", authorizationMiddleware, authController.deleteAccount);

export default router;