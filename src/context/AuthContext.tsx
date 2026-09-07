import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar: string;
  enrolledTrack?: string;
  mentor?: string;
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
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signup: (userData: { name: string; email: string; phone: string; course: string }) => Promise<boolean>;
  logout: () => void;
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
    title: "New Assignment Uploaded",
    message: "Rajesh Kumar uploaded Assignment #4: Kafka Dead Letter Queue Handler.",
    time: "2 hours ago",
    read: false,
    type: "assignment",
  },
  {
    id: "notif-4",
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
    // Default logged in as student for seamless interactive preview
    return {
      id: "std-1",
      name: "Aditya Sharma",
      email: "aditya.sharma@krtech.edu",
      role: "student",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format",
      enrolledTrack: "Java Backend & Spring Boot Microservices Track",
      mentor: "Rajesh Kumar (Ex-Amazon)",
    };
  });

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

  useEffect(() => {
    if (user) {
      localStorage.setItem("krtech_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("krtech_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("krtech_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string, _password?: string, forcedRole?: UserRole): Promise<boolean> => {
    // Determine role based on email or forcedRole
    const isAdmin = forcedRole === "admin" || email.toLowerCase().includes("admin");
    const newUser: User = {
      id: isAdmin ? "adm-1" : "std-1",
      name: isAdmin ? "Admin Operations Lead" : (email.split("@")[0].replace(".", " ").toUpperCase() || "Aditya Sharma"),
      email: email.trim(),
      role: isAdmin ? "admin" : "student",
      phone: "+91 98765 43210",
      avatar: isAdmin
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=faces&auto=format"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format",
      enrolledTrack: isAdmin ? undefined : "Java Backend & Spring Boot Microservices Track",
      mentor: isAdmin ? undefined : "Rajesh Kumar (Ex-Amazon)",
    };

    setUser(newUser);
    return true;
  };

  const signup = async (userData: { name: string; email: string; phone: string; course: string }): Promise<boolean> => {
    const newUser: User = {
      id: `std-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: "student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format",
      enrolledTrack: userData.course || "Java Backend & Spring Boot Microservices Track",
      mentor: "Rajesh Kumar (Ex-Amazon)",
    };

    setUser(newUser);

    // Add notification for new student
    addNotification({
      title: "New Student Joined",
      message: `${userData.name} just signed up for ${userData.course || "1:1 Live Training"}.`,
      type: "student",
    });

    return true;
  };

  const logout = () => {
    setUser(null);
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
        login,
        signup,
        logout,
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
