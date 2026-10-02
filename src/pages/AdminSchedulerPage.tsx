import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  scheduleSession,
  getAllSessions,
  updateSession,
  deleteSession,
  getLiveStats,
  type LiveSession,
  type LiveStats,
  type ScheduleSessionPayload,
} from "../services/liveClassService";
import { courseService } from "../services/courseService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

/* ──────── Helpers ──────── */
const platformLabels: Record<string, string> = {
  zoom: "🎥 Zoom",
  google_meet: "📹 Google Meet",
  teams: "💼 MS Teams",
  custom: "🔗 Custom",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  live: { label: "Live Now", color: "text-red-400 bg-red-500/15 border-red-500/30" },
  completed: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  cancelled: { label: "Cancelled", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
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

/* ──────── StatCard ──────── */
function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/20 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}

/* ──────── ScheduleForm ──────── */
function ScheduleForm({
  courses,
  onSubmit,
  submitting,
  onCancel,
  editSession,
}: {
  courses: any[];
  onSubmit: (data: ScheduleSessionPayload) => void;
  submitting: boolean;
  onCancel: () => void;
  editSession: LiveSession | null;
}) {
  const [title, setTitle] = useState(editSession?.title || "");
  const [description, setDescription] = useState(editSession?.description || "");
  const [courseId, setCourseId] = useState(
    typeof editSession?.course === "object" ? editSession.course._id : editSession?.course || ""
  );
  const [mentorName, setMentorName] = useState(editSession?.mentorName || "");
  const [scheduledAt, setScheduledAt] = useState(() => {
    if (editSession?.scheduledAt) {
      const d = new Date(editSession.scheduledAt);
      return d.toISOString().slice(0, 16);
    }
    return "";
  });
  const [duration, setDuration] = useState(editSession?.duration || 60);
  const [platform, setPlatform] = useState(editSession?.platform || "zoom");
  const [meetingLink, setMeetingLink] = useState(editSession?.meetingLink || "");
  const [meetingId, setMeetingId] = useState(editSession?.meetingId || "");
  const [meetingPassword, setMeetingPassword] = useState(editSession?.meetingPassword || "");
  const [maxAttendees, setMaxAttendees] = useState(editSession?.maxAttendees || 100);
  const [topicsStr, setTopicsStr] = useState(editSession?.topics?.join(", ") || "");
  const [notes, setNotes] = useState(editSession?.notes || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !courseId || !scheduledAt) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseId,
      mentorName: mentorName.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      duration,
      platform,
      meetingLink: meetingLink.trim(),
      meetingId: meetingId.trim(),
      meetingPassword: meetingPassword.trim(),
      maxAttendees,
      topics: topicsStr.split(",").map((t) => t.trim()).filter(Boolean),
      notes: notes.trim(),
    });
  }

  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/40 rounded-xl text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition";
  const labelCls = "block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <h2 className="text-xl font-bold text-white">
          {editSession ? "✏️ Edit Session" : "➕ Schedule New Live Session"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-500 hover:text-red-400 text-xl transition cursor-pointer bg-transparent border-0"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelCls}>Session Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. React Hooks Deep Dive"
            className={inputCls}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will be covered in this session..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Course *</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={inputCls}
            required
          >
            <option value="">Select a course</option>
            {courses.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Mentor Name</label>
          <input
            type="text"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            placeholder="e.g. Karthik R"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Date & Time *</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={15}
            max={480}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={inputCls}
          >
            <option value="zoom">🎥 Zoom</option>
            <option value="google_meet">📹 Google Meet</option>
            <option value="teams">💼 MS Teams</option>
            <option value="custom">🔗 Custom Link</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Max Attendees</label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(Number(e.target.value))}
            min={1}
            max={1000}
            className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Meeting Link</label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Meeting ID</label>
          <input
            type="text"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Optional meeting ID"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Meeting Password</label>
          <input
            type="text"
            value={meetingPassword}
            onChange={(e) => setMeetingPassword(e.target.value)}
            placeholder="Optional password"
            className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Topics (comma-separated)</label>
          <input
            type="text"
            value={topicsStr}
            onChange={(e) => setTopicsStr(e.target.value)}
            placeholder="React Hooks, State Management, Context API"
            className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Session Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes, prerequisites, etc."
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !title.trim() || !courseId || !scheduledAt}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Saving..." : editSession ? "Update Session" : "Schedule Session"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-800/60 text-slate-300 rounded-xl font-medium border border-slate-700/40 hover:border-red-500/30 hover:text-red-300 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ──────── SessionRow ──────── */
function SessionRow({
  session,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  session: LiveSession;
  onEdit: (s: LiveSession) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const courseTitle = typeof session.course === "object" ? session.course.title : "—";
  const st = statusLabels[session.status] || statusLabels.scheduled;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition group">
      <td className="p-4">
        <p className="font-semibold text-white text-sm">{session.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{courseTitle}</p>
      </td>
      <td className="p-4">
        <p className="text-sm text-slate-300">{formatDate(session.scheduledAt)}</p>
        <p className="text-xs text-slate-500">{formatTime(session.scheduledAt)}</p>
      </td>
      <td className="p-4 text-sm text-slate-300">{session.duration}m</td>
      <td className="p-4 text-sm text-slate-300">
        {platformLabels[session.platform] || session.platform}
      </td>
      <td className="p-4 text-sm text-slate-300">{session.mentorName || "—"}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold border rounded-full ${st.color}`}>
          {session.status === "live" && (
            <span className="relative flex h-1.5 w-1.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
          )}
          {st.label}
        </span>
      </td>
      <td className="p-4 text-sm text-slate-300">{session.attendeeCount || 0}</td>
      <td className="p-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(session)}
            className="p-1.5 text-xs bg-slate-800/60 text-slate-300 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 hover:text-cyan-300 transition-all cursor-pointer"
            title="Edit"
          >
            ✏️
          </button>

          {session.status === "scheduled" && (
            <button
              onClick={() => onStatusChange(session._id, "live")}
              className="p-1.5 text-xs bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
              title="Start Live"
            >
              🔴
            </button>
          )}

          {session.status === "live" && (
            <button
              onClick={() => onStatusChange(session._id, "completed")}
              className="p-1.5 text-xs bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="End Session"
            >
              ✅
            </button>
          )}

          {session.status === "scheduled" && (
            <button
              onClick={() => onStatusChange(session._id, "cancelled")}
              className="p-1.5 text-xs bg-slate-800/60 text-slate-400 rounded-lg border border-slate-700/30 hover:border-amber-500/30 hover:text-amber-300 transition-all cursor-pointer"
              title="Cancel"
            >
              ⛔
            </button>
          )}

          {confirmDelete ? (
            <button
              onClick={() => { onDelete(session._id); setConfirmDelete(false); }}
              className="p-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all cursor-pointer"
              title="Confirm Delete"
            >
              🗑️ Confirm
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-xs bg-slate-800/60 text-slate-400 rounded-lg border border-slate-700/30 hover:border-red-500/30 hover:text-red-300 transition-all cursor-pointer"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ──────── Main Page ──────── */
export default function AdminSchedulerPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<LiveSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    loadSessions();
  }, [statusFilter, page]);

  async function loadInitial() {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        getLiveStats(),
        courseService.getAllCourses(),
      ]);
      setStats(statsRes.data || null);
      setCourses(Array.isArray(coursesRes) ? coursesRes : coursesRes?.data || []);
    } catch (err) {
      console.warn("Failed to load initial data:", err);
    }
  }

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await getAllSessions({
        page,
        limit: 15,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setSessions(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.warn("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule(data: ScheduleSessionPayload) {
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateSession(editTarget._id, data);
        showToast("Session updated successfully!", "success");
      } else {
        await scheduleSession(data);
        showToast("Session scheduled successfully!", "success");
      }
      setShowForm(false);
      setEditTarget(null);
      await Promise.all([loadSessions(), loadInitial()]);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save session", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateSession(id, { status });
      showToast(`Session ${status === "live" ? "started" : status}!`, "success");
      await Promise.all([loadSessions(), loadInitial()]);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update status", "error");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSession(id);
      showToast("Session deleted.", "success");
      await Promise.all([loadSessions(), loadInitial()]);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  }

  function handleEdit(session: LiveSession) {
    setEditTarget(session);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
  }

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadSessions();
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title="Live Session Scheduler | Admin | KR Global Learning"
        description="Manage live class sessions, schedule new sessions, track attendance, and control session status."
      />

      {/* Ambient */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-gradient-to-l from-cyan-500/8 via-blue-500/8 to-purple-500/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 animate-[slideInRight_0.3s_ease] ${
          toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"
        }`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/admin" className="hover:text-cyan-400 transition no-underline">Admin</Link>
              <span>/</span>
              <span className="text-cyan-400">Live Session Scheduler</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                Live Session Scheduler
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Schedule, manage, and monitor live class sessions
            </p>
          </div>

          <button
            onClick={() => { setShowForm(true); setEditTarget(null); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            ➕ Schedule Session
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Total" value={stats.totalSessions} icon="📊" color="text-slate-400" />
            <StatCard label="Scheduled" value={stats.scheduledSessions} icon="📅" color="text-cyan-400" />
            <StatCard label="Live Now" value={stats.liveSessions} icon="🔴" color="text-red-400" />
            <StatCard label="Completed" value={stats.completedSessions} icon="✅" color="text-emerald-400" />
            <StatCard label="This Week" value={stats.upcomingThisWeek} icon="📆" color="text-purple-400" />
          </div>
        )}

        {/* Schedule Form */}
        {showForm && (
          <ScheduleForm
            courses={courses}
            onSubmit={handleSchedule}
            submitting={submitting}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
            editSession={editTarget}
          />
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/40 rounded-xl text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 text-sm hover:border-cyan-500/30 transition cursor-pointer">
              Search
            </button>
          </form>

          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800/50">
            {["all", "scheduled", "live", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" label="Loading sessions..." fullScreen={false} />
          </div>
        ) : sessions.length > 0 ? (
          <div className="bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {["Session", "Date", "Duration", "Platform", "Mentor", "Status", "Attendees", "Actions"].map((h) => (
                      <th key={h} className="text-left p-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <SessionRow
                      key={s._id}
                      session={s}
                      onEdit={handleEdit}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📡</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Sessions Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Schedule your first live session to get started.
            </p>
            <button
              onClick={() => { setShowForm(true); setEditTarget(null); }}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold cursor-pointer"
            >
              ➕ Schedule First Session
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 disabled:opacity-40 hover:border-cyan-500/30 transition-all cursor-pointer text-sm"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-400 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 disabled:opacity-40 hover:border-cyan-500/30 transition-all cursor-pointer text-sm"
            >
              Next →
            </button>
          </div>
        )}
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
