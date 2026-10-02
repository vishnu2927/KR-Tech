import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getSessionById,
  joinSession,
  leaveSession,
  downloadICS,
  type LiveSession,
  type AttendanceRecord,
  type SessionRecording,
} from "../services/liveClassService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

/* ──────── Helpers ──────── */
const platformConfig: Record<string, { icon: string; label: string; color: string }> = {
  zoom: { icon: "🎥", label: "Zoom", color: "text-blue-400 bg-blue-500/15 border-blue-500/30" },
  google_meet: { icon: "📹", label: "Google Meet", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  teams: { icon: "💼", label: "MS Teams", color: "text-purple-400 bg-purple-500/15 border-purple-500/30" },
  custom: { icon: "🔗", label: "Custom", color: "text-slate-400 bg-slate-500/15 border-slate-500/30" },
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " at " + d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

/* ──────── MentorScheduleCard ──────── */
function MentorScheduleCard({ session }: { session: LiveSession }) {
  const pf = platformConfig[session.platform] || platformConfig.custom;

  return (
    <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-5">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        👨‍🏫 Mentor Details
      </h3>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center text-2xl border border-cyan-500/20">
          {session.mentorName?.[0]?.toUpperCase() || "M"}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{session.mentorName || "TBA"}</p>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium border rounded-full ${pf.color}`}>
            {pf.icon} {pf.label}
          </span>
        </div>
      </div>

      {session.notes && (
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Session Notes</p>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{session.notes}</p>
        </div>
      )}
    </div>
  );
}

/* ──────── RecordingCard ──────── */
function RecordingCard({ recording }: { recording: SessionRecording }) {
  return (
    <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-4 hover:border-purple-500/30 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center text-xl border border-purple-500/20 shrink-0">
          🎬
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
            {recording.title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {recording.duration > 0 ? formatDuration(recording.duration) : ""} {recording.fileSize && `• ${recording.fileSize}`}
          </p>
          {recording.mentorNotes && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{recording.mentorNotes}</p>
          )}
        </div>
        <a
          href={recording.recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-purple-500/15 text-purple-300 rounded-lg text-xs font-semibold border border-purple-500/20 hover:bg-purple-500/25 transition-all no-underline"
        >
          ▶ Play
        </a>
      </div>

      {/* Attachments */}
      {recording.attachments && recording.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700/30 flex flex-wrap gap-2">
          {recording.attachments.map((att, i) => (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/60 text-slate-300 rounded-lg text-[11px] border border-slate-700/30 hover:border-cyan-500/30 hover:text-cyan-300 transition-all no-underline"
            >
              📎 {att.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────── Main Page ──────── */
export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (id) loadSession();
  }, [id]);

  async function loadSession() {
    setLoading(true);
    try {
      const res = await getSessionById(id!);
      setSession(res.data || null);
    } catch (err) {
      console.warn("Failed to load session:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!session) return;
    setJoining(true);
    try {
      const res = await joinSession(session._id);
      setToast({ msg: res.message || "Joined!", type: "success" });
      if (session.meetingLink) {
        window.open(session.meetingLink, "_blank");
      }
      await loadSession();
    } catch (err: any) {
      setToast({ msg: err?.response?.data?.message || "Failed to join", type: "error" });
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!session) return;
    setLeaving(true);
    try {
      const res = await leaveSession(session._id);
      setToast({ msg: res.message || "Left session", type: "success" });
      await loadSession();
    } catch (err: any) {
      setToast({ msg: err?.response?.data?.message || "Failed to leave", type: "error" });
    } finally {
      setLeaving(false);
    }
  }

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center pt-28">
        <LoadingSpinner size="lg" label="Loading session details..." fullScreen={false} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
        <p className="text-slate-400 mb-6">This session may have been removed or does not exist.</p>
        <Link to="/live" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold no-underline">
          ← Back to Live Classes
        </Link>
      </div>
    );
  }

  const pf = platformConfig[session.platform] || platformConfig.custom;
  const isLive = session.status === "live";
  const isScheduled = session.status === "scheduled";
  const isCompleted = session.status === "completed";
  const courseTitle = typeof session.course === "object" ? session.course.title : "Course";
  const attendanceList = session.attendance || [];
  const recordings = session.recordings || [];

  // Check if current user already joined
  const userAttendance = attendanceList.find((a) => {
    const studentId = typeof a.student === "object" ? a.student._id : a.student;
    return studentId === user?._id || studentId === user?.id;
  });

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title={`${session.title} | Live Class | KR Global Learning`}
        description={session.description || `Live session: ${session.title}`}
      />

      {/* Ambient */}
      <div className="absolute top-20 left-1/3 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/8 via-purple-500/8 to-pink-500/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 animate-[slideInRight_0.3s_ease] ${
          toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"
        }`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-cyan-400 transition no-underline">Dashboard</Link>
          <span>/</span>
          <Link to="/live" className="hover:text-cyan-400 transition no-underline">Live Classes</Link>
          <span>/</span>
          <span className="text-cyan-400 truncate max-w-[200px]">{session.title}</span>
        </div>

        {/* Hero Section */}
        <div className={`bg-[#0d1025]/80 backdrop-blur-xl border rounded-2xl overflow-hidden ${
          isLive ? "border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.12)]" : "border-slate-700/50"
        }`}>
          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {isLive && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-red-300 text-xs font-bold uppercase">LIVE NOW</span>
                  </span>
                )}
                {isScheduled && (
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-semibold">
                    📅 Scheduled
                  </span>
                )}
                {isCompleted && (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
                    ✅ Completed
                  </span>
                )}
                {session.status === "cancelled" && (
                  <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/30 rounded-full text-slate-400 text-xs font-semibold">
                    ❌ Cancelled
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium border rounded-full ${pf.color}`}>
                  {pf.icon} {pf.label}
                </span>
              </div>

              {/* Calendar Button */}
              {(isScheduled || isLive) && (
                <button
                  onClick={() => downloadICS(session._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 hover:border-cyan-500/30 hover:text-cyan-300 transition-all text-sm font-medium cursor-pointer"
                >
                  📅 Add to Calendar
                </button>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{session.title}</h1>

            {/* Description */}
            {session.description && (
              <p className="text-slate-400 leading-relaxed">{session.description}</p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Date & Time", value: formatDateTime(session.scheduledAt), icon: "⏰" },
                { label: "Duration", value: formatDuration(session.duration), icon: "⏱️" },
                { label: "Course", value: courseTitle, icon: "📚" },
                { label: "Attendees", value: `${session.attendeeCount || 0} / ${session.maxAttendees}`, icon: "👥" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.icon} {item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Topics */}
            {session.topics && session.topics.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Topics Covered</p>
                <div className="flex flex-wrap gap-2">
                  {session.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {(isLive || isScheduled) && !userAttendance && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className={`px-6 py-3 rounded-xl text-white font-bold transition-all cursor-pointer disabled:opacity-50 ${
                    isLive
                      ? "bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                  }`}
                >
                  {joining ? "Joining..." : isLive ? "🔴 Join Live Session" : "Join Session"}
                </button>
              )}

              {userAttendance && !userAttendance.leftAt && isLive && (
                <button
                  onClick={handleLeave}
                  disabled={leaving}
                  className="px-6 py-3 rounded-xl bg-slate-800/60 text-slate-300 font-bold border border-slate-700/40 hover:border-red-500/30 hover:text-red-300 transition-all cursor-pointer disabled:opacity-50"
                >
                  {leaving ? "Leaving..." : "Leave Session"}
                </button>
              )}

              {userAttendance && (
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold">
                  ✅ You attended this session
                </span>
              )}

              {session.meetingLink && (isLive || isScheduled) && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-slate-800/60 text-slate-300 font-medium border border-slate-700/40 hover:border-purple-500/30 hover:text-purple-300 transition-all no-underline"
                >
                  🔗 Open Meeting Link
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance List */}
            {attendanceList.length > 0 && (
              <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800/60">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    👥 Attendance ({attendanceList.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800/60">
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Joined</th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Duration</th>
                        <th className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((a) => {
                        const student = typeof a.student === "object" ? a.student : null;
                        return (
                          <tr key={a._id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition">
                            <td className="p-4">
                              <p className="font-semibold text-white">{student?.name || "Student"}</p>
                              <p className="text-xs text-slate-500">{student?.email || ""}</p>
                            </td>
                            <td className="p-4 text-slate-300 text-xs">
                              {new Date(a.joinedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="p-4 text-slate-300">
                              {a.durationMinutes > 0 ? `${a.durationMinutes}m` : "Active"}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold border rounded-full ${
                                a.status === "present" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                                a.status === "late" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                                "bg-red-500/15 text-red-400 border-red-500/30"
                              }`}>
                                {a.status === "present" ? "✅" : a.status === "late" ? "⏰" : "❌"} {a.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recordings */}
            {recordings.length > 0 && (
              <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  🎬 Session Recordings ({recordings.length})
                </h3>
                <div className="space-y-3">
                  {recordings.map((r) => (
                    <RecordingCard key={r._id} recording={r} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <MentorScheduleCard session={session} />

            {/* Meeting Info */}
            {(session.meetingId || session.meetingPassword) && (
              <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">🔐 Meeting Info</h3>
                {session.meetingId && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Meeting ID</p>
                    <p className="text-sm font-mono text-cyan-300 mt-1">{session.meetingId}</p>
                  </div>
                )}
                {session.meetingPassword && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Password</p>
                    <p className="text-sm font-mono text-cyan-300 mt-1">{session.meetingPassword}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
