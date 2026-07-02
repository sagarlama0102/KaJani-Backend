import { NotificationModel, INotification } from "../models/notification.model";

export interface INotificationRepository {
  createNotification(data: Partial<INotification>): Promise<INotification>;
  getNotificationsByUserId(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

export class NotificationRepository implements INotificationRepository {

  async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = new NotificationModel(data);
    return notification.save();
  }

  async getNotificationsByUserId(userId: string): Promise<INotification[]> {
    return NotificationModel.find({ recipient: userId })
      .populate("sender", "firstName lastName profilePicture username")
      .populate("planId", "title coverImage")
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }
}