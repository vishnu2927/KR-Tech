import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiClient } from "../services/apiClient";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  body?: string;
  type: "live" | "assignment" | "quiz" | "cert" | "payment" | "goal" | "general";
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  expoPushToken: string | null;
  unreadCount: number;
  notifications: PushNotificationItem[];
  scheduleLocalAlert: (title: string, body: string, data?: any, delaySeconds?: number) => Promise<void>;
  sendInstantNotification: (title: string, body: string) => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationItem[]>([
    {
      id: "notif-1",
      title: "🔴 Live Class Starting in 15m",
      message: "Microservices & Distributed Systems with Senior Architect Rajesh Kumar starts at 7:00 PM IST.",
      body: "Microservices & Distributed Systems with Senior Architect Rajesh Kumar starts at 7:00 PM IST.",
      type: "live",
      timestamp: "10 mins ago",
      read: false,
    },
    {
      id: "notif-2",
      title: "🏆 Certificate Verified & Issued",
      message: "Congratulations! Your Full Stack AI Architect credential KRGL-2026-AI9821 is ready in your wallet.",
      body: "Congratulations! Your Full Stack AI Architect credential KRGL-2026-AI9821 is ready in your wallet.",
      type: "cert",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "notif-3",
      title: "📝 Assignment Due Tomorrow",
      message: "Dockerize Multi-Service Backend submission deadline is Sep 26, 11:59 PM.",
      body: "Dockerize Multi-Service Backend submission deadline is Sep 26, 11:59 PM.",
      type: "assignment",
      timestamp: "5 hours ago",
      read: true,
    },
    {
      id: "notif-4",
      title: "💳 Payment Invoice Generated",
      message: "Tax Invoice KR-INV-2026-8819 for ₹4,999 has been generated. Tap to download PDF.",
      body: "Tax Invoice KR-INV-2026-8819 for ₹4,999 has been generated. Tap to download PDF.",
      type: "payment",
      timestamp: "Yesterday",
      read: true,
    },
    {
      id: "notif-5",
      title: "🔥 14-Day Study Streak Maintained!",
      message: "Great work! You reached today's 45-minute target. AI Mentor recommended next lesson.",
      body: "Great work! You reached today's 45-minute target. AI Mentor recommended next lesson.",
      type: "goal",
      timestamp: "Yesterday",
      read: true,
    },
  ]);

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        apiClient.post("/notifications/register-token", { token }).catch(() => {});
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const newNotif: PushNotificationItem = {
        id: notification.request.identifier,
        title: notification.request.content.title || "KR Global Learning",
        message: notification.request.content.body || "",
        body: notification.request.content.body || "",
        type: (notification.request.content.data?.type as any) || "general",
        timestamp: "Just now",
        read: false,
        data: notification.request.content.data,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("User tapped notification with data:", data);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleLocalAlert = async (
    title: string,
    body: string,
    data: any = {},
    delaySeconds: number = 2
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: {
        seconds: delaySeconds,
      } as any,
    });
  };

  const sendInstantNotification = async (title: string, body: string) => {
    await scheduleLocalAlert(title, body, {}, 1);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    Notifications.setBadgeCountAsync(0).catch(() => {});
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    Notifications.setBadgeCountAsync(0).catch(() => {});
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        unreadCount,
        notifications,
        scheduleLocalAlert,
        sendInstantNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "kr-global-learning-mobile-production",
    }).catch(() => null);

    return tokenData?.data || null;
  } catch (err) {
    return null;
  }
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};
