import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function AIQuizPage() {
  const [sourceType, setSourceType] = useState<string>("topic"); // 'topic' | 'lesson' | 'pdf'
  const [topic, setTopic] = useState<string>("Distributed Systems & Cloud Architecture");
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  // Live Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 minutes
  const [testActive, setTestActive] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"quiz" | "leaderboard">("quiz");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await lmsService.getQuizLeaderboard();
    setLeaderboard(data || []);
  };

  // Timer countdown during live quiz
  useEffect(() => {
    let interval: any = null;
    if (testActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (testActive && timerSeconds === 0) {
      handleSubmitQuiz();
    }
    return () => clearInterval(interval);
  }, [testActive, timerSeconds]);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await lmsService.generateQuiz({
        topic,
        difficulty,
        questionCount,
      });
      setActiveQuiz(quiz);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimerSeconds(quiz.durationMinutes ? quiz.durationMinutes * 60 : 600);
      setTestActive(true);
      setQuizResult(null);
    } catch {
      alert("Failed to generate quiz. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qId: string, answerText: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: answerText }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setLoading(true);
    setTestActive(false);

    try {
      const res = await lmsService.submitQuiz({
        quizId: activeQuiz._id,
        answers,
        timeSpentSeconds: (activeQuiz.durationMinutes * 60 || 600) - timerSeconds,
      });
      setQuizResult(res);
      loadLeaderboard();
    } catch {
      alert("Error evaluating quiz attempt.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Quiz Generator | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Generate live technical quizzes from lessons, PDFs, and topics. MCQs, True/False, Fill in Blanks, Coding, and Subjective questions with instant grading."
      />
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.4</span>
              <span>•</span>
              <span>AI Quiz Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Interactive Skill Quizzes & Assessments</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Synthesize tests from lessons, PDFs, or syllabus topics. Practice with live timers, automated scoring, XP boosts, and batch leaderboards.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "quiz" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Quiz Arena
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "leaderboard" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>

        {activeTab === "leaderboard" ? (
          /* Leaderboard Tab */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🏆 Global Batch Leaderboard</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Rankings updated in real-time across all 15,000+ students</p>
              </div>
              <span className="text-xs text-purple-400 font-mono font-bold">Spring 2026 Season</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Badge Tier</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboard.map((item) => (
                    <tr
                      key={item.rank}
                      className={item.name.includes("You") ? "bg-purple-600/10 font-bold" : "hover:bg-slate-800/40"}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        {item.rank === 1 ? "🥇 #1" : item.rank === 2 ? "🥈 #2" : item.rank === 3 ? "🥉 #3" : `#${item.rank}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{item.accuracy}%</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-300">{item.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Quiz Arena Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Parameters Sidebar */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚙️ Quiz Generator Settings</span>
              </h2>

              {/* Source Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Source Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "topic", label: "Topic", icon: "💡" },
                    { key: "lesson", label: "Lesson", icon: "🎥" },
                    { key: "pdf", label: "PDF", icon: "📄" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSourceType(s.key)}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                        sourceType === s.key
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span>{s.icon}</span> <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic or Subject</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Kafka, Redis, Docker, System Design"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="beginner">Beginner (Foundations)</option>
                  <option value="intermediate">Intermediate (Production Patterns)</option>
                  <option value="advanced">Advanced (Staff Architect / High Scale)</option>
                </select>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Question Count</label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        questionCount === cnt
                          ? "bg-cyan-600 text-white border-cyan-500"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types Covered */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Question Types Generated:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-850 text-purple-300">MCQ</span>
                  <span className="px-2 py-0.5 rounded bg-slate-850 text-cyan-300">True/False</span>
                  <span className="px-2 py-0.5 rounded bg-slate-850 text-emerald-300">Fill Blanks</span>
                  <span className="px-2 py-0.5 rounded bg-slate-850 text-amber-300">Coding</span>
                  <span className="px-2 py-0.5 rounded bg-slate-850 text-rose-300">Subjective</span>
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !topic.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950/40 cursor-pointer disabled:opacity-50 transition"
              >
                {loading ? "Generating Questions..." : "⚡ Generate & Start Quiz"}
              </button>
            </div>

            {/* Quiz Execution Area (2 Cols) */}
            <div className="lg:col-span-2">
              {quizResult ? (
                /* Results View */
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">🎉</div>
                    <h2 className="text-2xl font-black text-white">Quiz Evaluation Completed</h2>
                    <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Score: {quizResult.score} / {quizResult.totalMarks} ({quizResult.percentage}%) • +{quizResult.xpAwarded} XP Earned!
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xl font-bold text-cyan-400">{quizResult.percentage}%</div>
                      <div className="text-[11px] text-slate-400 mt-1">Accuracy</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xl font-bold text-emerald-400">{quizResult.passed ? "PASSED" : "NEEDS PRACTICE"}</div>
                      <div className="text-[11px] text-slate-400 mt-1">Status</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xl font-bold text-amber-400">+{quizResult.xpAwarded} XP</div>
                      <div className="text-[11px] text-slate-400 mt-1">XP Credited</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white">Question Explanations & Review</h3>
                    {quizResult.evaluatedQuestions?.map((eq: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          eq.isCorrect
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                            : "bg-rose-950/20 border-rose-500/30 text-rose-200"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>Question #{idx + 1}: {eq.question}</span>
                          <span>{eq.isCorrect ? "✓ Correct (+10)" : "✗ Incorrect (0)"}</span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <strong>Explanation:</strong> {eq.explanation}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setActiveQuiz(null);
                    }}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Start Another Quiz →
                  </button>
                </div>
              ) : testActive && activeQuiz ? (
                /* Live Test Questions */
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
                  {/* Top Bar with Timer */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-purple-400 font-bold">
                        Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{activeQuiz.title}</h3>
                    </div>

                    <div className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold text-xs flex items-center gap-1.5">
                      <span>⏱️</span> <span>{formatTimer(timerSeconds)}</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  {(() => {
                    const q = activeQuiz.questions[currentQuestionIndex];
                    if (!q) return null;
                    const qId = q._id || String(currentQuestionIndex);
                    const selectedVal = answers[qId] || "";

                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-white">
                          {q.question}
                        </div>

                        {/* Options / Input */}
                        {q.options && q.options.length > 0 ? (
                          <div className="space-y-2.5">
                            {q.options.map((opt: string, optIdx: number) => (
                              <div
                                key={optIdx}
                                onClick={() => handleAnswerSelect(qId, opt)}
                                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center gap-3 ${
                                  selectedVal === opt
                                    ? "bg-purple-600/30 border-purple-500 text-purple-100 font-semibold"
                                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                                }`}
                              >
                                <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-[10px] text-purple-400 border border-slate-800 shrink-0">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            rows={4}
                            value={selectedVal}
                            onChange={(e) => handleAnswerSelect(qId, e.target.value)}
                            placeholder="Type your subjective answer or code reasoning here..."
                            className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                          />
                        )}
                      </div>
                    );
                  })()}

                  {/* Nav Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      ← Previous
                    </button>

                    {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white cursor-pointer"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 cursor-pointer"
                      >
                        {loading ? "Grading..." : "Submit Assessment ✓"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                  <div className="text-4xl">⚡</div>
                  <h3 className="text-base font-bold text-white">Configure Your Assessment</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Select your topic or lesson from the left panel and click "Generate & Start Quiz" to test your knowledge against real-world engineering standards.
                  </p>
                  <button
                    onClick={handleGenerateQuiz}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 cursor-pointer"
                  >
                    Quick Start 5-Question Test →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
