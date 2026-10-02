import React, { useState } from "react";
import { pwaService } from "../../services/pwaService";

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
}

export default function NotificationPermissionModal({
  isOpen,
  onClose,
  onPermissionGranted,
}: NotificationPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Push notifications are not supported by this browser.");
      onClose();
      return;
    }

    setIsRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Register sample endpoint / token
        await pwaService.registerDevice({
          endpoint: `https://fcm.googleapis.com/fcm/send/krtech_demo_${Date.now()}`,
          browser: navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser",
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
        });
        if (onPermissionGranted) onPermissionGranted();
      }
    } catch (err) {
      console.warn("Permission request failed:", err);
    } finally {
      setIsRequesting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 shadow-2xl shadow-purple-950/50">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-purple-600/40">
            🔔
          </div>
          <h3 className="text-xl font-black text-white">Enable Real-Time Alerts</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Stay ahead in your technical learning journey with instant reminders sent directly to your device screen.
          </p>
        </div>

        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">✓</span>
            <span className="text-slate-200">15-minute One-on-One Live Class & Mentor Reminders</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">✓</span>
            <span className="text-slate-200">Instant Code Review & Hands-On Project Lab Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-400 font-bold">✓</span>
            <span className="text-slate-200">Daily Coding Streak Saver Reminders</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isRequesting ? "Requesting Permission..." : "🔔 Allow Push Notifications"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
