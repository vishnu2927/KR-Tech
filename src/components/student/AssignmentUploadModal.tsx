import React, { useState } from "react";
import studentDashboardService from "../../services/studentDashboardService";

export interface AssignmentData {
  _id: string;
  title: string;
  description: string;
  moduleTitle?: string;
  deadline?: string;
  maxScore?: number;
  requirements?: string[];
  starterRepoUrl?: string;
}

interface AssignmentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  assignment: AssignmentData | null;
  onSuccess?: () => void;
}

export default function AssignmentUploadModal({
  isOpen,
  onClose,
  courseId,
  assignment,
  onSuccess,
}: AssignmentUploadModalProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setError("Please provide your GitHub repository URL for code review.");
      return;
    }
    if (!githubUrl.includes("github.com")) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo).");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await studentDashboardService.submitCourseAssignment(courseId, {
        assignmentId: assignment._id,
        githubUrl: githubUrl.trim(),
        liveDemoUrl: liveDemoUrl.trim(),
        notes: notes.trim(),
        fileUrl: fileUrl.trim(),
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Assignment submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit assignment. Please verify your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setGithubUrl("");
    setLiveDemoUrl("");
    setNotes("");
    setFileUrl("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 text-slate-100 my-8">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
              ✓
            </div>
            <h3 className="text-2xl font-black text-white">Capstone Assignment Submitted!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your solution has been submitted to the KR Global Learning Principal Mentors review queue.
              You will receive automated feedback on code modularity, architecture patterns, and test suites.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assignment:</span>
                <span className="text-slate-200 font-bold">{assignment.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Repo:</span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline truncate max-w-[200px]"
                >
                  {githubUrl}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold">Under Review (ETA: 24 hrs)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-sm font-bold text-white shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              Continue Learning →
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 mb-2">
                {assignment.moduleTitle || "Capstone Module Submission"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Submit: {assignment.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {assignment.description}
              </p>
            </div>

            {/* Assignment Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 text-xs">
              <div>
                <span className="text-slate-500 block">Max Score</span>
                <span className="font-bold text-white">{assignment.maxScore || 100} Points</span>
              </div>
              <div>
                <span className="text-slate-500 block">Deadline</span>
                <span className="font-bold text-cyan-400">{assignment.deadline || "Sunday, 11:59 PM"}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Starter Repo</span>
                {assignment.starterRepoUrl ? (
                  <a
                    href={assignment.starterRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline font-mono truncate block"
                  >
                    Clone Starter →
                  </a>
                ) : (
                  <span className="text-slate-400">Not required</span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-5 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Repository URL <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    🐙
                  </span>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-username/assignment-repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Must contain clean commits, README, and unit tests.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Live Deployment / Demo URL (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    🌐
                  </span>
                  <input
                    type="url"
                    placeholder="https://your-service.up.railway.app or Vercel link"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Architecture & Implementation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your design choices, concurrency handling, database optimizations, or challenges faced..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Architecture Diagram / ZIP Archive Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Link to Google Drive, Figma diagram, or ZIP archive"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/40 transition-all cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Solution 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
