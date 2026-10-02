import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUpcomingSessions,
  joinSession,
  downloadICS,
  getMyAttendance,
  type LiveSession,
  type AttendanceRecord,
} from "../services/liveClassService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

/* ──────── Helpers ──────── */
const platformIcons: Record<string, string> = {
  zoom: "🎥",
  google_meet: "📹",
  teams: "💼",
  custom: "🔗",
};

const platformLabels: Record<string, string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  teams: "MS Teams",
  custom: "Custom Link",
};

const statusColors: Record<string, string> = {
  scheduled: "text-cyan-400 bg-cyan-400/10 border-cyan-500/30",
  live: "text-red-400 bg-red-400/15 border-red-500/40",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
  cancelled: "text-slate-400 bg-slate-400/10 border-slate-500/30",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff < 0) return "Started";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/* ──────── LiveClassCard ──────── */
function LiveClassCard({
  session,
  onJoin,
  joining,
}: {
  session: LiveSession;
  onJoin: (id: string) => void;
  joining: string | null;
}) {
  const courseTitle =
    typeof session.course === "object" ? session.course.title : "Course";
  const isLive = session.status === "live";
  const isScheduled = session.status === "scheduled";
  const scheduledDate = new Date(session.scheduledAt);
  const isStartingSoon =
    isScheduled && scheduledDate.getTime() - Date.now() < 30 * 60 * 1000;

  return (
    <div
      className={`group relative bg-[#0d1025]/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_40px_rgba(0,240,255,0.12)] ${
        isLive
          ? "border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
          : "border-slate-700/50 hover:border-cyan-500/30"
      }`}
    >
      {/* Live Pulse Badge */}
      {isLive && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/40 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-red-300 text-xs font-bold tracking-wider uppercase">
            LIVE NOW
          </span>
        </div>
      )}

      {/* Starting Soon Badge */}
      {isStartingSoon && !isLive && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 backdrop-blur-sm border border-amber-500/30 rounded-full">
          <span className="text-amber-400 text-xs font-semibold">
            ⏰ Starting in {timeUntil(session.scheduledAt)}
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-4">
        {/* Platform + Course Tag */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20 rounded-full">
            {platformIcons[session.platform]}{" "}
            {platformLabels[session.platform]}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full truncate max-w-[180px]">
            {courseTitle}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {session.title}
        </h3>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {session.description}
          </p>
        )}

        {/* Mentor + Time Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Mentor
            </p>
            <p className="text-sm font-semibold text-white">
              {session.mentorName || "TBA"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Duration
            </p>
            <p className="text-sm font-semibold text-white">
              {session.duration} min
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Date
            </p>
            <p className="text-sm font-semibold text-cyan-300">
              {formatDate(session.scheduledAt)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Time
            </p>
            <p className="text-sm font-semibold text-cyan-300">
              {formatTime(session.scheduledAt)}
            </p>
          </div>
        </div>

        {/* Topics */}
        {session.topics && session.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {session.topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] bg-slate-800/60 text-slate-300 border border-slate-700/40 rounded-full"
              >
                {topic}
              </span>
            ))}
            {session.topics.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{session.topics.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>👥</span>
            <span>
              {session.attendeeCount}/{session.maxAttendees}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Calendar Download */}
            {(isScheduled || isLive) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadICS(session._id);
                }}
                className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:bg-cyan-500/15 hover:text-cyan-400 border border-slate-700/40 hover:border-cyan-500/30 transition-all text-sm cursor-pointer"
                title="Add to Calendar"
              >
                📅
              </button>
            )}

            {/* Join / View Button */}
            {isLive && (
              <button
                onClick={() => onJoin(session._id)}
                disabled={joining === session._id}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {joining === session._id ? "Joining..." : "🔴 Join Live"}
              </button>
            )}

            {isScheduled && (
              <button
                onClick={() => onJoin(session._id)}
                disabled={
                  joining === session._id ||
                  scheduledDate.getTime() - Date.now() > 30 * 60 * 1000
                }
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  scheduledDate.getTime() - Date.now() <= 30 * 60 * 1000
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/40"
                } disabled:opacity-50`}
              >
                {joining === session._id
                  ? "Joining..."
                  : scheduledDate.getTime() - Date.now() <= 30 * 60 * 1000
                  ? "Join Now"
                  : `In ${timeUntil(session.scheduledAt)}`}
              </button>
            )}

            {session.status === "completed" && (
              <Link
                to={`/live/session/${session._id}`}
                className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm font-medium hover:bg-emerald-500/15 hover:text-emerald-400 border border-slate-700/40 hover:border-emerald-500/30 transition-all no-underline"
              >
                View Recording
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────── AttendanceBadge ──────── */
function AttendanceBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    present: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    late: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    absent: "bg-red-500/15 text-red-400 border-red-500/30",
    excused: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold border rounded-full ${
        styles[status] || styles.absent
      }`}
    >
      {status === "present" && "✅ "}
      {status === "late" && "⏰ "}
      {status === "absent" && "❌ "}
      {status === "excused" && "📋 "}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ──────── Main Page ──────── */
