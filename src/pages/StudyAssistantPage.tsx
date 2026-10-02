import React, { useState, useEffect } from "react";
import {
  generateCustomStudyPlan,
  getCurrentStudyPlan,
  toggleStudyMilestone,
  getAIProgressTelemetry,
  type StudyPlan,
  type AIProgressStats,
} from "../services/aiService";
import ProgressChart from "../components/ai/ProgressChart";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function StudyAssistantPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [telemetry, setTelemetry] = useState<AIProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [targetRole, setTargetRole] = useState("Senior Full-Stack Cloud Architect");
  const [timelineWeeks, setTimelineWeeks] = useState(8);
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [currentLevel, setCurrentLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plan, progress] = await Promise.all([
        getCurrentStudyPlan(),
        getAIProgressTelemetry(),
      ]);
      setStudyPlan(plan);
      setTelemetry(progress);
    } catch (err) {
      console.error("Load study assistant data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const newPlan = await generateCustomStudyPlan({
        targetRole,
        timelineWeeks,
        weeklyHours,
        currentLevel,
      });
      setStudyPlan(newPlan);
      // Reload telemetry
      const updatedProgress = await getAIProgressTelemetry();
      setTelemetry(updatedProgress);
    } catch (err) {
      console.error("Generate study plan error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleWeek = async (weekNumber: number, currentStatus: boolean) => {
    if (!studyPlan) return;
    try {
      const updatedPlan = await toggleStudyMilestone(studyPlan._id, weekNumber, !currentStatus);
      setStudyPlan(updatedPlan);
      // Refresh telemetry
      const updatedProgress = await getAIProgressTelemetry();
      setTelemetry(updatedProgress);
    } catch (err) {
      console.error("Toggle milestone error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Personalized AI Study Assistant & Roadmap | KR Global Learning"
        description="Generate a tailored, week-by-week software engineering curriculum with automated progress milestones and telemetry."
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>🧭</span> Personalized Study Assistant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Engineering Curriculum & Roadmap Assistant
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Dynamic week-by-week learning blueprints synthesized for your target engineering title, current proficiency, and weekly study schedule.
          </p>
        </div>

        {/* Telemetry Progress Chart */}
        {telemetry && <ProgressChart stats={telemetry} />}

        {/* Generator Controls */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <span>⚡</span> Customize Your Learning Roadmap
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Input your career milestone goals. The AI will synthesize an end-to-end curriculum with capstones.
          </p>

          <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role / Specialization
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Java Backend Architect, Cloud DevOps Lead"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Timeline (Weeks)
              </label>
              <select
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value={4}>4 Weeks (Fast Track Sprint)</option>
                <option value={8}>8 Weeks (Balanced Mastery)</option>
                <option value={12}>12 Weeks (Comprehensive Lead)</option>
                <option value={16}>16 Weeks (Staff Engineer Blueprint)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Weekly Commitment
              </label>
              <select
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value={8}>8 Hours / Week (Part-time)</option>
                <option value={12}>12 Hours / Week (Recommended)</option>
                <option value={20}>20 Hours / Week (Intensive)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? "Synthesizing Custom Curriculum..." : "Generate AI Study Roadmap ➔"}
              </button>
            </div>
          </form>
        </div>

        {/* Current Active Plan Weeks Roadmap */}
        {studyPlan && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Active Learning Blueprint
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {studyPlan.targetRole}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {studyPlan.targetTimelineWeeks} Weeks • {studyPlan.weeklyHours} hrs/week • Proficiency: {studyPlan.currentSkillLevel}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-1">
                  Curriculum Progress
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-36 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${studyPlan.overallProgress}%` }}
                    />
                  </div>
                  <span className="text-xl font-black text-amber-400">
                    {studyPlan.overallProgress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Weeks Timeline */}
            <div className="space-y-4">
              {studyPlan.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`p-5 rounded-2xl border transition-all ${
                    week.completed
                      ? "bg-slate-950/40 border-emerald-500/30 text-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleWeek(week.weekNumber, week.completed)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold transition-all mt-0.5 cursor-pointer shrink-0 ${
                          week.completed
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
                            : "border-slate-700 bg-slate-900 hover:border-amber-400"
                        }`}
                      >
                        {week.completed && "✓"}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              week.completed ? "line-through text-slate-500" : "text-white"
                            }`}
                          >
                            {week.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            {week.milestone}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {week.description}
                        </p>

                        {/* Practical Project Badge */}
                        {week.practicalProject && (
                          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-cyan-300 flex items-center gap-2">
                            <span>🛠️</span>
                            <span>{week.practicalProject}</span>
                          </div>
                        )}

                        {/* Topics Pill List */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {week.topics.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          week.completed
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {week.completed ? "Completed" : "Pending Checkpoint"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
