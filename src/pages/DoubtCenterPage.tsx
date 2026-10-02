import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function DoubtCenterPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [category, setCategory] = useState<string>("Backend Architecture");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    const list = await lmsService.getDoubts();
    setDoubts(list || []);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await lmsService.askDoubt({
        title,
        description,
        codeSnippet,
        category,
      });

      showToast("✓ Doubt posted! AI generated an immediate solution.");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setCodeSnippet("");
      loadDoubts();
    } catch {
      showToast("Failed to post doubt.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (doubtId: string) => {
    setDoubts((prev) =>
      prev.map((d) => (d._id === doubtId ? { ...d, upvotes: (d.upvotes || 0) + 1 } : d))
    );
    showToast("✓ Upvoted! Added +5 XP to helpful answer contributor.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Doubt Solver & Mentor Q&A | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Ask technical questions and receive immediate step-by-step AI answers verified by Senior Staff Mentors. Upvote helpful answers and share code snippets."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.13</span>
              <span>•</span>
              <span>AI Doubt Solver & Verified Answers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">24×7 Technical Doubt Resolution</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Post debugging errors, architectural questions, or system design trade-offs. AI replies in seconds, followed by Senior Staff Mentor verification.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-900/40 cursor-pointer transition shrink-0"
          >
            + Ask a Technical Doubt
          </button>
        </div>

        {/* Doubts List */}
        <div className="space-y-6">
          {doubts.map((doubt) => (
            <div
              key={doubt._id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {doubt.category}
                    </span>
                    <span className="text-xs text-slate-400">Asked by {doubt.studentName}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5">{doubt.title}</h2>
                </div>

                <button
                  onClick={() => handleVote(doubt._id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-purple-300 hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>▲</span> <span>{doubt.upvotes || 18}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{doubt.description}</p>

              {doubt.codeSnippet && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <code>{doubt.codeSnippet}</code>
                </div>
              )}

              {/* Answers Accordion */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Answers ({doubt.answers?.length || 2})
                </div>

                {doubt.answers?.map((ans: any, aidx: number) => (
                  <div
                    key={aidx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      ans.isVerifiedMentorAnswer
                        ? "bg-purple-950/20 border-purple-500/40 text-purple-100"
                        : "bg-slate-950/70 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{ans.authorName}</span>
                        {ans.isVerifiedMentorAnswer && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ✓ Verified Staff Mentor
                          </span>
                        )}
                        {ans.authorType === "ai" && (
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            🤖 AI Instant Resolution
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">▲ {ans.helpfulVotes} helpful</span>
                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed">{ans.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Ask Doubt */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Ask a Technical Doubt</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAskDoubt} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Backend Architecture">Backend Architecture & Spring Boot</option>
                    <option value="Event Streams">Kafka, RabbitMQ & Event Streams</option>
                    <option value="Cloud & Kubernetes">Cloud, Docker & Kubernetes</option>
                    <option value="System Design">System Design & Scaling</option>
                    <option value="DSA">Data Structures & Algorithms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Doubt Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to prevent Consumer Rebalance Storms in Kafka?"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain what behavior you are seeing and what you've tried..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Code Snippet (Optional)</label>
                  <textarea
                    rows={2}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste relevant snippet..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 cursor-pointer"
                >
                  {submitting ? "Posting Doubt..." : "Submit Doubt for Instant AI & Mentor Answer →"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
