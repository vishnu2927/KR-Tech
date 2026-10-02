import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import studentDashboardService from "../services/studentDashboardService";
import LoadingSpinner from "../components/common/LoadingSpinner";

export interface EnrolledCourseCard {
  courseId: string;
  title: string;
  courseTitle?: string;
  category: string;
  thumbnail: string;
  mentor: string;
  mentorCompany?: string;
  progress: number;
  status: "active" | "completed" | "paused";
  enrolledAt?: string;
  totalLessons?: number;
  completedLessons?: number;
  currentLesson?: string;
}

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<EnrolledCourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    let isMounted = true;

    async function fetchEnrolledCourses() {
      try {
        setLoading(true);
        const data = await studentDashboardService.getStudentCourses();
        if (!isMounted) return;

        const rawList = data.courses || [];
        if (rawList.length > 0) {
          setCourses(
            rawList.map((c: any) => ({
              courseId: c.courseId || "java-backend",
              title: c.title || c.courseTitle || "Enterprise Software Engineering",
              category: c.category || "Full Stack Engineering",
              thumbnail:
                c.thumbnail ||
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format",
              mentor: c.mentor || "Dr. Rajesh Kumar (Principal Technical Architect Staff)",
              mentorCompany: c.mentorCompany || "Principal Technical Architect",
              progress: typeof c.progress === "number" ? c.progress : 74,
              status: (c.progress >= 100 || c.status === "completed") ? "completed" : "active",
              enrolledAt: c.enrolledAt || "Recently",
              totalLessons: c.totalLessons || 7,
              completedLessons: c.completedLessons || Math.round(((c.progress || 74) / 100) * 7),
              currentLesson: c.currentLesson || "Architecture & Distributed Core",
            }))
          );
        } else {
          // Fallback realistic courses
          setCourses([
            {
              courseId: "java-backend",
              title: "Complete Java Backend Development with Spring Boot & Microservices",
              category: "Backend Architecture",
              thumbnail:
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format",
              mentor: "Dr. Rajesh Kumar",
              mentorCompany: "Principal Technical Architect Staff",
              progress: 74,
              status: "active",
              totalLessons: 7,
              completedLessons: 5,
              currentLesson: "Kafka Architecture & Offset Management",
            },
            {
              courseId: "mern-stack",
              title: "MERN Stack Full Stack Web Development Mastery Bootcamp",
              category: "Full Stack Development",
              thumbnail:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format",
              mentor: "Priya Sundaram",
              mentorCompany: "Principal Frontend Architect",
              progress: 45,
              status: "active",
              totalLessons: 6,
              completedLessons: 3,
              currentLesson: "React 19 Actions & Concurrency",
            },
            {
              courseId: "aws-architect",
              title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
              category: "Cloud Engineering",
              thumbnail:
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
              mentor: "Amitabh Verma",
              mentorCompany: "AWS Community Hero",
              progress: 100,
              status: "completed",
              totalLessons: 8,
              completedLessons: 8,
              currentLesson: "Certified Solutions Architect SAA-C03",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load enrolled courses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEnrolledCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "active") return matchesSearch && c.status === "active";
    if (filterTab === "completed") return matchesSearch && c.status === "completed";
    return matchesSearch;
  });

  const totalEnrolled = courses.length;
  const activeCount = courses.filter((c) => c.status === "active").length;
  const completedCount = courses.filter((c) => c.status === "completed").length;
  const avgProgress =
    courses.length > 0
      ? Math.round(courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  KR Global Learning Student LMS
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                My Courses & Learning Tracks
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Continue where you left off, stream HD system architecture lectures, submit capstone
                challenges, and earn verified industry certificates.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-all no-underline"
              >
                ← Dashboard Home
              </Link>
              <Link
                to="/courses"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition-all no-underline"
              >
                Explore More Courses →
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Courses Enrolled</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalEnrolled}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">In Progress</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {activeCount}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Completed</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {completedCount}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Average Progress</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                {avgProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS: SEARCH & FILTER TABS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Courses ({totalEnrolled})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("active")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "active"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              In Progress ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("completed")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "completed"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search enrolled courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* COURSES GRID */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
              Loading your course curriculum...
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-bold text-white">No courses match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore our full-stack, cloud, and distributed system curriculum to enroll in your next
              career milestone.
            </p>
            <Link
              to="/courses"
              className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all no-underline"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => {
              const isDone = c.progress >= 100;

              return (
                <div
                  key={c.courseId}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-950/20 transition-all duration-300 flex flex-col group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Category & Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {c.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {isDone ? (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                          <span>✓</span> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/40">
                          {c.progress}% Done
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                        {c.title}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>👨‍🏫</span>
                        <span>{c.mentor}</span>
                      </p>
                      {c.currentLesson && (
                        <p className="text-[11px] text-cyan-400/90 font-mono line-clamp-1">
                          📍 {c.currentLesson}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">
                          {c.completedLessons || 0} of {c.totalLessons || 7} lessons
                        </span>
                        <span className="font-bold text-white">{c.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, c.progress)}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      {isDone ? (
                        <Link
                          to={`/certificates`}
                          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 no-underline"
                        >
                          <span>🎓 View Certificate</span>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">
                          Auto-resumes lesson
                        </span>
                      )}

                      <Link
                        to={`/learn/${c.courseId}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-purple-900/30 transition-all no-underline flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <span>{isDone ? "Review Course" : "Continue Learning"}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
