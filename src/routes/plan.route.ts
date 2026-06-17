import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";

const planController = new PlanController();
const router = Router();

// ─── Specific routes FIRST ──────────────────────────────────────
router.post(
  "/upload-cover",
  authorizationMiddleware,
  uploads.single("coverImage"),
  planController.uploadCoverImage
);

router.get("/user/my-plans", authorizationMiddleware, planController.getMyPlans);
router.get("/user/joined", authorizationMiddleware, planController.getJoinedPlans);
router.get("/user/saved", authorizationMiddleware, planController.getSavedPlans);

// ─── General routes ──────────────────────────────────────────────
router.get("/", planController.getAllPlans);
router.post("/", authorizationMiddleware, planController.createPlan);

// ─── Dynamic :id routes LAST ─────────────────────────────────────
router.get("/:id", planController.getPlanById);
router.put("/:id", authorizationMiddleware, planController.updatePlan);
router.delete("/:id", authorizationMiddleware, planController.deletePlan);

router.post("/:id/join", authorizationMiddleware, planController.joinPlan);
router.post("/:id/leave", authorizationMiddleware, planController.leavePlan);
router.post("/:id/save", authorizationMiddleware, planController.toggleSavePlan);

export default router;