import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

const reportController = new ReportController();
const router = Router();

router.post("/", authorizationMiddleware, reportController.createReport);
router.get("/", authorizationMiddleware, reportController.getReports);

export default router;