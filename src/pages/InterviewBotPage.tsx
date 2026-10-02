import React, { useState, useEffect } from "react";
import {
  startMockInterview,
  submitInterviewAnswer,
  getInterviewHistory,
  type InterviewSession,
} from "../services/aiService";
import InterviewQuestionCard from "../components/ai/InterviewQuestionCard";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function InterviewBotPage() {
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [targetRole, setTargetRole] = useState("Senior Java Full Stack Engineer");
  const [interviewType, setInterviewType] = useState<"technical" | "hr" | "system_design" | "coding">("technical");
  const [difficulty, setDifficulty] = useState<"entry" | "junior" | "mid" | "senior" | "lead">("senior");
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const history = await getInterviewHistory();
      setPastSessions(history);
    } catch {
      // Ignored
    }
  };

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      const session = await startMockInterview({
        targetRole,
        interviewType,
        difficulty,
      });
      setActiveSession(session);
      setCurrentIdx(0);
      fetchHistory();
    } catch (err) {
      console.error("Start interview error:", err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!activeSession) return;
    setIsSubmitting(true);
    const currentQ = activeSession.questions[currentIdx];

    try {
      const result = await submitInterviewAnswer({
        sessionId: activeSession._id,
        questionId: currentQ.questionId,
        studentAnswer: answer,
      });

      setActiveSession(result.session);
      fetchHistory();
    } catch (err) {
      console.error("Submit answer error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (activeSession && currentIdx < activeSession.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="AI Mock Interview Bot | KR Global Learning"
        description="Simulate real-world technical and HR mock interviews with real-time AI scoring, feedback, and skill readiness reports."
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>🎙️</span> AI Mock Interview Bot
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical & HR Mock Interview Simulator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Practice FAANG-tier engineering and leadership questions. Receive instant scoring (1-10), key architectural strengths, and areas to tighten up before real interviews.
          </p>
        </div>

        {!activeSession ? (
          /* Configuration Setup View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Setup Form */}
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span>⚙️</span> Configure Mock Interview Track
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Tailor the mock technical session depth to your target technical specialization and skill level.
              </p>

              <form onSubmit={handleStartInterview} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Engineering Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Java Backend Engineer, Lead DevOps Specialist"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Interview Format
                    </label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none cursor-pointer"
                    >
                      <option value="technical">💻 Technical Architecture & Code</option>
                      <option value="hr">🤝 HR & Behavioral Leadership</option>
                      <option value="system_design">🏛️ Large-Scale System Design</option>
                      <option value="coding">⚡ Algorithms & Data Structures</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Seniority Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none cursor-pointer"
                    >
                      <option value="junior">Junior Engineer (1-3 Yrs)</option>
                      <option value="mid">Mid-Level Engineer (3-5 Yrs)</option>
                      <option value="senior">Senior Engineer (5-8 Yrs)</option>
                      <option value="lead">Staff / Principal Lead (8+ Yrs)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                  <span className="font-bold text-slate-300 block mb-1">What to expect:</span>
                  <p>• 4 sequentially tailored questions with real-time AI scoring.</p>
                  <p>• Detailed breakdown of what principal interviewers look for.</p>
                  <p>• End-of-interview readiness report and skill evaluation verdict.</p>
                </div>

                <button
                  type="submit"
                  disabled={isStarting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isStarting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Preparing Interview Room...
                    </>
                  ) : (
                    <>Launch Interview Session 🚀</>
                  )}
                </button>
              </form>
            </div>

            {/* Past Sessions List */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Past Mock Sessions</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {pastSessions.length} total
                  </span>
                </h3>

                <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                  {pastSessions.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">
                      No interviews recorded yet. Click Launch to start!
                    </p>
                  ) : (
                    pastSessions.map((s) => (
                      <div
                        key={s._id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white truncate max-w-[140px]">
                            {s.targetRole}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              s.skillVerdict === "Advanced Mastery" || s.skillVerdict === "Proficient"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            }`}
                          >
                            {s.overallScore ? `${s.overallScore}%` : "In Progress"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="capitalize">{s.interviewType}</span>
                          <span>{new Date(s.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
                Powered by KR Global Learning Intelligent Evaluator
              </div>
            </div>
          </div>
        ) : (
          /* Active Interview Session Room */
          <div className="space-y-6">
            {/* Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {activeSession.targetRole}
                  </h3>
                  <span className="text-xs text-slate-400 capitalize">
                    {activeSession.interviewType} Track • {activeSession.difficulty} Level
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Question Navigator Pills */}
                <div className="flex items-center gap-1.5">
                  {activeSession.questions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        currentIdx === idx
                          ? "bg-purple-600 text-white ring-2 ring-purple-400/50"
                          : q.aiFeedback?.score
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Current Question Card */}
            <InterviewQuestionCard
              question={activeSession.questions[currentIdx]}
              questionIndex={currentIdx}
              totalQuestions={activeSession.questions.length}
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
              onNextQuestion={handleNextQuestion}
              hasNextQuestion={currentIdx < activeSession.questions.length - 1}
            />

            {/* Final Assessment Modal/Card (if all questions answered) */}
            {activeSession.status === "completed" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
                      Interview Completed
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">
                      Comprehensive Performance Assessment
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold uppercase">
                      Aggregate Score
                    </span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {activeSession.overallScore}/100
                    </span>
                  </div>
                </div>

                <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                      Skill Evaluation Verdict
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      {activeSession.skillVerdict}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                      Target Benchmark
                    </span>
                    <span className="text-lg font-extrabold text-cyan-400">
                      Top 10% Senior Engineering Tier
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {activeSession.overallFeedback}
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveSession(null)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Start Another Interview Track ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
