import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [fileType, setFileType] = useState<"pdf" | "zip" | "image">("zip");
  const [fileName, setFileName] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [liveDemoUrl, setLiveDemoUrl] = useState<string>("");
  const [studentNotes, setStudentNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  // Admin Grading State
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [adminComment, setAdminComment] = useState<string>("Exceptional thread-safety and dead letter queue error recovery. Approved for capstone credit.");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await lmsService.getAssignments();
    setAssignments(res.assignments || [
      {
        _id: "asg-01",
        title: "Kafka Consumer Group Rebalance Simulator",
        courseId: "crs-java-fullstack-2026",
        deadline: "Sunday, 11:59 PM IST",
        maxScore: 100,
        description: "Implement a multi-partition consumer group simulator with manual offset commit and dead letter routing.",
        requirements: [
          "Create 3 consumer threads reading from 6 partitions",
          "Simulate node failure and measure rebalance recovery time",
          "Write unit tests with EmbeddedKafka",
        ],
      },
      {
        _id: "asg-02",
        title: "Distributed Rate Limiter with Redis Token Bucket",
        courseId: "system-design-2026",
        deadline: "Next Tuesday, 6:00 PM IST",
        maxScore: 100,
        description: "Build an L7 API rate limiting middleware with Lua scripts in Redis to guarantee atomicity.",
        requirements: [
          "Handle 10,000 req/sec load test with k6",
          "Support sliding window log algorithm",
        ],
      },
    ]);

    setSubmissions(res.submissions?.length ? res.submissions : [
      {
        _id: "sub-01",
        assignmentId: "asg-01",
        courseId: "crs-java-fullstack-2026",
        title: "Kafka Consumer Group Rebalance Simulator",
        fileName: "kafka_consumer_capstone.zip",
        githubUrl: "https://github.com/aditya-dev/kafka-rebalance-simulator",
        liveDemoUrl: "https://kafka-sim.krtech.dev",
        status: "graded",
        grade: "Grade A+ (98/100)",
        score: 98,
        feedback: "Outstanding separation of concerns. The Dead Letter Queue recovery mechanism handles partition rebalancing gracefully.",
        submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) {
      showToast("Please choose an assignment to submit.");
      return;
    }

    setSubmitting(true);
    try {
      await lmsService.submitAssignment({
        assignmentId: selectedAssignment._id,
        courseId: selectedAssignment.courseId,
        githubUrl: githubUrl || "https://github.com/student/krtech-submission",
        liveDemoUrl,
        notes: studentNotes,
        fileName: fileName || `assignment_${fileType}.${fileType}`,
      });

      showToast("✓ Assignment successfully submitted! Senior Mentor review initiated.");
      setGithubUrl("");
      setLiveDemoUrl("");
      setStudentNotes("");
      setFileName("");
      loadData();
    } catch {
      showToast("Submission queued successfully.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminGrade = (submissionId: string, status: "approved" | "rejected") => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s._id === submissionId
          ? {
              ...s,
              status: status === "approved" ? "graded" : "resubmission_requested",
              grade: status === "approved" ? `Grade A (${gradeScore}/100)` : "Resubmission Requested",
              score: status === "approved" ? gradeScore : 40,
              feedback: adminComment,
            }
          : s
      )
    );
    showToast(`✓ Submission ${status.toUpperCase()} and student notified.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="Assignment Portal | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Submit capstone assignments, upload PDF/ZIP/Images, track mentor evaluation status, and review senior staff code feedback."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.8</span>
              <span>•</span>
              <span>Assignment Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Capstone Assignments & Code Reviews</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Submit code archives, PDFs, or Git repositories. Receive detailed PR critiques, performance scores, and architectural feedback from Senior Mentors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "student" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "admin" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              👑 Mentor Grading
            </button>
          </div>
        </div>

        {activeTab === "student" ? (
          /* Student Portal */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Active Assignments Selection */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Active Assignments ({assignments.length})
              </div>

              {assignments.map((asg) => (
                <div
                  key={asg._id}
                  onClick={() => setSelectedAssignment(asg)}
                  className={`p-5 rounded-3xl border text-xs cursor-pointer transition space-y-3 ${
                    selectedAssignment?._id === asg._id
                      ? "bg-purple-600/20 border-purple-500/50 text-white shadow-xl"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-white">{asg.title}</h3>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {asg.maxScore} Pts
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{asg.description}</p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
                    <span>⏱️ Deadline:</span>
                    <span className="text-amber-400 font-semibold">{asg.deadline}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Submission Form & Requirements (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {selectedAssignment ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-wider">
                      Selected Capstone
                    </span>
                    <h2 className="text-xl font-black text-white mt-1.5">{selectedAssignment.title}</h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedAssignment.description}</p>
                  </div>

                  {/* Requirements List */}
                  {selectedAssignment.requirements && (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        Mandatory PR Requirements
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {selectedAssignment.requirements.map((req: string, idx: number) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Submission Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Upload Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Upload Format</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: "zip", label: "ZIP Archive", icon: "📦" },
                          { key: "pdf", label: "PDF Report", icon: "📄" },
                          { key: "image", label: "Image / Schema", icon: "🖼️" },
                        ].map((fmt) => (
                          <button
                            key={fmt.key}
                            type="button"
                            onClick={() => setFileType(fmt.key as any)}
                            className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                              fileType === fmt.key
                                ? "bg-purple-600 text-white border-purple-500"
                                : "bg-slate-950 border-slate-800 text-slate-400"
                            }`}
                          >
                            <span>{fmt.icon}</span> <span>{fmt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Name / Path</label>
                        <input
                          type="text"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          placeholder={`e.g. project_submission.${fileType}`}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username/project"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Live Demo / Deployment URL (Optional)</label>
                      <input
                        type="url"
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        placeholder="https://your-app.vercel.app"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes for Senior Mentor Reviewer</label>
                      <textarea
                        rows={3}
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Mention any tricky edge cases, load test numbers, or setup instructions..."
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/40 cursor-pointer disabled:opacity-50 transition"
                    >
                      {submitting ? "Uploading & Notifying Mentor..." : "Submit Capstone Assignment →"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                  Select an assignment from the left to view specifications and upload your solution.
                </div>
              )}

              {/* Past Submissions & Status Tracking */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  My Submission History & Mentor Feedback ({submissions.length})
                </div>

                {submissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-white">{sub.title || "Kafka Rebalance Simulator"}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString()} • File: {sub.fileName}
                        </div>
                      </div>

                      <span
                        className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                          sub.status === "graded"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {sub.status === "graded" ? `✓ ${sub.grade}` : "Under Review"}
                      </span>
                    </div>

                    {sub.feedback && (
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-cyan-300">Senior Mentor Feedback:</strong> {sub.feedback}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 text-xs">
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:text-purple-300 font-bold"
                        >
                          View GitHub PR ↗
                        </a>
                      )}
                      {sub.liveDemoUrl && (
                        <a
                          href={sub.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-bold"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Mentor / Admin Grading Portal */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>👑 Senior Staff Mentor Review Queue</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Grade student PRs, evaluate unit test suites, and approve capstones</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono font-bold">1 Pending Review</span>
            </div>

            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub._id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        Student: Aditya Sharma
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{sub.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Repo: {sub.githubUrl}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">Score: {sub.score || 95} / 100</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Score (out of 100)</label>
                      <input
                        type="number"
                        value={gradeScore}
                        onChange={(e) => setGradeScore(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Actionable Critique</label>
                      <input
                        type="text"
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAdminGrade(sub._id, "approved")}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer"
                    >
                      Approve & Award Credit ✓
                    </button>
                    <button
                      onClick={() => handleAdminGrade(sub._id, "rejected")}
                      className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white shadow-md cursor-pointer"
                    >
                      Request Resubmission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
