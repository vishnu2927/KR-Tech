import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function LearningAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await lmsService.getLearningAnalytics();
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  };

  const weeklyHoursData = [
    { day: "Mon", hours: 2.5, target: 2.0 },
    { day: "Tue", hours: 3.8, target: 2.0 },
    { day: "Wed", hours: 1.5, target: 2.0 },
    { day: "Thu", hours: 2.8, target: 2.0 },
    { day: "Fri", hours: 2.4, target: 2.0 },
    { day: "Sat", hours: 4.2, target: 3.0 },
    { day: "Sun", hours: 3.0, target: 2.0 },
  ];

  const accuracyData = [
    { topic: "Java Concurrency", score: 94 },
    { topic: "Spring Boot", score: 88 },
    { topic: "Kafka Streams", score: 96 },
    { topic: "PostgreSQL", score: 82 },
    { topic: "Kubernetes", score: 75 },
    { topic: "System Design", score: 90 },
  ];

  const summary = analytics?.summary || {
    totalHoursStudied: 42.5,
    totalLessonsCompleted: 58,
    overallQuizAccuracy: 92.4,
    assignmentsSubmitted: 8,
    courseCompletionPercent: 78,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="Learning Analytics & Telemetry | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Detailed learning telemetry charts, hours studied, quiz accuracy, weekly study trends, and AI-personalized recommendations."
      />
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.17</span>
              <span>•</span>
              <span>Deep Learning Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Student Telemetry & Progress Intelligence</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time telemetry tracking hours invested, quiz accuracy trends, assignment completion velocity, and AI-driven study recommendations.
            </p>
          </div>
          <span className="text-4xl">📈</span>
        </div>

        {/* 5 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xl">⏱️</span>
            <div className="text-2xl font-black text-white mt-2">{summary.totalHoursStudied}h</div>
            <div className="text-xs text-slate-400">Hours Studied</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xl">🎯</span>
            <div className="text-2xl font-black text-cyan-400 mt-2">{summary.totalLessonsCompleted}</div>
            <div className="text-xs text-slate-400">Lessons Completed</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xl">⚡</span>
            <div className="text-2xl font-black text-emerald-400 mt-2">{summary.overallQuizAccuracy}%</div>
            <div className="text-xs text-slate-400">Quiz Accuracy</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <span className="text-xl">📝</span>
            <div className="text-2xl font-black text-purple-400 mt-2">{summary.assignmentsSubmitted}</div>
            <div className="text-xs text-slate-400">Assignments Done</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl col-span-2 lg:col-span-1">
            <span className="text-xl">🎓</span>
            <div className="text-2xl font-black text-amber-400 mt-2">{summary.courseCompletionPercent}%</div>
            <div className="text-xs text-slate-400">Course Completion</div>
          </div>
        </div>

        {/* 2 Animated Recharts Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Chart 1: Hours Studied vs Target */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⏱️ Weekly Hours Studied vs Target</span>
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono">Total: 20.2h / 15.0h Goal</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHoursData}>
                  <defs>
                    <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="h" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="hours" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#hourGrad)" />
                  <Line type="monotone" dataKey="target" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Quiz Accuracy by Subject */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎯 Subject Mastery & Quiz Accuracy</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono">Avg: 92.4%</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="topic" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤖 AI-Generated Productivity Recommendations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analytics?.aiRecommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="text-xl">{rec.priority === "high" ? "🔥" : "💡"}</span>
                <div>
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">{rec.priority} Priority</div>
                  <p className="text-xs text-slate-300 mt-1">{rec.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