export default function LiveClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "attendance">("upcoming");
  const [joining, setJoining] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "upcoming") {
        const res = await getUpcomingSessions({ limit: 50 });
        setSessions(res.data || []);
      } else {
        const res = await getMyAttendance({ limit: 50 });
        setAttendance(res.data || []);
      }
    } catch (err) {
      console.warn("Failed to load live class data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(sessionId: string) {
    setJoining(sessionId);
    try {
      const res = await joinSession(sessionId);
      setToast({ msg: res.message || "Joined!", type: "success" });

      // Open meeting link if available
      const session = sessions.find((s) => s._id === sessionId);
      if (session?.meetingLink) {
        window.open(session.meetingLink, "_blank");
      }

      // Refresh
      await loadData();
    } catch (err: any) {
      setToast({
        msg: err?.response?.data?.message || "Failed to join",
        type: "error",
      });
    } finally {
      setJoining(null);
    }
  }

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mentorName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform =
        platformFilter === "all" || s.platform === platformFilter;
      return matchSearch && matchPlatform;
    });
  }, [sessions, searchQuery, platformFilter]);

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const liveSessions = filteredSessions.filter((s) => s.status === "live");
  const scheduledSessions = filteredSessions.filter(
    (s) => s.status === "scheduled"
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title="Live Classes | KR Global Learning"
        description="Join live interactive coding sessions with expert mentors. Zoom &amp; Google Meet integrated with attendance tracking."
      />

      {/* Ambient background */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[400px] bg-gradient-to-r from-cyan-500/8 via-purple-500/8 to-pink-500/8 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-gradient-to-l from-blue-500/6 to-emerald-500/6 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 animate-[slideInRight_0.3s_ease] ${
            toast.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border-red-500/30 text-red-300"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link
                to="/dashboard"
                className="hover:text-cyan-400 transition no-underline"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-cyan-400">Live Classes</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Live Classes
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Join real-time sessions with expert mentors via Zoom & Google Meet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/live/recordings"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-500/10 transition-all text-sm font-medium no-underline"
            >
              🎬 Recordings
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 w-fit">
          {(["upcoming", "attendance"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "upcoming" ? "📡 Upcoming" : "📊 My Attendance"}
            </button>
          ))}
        </div>

        {/* Filters */}
        {tab === "upcoming" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/40 rounded-xl text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition"
              />
            </div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-900/60 border border-slate-700/40 rounded-xl text-sm text-slate-300 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="zoom">Zoom</option>
              <option value="google_meet">Google Meet</option>
              <option value="teams">MS Teams</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner
              size="lg"
              label="Loading live classes..."
              fullScreen={false}
            />
          </div>
        ) : tab === "upcoming" ? (
          <div className="space-y-8">
            {/* Live Now Section */}
            {liveSessions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  Live Now
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {liveSessions.map((s) => (
                    <LiveClassCard
                      key={s._id}
                      session={s}
                      onJoin={handleJoin}
                      joining={joining}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Section */}
            {scheduledSessions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  📅 Upcoming Sessions
                  <span className="text-xs font-normal text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                    {scheduledSessions.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {scheduledSessions.map((s) => (
                    <LiveClassCard
                      key={s._id}
                      session={s}
                      onJoin={handleJoin}
                      joining={joining}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredSessions.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📡</div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  No Live Sessions Scheduled
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Check back later for upcoming live classes with expert
                  mentors. Sessions are regularly added for all active courses.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Attendance Tab */
          <div className="space-y-4">
            {attendance.length > 0 ? (
              <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800/60">
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                          Session
                        </th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                          Platform
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((a) => {
                        const s =
                          typeof a.session === "object" ? a.session : null;
                        return (
                          <tr
                            key={a._id}
                            className="border-b border-slate-800/30 hover:bg-slate-800/20 transition"
                          >
                            <td className="p-4">
                              <p className="font-semibold text-white">
                                {s?.title || "Session"}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {s?.mentorName || "—"}
                              </p>
                            </td>
                            <td className="p-4 text-slate-300">
                              {s?.scheduledAt ? formatDate(s.scheduledAt) : "—"}
                            </td>
                            <td className="p-4 text-slate-300">
                              {a.durationMinutes > 0
                                ? `${a.durationMinutes} min`
                                : "—"}
                            </td>
                            <td className="p-4">
                              <AttendanceBadge status={a.status} />
                            </td>
                            <td className="p-4">
                              <span className="text-slate-400">
                                {platformIcons[s?.platform || "custom"]}{" "}
                                {platformLabels[s?.platform || "custom"]}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  No Attendance Records
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Join upcoming live sessions to build your attendance history.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyframe Animation */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
