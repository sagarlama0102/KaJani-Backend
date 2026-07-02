import { NotificationRepository } from "../repositories/notification.repository";
import { UserRepository } from "../repositories/user.repository";

const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();

export class NotificationService {

  // ─── Create Join Notification ────────────────────────────────────
  async createJoinNotification(
    joinerId: string,   // user who joined
    creatorId: string,  // plan creator
    planId: string,
    planTitle: string,
  ) {
    const joiner = await userRepository.getUserById(joinerId);
    if (!joiner) return;

    const joinerName = `${joiner.firstName} ${joiner.lastName}`;

    // 1. Notify the creator — "someone joined your plan"
    if (joinerId !== creatorId) { // don't notify if creator joins their own plan
      await notificationRepository.createNotification({
        recipient: creatorId as any,
        sender: joinerId as any,
        type: "plan_joined",
        planId: planId as any,
        message: `${joinerName} joined your plan "${planTitle}"`,
        isRead: false,
      });
    }

    // 2. Notify the joiner — "you successfully joined"
    await notificationRepository.createNotification({
      recipient: joinerId as any,
      sender: joinerId as any,
      type: "plan_joined",
      planId: planId as any,
      message: `You successfully joined "${planTitle}"`,
      isRead: false,
    });
  }

  // ─── Create Leave Notification ───────────────────────────────────
  async createLeaveNotification(
    leaverId: string,
    creatorId: string,
    planId: string,
    planTitle: string,
  ) {
    const leaver = await userRepository.getUserById(leaverId);
    if (!leaver) return;

    const leaverName = `${leaver.firstName} ${leaver.lastName}`;

    // Notify the creator — "someone left your plan"
    await notificationRepository.createNotification({
      recipient: creatorId as any,
      sender: leaverId as any,
      type: "plan_left",
      planId: planId as any,
      message: `${leaverName} left your plan "${planTitle}"`,
      isRead: false,
    });
  }

  // ─── Get Notifications ───────────────────────────────────────────
  async getNotifications(userId: string) {
    return notificationRepository.getNotificationsByUserId(userId);
  }

  // ─── Mark As Read ────────────────────────────────────────────────
  async markAsRead(notificationId: string) {
    return notificationRepository.markAsRead(notificationId);
  }

  // ─── Mark All As Read ────────────────────────────────────────────
  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  // ─── Get Unread Count ────────────────────────────────────────────
  async getUnreadCount(userId: string) {
    const count = await notificationRepository.getUnreadCount(userId);
    return { count };
  }
}