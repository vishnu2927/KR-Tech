import api from "./api";

export type NotificationType =
  | "announcement"
  | "course_reminder"
  | "demo_reminder"
  | "system";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface NotificationItem {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  recipient: string;
  recipientRole: "all" | "student" | "admin";
  isRead: boolean;
  readBy?: string[];
  priority: NotificationPriority;
  actionUrl?: string;
  metadata?: {
    courseId?: string;
    courseTitle?: string;
    batch?: string;
    scheduledTime?: string;
    mentorName?: string;
  };
  createdBy?: {
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  recipient?: string;
  recipientRole?: "all" | "student" | "admin";
  priority?: NotificationPriority;
  actionUrl?: string;
  metadata?: {
    courseId?: string;
    courseTitle?: string;
    batch?: string;
    scheduledTime?: string;
    mentorName?: string;
  };
  createdBy?: {
    name: string;
    role: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Array<{ _id: string; count: number; unread: number }>;
}

export const notificationService = {
  // Fetch notifications with optional filtering & recipient matching
  async getNotifications(params?: {
    type?: string;
    isRead?: boolean | string;
    recipient?: string;
    limit?: number;
  }): Promise<{ notifications: NotificationItem[]; count: number; unreadCount: number }> {
    try {
      const response = await api.get("/notifications", { params });
      return {
        notifications: response.data?.notifications || [],
        count: response.data?.count || 0,
        unreadCount: response.data?.unreadCount || 0,
      };
    } catch (error) {
      console.error("Failed to fetch notifications from Atlas:", error);
      throw error;
    }
  },

  // Mark single notification as read
  async markAsRead(id: string, userIdentifier?: string): Promise<NotificationItem> {
    try {
      const response = await api.patch(`/notifications/${encodeURIComponent(id)}/read`, {
        userIdentifier,
      });
      return response.data?.notification;
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(recipient?: string): Promise<{ modifiedCount: number }> {
    try {
      const response = await api.patch("/notifications/read-all", { recipient });
      return { modifiedCount: response.data?.modifiedCount || 0 };
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  // Create new notification / announcement / reminder (Admin or System)
  async createNotification(payload: CreateNotificationPayload): Promise<NotificationItem> {
    try {
      const response = await api.post("/notifications", payload);
      return response.data?.notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/notifications/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete notification ${id}:`, error);
      throw error;
    }
  },

  // Get statistics
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await api.get("/notifications/stats");
      return response.data?.stats;
    } catch (error) {
      console.error("Failed to get notification stats:", error);
      throw error;
    }
  },
};

export default notificationService;
