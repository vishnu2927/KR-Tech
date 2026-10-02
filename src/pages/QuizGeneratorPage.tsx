import React, { useState, useEffect } from "react";
import {
  generateQuizQuestions,
  submitQuizResults,
  getQuizAttemptsHistory,
  type QuizQuestionItem,
  type QuizAttempt,
} from "../services/aiService";
import QuizCard from "../components/ai/QuizCard";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TOPIC_PRESETS = [
  { id: "java", label: "Java 21 & Spring Boot", icon: "☕" },
  { id: "react", label: "React 19 & TypeScript", icon: "⚛️" },
  { id: "cloud", label: "Kubernetes & AWS Cloud", icon: "☁️" },
  { id: "microservices", label: "Kafka & Event-Driven", icon: "⚡" },
  { id: "security", label: "Cybersecurity & OWASP", icon: "🛡️" },
  { id: "dsa", label: "Data Structures & Algos", icon: "🏛️" },
];

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState("java");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionItem[] | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompletedAttempt, setQuizCompletedAttempt] = useState<QuizAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History State
  const [pastAttempts, setPastAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const history = await getQuizAttemptsHistory();
      setPastAttempts(history);
    } catch {
      // Ignored
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setQuizCompletedAttempt(null);
    setSelectedAnswers({});
    setShowExplanation(false);

    try {
      const data = await generateQuizQuestions({
        topic,
        difficulty,
        count: questionCount,
      });

      setActiveQuestions(data.questions);
      setCurrentQIndex(0);
    } catch (err) {
      console.error("Generate quiz error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (activeQuestions && currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuestions) return;
    setIsSubmitting(true);

    const questionsPayload = activeQuestions.map((q, idx) => ({
      ...q,
      selectedOptionIndex: selectedAnswers[idx] ?? -1,
    }));

    try {
      const attempt = await submitQuizResults({
        topic,
        difficulty,
        questions: questionsPayload,
        timeSpentSeconds: 180,
      });

      setQuizCompletedAttempt(attempt);
      setActiveQuestions(null);
      fetchHistory();
    } catch (err) {
      console.error("Submit quiz error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="AI Dynamic Technical Quiz | KR Global Learning"
        description="Test your engineering skills with customized AI-generated multiple choice quizzes, instant grading, and in-depth architectural explanations."
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>⚡</span> Dynamic Technical Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Technical Knowledge Evaluator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Generate customized, production-grade multiple choice questions across modern tech stacks. Receive instant answers, code insights, and track your proficiency.
          </p>
        </div>

        {/* Generator Controls / Active Quiz / Results */}
        {!activeQuestions && !quizCompletedAttempt && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Setup Form */}
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🎯</span> Configure Assessment Parameters
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Choose an engineering domain, seniority tier, and quiz length.
              </p>

              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Topic Presets Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Technical Domain
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TOPIC_PRESETS.map((p) => {
                      const isSelected = topic === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTopic(p.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-cyan-950/40 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60"
                          }`}
                        >
                          <span className="text-lg">{p.icon}</span>
                          <span className="text-xs font-bold leading-tight">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Difficulty Calibration
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="beginner">Beginner (Core Syntax & Concepts)</option>
                      <option value="intermediate">Intermediate (Production Patterns)</option>
                      <option value="advanced">Advanced (High Scale & Internals)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Questions Count
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value={3}>3 Questions (Quick Sprint)</option>
                      <option value={5}>5 Questions (Standard Benchmark)</option>
                      <option value={10}>10 Questions (Deep Dive)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Synthesizing Assessment Questions...
                    </>
                  ) : (
                    <>Generate & Start Quiz 🚀</>
                  )}
                </button>
              </form>
            </div>

            {/* Past Attempts List */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Recent Assessments</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {pastAttempts.length} total
                  </span>
                </h3>

                <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                  {pastAttempts.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">
                      No quizzes taken yet. Generate your first one!
                    </p>
                  ) : (
                    pastAttempts.map((att) => (
                      <div
                        key={att._id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white capitalize">
                            {att.topic}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              att.passed
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {att.percentage}% ({att.score}/{att.totalQuestions})
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="capitalize">{att.difficulty}</span>
                          <span>{new Date(att.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
                70% Score Required to Pass Benchmark
              </div>
            </div>
          </div>
        )}

        {/* Active Quiz Card View */}
        {activeQuestions && (
          <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Topic:</span>
                <span className="text-xs font-bold text-white capitalize">{topic}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  {difficulty}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExplanation((v) => !v)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all cursor-pointer"
                >
                  {showExplanation ? "Hide Explanation" : "Reveal Answer"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuestions(null)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Quiz Card */}
            <QuizCard
              question={activeQuestions[currentQIndex]}
              questionIndex={currentQIndex}
              totalQuestions={activeQuestions.length}
              selectedOption={selectedAnswers[currentQIndex] ?? -1}
              onSelectOption={handleSelectOption}
              showExplanation={showExplanation}
            />

            {/* Pagination / Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="text-xs px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ◀ Previous
              </button>

              <div className="flex items-center gap-1.5">
                {activeQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentQIndex(idx);
                      setShowExplanation(false);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      currentQIndex === idx
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : selectedAnswers[idx] !== undefined
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQIndex < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-xs px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
                >
                  Next ▶
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="text-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? "Grading..." : "Submit All Answers ✓"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Completed Results Card */}
        {quizCompletedAttempt && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    quizCompletedAttempt.passed
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {quizCompletedAttempt.passed ? "Passed Benchmark ✓" : "Needs Review"}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  Assessment Performance Summary
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-bold block">
                  Final Score
                </span>
                <span
                  className={`text-4xl font-black ${
                    quizCompletedAttempt.passed ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {quizCompletedAttempt.percentage}%
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {quizCompletedAttempt.score} of {quizCompletedAttempt.totalQuestions} Correct
                </span>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Question-by-Question Breakdown:
              </h4>

              {quizCompletedAttempt.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    q.isCorrect
                      ? "bg-emerald-950/15 border-emerald-800/40"
                      : "bg-rose-950/15 border-rose-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      Q{idx + 1}: {q.question}
                    </h5>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        q.isCorrect
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {q.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    Correct Answer: <strong className="text-emerald-300">{q.options[q.correctOptionIndex]}</strong>
                  </p>
                  {q.explanation && (
                    <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setQuizCompletedAttempt(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                Take Another Assessment ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
