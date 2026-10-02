import React, { useState, useEffect } from "react";
import { I } from "../Icons";
import LoadingSpinner from "../common/LoadingSpinner";
import AnalyticsLineChart from "./AnalyticsLineChart";
import AnalyticsPieChart from "./AnalyticsPieChart";
import AnalyticsBarChart from "./AnalyticsBarChart";
import {
  analyticsService,
  AnalyticsWidgetsData,
  RevenueTrendItem,
  SignupsTrendItem,
  CategoryDistributionItem,
  PopularCourseBarItem,
  PaymentMethodItem,
} from "../../services/analyticsService";

interface AnalyticsDashboardViewProps {
  isDark?: boolean;
}

export default function AnalyticsDashboardView({
  isDark = true,
}: AnalyticsDashboardViewProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Time Range for Trends
  const [daysRange, setDaysRange] = useState<number>(14);

  // Datasets from MongoDB Atlas
  const [widgets, setWidgets] = useState<AnalyticsWidgetsData | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendItem[]>([]);
  const [signupsTrend, setSignupsTrend] = useState<SignupsTrendItem[]>([]);
  const [categories, setCategories] = useState<CategoryDistributionItem[]>([]);
  const [popularCourses, setPopularCourses] = useState<PopularCourseBarItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);

  // Sub-tab view inside Analytics
  const [viewTab, setViewTab] = useState<"all" | "revenue" | "courses">("all");

  // Fetch all analytics datasets concurrently
  const loadAnalyticsData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [
        widgetData,
        revenueData,
        signupsData,
        categoryData,
        coursesData,
        methodsData,
      ] = await Promise.all([
        analyticsService.getWidgets(),
        analyticsService.getRevenueTrend(daysRange),
        analyticsService.getSignupsTrend(daysRange),
        analyticsService.getCategoryDistribution(),
        analyticsService.getPopularCourses(7),
        analyticsService.getPaymentMethods(),
      ]);

      setWidgets(widgetData);
      setRevenueTrend(revenueData);
      setSignupsTrend(signupsData);
      setCategories(categoryData);
      setPopularCourses(coursesData);
      setPaymentMethods(methodsData);
    } catch (err: any) {
      console.error("Failed to load analytics dashboard data:", err);
      setError(err?.message || "Failed to load telemetry from MongoDB Atlas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [daysRange]);

  // Export Analytics Summary CSV
  const handleExportCSV = () => {
    if (!widgets) return;

    const rows = [
      ["Metric", "Value", "Notes"],
      ["Total Captured Revenue", `₹${widgets.revenue.totalRevenue}`, `Transactions: ${widgets.revenue.totalTransactions}`],
      ["Average Order Value", `₹${widgets.revenue.avgOrderValue}`, "Calculated across captured orders"],
      ["Total CRM Inquiries", widgets.leads.totalLeads, `Today: ${widgets.leads.todayLeads}`],
      ["Scheduled Demos", widgets.leads.scheduledDemos, "One-on-One Live Cohort Consultations"],
      ["Lead-to-Student Conversion", widgets.leads.conversionRate, "Counselor conversion metric"],
      ["Active Enrolled Students", widgets.students.totalStudents, `Completion Rate: ${widgets.students.completionRate}`],
      ["Payment Success Rate", widgets.payments.successRate, `Attempts: ${widgets.payments.totalAttempts}`],
      ["Signups Today", widgets.dailySignups.todaySignups, `7-day Average: ${widgets.dailySignups.sevenDayAvg}`],
      ["Total Registered Students", widgets.dailySignups.totalUsers, "Atlas User Collection"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KR_Tech_Analytics_Summary_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" label="Computing MongoDB Atlas Aggregations & Telemetry..." />
      </div>
    );
  }

  if (error || !widgets) {
    return (
      <div className="p-8 rounded-3xl bg-red-950/30 border border-red-800/50 text-center my-6">
        <p className="text-red-400 font-medium mb-3">{error || "Failed to load analytics."}</p>
        <button
          onClick={() => loadAnalyticsData(true)}
          className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition"
        >
          Retry Pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              MongoDB Atlas Pipeline Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Enterprise Admissions & Financial Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-dimensional aggregations computed across Revenue, CRM Leads, Students, Payments, and Catalog.
          </p>
        </div>

        {/* Action Buttons: Refresh & Export */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadAnalyticsData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-50"
            title="Refresh from Atlas"
          >
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            <span>{refreshing ? "Computing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition"
          >
            <I.Download />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 6 PRIMARY KPI WIDGETS (Revenue, Leads, Students, Payments, Popular Courses, Daily Signups) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* WIDGET 1: REVENUE */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-lg hover:border-emerald-400/60 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400">Total Revenue</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
              {widgets.revenue.growthPercent}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{widgets.revenue.totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>AOV: ₹{widgets.revenue.avgOrderValue.toLocaleString("en-IN")}</span>
            <span className="text-emerald-300 font-medium">{widgets.revenue.totalTransactions} Orders</span>
          </div>
        </div>

        {/* WIDGET 2: LEADS */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-purple-300">CRM Leads</span>
            <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full text-[10px]">
              {widgets.leads.todayLeads} Today
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {widgets.leads.totalLeads}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{widgets.leads.scheduledDemos} Demos Set</span>
            <span className="text-purple-300 font-medium">{widgets.leads.conversionRate} Conv</span>
          </div>
        </div>

        {/* WIDGET 3: STUDENTS */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-cyan-300">Active Students</span>
            <span className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full text-[10px]">
              {widgets.students.completionRate}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {widgets.students.totalStudents.toLocaleString()}+
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{widgets.students.activeEnrollments} In Cohort</span>
            <span className="text-cyan-300 font-medium">{widgets.students.completionRate} Done</span>
          </div>
        </div>

        {/* WIDGET 4: PAYMENTS */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-blue-300">Payment Success</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
              {widgets.payments.successRate}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {widgets.payments.totalCaptured}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{widgets.payments.totalAttempts} Attempts</span>
            <span className="text-blue-300 font-medium">{widgets.payments.totalFailed} Failed</span>
          </div>
        </div>

        {/* WIDGET 5: POPULAR COURSES */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-amber-300">Popular Track</span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">
              #1 Ranked
            </span>
          </div>
          <div className="text-lg font-bold text-white truncate" title={widgets.popularCourses[0]?.courseTitle || "Java Backend"}>
            {widgets.popularCourses[0]?.courseTitle || "Java Backend & Microservices"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{widgets.popularCourses[0]?.studentsCount || 1500} Students</span>
            <span className="text-amber-300 font-medium">★ 4.95</span>
          </div>
        </div>

        {/* WIDGET 6: DAILY SIGNUPS */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-pink-300">Daily Signups</span>
            <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-full text-[10px]">
              {widgets.dailySignups.growthPercent}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {widgets.dailySignups.todaySignups}
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>7d Avg: {widgets.dailySignups.sevenDayAvg}</span>
            <span className="text-pink-300 font-medium">{widgets.dailySignups.totalUsers} Accounts</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUB-VIEW TABS (Overview, Revenue & Growth, Course Volume) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setViewTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            viewTab === "all"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          📈 Executive Overview (All 3 Charts)
        </button>
        <button
          type="button"
          onClick={() => setViewTab("revenue")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            viewTab === "revenue"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          💳 Financial Trends & Channels
        </button>
        <button
          type="button"
          onClick={() => setViewTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            viewTab === "courses"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          📚 Course Enrollments & Share
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. CHARTS SECTION (LINE, PIE, BAR) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* CHART 1: LINE CHART (Revenue & Daily Signups Time Series) */}
        {(viewTab === "all" || viewTab === "revenue") && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📈</span> Chronological Revenue & Signups Trajectory (Line Chart)
                </h3>
                <p className="text-xs text-slate-400">
                  Aggregated time-series from MongoDB Payment & User collections with smooth spline interpolation.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                Live Data Synchronized
              </span>
            </div>

            <AnalyticsLineChart
              revenueData={revenueTrend}
              signupsData={signupsTrend}
              days={daysRange}
              onDaysChange={(d) => setDaysRange(d)}
              isDark={isDark}
            />
          </div>
        )}

        {/* CHARTS ROW: PIE (Category Share / Payment Methods) & BAR (Popular Courses) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CHART 2: PIE / DONUT CHART */}
          {(viewTab === "all" || viewTab === "revenue" || viewTab === "courses") && (
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🍩</span> Distribution Share (Pie / Donut Chart)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proportional breakdown across courses & checkout methods
                  </p>
                </div>
              </div>

              <AnalyticsPieChart
                categories={categories}
                paymentMethods={paymentMethods}
                isDark={isDark}
              />
            </div>
          )}

          {/* CHART 3: BAR CHART (Popular Courses by Enrollments & Revenue) */}
          {(viewTab === "all" || viewTab === "courses") && (
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>📊</span> Popular Courses Performance (Bar Chart)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comparative student intake volume and revenue generation
                  </p>
                </div>
              </div>

              <AnalyticsBarChart
                data={popularCourses}
                isDark={isDark}
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RECENT REAL-TIME PAYMENTS FEED */}
      {/* ========================================================================= */}
      {widgets.revenue.recentPayments && widgets.revenue.recentPayments.length > 0 && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>⚡</span> Latest Razorpay Transaction Feed (Live Captures)
              </h3>
              <p className="text-xs text-slate-400">
                Direct chronological transactions recorded in MongoDB Atlas
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-300">
              {widgets.revenue.totalTransactions} Total Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Enrolled Course</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {widgets.revenue.recentPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{p.userName || "Student"}</div>
                      <div className="text-slate-400 text-[10px]">{p.userEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200 max-w-[200px] truncate">
                      {p.courseTitle}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-400">
                      ₹{p.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-mono text-cyan-300">
                      {p.method}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
