import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { notificationService, NotificationItem } from "../services/notificationService";

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [composer, setComposer] = useState({
    title: "",
    message: "",
    type: "announcement" as const,
    recipientRole: "all" as const,
    priority: "normal" as const,
    actionUrl: "/live",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications(30);
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err: any) {
      console.error("Fetch notifications error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composer.title.trim() || !composer.message.trim()) {
      showToast("Please provide both title and announcement body");
      return;
    }

    try {
      await notificationService.createNotification(composer);
      showToast("✓ Broadcast announcement dispatched to all connected students!");
      setComposer({
        title: "",
        message: "",
        type: "announcement",
        recipientRole: "all",
        priority: "normal",
        actionUrl: "/live",
      });
      fetchNotifications();
    } catch (err: any) {
      showToast(err.message || "Failed to broadcast notification");
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Notification & Broadcast Center — KR Global Learning Admin Suite"
        description="Compose system announcements, push cohort reminders, and manage multi-channel alerts."
      />

      <DashboardSidebar role="admin" activeTab="notifications" onTabChange={() => {}} />

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
                  Communications & Broadcast Engine
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  98.8% Delivery Rate
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Notification <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Broadcast Center</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Send targeted instant messages, cohort assignment reminders, live class alerts, and platform announcements to thousands of students simultaneously.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>←</span> Founder Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Broadcasts Sent</p>
            <h4 className="text-2xl font-black text-white mt-1">128</h4>
            <span className="text-[11px] text-emerald-400 font-semibold">Active notifications</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Student Read Rate</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">74.2%</h4>
            <span className="text-[11px] text-cyan-300 font-semibold">Within 30 minutes</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Urgent Broadcasts</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">8</h4>
            <span className="text-[11px] text-slate-400 font-semibold">Session updates</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Automated Triggers</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">3,420</h4>
            <span className="text-[11px] text-emerald-300 font-semibold">24h + 30m Class Reminders</span>
          </div>
        </div>

        {/* Layout: Composer on Left, Broadcast History on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Broadcast Composer */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 md:p-7 space-y-5 shadow-2xl backdrop-blur-xl">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📢</span> Send Broadcast Announcement
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct notification payload sent to student dashboard bell icons and notification drawers.
              </p>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS NQT Digital Track 2026 Mock Test Registrations Open!"
                  value={composer.title}
                  onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, meeting links, or guidance for students..."
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audience Target</label>
                  <select
                    value={composer.recipientRole}
                    onChange={(e) => setComposer({ ...composer, recipientRole: e.target.value as any })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="all">All Users & Visitors</option>
                    <option value="student">Enrolled Students Only</option>
                    <option value="admin">Administrators Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={composer.priority}
                    onChange={(e) => setComposer({ ...composer, priority: e.target.value as any })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Banner Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Click Action URL</label>
                <input
                  type="text"
                  placeholder="/certificates or /live or /courses"
                  value={composer.actionUrl}
                  onChange={(e) => setComposer({ ...composer, actionUrl: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span> Dispatch Broadcast
              </button>
            </form>
          </div>

          {/* Broadcast History Table */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Live Broadcast Dispatch Log</h3>
                <p className="text-xs text-slate-400">Chronological history of notifications sent across the platform.</p>
              </div>
              <button
                type="button"
                onClick={fetchNotifications}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No notifications found. Send your first broadcast above!
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{n.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            n.priority === "urgent"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : n.priority === "high"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {n.priority}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/60">
                      <span>Target: <strong className="text-purple-300 uppercase">{n.recipientRole || "all"}</strong></span>
                      {n.actionUrl && (
                        <Link to={n.actionUrl} className="text-purple-400 hover:underline">
                          Link: {n.actionUrl} →
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
