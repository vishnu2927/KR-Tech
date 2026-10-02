import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationService, NotificationItem, NotificationType } from "../services/notificationService";

interface NotificationDropdownProps {
  isDark?: boolean;
}

export default function NotificationDropdown({ isDark = false }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterTab, setFilterTab] = useState<"all" | "announcement" | "reminder" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load notifications from MongoDB Atlas
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({
        recipient: user?.email,
      });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.warn("Notice: notification fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 45s for live background notifications
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (e: React.MouseEvent, notif: NotificationItem) => {
    e.stopPropagation();
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id, user?.email);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }

    if (notif.actionUrl) {
      setOpen(false);
      if (notif.actionUrl.startsWith("http")) {
        window.open(notif.actionUrl, "_blank");
      } else {
        navigate(notif.actionUrl);
      }
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead(user?.email);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Delete notification
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      const deleted = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filterTab === "all") return true;
    if (filterTab === "announcement") return n.type === "announcement";
    if (filterTab === "reminder") return n.type === "course_reminder" || n.type === "demo_reminder";
    if (filterTab === "unread") return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "announcement":
        return "📢";
      case "course_reminder":
        return "⏰";
      case "demo_reminder":
        return "📅";
      case "system":
        return "⚡";
      default:
        return "🔔";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchNotifications();
        }}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
          isDark
            ? "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700"
            : "bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700/40"
        }`}
        aria-label="Notifications"
        title="Notifications Center"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse shadow-md shadow-red-500/40 border border-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2.5 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-4 z-50 animate-scaleIn text-slate-100 divide-y divide-slate-800/80">
          {/* Header */}
          <div className="pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">All caught up</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                filterTab === "all"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("announcement")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                filterTab === "announcement"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              📢 News
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("reminder")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                filterTab === "reminder"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              ⏰ Reminders
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("unread")}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                filterTab === "unread"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              🔴 Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="pt-2 space-y-2 max-h-84 overflow-y-auto pr-1">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <span className="text-3xl block mb-2">🎉</span>
                <p className="text-xs font-semibold text-slate-300">No notifications found</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {filterTab === "unread"
                    ? "You are completely up to date!"
                    : "No alerts matching this filter."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={(e) => handleMarkAsRead(e, notif)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group relative ${
                    notif.isRead
                      ? "bg-slate-900/50 border-slate-800/80 opacity-75 hover:opacity-100 hover:bg-slate-800/50"
                      : "bg-slate-800/70 border-purple-500/40 shadow-md shadow-purple-950/20 hover:bg-slate-800"
                  }`}
                >
                  {/* Icon Box */}
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0 shadow">
                    {getIcon(notif.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getPriorityBadge(notif.priority)}`}>
                        {notif.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-purple-300 transition">
                      {notif.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Metadata Pill */}
                    {notif.metadata?.scheduledTime && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-cyan-300 font-medium">
                        <span>🗓️</span>
                        <span>{notif.metadata.scheduledTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Unread Indicator Dot */}
                  {!notif.isRead && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, notif._id)}
                    className="absolute bottom-2 right-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
