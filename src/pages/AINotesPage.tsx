import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function AINotesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("Full Stack Java & Microservices");
  const [selectedUnit, setSelectedUnit] = useState<string>("Unit 4: Event-Driven Systems & Kafka");
  const [selectedTopic, setSelectedTopic] = useState<string>("Distributed Transactions & Saga Pattern");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("detailed");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedNote, setGeneratedNote] = useState<any>(null);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const coursesCatalog = [
    {
      name: "Full Stack Java & Microservices",
      units: [
        { unit: "Unit 1: Java 21 Modern Concurrency", topics: ["Virtual Threads", "CompletableFuture", "Structured Concurrency"] },
        { unit: "Unit 2: Spring Boot 3 & Security", topics: ["Stateless JWT Filter", "OAuth2 Flow", "Spring Cloud Gateway"] },
        { unit: "Unit 3: Relational Persistence & Tuning", topics: ["PostgreSQL Query Planning", "JPA N+1 Problem", "Connection Pools"] },
        { unit: "Unit 4: Event-Driven Systems & Kafka", topics: ["Distributed Transactions & Saga Pattern", "Consumer Groups & Rebalance", "Schema Registry"] },
      ],
    },
    {
      name: "Cloud, DevOps & Kubernetes",
      units: [
        { unit: "Unit 1: Linux & Networking", topics: ["TCP/IP Handshake", "iptables & eBPF", "DNS Resolution Under High Load"] },
        { unit: "Unit 2: Docker & Container Security", topics: ["Multi-Stage Builds", "Distroless Images", "cgroups & namespaces"] },
        { unit: "Unit 3: Kubernetes in Production", topics: ["Pod Eviction & OOMKiller", "Ingress Controllers", "StatefulSets vs Deployments"] },
      ],
    },
    {
      name: "System Design & Distributed Scalability",
      units: [
        { unit: "Unit 1: Foundations of Scale", topics: ["Consistent Hashing", "CAP Theorem in Practice", "Rate Limiting Algorithms"] },
        { unit: "Unit 2: Real-World Architecture", topics: ["Uber Geospatial Dispatch", "Netflix Video Chunking", "Twitter Fan-Out Timeline"] },
      ],
    },
  ];

  const currentCourseObj = coursesCatalog.find((c) => c.name === selectedCourse) || coursesCatalog[0];
  const currentUnitObj = currentCourseObj.units.find((u) => u.unit === selectedUnit) || currentCourseObj.units[0];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadSavedNotes();
  }, []);

  const loadSavedNotes = async () => {
    const notes = await lmsService.getAiNotes();
    setSavedNotes(notes || []);
  };

  const handleGenerate = async () => {
    const finalTopic = customTopic.trim() || selectedTopic;
    if (!finalTopic) return;

    setLoading(true);
    try {
      const res = await lmsService.generateAiNotes({
        course: selectedCourse,
        unit: selectedUnit,
        topic: finalTopic,
        format: selectedFormat,
      });
      setGeneratedNote(res);
      showToast("✓ High-yield AI notes successfully compiled!");
      loadSavedNotes();
    } catch {
      showToast("Failed to generate notes. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const exportAsPdf = () => {
    window.print();
    showToast("✓ Printable PDF view generated!");
  };

  const exportAsWord = () => {
    if (!generatedNote) return;
    const blob = new Blob([generatedNote.content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedNote.title.replace(/\s+/g, "_")}.doc`;
    a.click();
    showToast("✓ Word document exported!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Notes Generator | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Instant AI-generated technical revision notes, detailed study guides, and interview prep summaries for KR Tech students."
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
              <span>⚡ Sprint 9.3</span>
              <span>•</span>
              <span>AI Notes Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Smart AI Notes & Exam Guides</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Select your course curriculum module, choose note density (Short, Detailed, Bullet, Exam, or Interview), and generate exportable study artifacts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Notes Generated</div>
              <div className="text-xl font-black text-cyan-300">{savedNotes.length + 8} Modules</div>
            </div>
          </div>
        </div>

        {/* Note Configuration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls Column */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎯 Note Parameters</span>
            </h2>

            {/* Course Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">1. Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  const firstUnit = coursesCatalog.find((c) => c.name === e.target.value)?.units[0];
                  if (firstUnit) {
                    setSelectedUnit(firstUnit.unit);
                    setSelectedTopic(firstUnit.topics[0]);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {coursesCatalog.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">2. Select Module / Unit</label>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  const foundUnit = currentCourseObj.units.find((u) => u.unit === e.target.value);
                  if (foundUnit && foundUnit.topics.length > 0) {
                    setSelectedTopic(foundUnit.topics[0]);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {currentCourseObj.units.map((u) => (
                  <option key={u.unit} value={u.unit}>
                    {u.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">3. Select Syllabus Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {currentUnitObj.topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or enter custom topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Note Format Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">4. Note Density & Type</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: "short", label: "⚡ Short Notes (2 Min)", desc: "Quick revision & formula cheat-sheet" },
                  { key: "detailed", label: "📖 Detailed Notes", desc: "Comprehensive engineering breakdown" },
                  { key: "bullet", label: "📋 Bullet Notes", desc: "Key facts, complexities & rules" },
                  { key: "exam", label: "🎯 Exam Notes", desc: "5-mark / 10-mark questions & CAP theorem" },
                  { key: "interview", label: "🎙️ Interview Notes", desc: "FAANG / Tier-1 interview answers" },
                ].map((fmt) => (
                  <div
                    key={fmt.key}
                    onClick={() => setSelectedFormat(fmt.key)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                      selectedFormat === fmt.key
                        ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-md"
                        : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="font-bold">{fmt.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{fmt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/40 cursor-pointer disabled:opacity-50 transition"
            >
              {loading ? "Generating Notes with AI..." : "⚡ Generate AI Study Notes"}
            </button>
          </div>

          {/* Note Viewer Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {generatedNote ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
                {/* Note Header & Export Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      {generatedNote.format?.toUpperCase()} FORMAT
                    </span>
                    <h2 className="text-xl font-black text-white mt-1.5">{generatedNote.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Course: <span className="text-purple-300">{generatedNote.course}</span> • Unit: {generatedNote.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportAsPdf}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📥</span> <span>PDF Export</span>
                    </button>
                    <button
                      onClick={exportAsWord}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📄</span> <span>Word Export</span>
                    </button>
                    <button
                      onClick={() => showToast("✓ Notes pinned to your study library!")}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-900/30 cursor-pointer"
                    >
                      <span>💾</span> <span>Saved</span>
                    </button>
                  </div>
                </div>

                {/* Note Body */}
                <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {generatedNote.content}
                </div>

                {/* Key Terminology Pills */}
                {generatedNote.keyTerms && generatedNote.keyTerms.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Important Terms & Definitions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {generatedNote.keyTerms.map((kt: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="font-bold text-cyan-300">{kt.term}: </span>
                          <span className="text-slate-400">{kt.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="text-4xl">📚</div>
                <h3 className="text-base font-bold text-white">Select a Topic to Generate Notes</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Our AI engine will parse curriculum specifications, produce bullet takeaways, formulas, exam tips, and export-ready PDFs.
                </p>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  Generate First Note →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
