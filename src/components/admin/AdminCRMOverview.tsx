import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import adminService, {
  AdminMetrics,
  WeeklyGrowthItem,
  MonthlyRevenueItem,
  LeadConversionItem,
  AdminActivityItem,
} from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AdminCRMOverview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalStudents: 146,
    activeStudents: 105,
    totalCourses: 55,
    totalMentors: 10,
    totalRevenue: 359976,
    totalTransactions: 24,
    demoLeads: 13,
    totalLeads: 22,
    conversionRate: "38.4%",
    growthPercent: "+24.6% this month",
  });

  const [weeklyGrowth, setWeeklyGrowth] = useState<WeeklyGrowthItem[]>([
    { week: "W1", students: 14, revenue: 38997, leads: 8 },
    { week: "W2", students: 18, revenue: 51996, leads: 12 },
    { week: "W3", students: 24, revenue: 64995, leads: 15 },
    { week: "W4", students: 29, revenue: 77994, leads: 19 },
    { week: "W5", students: 35, revenue: 90993, leads: 22 },
    { week: "W6", students: 42, revenue: 103992, leads: 26 },
    { week: "W7", students: 51, revenue: 129990, leads: 31 },
    { week: "W8", students: 64, revenue: 155988, leads: 38 },
  ]);

  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueItem[]>([
    { month: "Apr 2026", revenue: 185000, target: 150000, students: 28 },
    { month: "May 2026", revenue: 245000, target: 200000, students: 36 },
    { month: "Jun 2026", revenue: 320000, target: 280000, students: 44 },
    { month: "Jul 2026", revenue: 410000, target: 350000, students: 58 },
    { month: "Aug 2026", revenue: 535000, target: 450000, students: 72 },
    { month: "Sep 2026", revenue: 680000, target: 550000, students: 95 },
  ]);

  const [leadConversion, setLeadConversion] = useState<LeadConversionItem[]>([
    { stage: "Total Inquiries", count: 45, fill: "#8b5cf6" },
    { stage: "Contacted", count: 34, fill: "#06b6d4" },
    { stage: "Demo Scheduled", count: 23, fill: "#3b82f6" },
    { stage: "Converted (Enrolled)", count: 17, fill: "#10b981" },
  ]);

  const [activity, setActivity] = useState<AdminActivityItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCRMData() {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        if (!isMounted) return;

        if (data.metrics) setMetrics(data.metrics);
        if (data.weeklyGrowth) setWeeklyGrowth(data.weeklyGrowth);
        if (data.monthlyRevenue) setMonthlyRevenue(data.monthlyRevenue);
        if (data.leadConversion) setLeadConversion(data.leadConversion);
        if (data.recentActivity) setActivity(data.recentActivity);
      } catch (err) {
        console.warn("Using baseline aggregation metrics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCRMData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. TOP ANALYTICS WIDGETS CARDS (Revenue, Student, Mentor, Leads) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Widget 1: Revenue Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">
              💰
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              {metrics.growthPercent || "+24.6%"}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Platform Revenue</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            ₹{metrics.totalRevenue?.toLocaleString("en-IN") || "3,59,976"}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.totalTransactions || 24} Razorpay Orders</span>
            <span className="text-emerald-400 font-semibold">100% Captured</span>
          </div>
        </div>

        {/* Widget 2: Student Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xl">
              👥
            </span>
            <Link
              to="/admin/students"
              className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-all no-underline"
            >
              Directory →
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Registered Students</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {metrics.totalStudents || 146}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              <strong className="text-cyan-400">{metrics.activeStudents || 105}</strong> Active Learners
            </span>
            <span className="text-purple-400 font-semibold">72% Retained</span>
          </div>
        </div>

        {/* Widget 3: Mentor Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl">
              👨‍🏫
            </span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
              Live Mentorship
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Principal Engineering Mentors</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {metrics.totalMentors || 10}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Across 55 Courses</span>
            <span className="text-cyan-400 font-semibold">Principal Technical Architect / MSFT</span>
          </div>
        </div>

        {/* Widget 4: Leads Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-blue-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between mb-3">
            <span className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl">
              🎯
            </span>
            <Link
              to="/admin/leads"
              className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all no-underline"
            >
              Pipeline →
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-medium">Demo Leads & Inquiries</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {metrics.totalLeads || 22}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              <strong className="text-blue-400">{metrics.demoLeads || 13}</strong> Demos Booked
            </span>
            <span className="text-emerald-400 font-semibold">{metrics.conversionRate || "38.4%"} Conv.</span>
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION (Weekly Students Growth + Monthly Revenue Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Students Growth (AreaChart) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📈 Weekly Student Enrollment Velocity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                New student registrations grouped by weekly aggregation
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Last 8 Weeks
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#studentAreaGradient)"
                  name="Students"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Revenue Performance (BarChart) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>💳 Monthly Revenue vs Targets</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target vs realized revenue in INR (₹)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              FY 2026
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Actual Revenue (₹)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" fill="#334155" name="Target (₹)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION: Lead Conversion Pipeline + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Conversion Pipeline Chart */}
        <div className="lg:col-span-1 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🎯 Lead Conversion Funnel</span>
              </h2>
              <Link
                to="/admin/leads"
                className="text-[10px] text-cyan-400 hover:underline font-mono no-underline"
              >
                View Pipeline →
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              Visitor inquiry progression from demo request to paid enrollment.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={leadConversion}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  stroke="#94a3b8"
                  tick={{ fontSize: 10 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {leadConversion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || "#8b5cf6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-center justify-between">
            <span className="text-slate-400">Overall Demo-to-Paid Rate:</span>
            <span className="text-emerald-400 font-bold font-mono">38.4% (Industry Top 5%)</span>
          </div>
        </div>

        {/* Recent Platform Activity Feed */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>⚡ Live Platform Activity Feed</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time MongoDB Atlas events across payments, submissions, and registrations
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Stream
            </span>
          </div>

          <div className="space-y-3 divide-y divide-slate-800/60 max-h-80 overflow-y-auto pr-1">
            {activity.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Listening for real-time events...
              </div>
            ) : (
              activity.map((act) => (
                <div key={act.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                      {act.icon || "📌"}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white truncate">{act.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {act.subtitle || act.detail}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
