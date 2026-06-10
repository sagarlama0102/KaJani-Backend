import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

let planController = new PlanController();
const router = Router();

router.get("/", planController.getAllPlans);
router.get("/:id", planController.getPlanById);


router.post("/", authorizationMiddleware, planController.createPlan);             // create plan
router.put("/:id", authorizationMiddleware, planController.updatePlan);           // update plan
router.delete("/:id", authorizationMiddleware, planController.deletePlan);

router.get("/user/my-plans", authorizationMiddleware, planController.getMyPlans);         // my plans
router.get("/user/joined", authorizationMiddleware, planController.getJoinedPlans);       // joined plans
router.get("/user/saved", authorizationMiddleware, planController.getSavedPlans);

router.post("/:id/join", authorizationMiddleware, planController.joinPlan);               // join plan
router.post("/:id/leave", authorizationMiddleware, planController.leavePlan);             // leave plan
router.post("/:id/save", authorizationMiddleware, planController.toggleSavePlan);

export default router;