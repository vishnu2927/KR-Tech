import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, User as AuthUser, EnrolledCourse } from "../services/authService";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  enrolledCourses?: EnrolledCourse[];
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "demo" | "student" | "assignment" | "system";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  signup: (userData: { name: string; email: string; phone: string; course: string; password?: string }) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string; password?: string }) => Promise<User>;
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "time" | "read">) => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "New Demo Booked",
    message: "Rahul Sharma booked a 1:1 Live Demo for Java Backend Development.",
    time: "10 mins ago",
    read: false,
    type: "demo",
  },
  {
    id: "notif-2",
    title: "New Student Joined",
    message: "Priya Varma enrolled in AWS Certified Solutions Architect track.",
    time: "45 mins ago",
    read: false,
    type: "student",
  },
  {
    id: "notif-3",
    title: "Live Class Reminder",
    message: "Today's session on Microservices Architecture starts at 7:00 PM IST.",
    time: "4 hours ago",
    read: true,
    type: "system",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("krtech_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("krtech_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_NOTIFICATIONS;
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Verify JWT and sync user profile with MongoDB Atlas on startup
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              phone: profile.phone,
              avatar: profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format",
              enrolledCourses: profile.enrolledCourses || [],
              createdAt: profile.createdAt,
            });
          } else {
            setUser(null);
          }
        } catch {
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem("krtech_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string, password?: string): Promise<User> => {
    const res = await authService.login(email, password);
    const loggedInUser: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role,
      phone: res.user.phone,
      avatar: res.user.avatar || (res.user.role === "admin"
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=faces&auto=format"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"),
      enrolledCourses: res.user.enrolledCourses || [],
      createdAt: res.user.createdAt,
    };

    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (userData: { name: string; email: string; phone: string; course: string; password?: string }): Promise<User> => {
    const res = await authService.register({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      course: userData.course,
      role: "student",
    });

    const newUser: User = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      phone: res.user.phone,
      role: "student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format",
      enrolledCourses: res.user.enrolledCourses || [],
      createdAt: res.user.createdAt,
    };

    setUser(newUser);

    addNotification({
      title: "Welcome to KR Tech!",
      message: `Hi ${userData.name}, your student account has been created in our live portal.`,
      type: "system",
    });

    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async (): Promise<User | null> => {
    const p = await authService.getProfile();
    if (p) {
      const u: User = {
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        phone: p.phone,
        avatar: p.avatar,
        enrolledCourses: p.enrolledCourses || [],
        createdAt: p.createdAt,
      };
      setUser(u);
      return u;
    }
    return null;
  };

  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string; password?: string }): Promise<User> => {
    const updated = await authService.updateProfile(data);
    const u: User = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      avatar: updated.avatar,
      enrolledCourses: updated.enrolledCourses || [],
      createdAt: updated.createdAt,
    };
    setUser(u);
    return u;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, "id" | "time" | "read">) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshProfile,
        updateProfile,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
