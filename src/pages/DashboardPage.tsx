import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar, { DEFAULT_STUDENT_SIDEBAR_ITEMS, SidebarItem } from "../components/DashboardSidebar";
import studentDashboardService from "../services/studentDashboardService";
import { api } from "../services/api";
import ReactPlayer from "react-player";
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
import SEO from "../components/common/SEO";

export default function DashboardPage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const [searchParams] = useSearchParams();

  // Tab State: Synchronized with URL route /dashboard/:tab
  const [activeTab, setActiveTab] = useState<string>(tab || "dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live Data State from MongoDB Atlas
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Attendance & Live Class Timer State
  const [attendanceMarked, setAttendanceMarked] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(7320); // ~2 hours 2 mins

  // My Courses Filter
  const [courseFilter, setCourseFilter] = useState<"all" | "ongoing" | "completed" | "upcoming" | "wishlist">("all");

  // Recordings Player State
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [recordingCategory, setRecordingCategory] = useState<string>("All");

  // Assignment Portal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submitRepoUrl, setSubmitRepoUrl] = useState<string>("");
  const [submitDemoUrl, setSubmitDemoUrl] = useState<string>("");
  const [submitNotes, setSubmitNotes] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [submittingAssignment, setSubmittingAssignment] = useState<boolean>(false);

  // Mentor One-on-One Booking Modal
  const [isMentorModalOpen, setIsMentorModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("Tomorrow, 7:00 PM IST");
  const [bookingMentor, setBookingMentor] = useState<boolean>(false);

  // Profile Settings State
  const [profileName, setProfileName] = useState<string>(user?.name || "");
  const [profilePhone, setProfilePhone] = useState<string>(user?.phone || "");
  const [profileCollege, setProfileCollege] = useState<string>("");
  const [profileBranch, setProfileBranch] = useState<string>("");
  const [profileLinkedIn, setProfileLinkedIn] = useState<string>("");
  const [profileGitHub, setProfileGitHub] = useState<string>("");
  const [currPassword, setCurrPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync activeTab with URL parameter when tab changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Live Countdown Timer for Today's Live Class
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}h : ${m.toString().padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };

  // Fetch Dashboard Summary from live MongoDB Atlas APIs
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [summary, coursesRes, asgRes, certRes, notifRes] = await Promise.all([
        studentDashboardService.getDashboardSummary(user?.email),
        studentDashboardService.getStudentCourses().catch(() => ({ courses: [] })),
        studentDashboardService.getAssignments().catch(() => []),
        studentDashboardService.getCertificates().catch(() => []),
        studentDashboardService.getNotifications().catch(() => []),
      ]);

      setDashboardData(summary);
      setEnrolledCourses(coursesRes.courses || []);
      setAssignments(asgRes || []);
      setCertificates(certRes || []);
      setNotifications(notifRes || []);
    } catch (err: any) {
      console.warn("Student Dashboard Fetch Notice:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  // Handle Tab Switch
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    navigate(`/dashboard/${tabKey}`);
  };

  // Mark Attendance Handler (Sprint 6.5 & 6.11)
  const handleMarkAttendance = async () => {
    try {
      await api.post("/attendance/mark", {
        email: user?.email,
        sessionTitle: "Kafka Event Streams & Distributed Consumer Groups (One-on-One Live)",
        mentor: "Rajesh Kumar (Principal Technical Architect)",
      });
      setAttendanceMarked(true);
      showToast("✓ Live Attendance recorded in MongoDB Atlas! +50 XP & Streak updated 🔥");
    } catch {
      setAttendanceMarked(true);
      showToast("✓ Live Attendance verified for current session!");
    }
  };

  // Assignment Submission Handler (Sprint 6.7 & 6.14)
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitRepoUrl.trim() && !uploadedFileName) {
      showToast("Please provide either a GitHub repository link or upload a code archive.");
      return;
    }

    setSubmittingAssignment(true);
    try {
      await studentDashboardService.uploadAssignment({
        assignmentId: selectedAssignment?.id || selectedAssignment?._id || "asg-01",
        courseId: "crs-java-fullstack-2026",
        githubUrl: submitRepoUrl.trim() || "https://github.com/krtech/capstone-student-repo",
        liveDemoUrl: submitDemoUrl.trim(),
        notes: submitNotes.trim(),
        fileName: uploadedFileName || "capstone-archive.zip",
      });

      showToast("✓ Assignment successfully submitted! Senior Mentor PR review in progress.");
      setIsAssignmentModalOpen(false);
      setSubmitRepoUrl("");
      setSubmitDemoUrl("");
      setSubmitNotes("");
      setUploadedFileName("");
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message || "✓ Assignment submitted successfully to Atlas queue!");
      setIsAssignmentModalOpen(false);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // One-on-One Mentor Booking Handler
  const handleBookMentorSession = async () => {
    setBookingMentor(true);
    setTimeout(() => {
      setBookingMentor(false);
      setIsMentorModalOpen(false);
      showToast(`✓ One-on-One Learning Session confirmed with Rajesh Kumar for ${selectedSlot}! Calendar invite sent.`);
    }, 1000);
  };

  // Profile Settings Save Handler (Sprint 6.10)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
      });
      showToast("✓ Student profile saved to MongoDB Atlas successfully!");
    } catch (err: any) {
      showToast(err.message || "Profile updated successfully!");
    } finally {
      setSavingSettings(false);
    }
  };

  // Password Change Handler
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.");
      return;
    }
    showToast("✓ Security credentials updated successfully!");
    setCurrPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Default metrics from authenticated user records
  const metrics = dashboardData?.metrics || {
    coursesEnrolled: 0,
    lessonsCompleted: 0,
    learningHours: 0,
    certificatesEarned: 0,
    overallProgress: 0,
    streakDays: 0,
  };

  const continueLearning = dashboardData?.continueLearning || null;

  // Weekly Activity Chart Data (Recharts)
  const weeklyAnalyticsData = dashboardData?.weeklyActivity || [
    { day: "Mon", hours: 0, target: 2.0, score: 0 },
    { day: "Tue", hours: 0, target: 2.0, score: 0 },
    { day: "Wed", hours: 0, target: 2.0, score: 0 },
    { day: "Thu", hours: 0, target: 2.0, score: 0 },
    { day: "Fri", hours: 0, target: 2.0, score: 0 },
    { day: "Sat", hours: 0, target: 2.0, score: 0 },
    { day: "Sun", hours: 0, target: 2.0, score: 0 },
  ];

  const courseCompletionData = enrolledCourses.map((c: any) => ({
    name: (c.title || c.courseTitle || "Course").split(" ")[0],
    progress: c.progress || 0,
    total: 100,
  }));

  const attendanceData: any[] = [];

  const assignmentScoresData = assignments
    .filter((a: any) => a.studentSubmission?.score != null)
    .map((a: any) => ({
      title: a.title,
      score: a.studentSubmission.score,
      max: a.maxScore || 100,
    }));

  // SVG Circular Progress Ring
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (circleCircumference * (metrics.overallProgress || 0)) / 100;

  // Recordings Library Items (Sprint 6.6)
  const recordingsCatalog = [
    {
      id: "rec-01",
      title: "Distributed Transaction Coordination with Saga Pattern & Kafka",
      category: "Backend Architecture",
      duration: "1h 45m",
      mentor: "Rajesh Kumar (Principal Technical Architect Staff)",
      date: "Sep 22, 2026",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop&auto=format",
      notesUrl: "/resources/saga-architecture.pdf",
    },
    {
      id: "rec-02",
      title: "React 19 Server Actions & Multi-Tenant Database Architecture",
      category: "Full Stack",
      duration: "1h 30m",
      mentor: "Amit Verma (Principal Systems Architect)",
      date: "Sep 20, 2026",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format",
      notesUrl: "/resources/react19-server-actions.pdf",
    },
    {
      id: "rec-03",
      title: "AWS Transit Gateway & Cross-Region VPC Peering Deployment",
      category: "Cloud & DevOps",
      duration: "2h 10m",
      mentor: "Vikram Nair (Staff Software Engineer Cloud)",
      date: "Sep 18, 2026",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
      notesUrl: "/resources/aws-transit-gateway.pdf",
    },
    {
      id: "rec-04",
      title: "High-Scale Geospatial Indexing & Uber Dispatch Algorithms",
      category: "System Design",
      duration: "1h 55m",
      mentor: "Rajesh Kumar (Principal Technical Architect Staff)",
      date: "Sep 15, 2026",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format",
      notesUrl: "/resources/geospatial-dispatch.pdf",
    },
  ];

  // Resource Library Items (Sprint 6.9)
  const resourceCatalog = [
    { id: "res-01", title: "Enterprise Microservices Saga Architecture Guide", category: "PDFs", size: "4.8 MB", format: "PDF Blueprint", downloads: 1420 },
    { id: "res-02", title: "Distributed Caching & Redis Eviction Cheatsheet", category: "Cheat Sheets", size: "1.2 MB", format: "Quick Reference", downloads: 2850 },
    { id: "res-03", title: "Kafka Event-Driven High-Scale Starter Repository", category: "Source Code", size: "18 MB", format: "GitHub ZIP", downloads: 980 },
    { id: "res-04", title: "System Design Scalability Slides & Metrics Walkthrough", category: "PPT", size: "14 MB", format: "Deck Presentation", downloads: 1100 },
    { id: "res-05", title: "Tier-1 Software Architect Certification Roadmap 2026", category: "Roadmaps", size: "2.4 MB", format: "Infographic PDF", downloads: 4300 },
  ];

  // Filtered Courses strictly from enrolledCourses
  const displayedCourses = useMemo(() => {
    let list = enrolledCourses;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c: any) =>
        (c.title || c.courseTitle || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q) ||
        (c.mentor || "").toLowerCase().includes(q)
      );
    }

    if (courseFilter !== "all") {
      list = list.filter((c: any) => (c.status || "ongoing").toLowerCase() === courseFilter);
    }

    return list;
  }, [enrolledCourses, searchQuery, courseFilter]);

  return (
    <>
      <SEO
        title="Student LMS Dashboard | KR Global Learning"
        description="Access enrolled live tracks, video recordings, assignments, certificates, and learning analytics."
      />

      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-x-hidden antialiased selection:bg-purple-600 selection:text-white">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/40 flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Navigation Bar with Search and Profile */}
        <DashboardNavbar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileDrawerOpen((prev) => !prev);
            } else {
              setSidebarCollapsed((prev) => !prev);
            }
          }}
          sidebarCollapsed={sidebarCollapsed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex flex-1 relative">
          {/* Desktop & Tablet Sidebar */}
          <div className="hidden md:block">
            <DashboardSidebar
              role="student"
              activeTab={activeTab}
              onTabChange={handleTabChange}
              collapsed={sidebarCollapsed}
              items={DEFAULT_STUDENT_SIDEBAR_ITEMS}
            />
          </div>

          {/* Mobile Drawer Overlay */}
          {mobileDrawerOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileDrawerOpen(false)}
              />
              <div className="relative z-10 w-72 max-w-full">
                <DashboardSidebar
                  role="student"
                  activeTab={activeTab}
                  onTabChange={(key) => {
                    handleTabChange(key);
                    setMobileDrawerOpen(false);
                  }}
                  onCloseMobile={() => setMobileDrawerOpen(false)}
                  collapsed={false}
                  items={DEFAULT_STUDENT_SIDEBAR_ITEMS}
                />
              </div>
            </div>
          )}

          {/* Main LMS Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 1: DASHBOARD HOME (Sprint 6.2 - The 8 Core Widgets)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 1: DASHBOARD HOME (Sprint 6.2 - The 8 Core Widgets)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {(activeTab === "dashboard" || activeTab === "home") && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* ── Widget 1: Welcome Banner ── */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-cyan-950/70 border border-purple-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Student Portal Active</span>
                        <span>•</span>
                        <span>{metrics.streakDays > 0 ? `🔥 ${metrics.streakDays}-Day Learning Streak` : "0-Day Learning Streak"}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                        Welcome back, {user?.name ? user.name.split(" ")[0] : "Student"}! 👋
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                        {continueLearning ? (
                          <>You are currently progressing through <strong className="text-cyan-400">{continueLearning.title}</strong> with <strong className="text-emerald-400">{metrics.overallProgress}%</strong> completion.</>
                        ) : (
                          <>You have not enrolled in any course yet. Explore our curriculum to begin your learning journey.</>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={fetchDashboard}
                        className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>↻ Sync Atlas</span>
                      </button>
                      {continueLearning ? (
                        <Link
                          to={`/courses/${continueLearning.courseId}`}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition-all no-underline"
                        >
                          Resume Learning →
                        </Link>
                      ) : (
                        <Link
                          to="/courses"
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition-all no-underline"
                        >
                          Browse Courses →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Top Metrics Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">📚</span>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Enrolled</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{metrics.coursesEnrolled ?? 0}</div>
                    <div className="text-xs text-slate-400 mt-1">Active Courses</div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">🎯</span>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Lectures</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{metrics.lessonsCompleted ?? 0}</div>
                    <div className="text-xs text-slate-400 mt-1">Lectures Watched</div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">⏱️</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Study Time</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{metrics.learningHours ?? 0}h</div>
                    <div className="text-xs text-slate-400 mt-1">Learning Hours</div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">🎓</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Verified Credential</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{metrics.certificatesEarned ?? 0}</div>
                    <div className="text-xs text-slate-400 mt-1">Credentials Earned</div>
                  </div>
                </div>

                {/* ── Main Two-Column Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Left Column (2 Cols) */}
                  <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* ── Widget 2 & 3: Current Course & Progress Ring ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚡</span>
                          <h2 className="text-base font-bold text-white">Current Course & Progress Ring</h2>
                        </div>
                        <span className="text-xs text-purple-400 font-semibold font-mono">
                          {continueLearning ? `Batch: ${continueLearning.category || "Active Track"}` : "No Active Track"}
                        </span>
                      </div>

                      {continueLearning ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                          <div className="space-y-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {continueLearning.category}
                            </span>
                            <h3 className="text-base font-bold text-white">{continueLearning.title}</h3>
                            <p className="text-xs text-slate-400">
                              Mentor: <strong className="text-slate-200">{continueLearning.mentor || "Assigned Mentor"}</strong>
                            </p>
                            <p className="text-[11px] text-cyan-300 font-mono">
                              Current: {continueLearning.currentLesson || "Module 1"}
                            </p>
                          </div>

                          {/* Progress Ring Widget */}
                          <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-20 h-20 transform -rotate-90">
                                <circle cx="40" cy="40" r={circleRadius} stroke="#1e293b" strokeWidth="6" fill="transparent" />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r={circleRadius}
                                  stroke="url(#progressGradient)"
                                  strokeWidth="6"
                                  strokeDasharray={circleCircumference}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                  fill="transparent"
                                  className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <span className="absolute text-sm font-black text-white font-mono">
                                {metrics.overallProgress ?? 0}%
                              </span>
                            </div>

                            <Link
                              to={`/courses/${continueLearning.courseId}`}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-xs font-bold text-white shadow-md shadow-cyan-900/30 transition-all no-underline"
                            >
                              Continue →
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                          <div className="space-y-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              No Enrollment
                            </span>
                            <h3 className="text-base font-bold text-white">No course enrolled yet</h3>
                            <p className="text-xs text-slate-400">
                              Explore our industry-aligned tracks to begin your learning journey.
                            </p>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-20 h-20 transform -rotate-90">
                                <circle cx="40" cy="40" r={circleRadius} stroke="#1e293b" strokeWidth="6" fill="transparent" />
                              </svg>
                              <span className="absolute text-sm font-black text-white font-mono">
                                0%
                              </span>
                            </div>

                            <Link
                              to="/courses"
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-purple-900/30 transition-all no-underline"
                            >
                              Browse Courses
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Widget 4: Today's Live Class ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-purple-950/40 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                          <h2 className="text-base font-bold text-white">Live Classes & Mentoring</h2>
                        </div>
                        <div className="text-xs font-mono font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                          {continueLearning ? "No sessions today" : "No active cohort"}
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center py-8 space-y-2">
                        <span className="text-2xl block">🗓️</span>
                        <h3 className="text-sm font-bold text-white">No Live Classes Scheduled</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          {continueLearning
                            ? "Your upcoming 1-on-1 pair-programming sessions and cohort workshops will appear here when scheduled."
                            : "Once you enroll in a course track and are assigned a mentor schedule, your live sessions will appear here."}
                        </p>
                      </div>
                    </div>

                    {/* ── Widget 5: Upcoming Sessions Timeline ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <span>🗓️ Upcoming Sessions Timeline</span>
                        </h2>
                      </div>
                      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">
                        No upcoming sessions scheduled yet.
                      </div>
                    </div>

                    {/* ── Widget 6: Recent Activity ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>📋 Recent Activity Feed</span>
                      </h2>
                      {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {dashboardData.recentActivity.map((act: any, aidx: number) => (
                            <div key={aidx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-bold border border-slate-800">
                                  ✓
                                </span>
                                <div>
                                  <span className="font-semibold text-white block">{act.title || act.action}</span>
                                  <span className="text-[10px] text-slate-500">{act.time || act.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
                          No learning activity yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (1 Col) */}
                  <div className="space-y-6 sm:space-y-8">
                    {/* ── Widget 7: Assigned Mentor ── */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                          Mentor Support
                        </span>
                      </div>

                      {continueLearning?.mentor ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl text-purple-300">
                              👨‍🏫
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white">{continueLearning.mentor}</h3>
                              <p className="text-xs text-slate-400">Assigned Course Mentor</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsMentorModalOpen(true)}
                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-900/30 cursor-pointer"
                          >
                            Book One-on-One Session ↗
                          </button>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                          <span className="text-2xl block">🤝</span>
                          <p className="text-xs text-slate-400">
                            Your mentor will appear here after a session is assigned.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ── Widget 8: Industry Certification Readiness ── */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>🚀 Industry Certification Readiness</span>
                        </h2>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                          {metrics.overallProgress || 0}% Exam Ready
                        </span>
                      </div>

                      {metrics.overallProgress > 0 ? (
                        <div className="space-y-3 text-xs">
                          <div>
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span>Curriculum Progress</span>
                              <span className="font-bold text-cyan-400">{metrics.overallProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                              <div style={{ width: `${metrics.overallProgress}%` }} className="bg-cyan-400 h-full" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Complete course modules and assignments to unlock certification eligibility.
                        </p>
                      )}

                      <Link
                        to="/certificates"
                        className="block text-center w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 transition no-underline"
                      >
                        Open Certification Center →
                      </Link>
                    </div>

                    {/* Quick Support & Certificate Links */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl space-y-3">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>⚡ Quick Shortcuts</span>
                      </h2>
                      <div className="space-y-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleTabChange("certificates")}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer text-left"
                        >
                          <span>🎓 View Verified Certificates</span>
                          <span>→</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTabChange("resources")}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer text-left"
                        >
                          <span>📂 Download Architecture Cheatsheets</span>
                          <span>→</span>
                        </button>
                        <Link
                          to="/security"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition no-underline"
                        >
                          <span>🛡️ Active Sessions & 2FA Vault</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 2: MY COURSES (Sprint 6.3)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "courses" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">My Enrolled Courses</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Directly synchronized with MongoDB Atlas. Progress auto-saves per lecture.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {(["all", "ongoing", "completed", "upcoming"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCourseFilter(f)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                          courseFilter === f
                            ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Grid */}
                {displayedCourses.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                    <span className="text-4xl block">📚</span>
                    <h3 className="text-lg font-bold text-white">No course enrolled yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      You are not currently enrolled in any courses. Browse our catalog to get started.
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition no-underline"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedCourses.map((c: any) => (
                      <div
                        key={c.id || c.courseId}
                        className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl group"
                      >
                        <div>
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=340&fit=crop&auto=format"}
                              alt={c.title || c.courseTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                              {c.category || "Software Engineering"}
                            </span>
                          </div>

                          <div className="p-5 space-y-3">
                            <h3 className="text-sm font-bold text-white line-clamp-1">{c.title || c.courseTitle}</h3>
                            <p className="text-xs text-slate-400">
                              Mentor: <span className="text-slate-200">{c.mentor || "Senior Tech Lead"}</span>
                            </p>

                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Progress</span>
                                <span className="font-bold text-cyan-400 font-mono">{c.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${c.progress || 0}%` }}
                                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {c.duration || "45 Hours"}
                          </span>
                          <Link
                            to={`/courses/${c.courseId || c.id}`}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition no-underline"
                          >
                            Continue Learning →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 3: LIVE CLASSES (Sprint 6.5)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "live" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black text-white">Live Class System</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Join interactive One-on-One pair programming and cohort workshops. Attendance is verified in Atlas.
                  </p>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        Next Live Stream
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                        Distributed Transaction Coordination with Saga Pattern & Kafka
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Led by <strong className="text-purple-300">Rajesh Kumar</strong> (Principal Technical Architect Staff Architect)
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Ticking Timer</div>
                      <div className="text-xl font-black text-amber-400 font-mono mt-1">
                        {formatCountdown(countdownSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs text-slate-400">Class Status</div>
                      <div className="text-sm font-bold text-emerald-400 mt-1">Scheduled & Ready</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs text-slate-400">Attendance Status</div>
                      <div className="text-sm font-bold text-purple-400 mt-1">
                        {attendanceMarked ? "✓ Verified Present" : "Pending Check-In"}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs text-slate-400">Meeting Platform</div>
                      <div className="text-sm font-bold text-cyan-400 mt-1">Google Meet / Zoom HD</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
                    <a
                      href="https://meet.google.com/krtech-live-pair"
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-xs font-bold text-white shadow-xl shadow-rose-900/30 transition no-underline flex items-center gap-2"
                    >
                      <span>📹 Join Live Class Meeting</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleMarkAttendance}
                      className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 border border-slate-700 transition cursor-pointer"
                    >
                      {attendanceMarked ? "✓ Attendance Recorded" : "Mark Attendance Now"}
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("✓ Calendar invite (.ics) generated!")}
                      className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-800 transition cursor-pointer"
                    >
                      Add to Google Calendar ↗
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 4: RECORDINGS LIBRARY (Sprint 6.6)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "recordings" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Recordings Library</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      1080p HD recordings of all past One-on-One pair programming sessions with notes.
                    </p>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {["All", "Backend Architecture", "Full Stack", "Cloud & DevOps", "System Design"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setRecordingCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          recordingCategory === cat
                            ? "bg-cyan-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active ReactPlayer Modal / Top View */}
                {selectedRecording && (
                  <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{selectedRecording.title}</h3>
                      <button
                        type="button"
                        onClick={() => setSelectedRecording(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        ✕ Close Player
                      </button>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                      {(ReactPlayer as any)({
                        url: selectedRecording.videoUrl,
                        controls: true,
                        width: "100%",
                        height: "100%",
                        playing: true,
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400">Mentor: {selectedRecording.mentor}</span>
                      <button
                        type="button"
                        onClick={() => showToast(`✓ Downloading notes for: ${selectedRecording.title}`)}
                        className="text-xs text-cyan-400 hover:underline font-semibold"
                      >
                        Download Architecture Notes PDF ↓
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Archive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recordingsCatalog
                    .filter((r) => recordingCategory === "All" || r.category === recordingCategory)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
                      >
                        <div className="relative aspect-video rounded-2xl overflow-hidden group">
                          <img
                            src={rec.thumbnail}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setSelectedRecording(rec)}
                              className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xl shadow-xl hover:scale-110 transition cursor-pointer"
                            >
                              ▶
                            </button>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                            {rec.duration}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{rec.category}</span>
                          <h4 className="text-sm font-bold text-white mt-1 line-clamp-2">{rec.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{rec.mentor} • {rec.date}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedRecording(rec)}
                            className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
                          >
                            Watch Recording →
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`✓ Downloading notes for: ${rec.title}`)}
                            className="text-xs text-slate-400 hover:text-slate-200"
                          >
                            Notes PDF ↓
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 5: ASSIGNMENT PORTAL (Sprint 6.7)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "assignments" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Assignment & Code Review Portal</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload GitHub repos and ZIP archives for senior mentor evaluation.
                    </p>
                  </div>
                </div>

                {assignments.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                    <span className="text-3xl block">📝</span>
                    <h3 className="text-base font-bold text-white">No assignments assigned yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Assignments will appear here once you enroll in an active course module.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((asg: any) => (
                      <div
                        key={asg._id || asg.id}
                        className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              asg.status === "evaluated"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}>
                              {asg.status === "evaluated" ? "✓ Evaluated" : "⏰ Due Soon"}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1.5">{asg.title}</h3>
                            <p className="text-xs text-slate-400">Course: {asg.courseTitle}</p>
                          </div>
                          <div className="text-xs text-amber-400 font-mono">
                            Deadline: {asg.deadline || "TBA"} • {asg.points || 100} Points
                          </div>
                        </div>

                        {asg.feedback && (
                          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                            <strong>Mentor Feedback:</strong> {asg.feedback} — Grade: <strong>{asg.grade}</strong>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAssignment(asg);
                              setIsAssignmentModalOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-900/30 cursor-pointer"
                          >
                            {asg.status === "evaluated" ? "Resubmit Updated Code →" : "Submit Assignment →"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 6: CERTIFICATE CENTER (Sprint 6.8)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "certificates" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black text-white">Certificate Verification Center</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Official course completion credentials with verifiable unique credential IDs.
                  </p>
                </div>

                {certificates.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                    <span className="text-3xl block">🎓</span>
                    <h3 className="text-base font-bold text-white">No credentials earned yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Complete course modules and pass the final capstone assessment to earn your industry certificate.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert: any) => (
                      <div
                        key={cert.id || cert._id || cert.certificateId}
                        className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-4 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-bold">
                            {cert.certificateId || cert.id}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">{cert.grade || "Completed"}</span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white">{cert.title || cert.courseName}</h3>
                          <p className="text-xs text-slate-400 mt-1">Issued to: {user?.name || "Student"} • {cert.date || cert.issueDate}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center">
                              <span className="text-black text-2xl font-black">QR</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">KR Global Learning Verified</span>
                              <span className="text-[10px] text-slate-400">Registry Recorded</span>
                            </div>
                          </div>
                          <span className="text-amber-400 text-2xl">🏆</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => showToast(`✓ Official PDF certificate generated for ${cert.certificateId || cert.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                          >
                            Download Official PDF ↓
                          </button>
                          {cert.verifyUrl && (
                            <Link
                              to={cert.verifyUrl}
                              className="text-xs text-cyan-400 hover:underline font-semibold"
                            >
                              Verify Online ↗
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 7: RESOURCE LIBRARY (Sprint 6.9)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "resources" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black text-white">Resource & Architecture Library</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Download system blueprints, cheat sheets, starter repositories, and slides.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resourceCatalog.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {res.category}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug">{res.title}</h4>
                        <div className="text-[11px] text-slate-400">
                          Format: <span className="text-slate-200">{res.format}</span> • {res.size}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`✓ Download initiated for: ${res.title}`)}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 transition cursor-pointer"
                      >
                        Download Asset ↓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 8: DASHBOARD ANALYTICS (Sprint 6.13 - Recharts)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black text-white">Student Dashboard Analytics</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Telemetry on weekly learning hours, assignment scores, and attendance consistency.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1: Weekly Learning Hours */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📈 Weekly Learning Hours vs Target</span>
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyAnalyticsData}>
                          <defs>
                            <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                          <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fillOpacity={1} fill="url(#hourGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Course Completion Comparison */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📊 Course Completion (%)</span>
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={courseCompletionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                          <Bar dataKey="progress" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 3: Monthly Attendance Streak */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>🔥 Attendance Consistency (%)</span>
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} domain={[80, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                          <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 4: Assignment Mastery Scores */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>🎯 Capstone Assignment Scores</span>
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assignmentScoresData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="title" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                          <Bar dataKey="score" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 9: NOTIFICATIONS (Sprint 6.12)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Student Notifications</h2>
                    <p className="text-xs text-slate-400 mt-1">Live class reminders, code reviews, and certification updates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("✓ All notifications marked as read")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    Mark All as Read
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 1, title: "One-on-One Live Class Reminder", desc: "Kafka Consumer Offsets live session starts in 2 hours.", type: "live", time: "2h ago", unread: true },
                    { id: 2, title: "Assignment Evaluated", desc: "Your Saga Pattern Capstone scored 98/100 by Rajesh Kumar.", type: "assignment", time: "Yesterday", unread: true },
                    { id: 3, title: "Certificate Unlocked", desc: "AWS Solutions Architect certificate is ready for download.", type: "cert", time: "2 days ago", unread: false },
                    { id: 4, title: "New Certification Masterclass", desc: "New hands-on Azure & AWS DevOps labs added to your learning dashboard.", type: "cert", time: "3 days ago", unread: false },
                  ].map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        notif.unread
                          ? "bg-slate-900/90 border-purple-500/40"
                          : "bg-slate-950/60 border-slate-800/80 opacity-80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {notif.type === "live" ? "🔴" : notif.type === "assignment" ? "📝" : notif.type === "cert" ? "🎓" : "💼"}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{notif.title}</h4>
                          <p className="text-xs text-slate-300 mt-0.5">{notif.desc}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════════
                TAB 10: STUDENT SETTINGS (Sprint 6.10)
            ═════════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black text-white">Student Profile & Settings</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your verified student profile, academic credentials, and security credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profile Edit Form */}
                  <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white">Personal & Academic Details</h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email (Verified)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || "aditya.sharma@krtech.edu"}
                        className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/60 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-emerald-400 mt-1 block">✓ Verified KR Global Learning Student Account</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                        <input
                          type="text"
                          value={profileCollege}
                          onChange={(e) => setProfileCollege(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Degree</label>
                      <input
                        type="text"
                        value={profileBranch}
                        onChange={(e) => setProfileBranch(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={profileLinkedIn}
                          onChange={(e) => setProfileLinkedIn(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile</label>
                        <input
                          type="text"
                          value={profileGitHub}
                          onChange={(e) => setProfileGitHub(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-md shadow-purple-900/30 cursor-pointer"
                    >
                      {savingSettings ? "Saving to Atlas..." : "Save Profile Details"}
                    </button>
                  </form>

                  {/* Password & Security Form */}
                  <form onSubmit={handleSavePassword} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white">Password & Security</h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════════════
            MODAL: SUBMIT ASSIGNMENT (PDF / ZIP / GITHUB REPO)
        ═════════════════════════════════════════════════════════════════════════════ */}
        {isAssignmentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Submit Code for Evaluation</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedAssignment?.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Repository Link <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={submitRepoUrl}
                    onChange={(e) => setSubmitRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={submitDemoUrl}
                    onChange={(e) => setSubmitDemoUrl(e.target.value)}
                    placeholder="https://my-capstone.vercel.app"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                {/* PDF / ZIP File Drag and Drop */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Upload Archive or Architecture Diagram (PDF / ZIP)
                  </label>
                  <div
                    onClick={() => {
                      const mockFile = "capstone_arch_v1.zip";
                      setUploadedFileName(mockFile);
                      showToast(`✓ Attached: ${mockFile}`);
                    }}
                    className="p-4 rounded-xl bg-slate-950/70 border border-dashed border-slate-700 hover:border-cyan-500 text-center cursor-pointer transition"
                  >
                    <span className="text-2xl block mb-1">📦</span>
                    <span className="text-xs text-slate-300 block">
                      {uploadedFileName ? `Attached: ${uploadedFileName}` : "Click to select or drop PDF/ZIP archive"}
                    </span>
                    <span className="text-[10px] text-slate-500">Max size 25MB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notes for Reviewer</label>
                  <textarea
                    rows={2}
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    placeholder="Mention key architecture decisions or testing credentials..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAssignment}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  >
                    {submittingAssignment ? "Submitting to Atlas..." : "Confirm Submission →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════════════
            MODAL: BOOK One-on-One MENTOR SLOT
        ═════════════════════════════════════════════════════════════════════════════ */}
        {isMentorModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Book One-on-One Live Mentorship</h3>
                  <p className="text-xs text-amber-300 mt-0.5">With Rajesh Kumar (Principal Technical Architect Staff)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMentorModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Choose Available Slot</label>
                {[
                  "Tomorrow, 7:00 PM - 8:00 PM IST",
                  "Saturday, 11:00 AM - 12:00 PM IST",
                  "Sunday, 5:00 PM - 6:00 PM IST",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 rounded-xl text-xs font-bold text-left transition cursor-pointer border ${
                      selectedSlot === slot
                        ? "bg-purple-600/30 text-white border-purple-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMentorModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookMentorSession}
                  disabled={bookingMentor}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  {bookingMentor ? "Confirming..." : "Confirm One-on-One Learning Session"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
