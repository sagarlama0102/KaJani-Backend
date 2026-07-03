import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const notificationController = new NotificationController();

router.get("/", authorizationMiddleware, notificationController.getNotifications);
router.get("/unread-count", authorizationMiddleware, notificationController.getUnreadCount);
router.put("/:id/read", authorizationMiddleware, notificationController.markAsRead);
router.put("/mark-all-read", authorizationMiddleware, notificationController.markAllAsRead);

export default router;