import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function StudyPlannerPage() {
  const [plannerData, setPlannerData] = useState<any>(null);
  const [activeView, setActiveView] = useState<"goal" | "daily" | "weekly" | "calendar" | "habits">("goal");
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [pomodoroTopic, setPomodoroTopic] = useState<string>("Spring Boot Microservices & Saga Pattern");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadPlanner();
  }, []);

  const loadPlanner = async () => {
    const data = await lmsService.getStudyPlan();
    setPlannerData(data);
  };

  // Pomodoro countdown timer
  useEffect(() => {
    let timer: any = null;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      timer = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroRunning && pomodoroSeconds === 0) {
      if (pomodoroMode === "focus") {
        setPomodoroCount((prev) => prev + 1);
        setPomodoroMode("break");
        setPomodoroSeconds(5 * 60);
        showToast("✓ Pomodoro 25-min interval complete! Take a 5-minute break.");
        lmsService.logPomodoro(pomodoroTopic, 25);
      } else {
        setPomodoroMode("focus");
        setPomodoroSeconds(25 * 60);
        showToast("Break over! Ready for next 25-min focus sprint.");
      }
      setPomodoroRunning(false);
    }
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroSeconds, pomodoroMode, pomodoroTopic]);

  const togglePomodoro = () => {
    setPomodoroRunning(!pomodoroRunning);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroSeconds(pomodoroMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const calendarDays = [
    { day: "Mon 15", event: "Kafka Consumer Rebalancing", type: "class", time: "7:00 PM" },
    { day: "Tue 16", event: "Spring Security JWT Lab", type: "assignment", time: "Due 11:59 PM" },
    { day: "Wed 17", event: "One-on-One Mentor Pairing with Rajesh", type: "mentor", time: "8:00 PM" },
    { day: "Thu 18", event: "Distributed Systems Quiz", type: "quiz", time: "Available" },
    { day: "Fri 19", event: "PostgreSQL B-Tree Tuning", type: "study", time: "Self Study" },
    { day: "Sat 20", event: "Kubernetes Cluster Clinic", type: "live", time: "10:00 AM" },
    { day: "Sun 21", event: "Weekly Revision & Mock Interview", type: "revision", time: "6:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Study Planner & Pomodoro | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Goal-based AI study planner, daily & weekly targets, study calendar, exam countdown, habit streak tracker, and Pomodoro timer."
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
              <span>⚡ Sprint 9.5</span>
              <span>•</span>
              <span>AI Study Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Goal-Based Study Planner & Pomodoro</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              AI-personalized roadmaps, daily schedule blocks, exam countdowns, habit consistency tracking, and integrated Pomodoro sprints.
            </p>
          </div>

          {/* Exam Countdown Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center shrink-0">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Exam Countdown</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">51 Days</div>
            <div className="text-[11px] text-slate-400">Target Date: Nov 15, 2026</div>
          </div>
        </div>

        {/* View Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { key: "goal", label: "🎯 Goal-Based Roadmap" },
            { key: "daily", label: "⏱️ Daily Schedule" },
            { key: "weekly", label: "🗓️ Weekly Milestones" },
            { key: "calendar", label: "📅 Study Calendar" },
            { key: "habits", label: "🔥 Habit Tracker" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeView === tab.key
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Planner Content (2 Cols) + Pomodoro Timer (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Dynamic Views */}
          <div className="lg:col-span-2 space-y-6">
            {activeView === "goal" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🎯 Goal: Master Cloud & Microservices in 8 Weeks</span>
                  </h2>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    Week 4 of 8 (50% Reached)
                  </span>
                </div>

                <div className="space-y-3">
                  {plannerData?.weeklyMilestones?.map((wm: any) => (
                    <div
                      key={wm.week}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition ${
                        wm.completed
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                          : wm.isCurrent
                          ? "bg-purple-950/30 border-purple-500/50 text-white ring-1 ring-purple-500/40"
                          : "bg-slate-950/60 border-slate-800 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            wm.completed ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {wm.completed ? "✓" : `#${wm.week}`}
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm">{wm.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {wm.completed ? "Completed on schedule" : wm.isCurrent ? "Active Sprint (Focus Area)" : "Upcoming"}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border">
                        {wm.completed ? "Verified" : wm.isCurrent ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "daily" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>⏱️ Today's Optimized Hourly Schedule</span>
                </h2>
                <div className="space-y-3 text-xs">
                  {[
                    { time: "07:30 AM - 08:30 AM", title: "Morning DSA & LeetCode Problem of the Day", status: "Done", tag: "Algorithm" },
                    { time: "01:00 PM - 01:45 PM", title: "Review AI Flashcards & System Design Cheat-Sheet", status: "Done", tag: "Revision" },
                    { time: "07:00 PM - 08:30 PM", title: "Live Pair Programming Class with Rajesh Kumar", status: "Upcoming", tag: "Live Class" },
                    { time: "09:00 PM - 10:00 PM", title: "Kafka Consumer Rebalance Capstone Lab & PR Submission", status: "Scheduled", tag: "Assignment" },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400">{s.time}</span>
                        <div className="font-bold text-white">{s.title}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {s.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "weekly" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white">🗓️ Weekly Hours Breakdown</h2>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {[
                    { day: "Mon", hrs: "2.5h", done: true },
                    { day: "Tue", hrs: "3.8h", done: true },
                    { day: "Wed", hrs: "1.5h", done: true },
                    { day: "Thu", hrs: "2.8h", done: true },
                    { day: "Fri", hrs: "2.4h", done: true },
                    { day: "Sat", hrs: "0.0h", done: false },
                    { day: "Sun", hrs: "0.0h", done: false },
                  ].map((d, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border ${
                        d.done ? "bg-purple-600/20 border-purple-500/40 text-purple-200" : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      <div className="font-bold">{d.day}</div>
                      <div className="text-sm font-black mt-1">{d.hrs}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "calendar" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white">📅 Academic Study Calendar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {calendarDays.map((c, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 font-bold">{c.day}</span>
                        <div className="font-bold text-white mt-0.5">{c.event}</div>
                        <div className="text-[11px] text-slate-400">{c.time}</div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {c.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "habits" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">🔥 Daily Learning Habits & Consistency</h2>
                  <span className="text-xs text-amber-400 font-bold font-mono">18 Days Active Streak</span>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { habit: "Complete 1 Video Lecture or Tech Guide", streak: "18 Days", checked: true },
                    { habit: "Solve at least 1 LeetCode / DSA Problem", streak: "14 Days", checked: true },
                    { habit: "Review 10 Spaced Repetition Flashcards", streak: "9 Days", checked: true },
                    { habit: "Log 2 Pomodoro Sessions (50 mins focus)", streak: "12 Days", checked: true },
                  ].map((h, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold text-base">✓</span>
                        <span className="font-semibold text-slate-200">{h.habit}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        🔥 {h.streak}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pomodoro Integration */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <span>⏱️</span> Pomodoro Focus Engine
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {pomodoroCount} Done (+{pomodoroCount * 25} XP)
              </span>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <button
                onClick={() => {
                  setPomodoroMode("focus");
                  setPomodoroSeconds(25 * 60);
                  setPomodoroRunning(false);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  pomodoroMode === "focus" ? "bg-purple-600 text-white shadow-md" : "text-slate-400"
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => {
                  setPomodoroMode("break");
                  setPomodoroSeconds(5 * 60);
                  setPomodoroRunning(false);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  pomodoroMode === "break" ? "bg-cyan-600 text-white shadow-md" : "text-slate-400"
                }`}
              >
                Break (5m)
              </button>
            </div>

            {/* Big Countdown Display */}
            <div className="text-center py-6">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {formatTime(pomodoroSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {pomodoroMode === "focus" ? "🎯 Stay focused on your code" : "☕ Take a breather & stretch"}
              </p>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Focus Session Topic</label>
              <input
                type="text"
                value={pomodoroTopic}
                onChange={(e) => setPomodoroTopic(e.target.value)}
                placeholder="What are you studying right now?"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePomodoro}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  pomodoroRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40"
                    : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-purple-950/40"
                }`}
              >
                <span>{pomodoroRunning ? "⏸ Pause" : "▶ Start Session"}</span>
              </button>
              <button
                onClick={resetPomodoro}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
