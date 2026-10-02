import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getRecordings,
  type SessionRecording,
} from "../services/liveClassService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

/* ──────── RecordingCard ──────── */
function RecordingCard({ recording }: { recording: SessionRecording }) {
  const [expanded, setExpanded] = useState(false);

  const courseTitle =
    typeof recording.course === "object"
      ? recording.course.title
      : "General";

  const sessionInfo =
    typeof recording.session === "object"
      ? recording.session
      : null;

  function formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${minutes}m`;
  }

  return (
    <div className="group bg-[#0d1025]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)] transition-all duration-500">
      {/* Thumbnail / Gradient Header */}
      <div className="relative h-40 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-cyan-900/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

        {/* Play Button Overlay */}
        <a
          href={recording.recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all duration-300 no-underline"
        >
          <span className="text-3xl ml-1">▶</span>
        </a>

        {/* Duration Badge */}
        {recording.duration > 0 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
            {formatDuration(recording.duration)}
          </span>
        )}

        {/* Format Badge */}
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-500/20 backdrop-blur-sm text-purple-300 text-[10px] font-bold uppercase border border-purple-500/30 rounded-full">
          {recording.format}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Course Tag */}
        <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full">
          {courseTitle}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
          {recording.title}
        </h3>

        {/* Description */}
        {recording.description && (
          <p className="text-sm text-slate-400 line-clamp-2">{recording.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          {sessionInfo && (
            <span>🎤 {(sessionInfo as any).mentorName || "Mentor"}</span>
          )}
          {recording.fileSize && <span>📁 {recording.fileSize}</span>}
          <span>👁️ {recording.viewCount} views</span>
          <span>
            📅{" "}
            {new Date(recording.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Mentor Notes (expandable) */}
        {recording.mentorNotes && (
          <div className="mt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer bg-transparent border-0 font-medium"
            >
              {expanded ? "▼ Hide Notes" : "▶ Mentor Notes"}
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap animate-[fadeIn_0.2s_ease]">
                {recording.mentorNotes}
              </div>
            )}
          </div>
        )}

        {/* Attachments */}
        {recording.attachments && recording.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
          <a
            href={recording.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl text-sm font-semibold border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all no-underline"
          >
            ▶ Watch Recording
          </a>
        </div>
      </div>
    </div>
  );
}

/* ──────── Main Page ──────── */
export default function RecordingLibraryPage() {
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRecordings();
  }, [page]);

  async function loadRecordings() {
    setLoading(true);
    try {
      const res = await getRecordings({
        page,
        limit: 12,
        search: searchQuery || undefined,
      });
      setRecordings(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.warn("Failed to load recordings:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadRecordings();
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title="Recording Library | KR Global Learning"
        description="Access recorded live sessions, mentor notes, and downloadable resources from past classes."
      />

      {/* Ambient */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[350px] bg-gradient-to-r from-purple-500/8 via-pink-500/6 to-blue-500/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/dashboard" className="hover:text-cyan-400 transition no-underline">Dashboard</Link>
              <span>/</span>
              <Link to="/live" className="hover:text-cyan-400 transition no-underline">Live Classes</Link>
              <span>/</span>
              <span className="text-purple-400">Recordings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                Recording Library
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Rewatch past live sessions with mentor notes and downloadable resources
            </p>
          </div>

          <Link
            to="/live"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 hover:border-cyan-500/30 hover:text-cyan-300 transition-all text-sm font-medium no-underline"
          >
            📡 Live Classes
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/40 rounded-xl text-sm text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30 text-sm font-semibold hover:bg-purple-500/30 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Loading recordings..." fullScreen={false} />
          </div>
        ) : recordings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((r) => (
                <RecordingCard key={r._id} recording={r} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 disabled:opacity-40 hover:border-purple-500/30 transition-all cursor-pointer text-sm"
                >
                  ← Prev
                </button>
                <span className="text-sm text-slate-400 px-4">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/40 disabled:opacity-40 hover:border-purple-500/30 transition-all cursor-pointer text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Recordings Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Recordings will appear here after live sessions are completed and uploaded by mentors.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
