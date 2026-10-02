import React, { useState, useEffect } from "react";
import studentAnalyticsService, {
  StudentAnalyticsData,
  BadgeItem,
  CourseProgressDetail,
  AttendanceHistoryItem,
  XPActivityItem,
} from "../../services/studentAnalyticsService";

interface Props {
  userEmail?: string;
  userName?: string;
  onToast?: (msg: string) => void;
}

const FALLBACK_ANALYTICS: StudentAnalyticsData = {
  userEmail: "student@krtech.in",
  userName: "Aditya Sharma",
  xp: 3850,
  level: 8,
  levelTitle: "Senior Systems Builder",
  xpProgress: {
    currentLevelXP: 350,
    xpPerLevel: 500,
    xpToNextLevel: 150,
    progressPercent: 70,
  },
  streak: {
    current: 5,
    longest: 14,
    lastActiveDate: new Date().toISOString().split("T")[0],
    weeklyDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  attendance: {
    attendedSessions: 32,
    totalSessions: 34,
    attendanceRate: 94.1,
    history: [
      {
        sessionId: "sess-01",
        topic: "Event-Driven Architecture with Apache Kafka & Debezium",
        mentorName: "Rajesh Kumar (Principal Technical Architect)",
        date: "Sep 16, 2026",
        status: "Present",
        sessionType: "Live One-on-One Expert Mentorship",
      },
      {
        sessionId: "sess-02",
        topic: "Microservices Resiliency with Resilience4j & Envoy Mesh",
        mentorName: "Rajesh Kumar (Principal Technical Architect)",
        date: "Sep 14, 2026",
        status: "Present",
        sessionType: "Hands-on Lab",
      },
      {
        sessionId: "sess-03",
        topic: "AWS VPC Peering & High Availability Multi-Region Setup",
        mentorName: "Vikram Nair (Staff Software Engineer)",
        date: "Sep 11, 2026",
        status: "Present",
        sessionType: "Live One-on-One Expert Mentorship",
      },
      {
        sessionId: "sess-04",
        topic: "Distributed Tracing with OpenTelemetry & Jaeger",
        mentorName: "Rajesh Kumar (Principal Technical Architect)",
        date: "Sep 08, 2026",
        status: "Excused",
        sessionType: "Architecture Review",
      },
      {
        sessionId: "sess-05",
        topic: "MERN Authentication with JWT, Refresh Tokens & OAuth2",
        mentorName: "Amit Verma (Principal Systems Architect)",
        date: "Sep 05, 2026",
        status: "Present",
        sessionType: "Live One-on-One Expert Mentorship",
      },
    ],
  },
  badges: [
    {
      id: "badge-fast-learner",
      name: "Fast Track Learner",
      icon: "⚡",
      description: "Finished 5 architectural modules in a single study week.",
      category: "Speed",
      unlocked: true,
      unlockedAt: "2026-08-15T00:00:00.000Z",
      progressPercent: 100,
      criteria: "5 modules completed in 7 days",
    },
    {
      id: "badge-streak-5",
      name: "Consistency Flame",
      icon: "🔥",
      description: "Maintained a 5-day uninterrupted learning streak.",
      category: "Dedication",
      unlocked: true,
      unlockedAt: "2026-09-17T00:00:00.000Z",
      progressPercent: 100,
      criteria: "5-day check-in streak",
    },
    {
      id: "badge-kafka-pro",
      name: "Kafka Stream Master",
      icon: "🚀",
      description: "Configured multi-partition Kafka consumer groups with zero lag.",
      category: "Engineering",
      unlocked: true,
      unlockedAt: "2026-09-02T00:00:00.000Z",
      progressPercent: 100,
      criteria: "Complete Event-Driven Kafka module",
    },
    {
      id: "badge-resilience",
      name: "Resilience Architect",
      icon: "🛡️",
      description: "Implemented Circuit Breaker and Rate Limiter with 99.99% fault tolerance.",
      category: "Architecture",
      unlocked: true,
      unlockedAt: "2026-09-14T00:00:00.000Z",
      progressPercent: 100,
      criteria: "Complete Distributed Resiliency capstone",
    },
    {
      id: "badge-cloud-pro",
      name: "Cloud Terraform Pioneer",
      icon: "☁️",
      description: "Provisioned multi-tier AWS infrastructure using pure Infrastructure-as-Code.",
      category: "DevOps",
      unlocked: true,
      unlockedAt: "2026-09-01T00:00:00.000Z",
      progressPercent: 100,
      criteria: "Pass AWS Associate capstone test",
    },
    {
      id: "badge-attendance-90",
      name: "Unbroken Presence",
      icon: "🎯",
      description: "Achieved over 90% attendance across all live One-on-One mentor syncs.",
      category: "Attendance",
      unlocked: true,
      unlockedAt: "2026-09-10T00:00:00.000Z",
      progressPercent: 100,
      criteria: "Maintain >90% live attendance",
    },
    {
      id: "badge-streak-14",
      name: "Streak Warrior",
      icon: "⚔️",
      description: "Hit 14 days of consecutive coding & lecture study.",
      category: "Dedication",
      unlocked: false,
      progressPercent: 35,
      criteria: "14-day check-in streak (5/14)",
    },
    {
      id: "badge-staff-engineer",
      name: "Staff Engineer Candidate",
      icon: "👑",
      description: "Attain Level 10 and complete all core curriculum capstones.",
      category: "Mastery",
      unlocked: false,
      progressPercent: 80,
      criteria: "Reach Level 10 (Current: Level 8)",
    },
  ],
  xpActivities: [
    {
      title: "Completed Hands-on Lab: Resilience4j Circuit Breaker",
      xp: 150,
      type: "lecture",
      timestamp: "2026-09-17T14:30:00.000Z",
    },
    {
      title: "Daily Learning Streak Bonus",
      xp: 75,
      type: "streak",
      timestamp: "2026-09-17T09:00:00.000Z",
    },
    {
      title: "Attended Live One-on-One Expert Mentorship Session with Rajesh Kumar",
      xp: 100,
      type: "attendance",
      timestamp: "2026-09-16T19:45:00.000Z",
    },
    {
      title: "Unlocked Badge: Resilience Architect",
      xp: 200,
      type: "badge",
      timestamp: "2026-09-14T20:00:00.000Z",
    },
    {
      title: "Submitted Assignment: Kafka Distributed Producer & Consumer",
      xp: 250,
      type: "assignment",
      timestamp: "2026-09-12T18:00:00.000Z",
    },
  ],
  courses: [
    {
      courseId: "java-backend",
      courseTitle: "Complete Java Backend Development with Spring Boot 3 & Microservices",
      category: "Java Backend",
      mentor: "Rajesh Kumar (Principal Technical Architect)",
      progressPercent: 78,
      completedLectures: 19,
      totalLectures: 24,
      watchHours: 38.5,
      modules: [
        { name: "Microservices Architecture & Spring Cloud", progress: 100 },
        { name: "Event-Driven Messaging with Apache Kafka", progress: 90 },
        { name: "Distributed Caching & Redis Cluster", progress: 75 },
        { name: "Resilience, Rate Limiting & Docker Swarm", progress: 50 },
      ],
    },
    {
      courseId: "aws-architect",
      courseTitle: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      category: "AWS Cloud",
      mentor: "Vikram Nair (Staff Software Engineer)",
      progressPercent: 100,
      completedLectures: 28,
      totalLectures: 28,
      watchHours: 46.0,
      modules: [
        { name: "IAM, Security, VPC Peering & Transit Gateway", progress: 100 },
        { name: "Compute, ECS, Fargate & Serverless Lambda", progress: 100 },
        { name: "Storage & High Availability Databases (RDS/Aurora)", progress: 100 },
        { name: "Terraform Infrastructure as Code Capstone", progress: 100 },
      ],
    },
    {
      courseId: "mern-stack",
      courseTitle: "MERN Stack Full Stack Web Development Mastery Bootcamp",
      category: "MERN Stack",
      mentor: "Amit Verma (Principal Systems Architect)",
      progressPercent: 48,
      completedLectures: 12,
      totalLectures: 25,
      watchHours: 21.0,
      modules: [
        { name: "Modern React 19 & TypeScript State Systems", progress: 95 },
        { name: "Node.js Event Loop & Express REST Design", progress: 60 },
        { name: "MongoDB Aggregation Pipelines & Sharding", progress: 40 },
        { name: "Production CI/CD Pipelines & Cloud Run", progress: 0 },
      ],
    },
  ],
  overallCurriculumCompletion: 75.3,
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StudentProgressTrackerView({ userEmail, userName, onToast }: Props) {
  const [data, setData] = useState<StudentAnalyticsData>(FALLBACK_ANALYTICS);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingIn, setCheckingIn] = useState<boolean>(false);
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Load analytics from API
  useEffect(() => {
    let mounted = true;
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const result = await studentAnalyticsService.getAnalytics(userEmail);
        if (mounted && result) {
          setData(result);
        }
      } catch (err) {
        console.warn("Using fallback student analytics data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAnalytics();
    return () => {
      mounted = false;
    };
  }, [userEmail]);

  // Handle Daily Streak Check-in
  const handleCheckIn = async () => {
    if (checkingIn) return;
    setCheckingIn(true);
    try {
      const res = await studentAnalyticsService.checkInStreak();
      if (res && res.streak) {
        setData((prev) => ({
          ...prev,
          streak: res.streak,
          xp: res.xp,
          xpProgress: {
            ...prev.xpProgress,
            currentLevelXP: (prev.xpProgress.currentLevelXP + 75) % 500,
            xpToNextLevel: Math.max(0, 500 - ((prev.xpProgress.currentLevelXP + 75) % 500)),
            progressPercent: Math.min(100, Math.round((((prev.xpProgress.currentLevelXP + 75) % 500) / 500) * 100)),
          },
          xpActivities: [
            {
              title: "Daily Streak Check-in (+75 XP 🔥)",
              xp: 75,
              type: "streak",
              timestamp: new Date().toISOString(),
            },
            ...prev.xpActivities,
          ],
        }));
        if (onToast) onToast("🔥 Streak checked in! +75 XP awarded to your profile!");
      }
    } catch (err: any) {
      if (onToast) onToast(err.response?.data?.message || "Already checked in today! Keep the flame burning 🔥");
    } finally {
      setCheckingIn(false);
    }
  };

  // Filter badges
  const filteredBadges = data.badges.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

  const unlockedBadgeCount = data.badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO XP & LEVEL BANNER + DAILY STREAK WIDGET
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP & Level Status Card (Takes 2 columns on large screens) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-md">
          {/* Subtle decorative glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Level Hexagon / Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 p-[2px] shadow-xl shadow-purple-900/40">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-400">Level</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{data.level}</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-amber-300">
                  PRO
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    KR Global Learning Gamified Tier
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                    Top 5% Cohort
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {data.levelTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Learner: <strong className="text-slate-200">{userName || data.userName}</strong> ·{" "}
                  <span className="text-purple-400 font-medium">{data.xp.toLocaleString()} Total XP</span>
                </p>
              </div>
            </div>

            {/* Quick Check-in Button */}
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <span className="text-base animate-pulse">🔥</span>
              <span>{checkingIn ? "Checking In..." : "Daily Check-in (+75 XP)"}</span>
            </button>
          </div>

          {/* XP Progress Bar to next level */}
          <div className="mt-7 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Progress to Level {data.level + 1}</span>
                <span className="text-purple-400 font-mono text-[11px]">
                  ({data.xpProgress.currentLevelXP} / {data.xpProgress.xpPerLevel} XP)
                </span>
              </span>
              <span className="font-extrabold text-purple-300">
                {data.xpProgress.xpToNextLevel} XP needed
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                style={{ width: `${data.xpProgress.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full transition-all duration-1000 shadow-sm shadow-purple-500/50"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
              <span>Level {data.level} Baseline</span>
              <span className="text-slate-400 font-semibold">{data.xpProgress.progressPercent}% Completed</span>
              <span>Level {data.level + 1} Master</span>
            </div>
          </div>
        </div>

        {/* Weekly Streak Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Weekly Consistency</span>
              <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full text-[10px] border border-orange-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                Streak Active
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-black text-white tracking-tight">
                {data.streak.current}
              </span>
              <span className="text-sm font-bold text-orange-400">Days Consecutive 🔥</span>
            </div>
            <p className="text-xs text-slate-400">
              Personal Best: <strong className="text-slate-200">{data.streak.longest} Days</strong> · Check in daily to unlock the Streak Warrior badge!
            </p>
          </div>

          {/* 7-Day Visual Calendar Tracker */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 mb-3">
              Active This Week (Mon – Sun)
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isActive = data.streak.weeklyDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                      isActive
                        ? "bg-orange-500/15 border-orange-500/40 text-orange-300 shadow-sm shadow-orange-500/20"
                        : "bg-slate-950/60 border-slate-800 text-slate-500"
                    }`}
                  >
                    <span className="text-[10px] font-bold mb-1">{day}</span>
                    <span className="text-sm">{isActive ? "🔥" : "·"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 2: ATTENDANCE METRICS & SESSION HISTORY
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary Radial / Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">Live One-on-One & Class Attendance</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/20">
                90%+ Target Met
              </span>
            </div>

            {/* Big Attendance Metric */}
            <div className="flex items-center gap-5 my-3">
              <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950 shadow-inner">
                {/* Visual ring overlay */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-400 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                  }}
                />
                <div className="text-center relative z-10">
                  <span className="text-xl font-extrabold text-white block">
                    {data.attendance.attendanceRate}%
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase">Verified</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-white font-bold text-sm">
                  {data.attendance.attendedSessions} of {data.attendance.totalSessions} Sessions
                </div>
                <div className="text-slate-400 text-[11px]">
                  Attended with active camera & live whiteboard pairing.
                </div>
                <div className="text-emerald-400 font-medium text-[11px] pt-1">
                  ✓ Eligible for verified industry certification
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Minimum Requirement: <strong className="text-slate-200">80%</strong></span>
            <span className="text-purple-400 font-semibold">Tier 1 Standing</span>
          </div>
        </div>

        {/* Live Session Log Table */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Mentorship Attendance Log</h3>
              <p className="text-xs text-slate-400">Historical records of live One-on-One sessions & code walkthroughs</p>
            </div>
            <span className="text-xs text-purple-400 font-semibold">
              {data.attendance.history.length} Sessions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Topic / Milestone</th>
                  <th className="pb-3 font-semibold">Mentor</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.attendance.history.map((sess, idx) => (
                  <tr key={sess.sessionId || idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-medium text-white max-w-[220px] truncate">
                      {sess.topic}
                    </td>
                    <td className="py-3 text-slate-300">{sess.mentorName}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{sess.sessionType}</td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{sess.date}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          sess.status === "Present"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : sess.status === "Excused"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        {sess.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: COURSE PROGRESS BARS & MODULE BREAKDOWN
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Curriculum Mastery
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                {data.overallCurriculumCompletion}% Overall Done
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Course & Module Progress Bars</h3>
            <p className="text-xs text-slate-400">
              Detailed tracking of completed video lectures, capstone labs, and microservice deliverables
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Cohort Watch Time</span>
            <span className="text-xl font-black text-white font-mono">
              {data.courses.reduce((acc, c) => acc + (c.watchHours || 0), 0).toFixed(1)} hrs
            </span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.courses.map((c) => (
            <div
              key={c.courseId}
              className="rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all group shadow-md"
            >
              <div>
                {/* Course Category Badge */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {c.category}
                  </span>
                  <span className="font-mono text-slate-300">
                    {c.completedLectures} / {c.totalLectures} Lectures
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                  {c.courseTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  Mentor: <strong className="text-slate-200">{c.mentor || "Staff Architect"}</strong>
                </p>

                {/* Main Course Progress Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Course Completion</span>
                    <span className="text-purple-400 font-extrabold">{c.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${c.progressPercent}%` }}
                      className={`h-full rounded-full transition-all duration-700 ${
                        c.progressPercent === 100
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Sub-module breakdown progress bars */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Module Breakdown
                  </span>
                  {c.modules &&
                    c.modules.map((m, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span className="truncate pr-2">{m.name}</span>
                          <span className="font-mono text-[10px] text-purple-300 font-bold">{m.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${m.progress}%` }}
                            className="h-full bg-purple-400/80 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Watch Hours: <strong className="text-slate-200">{c.watchHours} hrs</strong></span>
                <span className={c.progressPercent === 100 ? "text-emerald-400 font-bold" : "text-purple-400 font-semibold"}>
                  {c.progressPercent === 100 ? "✓ Completed" : "In Progress"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 4: BADGES & ACHIEVEMENTS SYSTEM
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Gamified Accolades
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
                {unlockedBadgeCount} of {data.badges.length} Unlocked
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Earned Badges & Milestone Achievements</h3>
            <p className="text-xs text-slate-400">
              Complete engineering assignments, maintain daily streaks, and participate in live reviews to unlock badges.
            </p>
          </div>

          {/* Badge Filter Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setBadgeFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                badgeFilter === "all" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({data.badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter("unlocked")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                badgeFilter === "unlocked" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Unlocked ({unlockedBadgeCount})
            </button>
            <button
              onClick={() => setBadgeFilter("locked")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                badgeFilter === "locked" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              In Progress ({data.badges.length - unlockedBadgeCount})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                badge.unlocked
                  ? "bg-slate-950/80 border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-900/20"
                  : "bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700"
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    badge.unlocked
                      ? "bg-gradient-to-tr from-purple-600/30 to-amber-500/30 border border-purple-400/40"
                      : "bg-slate-900 border border-slate-800 text-slate-600 grayscale"
                  }`}
                >
                  {badge.icon}
                </div>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                    badge.unlocked
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors mb-1">
                  {badge.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Progress bar or unlock timestamp */}
              <div className="pt-3 border-t border-slate-900">
                {badge.unlocked ? (
                  <div className="text-[10px] text-purple-300 font-medium flex items-center gap-1">
                    <span>✓ Achieved</span>
                    {badge.unlockedAt && (
                      <span className="text-slate-500">
                        · {new Date(badge.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span className="text-slate-300 font-mono">{badge.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${badge.progressPercent}%` }}
                        className="h-full bg-amber-400/80 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 5: RECENT XP ACTIVITY TIMELINE
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Recent XP Activity Feed</h3>
            <p className="text-xs text-slate-400">
              Audit log of all learning activities, assignments, and check-ins that granted experience points.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 font-bold">
            Total {data.xpActivities.length} Events Logged
          </span>
        </div>

        <div className="space-y-3">
          {data.xpActivities.map((act, index) => {
            const isStreak = act.type === "streak";
            const isBadge = act.type === "badge";
            const isAssg = act.type === "assignment";
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                      isStreak
                        ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        : isBadge
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : isAssg
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {isStreak ? "🔥" : isBadge ? "🏆" : isAssg ? "📝" : "⚡"}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">{act.title}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    +{act.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          BADGE DETAILS MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-amber-500/30 border border-purple-400/40 flex items-center justify-center text-3xl shadow-inner">
                {selectedBadge.icon}
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {selectedBadge.category} Badge
                </span>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                    selectedBadge.unlocked
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {selectedBadge.unlocked ? "UNLOCKED" : "IN PROGRESS"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedBadge.name}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Criteria & Requirement
              </span>
              <p className="text-xs text-slate-200 font-medium">
                {selectedBadge.criteria || "Complete required modules and maintain high attendance."}
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Current Progress</span>
                  <span className="text-purple-400 font-bold">{selectedBadge.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedBadge.progressPercent}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
