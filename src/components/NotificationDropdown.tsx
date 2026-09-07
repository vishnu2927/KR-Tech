import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { I } from "./Icons";

export default function NotificationDropdown({ isDark = false }: { isDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "demo":
        return "📅";
      case "student":
        return "🎓";
      case "assignment":
        return "💻";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
          isDark
            ? "bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-700"
            : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100"
        }`}
        aria-label="Notifications"
        title="Notifications"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-purple-100 p-4 z-50 animate-scaleIn text-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-sans font-extrabold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    notif.read
                      ? "bg-gray-50/70 border-gray-100 opacity-80"
                      : "bg-purple-50/60 border-purple-200/80 shadow-2xs"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-sm shrink-0 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-sans font-bold text-xs text-gray-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug line-clamp-2">{notif.message}</p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400">No new notifications</div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 mt-2 text-center">
            <span className="text-[10px] text-gray-400 font-medium">
              KR Tech Real-time Notification Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
