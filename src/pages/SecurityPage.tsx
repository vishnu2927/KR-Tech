import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService, DeviceSession } from "../services/authService";
import { I } from "../components/Icons";

export default function SecurityPage() {
  const { user, logoutAll, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [loggingOutAll, setLoggingOutAll] = useState<boolean>(false);

  // Password update form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // General feedback
  const [bannerMsg, setBannerMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const activeSessions = await authService.getSessions();
      setSessions(activeSessions);
    } catch {
      // Fallback
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await authService.revokeSession(sessionId);
      setBannerMsg({ type: "success", text: "Device session revoked successfully." });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      setBannerMsg({ type: "error", text: err.message || "Failed to revoke session." });
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out from all devices? You will be signed out immediately.")) {
      return;
    }
    setLoggingOutAll(true);
    try {
      await logoutAll();
      navigate("/login");
    } catch (err: any) {
      setBannerMsg({ type: "error", text: err.message || "Failed to log out all devices." });
      setLoggingOutAll(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await updateProfile({ password: newPassword });
      setPasswordSuccess("Password updated securely in MongoDB Atlas!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Account Security</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>🛡️ Security & Active Devices</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage your active login sessions, rotate access credentials, and monitor authenticated devices.
              </p>
            </div>

            <button
              type="button"
              disabled={loggingOutAll || sessions.length === 0}
              onClick={handleLogoutAll}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loggingOutAll ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <span>🚪 Log Out All Devices</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Banner Notification */}
        {bannerMsg && (
          <div
            className={`p-4 mb-6 rounded-2xl border text-xs flex items-center justify-between ${
              bannerMsg.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{bannerMsg.type === "success" ? "✓" : "⚠️"}</span>
              <span>{bannerMsg.text}</span>
            </div>
            <button
              onClick={() => setBannerMsg(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Devices / Sessions List (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>📱 Active Devices & Sessions</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono">
                      {sessions.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sessions authorized with JWT & MongoDB Atlas TTL refresh tokens.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchSessions}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  ↻ Refresh
                </button>
              </div>

              {loadingSessions ? (
                <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                  <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading active sessions from Atlas...</span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
                  <span>No other active sessions detected. You are logged in on this device.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id || index}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        session.isCurrent
                          ? "bg-purple-950/20 border-purple-500/30 shadow-xs"
                          : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            session.isCurrent
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {session.deviceInfo?.toLowerCase().includes("mobile") ||
                          session.os?.toLowerCase().includes("android") ||
                          session.os?.toLowerCase().includes("ios")
                            ? "📱"
                            : "💻"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {session.deviceInfo || `${session.browser} on ${session.os}`}
                            </span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold">
                                Current Session
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                            <span>IP: <code className="text-slate-300">{session.ipAddress}</code></span>
                            <span>•</span>
                            <span>Last Active: {formatDate(session.lastActive)}</span>
                            <span>•</span>
                            <span className="text-slate-500">
                              TTL: 30d Refresh Token
                            </span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          type="button"
                          disabled={revokingId === session.id}
                          onClick={() => handleRevoke(session.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer self-end sm:self-center disabled:opacity-50"
                        >
                          {revokingId === session.id ? "Revoking..." : "Revoke"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Protection Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🔐 Security Verification Status</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Password Encryption</h4>
                    <p className="text-[11px] text-slate-400">Bcrypt Salt Rounds 10</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">MongoDB TTL Indices</h4>
                    <p className="text-[11px] text-slate-400">Auto-Expiry on OTP & Sessions</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">JWT Access Tokens</h4>
                    <p className="text-[11px] text-slate-400">Signed with HS256 algorithm</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Refresh Token Rotation</h4>
                    <p className="text-[11px] text-slate-400">Session model connected in Atlas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Update Password & Security Quick Links */}
          <div className="space-y-6">
            {/* Update Password Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>🔑 Change Password</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Update your student portal password. All other active sessions will be terminated automatically.
              </p>

              {passwordError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updatingPassword ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Hashing & Saving...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Support Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Need Help?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you suspect unauthorized access to your KR Global Learning student profile, please contact IT Security immediately.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:security@krtech.edu"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>✉️ security@krtech.edu</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
