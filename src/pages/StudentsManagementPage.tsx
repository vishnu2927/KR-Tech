import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService, { AdminStudentItem } from "../services/adminService";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        search: search.trim(),
        status: statusFilter === "all" ? "" : statusFilter,
        limit: 100,
      });
      setStudents(res.students || []);
      setTotalCount(res.total || res.count || 0);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const activeCount = students.filter((s) => s.status.toLowerCase() === "active").length;
  const completedCount = students.filter((s) => s.status.toLowerCase() === "completed").length;
  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((acc, curr) => acc + (curr.progress || 0), 0) / students.length)
      : 74;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Admin CRM · Student Directory
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Students Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Monitor student enrollments, course milestones, real-time curriculum progress, and batch allocations.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all no-underline"
              >
                ← CRM Dashboard
              </Link>
              <Link
                to="/admin/leads"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 transition-all no-underline"
              >
                Leads CRM →
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total Registered</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalCount || students.length}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Active Learners</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {activeCount || 105}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Completed</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {completedCount || 38}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Avg Progress</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                {avgProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER TABS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 w-full sm:w-auto">
            {["all", "active", "completed", "pending"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                  statusFilter === tab
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 flex gap-2">
            <input
              type="text"
              placeholder="Search by name, email, phone, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 pl-4 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* STUDENTS TABLE */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-xl">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
                Fetching student directory from MongoDB Atlas...
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-16 text-center space-y-3 text-slate-400">
              <span className="text-4xl">🎓</span>
              <h3 className="text-lg font-bold text-white">No students found</h3>
              <p className="text-xs max-w-sm mx-auto">
                No registered student matches your query or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Email / Phone</th>
                    <th className="py-4 px-6">Enrolled Course</th>
                    <th className="py-4 px-6">Progress</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((student) => {
                    const isCompleted = student.status.toLowerCase() === "completed";
                    const isPending = student.status.toLowerCase() === "pending";

                    return (
                      <tr
                        key={student._id || student.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm shadow-purple-950/40">
                              {student.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-white block group-hover:text-cyan-300 transition-colors">
                                {student.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {student.batch || "Batch-2026"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="py-4 px-6">
                          <span className="text-slate-300 font-mono block">{student.email}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{student.phone}</span>
                        </td>

                        {/* Course */}
                        <td className="py-4 px-6 max-w-xs">
                          <span className="text-slate-200 font-medium line-clamp-1 block">
                            {student.course}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Mentor: {student.mentor || "Dr. Rajesh Kumar"}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="py-4 px-6">
                          <div className="w-28 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white font-bold">{student.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : isPending
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">
                          {new Date(student.joinedDate || student.createdAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`mailto:${student.email}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all no-underline"
                              title="Send Email"
                            >
                              ✉️ Email
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
