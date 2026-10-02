import React from "react";
import type { AIProgressStats } from "../../services/aiService";

interface ProgressChartProps {
  stats: AIProgressStats;
}

export default function ProgressChart({ stats }: ProgressChartProps) {
  const metrics = [
    {
      label: "Interview Readiness",
      value: stats.averageInterviewScore,
      unit: "/100",
      color: "from-purple-500 to-indigo-500",
      textColor: "text-purple-400",
      bgBorder: "border-purple-500/30 bg-purple-500/10",
      description: `${stats.interviewSessionsCompleted} Mock Sessions Completed`,
    },
    {
      label: "Technical Quiz Mastery",
      value: stats.averageQuizScore,
      unit: "%",
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-400",
      bgBorder: "border-cyan-500/30 bg-cyan-500/10",
      description: `${stats.totalQuizzesTaken} Assessments Practiced`,
    },
    {
      label: "Resume ATS Score",
      value: stats.latestResumeAtsScore,
      unit: "/100",
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-400",
      bgBorder: "border-emerald-500/30 bg-emerald-500/10",
      description: "Parsed against Tier-1 Benchmarks",
    },
    {
      label: "Study Roadmap Progress",
      value: stats.studyRoadmapProgress,
      unit: "%",
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
      bgBorder: "border-amber-500/30 bg-amber-500/10",
      description: "Weekly Milestones & Capstones",
    },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header with Overall Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-base">
              📈
            </span>
            AI Engineering Mastery Telemetry
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated performance metrics across mock interviews, dynamic quizzes, ATS resume scoring, and study roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-cyan-500/30 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Overall Index
            </span>
            <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {stats.overallMasteryPercentage}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-xl">
            🏆
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">
                {m.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${m.textColor}`}>
                  {m.value}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {m.unit}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(5, m.value))}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                {m.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Competency Readiness Bar Breakdown */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>⚡</span> Enterprise Role Readiness Spectrum
        </h4>

        <div className="space-y-3.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Distributed Systems & Architecture</span>
              <span className="text-cyan-400 font-bold">88%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: "88%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Full Stack Integration (React 19 + Java/Node)</span>
              <span className="text-purple-400 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: "92%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Cloud Orchestration (AWS, Docker, K8s)</span>
              <span className="text-emerald-400 font-bold">84%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: "84%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Behavioral & Technical Communication</span>
              <span className="text-amber-400 font-bold">86%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: "86%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
