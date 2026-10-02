import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { pwaService, StudyReminderItem } from "../services/pwaService";
import NotificationPermissionModal from "../components/pwa/NotificationPermissionModal";

export default function NotificationSettingsPage() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminders, setReminders] = useState<StudyReminderItem[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const [reminderConfig, setReminderConfig] = useState({
    reminderType: "daily_study",
    time: "20:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    channel: "push",
    isActive: true,
    customMessage: "Time for daily coding session! Keep your 14-day streak alive 🔥",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
    pwaService.getReminders().then((data) => {
      if (data && data.reminders) {
        setReminders(data.reminders);
        if (data.reminders.length > 0) {
          const main = data.reminders[0];
          setReminderConfig({
            reminderType: main.reminderType,
            time: main.time,
            days: main.days,
            channel: main.channel,
            isActive: main.isActive,
            customMessage: main.customMessage,
          });
        }
      }
    });
  }, []);

  const handleDayToggle = (day: string) => {
    setReminderConfig((prev) => {
      const exists = prev.days.includes(day);
      const updated = exists ? prev.days.filter((d) => d !== day) : [...prev.days, day];
      return { ...prev, days: updated };
    });
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pwaService.saveReminder(reminderConfig);
      showToast("✓ Study reminder preferences saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save reminder preferences");
    }
  };

  const handleSendTestNotification = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      showToast("Push notifications not supported on this device");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("KR Global Learning Live Mentorship Alert", {
        body: "Your One-on-One Live Coding Class starts in 15 minutes! Zoom meeting ready.",
        icon: "/favicon.svg",
      });
      showToast("✓ Sample browser push notification dispatched!");
    } else {
      setIsModalOpen(true);
    }
  };

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Notification & Reminder Settings — KR Global Learning"
        description="Configure your study reminder time, push notification channels, and live class alerts."
      />

      <DashboardSidebar role="student" activeTab="notifications" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                  Notification Center & Reminders
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    permissionStatus === "granted"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  Status: {permissionStatus === "granted" ? "Push Enabled ✓" : "Permission Required"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Notification <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">& Study Reminders</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Set personalized study schedules, live session alert channels, and preserve your daily coding consistency streak.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <span>🔔</span> Test Alert
              </button>
            </div>
          </div>
        </div>

        {/* Web Push Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-2xl shrink-0">
              🔔
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Browser Web Push Notifications</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {permissionStatus === "granted"
                  ? "Active and connected to device service worker. You will receive live class reminders."
                  : "Allow notification permissions to receive 15-minute live class and contest alerts."}
              </p>
            </div>
          </div>

          {permissionStatus !== "granted" ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
            >
              Enable Push
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl self-start sm:self-auto">
              ✓ Active
            </span>
          )}
        </div>

        {/* Reminder Configuration Form */}
        <form onSubmit={handleSaveReminder} className="p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⏰</span> Daily Study Schedule & Streak Preserver
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize what time and on which days you would like to be reminded to study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Study Reminder Time</label>
              <input
                type="time"
                value={reminderConfig.time}
                onChange={(e) => setReminderConfig({ ...reminderConfig, time: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Notification Channel</label>
              <select
                value={reminderConfig.channel}
                onChange={(e) => setReminderConfig({ ...reminderConfig, channel: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="push">Browser Web Push Notification</option>
                <option value="whatsapp">WhatsApp Direct Message</option>
                <option value="email">Email Notification</option>
                <option value="all">All Channels (Push + WhatsApp + Email)</option>
              </select>
            </div>
          </div>

          {/* Days Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Active Study Days</label>
            <div className="flex flex-wrap gap-2">
              {allDays.map((day) => {
                const isSelected = reminderConfig.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400"
                        : "bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Custom Motivational Message</label>
            <input
              type="text"
              value={reminderConfig.customMessage}
              onChange={(e) => setReminderConfig({ ...reminderConfig, customMessage: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Save Reminder Preferences
          </button>
        </form>

        {/* Permission Modal */}
        <NotificationPermissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPermissionGranted={() => {
            setPermissionStatus("granted");
            showToast("✓ Push notifications enabled successfully!");
          }}
        />
      </main>
    </div>
  );
}
