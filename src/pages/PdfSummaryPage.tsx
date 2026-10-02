import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function PdfSummaryPage() {
  const [fileName, setFileName] = useState<string>("Distributed_Systems_Microservices_Paper.pdf");
  const [pastedText, setPastedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "points" | "flashcards" | "quiz" | "keywords" | "mindmap">("summary");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSummarize = async () => {
    if (!fileName && !pastedText) return;
    setLoading(true);

    try {
      const res = await lmsService.summarizePdf({
        fileName: fileName || "Pasted_Article_Notes.pdf",
        textContent: pastedText,
      });
      setSummaryData(res);
      showToast("✓ PDF analyzed & AI summary generated!");
    } catch {
      showToast("Error processing PDF document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI PDF Summarizer | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Upload technical PDFs, whitepapers, or lecture slides to generate instant executive summaries, key bullet points, auto-flashcards, mind maps, and quizzes."
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
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.10</span>
              <span>•</span>
              <span>AI PDF Summarizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Smart Document Intelligence & Summarizer</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Extract key architectural takeaways from technical whitepapers, textbook PDFs, and research papers. Generate instant flashcards, quizzes, and mind maps.
            </p>
          </div>
          <span className="text-4xl">📄</span>
        </div>

        {/* Input Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Distributed_Transactions_Saga.pdf"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 cursor-pointer disabled:opacity-50 transition"
              >
                {loading ? "Analyzing Document..." : "⚡ Summarize & Extract Insights"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Or Paste Research Paper / Chapter Text (Optional)
            </label>
            <textarea
              rows={3}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste article, documentation, or lecture transcript here..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Output Section */}
        {summaryData && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {[
                { key: "summary", label: "📝 Executive Summary" },
                { key: "points", label: "🎯 Key Points" },
                { key: "flashcards", label: "⚡ Auto Flashcards" },
                { key: "quiz", label: "❓ Instant Quiz" },
                { key: "keywords", label: "🔑 Keywords" },
                { key: "mindmap", label: "🗺️ Mind Map" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
              {activeTab === "summary" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Executive Document Summary</h3>
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200">
                    {summaryData.summary}
                  </div>
                </div>
              )}

              {activeTab === "points" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Crucial High-Yield Points</h3>
                  <div className="space-y-2">
                    {summaryData.importantPoints?.map((pt: string, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "flashcards" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Auto-Extracted Revision Cards</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {summaryData.flashcards?.map((fc: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="font-bold text-cyan-300">Q: {fc.front}</div>
                        <div className="text-slate-300 pt-2 border-t border-slate-850">A: {fc.back}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "quiz" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Document Comprehension Quiz</h3>
                  <div className="space-y-3">
                    {summaryData.quiz?.map((q: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                        <div className="font-bold text-white">{q.question}</div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options?.map((opt: string, oidx: number) => (
                            <div key={oidx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                          ✓ Correct Answer: {q.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "keywords" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Essential Keywords & Definitions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {summaryData.keywords?.map((kw: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="font-bold text-purple-300">{kw.term}</div>
                        <div className="text-slate-400">{kw.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "mindmap" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">Hierarchical Conceptual Mind Map</h3>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre leading-relaxed">
{`[${summaryData.fileName}]
  ├── 1. Core Motivation & Problem Statement
  │     ├── High Concurrent Write Latency
  │     └── Microservice Coupling Anti-Patterns
  ├── 2. Architectural Design
  │     ├── Asynchronous Event Broker
  │     └── Outbox Transaction Guarantees
  ├── 3. Production Benchmarks
  │     ├── p99 Latency dropped by 64%
  │     └── Throughput scaled to 120k events/sec
  └── 4. Best Practices Checklist
        ├── Idempotent Consumer Logic
        └── Exponential Backoff Dead Letter Queue`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
