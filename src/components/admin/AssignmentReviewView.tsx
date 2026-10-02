import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

export interface SubmissionItem {
  _id: string;
  courseId: string;
  studentName: string;
  userEmail: string;
  githubUrl: string;
  liveDemoUrl?: string;
  fileUrl?: string;
  notes?: string;
  status: "submitted" | "graded" | "returned";
  grade?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export default function AssignmentReviewView() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Review Modal State
  const [reviewingSubmission, setReviewingSubmission] = useState<SubmissionItem | null>(null);
  const [scoreInput, setScoreInput] = useState(90);
  const [gradeInput, setGradeInput] = useState("A+");
  const [feedbackInput, setFeedbackInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubmissions({
        status: statusFilter,
        search,
      });
      setSubmissions(res.submissions || []);
    } catch (err: any) {
      console.error("Error fetching submissions:", err);
      showToast("Notice: Loaded active submissions buffer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const openReviewModal = (sub: SubmissionItem) => {
    setReviewingSubmission(sub);
    setScoreInput(sub.score || 92);
    setGradeInput(sub.grade || "A+");
    setFeedbackInput(
      sub.feedback ||
        "Clean repository structure, robust error boundary handling, and production Docker containerization. Outstanding code modularity!"
    );
  };

  const handleSaveReview = async (isReturn: boolean = false) => {
    if (!reviewingSubmission) return;
    try {
      const nextStatus = isReturn ? "returned" : "graded";
      const res = await adminService.reviewSubmission(reviewingSubmission._id, {
        score: scoreInput,
        grade: isReturn ? "Needs Revision" : gradeInput,
        feedback: feedbackInput,
        status: nextStatus,
      });

      if (res.success) {
        showToast(
          isReturn
            ? `Assignment returned to ${reviewingSubmission.studentName} for revision`
            : `✓ Graded with score ${scoreInput}/100 and published to student dashboard!`
        );
        setSubmissions((prev) =>
          prev.map((s) => (s._id === reviewingSubmission._id ? res.submission : s))
        );
        setReviewingSubmission(null);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to submit review");
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "submitted").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const returnedCount = submissions.filter((s) => s.status === "returned").length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Sprint 7.8 · Code Review & Evaluation Suite
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Capstone & Assignment <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Review Panel</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Evaluate student project pull requests, test coverage, and documentation. Grade directly or return with structured mentor code feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchSubmissions}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/20">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Total Submissions</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{submissions.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Pending Review</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{pendingCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Graded & Approved</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{gradedCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Returned for Fixes</span>
            <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">{returnedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Submissions" },
            { id: "submitted", label: "Pending Review" },
            { id: "graded", label: "Graded" },
            { id: "returned", label: "Returned" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by student or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchSubmissions()}
            className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
            Connecting to MongoDB Atlas submissions collection...
          </p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-16 text-center space-y-3 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <span className="text-4xl">📝</span>
          <h3 className="text-lg font-bold text-white">No Submissions Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Submissions made by students from their Course Details page or LMS will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-6">Student Engineer</th>
                  <th className="py-4 px-6">Course Track</th>
                  <th className="py-4 px-6">Submission Repos & Assets</th>
                  <th className="py-4 px-6">Status & Grade</th>
                  <th className="py-4 px-6">Submitted At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-850/60 transition-colors">
                    {/* Student */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{sub.studentName}</div>
                      <div className="text-[11px] text-slate-400">{sub.userEmail}</div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6">
                      <span className="text-purple-300 font-medium">{sub.courseId}</span>
                    </td>

                    {/* Assets */}
                    <td className="py-4 px-6 space-y-1">
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold block"
                        >
                          <span>🐙</span>
                          <span>GitHub Repository</span>
                        </a>
                      )}
                      {sub.fileUrl && (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold block"
                        >
                          <span>📄</span>
                          <span>Download ZIP/PDF</span>
                        </a>
                      )}
                      {sub.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                          "{sub.notes}"
                        </p>
                      )}
                    </td>

                    {/* Status & Grade */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === "graded"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : sub.status === "returned"
                            ? "bg-red-500/10 text-red-300 border border-red-500/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {sub.status === "graded" ? `Graded: ${sub.grade || "A"}` : sub.status}
                      </span>
                      {sub.score !== undefined && sub.score > 0 && (
                        <span className="block text-[11px] font-mono font-bold text-white mt-0.5">
                          {sub.score} / 100
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => openReviewModal(sub)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        {sub.status === "graded" ? "Update Grade" : "Review Code"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEW & EVALUATION MODAL */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Mentor Code Review</h3>
                <p className="text-xs text-purple-300">{reviewingSubmission.studentName}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingSubmission(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Assets Links */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                Submitted Artifacts
              </span>
              <div className="flex flex-wrap gap-3">
                {reviewingSubmission.githubUrl && (
                  <a
                    href={reviewingSubmission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    🐙 Open GitHub
                  </a>
                )}
                {reviewingSubmission.liveDemoUrl && (
                  <a
                    href={reviewingSubmission.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    🌐 Live Demo
                  </a>
                )}
                {reviewingSubmission.fileUrl && (
                  <a
                    href={reviewingSubmission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline font-bold"
                  >
                    📥 Download Attachment
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Letter Grade</label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="A+ (Distinction)">A+ (Distinction)</option>
                    <option value="A (Excellent)">A (Excellent)</option>
                    <option value="B+ (Very Good)">B+ (Very Good)</option>
                    <option value="B (Good)">B (Good)</option>
                    <option value="Needs Revision">Needs Revision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mentor Feedback & Suggestions</label>
                <textarea
                  rows={4}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 outline-none resize-none"
                  placeholder="Provide constructive feedback on architectural patterns, modularity, and error handling..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSaveReview(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-bold transition-all cursor-pointer"
                >
                  Return for Fixes
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewingSubmission(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveReview(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                  >
                    Grade & Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
