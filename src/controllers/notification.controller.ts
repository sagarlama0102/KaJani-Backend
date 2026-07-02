import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export class NotificationController {

  // ─── Get Notifications ───────────────────────────────────────────
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const notifications = await notificationService.getNotifications(userId);
      return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Mark As Read ────────────────────────────────────────────────
  async markAsRead(req: Request, res: Response) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id as string
      );
      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Mark All As Read ────────────────────────────────────────────
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      await notificationService.markAllAsRead(userId);
      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // ─── Get Unread Count ────────────────────────────────────────────
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id.toString();
      const result = await notificationService.getUnreadCount(userId);
      return res.status(200).json({
        success: true,
        message: "Unread count fetched",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
