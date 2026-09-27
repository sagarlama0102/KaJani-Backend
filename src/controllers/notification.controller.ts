import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { HttpError } from "../errors/http-error";

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
      console.error(error);
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error instanceof HttpError
        ? error.message : "Something went wrong. Please try again.",
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
      console.error(error);
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error instanceof HttpError
        ? error.message : "Something went wrong. Please try again.",
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
      console.error(error);
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error instanceof HttpError
        ? error.message : "Something went wrong. Please try again.",
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
      console.error(error);
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error instanceof HttpError
        ? error.message : "Something went wrong. Please try again.",
      });
    }
  }
  async clearAll(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id.toString();
    const result = await notificationService.clearAllNotifications(userId);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    console.error(error);
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error instanceof HttpError
        ? error.message : "Something went wrong. Please try again.",
    });
  }
}
}
