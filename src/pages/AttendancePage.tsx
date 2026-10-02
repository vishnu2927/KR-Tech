import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { pwaService, AttendanceSummaryData } from "../services/pwaService";
import AttendanceCalendar from "../components/pwa/AttendanceCalendar";

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pwaService.getAttendance().then((data) => {
      if (data && data.attendance) {
        setAttendanceData(data.attendance);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Attendance & Learning Streaks — KR Global Learning"
        description="Track your live class attendance rate, monthly consistency streak, and verified session logs."
      />

      <DashboardSidebar role="student" activeTab="attendance" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                  Verified Classroom Presence
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                  {attendanceData?.badge || "🔥 14-Day Hot Streak"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Attendance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Consistency Streaks</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Maintain 85%+ live session attendance to qualify for verified QR completion certificates and advanced capstone masterclasses.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/live"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>🔴</span> Upcoming Class
              </Link>
              <Link
                to="/calendar"
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <span>📅</span> Class Calendar
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Overall Attendance Rate</p>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">
              {attendanceData?.overallPercentage || 94.2}%
            </h4>
            <span className="text-[11px] text-emerald-300 font-semibold">Requirement: &gt; 85%</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Active Consistency Streak</p>
            <h4 className="text-2xl font-black text-amber-400 mt-1">
              {attendanceData?.currentStreakDays || 14} Days
            </h4>
            <span className="text-[11px] text-amber-300 font-semibold">Longest: {attendanceData?.longestStreakDays || 22} days</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Attended Sessions</p>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">
              {attendanceData?.attendedClasses || 26} / {attendanceData?.totalClasses || 28}
            </h4>
            <span className="text-[11px] text-slate-400 font-semibold">Total scheduled classes</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <p className="text-xs text-slate-400 font-medium">Certificate Qualification</p>
            <h4 className="text-2xl font-black text-purple-400 mt-1">Unlocked ✓</h4>
            <span className="text-[11px] text-purple-300 font-semibold">{attendanceData?.tier || "Diamond Tier"}</span>
          </div>
        </div>

        {/* Heatmap Calendar */}
        {attendanceData && (
          <AttendanceCalendar
            heatmap={attendanceData.heatmap}
            currentStreakDays={attendanceData.currentStreakDays}
          />
        )}

        {/* Attendance Log Table */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl space-y-4 p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Live Session Attendance Logs</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated timestamped check-in and checkout logs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Mentor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Join Time</th>
                  <th className="py-3 px-4">Leave Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendanceData?.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="py-4 px-4 font-bold text-white max-w-[240px] truncate">
                      {log.sessionTitle}
                    </td>
                    <td className="py-4 px-4 text-slate-300">{log.mentor}</td>
                    <td className="py-4 px-4 text-slate-400 font-mono">{log.date}</td>
                    <td className="py-4 px-4 text-slate-300">{log.joinTime}</td>
                    <td className="py-4 px-4 text-slate-300">{log.leaveTime}</td>
                    <td className="py-4 px-4 font-bold text-cyan-300">{log.durationMinutes} mins</td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          log.status === "present"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : log.status === "late"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
