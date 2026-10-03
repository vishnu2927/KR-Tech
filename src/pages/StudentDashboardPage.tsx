import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import {
  studentDashboardService,
  EnrollmentItem,
  CourseProgress,
  RecordedLecture,
  AssignmentItem,
  CertificateItem,
  UpcomingClassItem,
  DashboardSummary,
} from "../services/studentDashboardService";
import { authService, DemoBooking } from "../services/authService";
import { paymentService, PaymentRecord } from "../services/paymentService";
import StudentProgressTrackerView from "../components/student/StudentProgressTrackerView";
import RecordedLecturePortal from "../components/lectures/RecordedLecturePortal";
import { I } from "../components/Icons";

const DEFAULT_ENROLLMENTS: EnrollmentItem[] = [
  {
    _id: "enr-01",
    courseId: "java-backend",
    courseTitle: "Complete Java Backend Development with Spring Boot 3 & Microservices",
    category: "Java Backend",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    mentor: "Rajesh Kumar",
    mentorCompany: "Principal Technical Architect · Staff Architect",
    batch: "Batch-2026 (Live One-on-One Weekend)",
    status: "active",
    enrolledAt: "2026-08-01T00:00:00.000Z",
  },
  {
    _id: "enr-02",
    courseId: "mern-stack",
    courseTitle: "MERN Stack Full Stack Web Development Mastery Bootcamp",
    category: "MERN Stack",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format",
    mentor: "Amit Verma",
    mentorCompany: "Principal Systems Architect",
    batch: "Batch-2026 (Live One-on-One Evening)",
    status: "active",
    enrolledAt: "2026-08-15T00:00:00.000Z",
  },
  {
    _id: "enr-03",
    courseId: "aws-architect",
    courseTitle: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    category: "AWS Cloud",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
    mentor: "Vikram Nair",
    mentorCompany: "Staff Software Engineer Cloud · Cloud Specialist",
    batch: "Batch-2026 (Fast-Track)",
    status: "completed",
    enrolledAt: "2026-07-10T00:00:00.000Z",
  },
];

const DEFAULT_PROGRESS: CourseProgress[] = [
  {
    courseId: "java-backend",
    completedLectures: ["lec-java-01", "lec-java-02", "lec-java-03"],
    completedAssignments: ["asg-java-01"],
    progressPercent: 75,
    currentLectureId: "lec-java-04",
    totalTimeSpentMinutes: 360,
  },
  {
    courseId: "mern-stack",
    completedLectures: ["lec-mern-01", "lec-mern-02"],
    completedAssignments: [],
    progressPercent: 45,
    currentLectureId: "lec-mern-02",
    totalTimeSpentMinutes: 180,
  },
  {
    courseId: "aws-architect",
    completedLectures: ["lec-aws-01", "lec-aws-02", "lec-aws-03", "lec-aws-04"],
    completedAssignments: ["asg-aws-01"],
    progressPercent: 100,
    currentLectureId: "lec-aws-04",
    totalTimeSpentMinutes: 480,
  },
];

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "CERT-KR-2026-8841",
    certificateId: "KR-AWS-88419",
    courseName: "AWS Certified Solutions Architect Associate (SAA-C03)",
    issueDate: "Sep 01, 2026",
    grade: "Distinction (96%)",
    credentialUrl: "https://krtech.edu/verify/KR-AWS-88419",
    downloadUrl: "https://krtech.edu/certificates/KR-AWS-88419.pdf",
    skills: ["AWS", "VPC", "ECS", "Terraform", "Serverless"],
  },
  {
    id: "CERT-KR-2026-9204",
    certificateId: "KR-JAV-92041",
    courseName: "Enterprise Spring Boot 3 & Distributed Microservices",
    issueDate: "Aug 15, 2026",
    grade: "Distinction (94%)",
    credentialUrl: "https://krtech.edu/verify/KR-JAV-92041",
    downloadUrl: "https://krtech.edu/certificates/KR-JAV-92041.pdf",
    skills: ["Spring Boot 3", "Kafka", "Docker", "PostgreSQL", "Redis"],
  },
];

const DEFAULT_UPCOMING_CLASSES: UpcomingClassItem[] = [
  {
    id: "cls-01",
    title: "One-on-One Live Mentoring: Event-Driven Kafka Consumer Partitioning & Offsets",
    date: "Today",
    time: "7:00 PM - 8:30 PM IST",
    course: "Java Backend Microservices Mastery",
    instructor: "Rajesh Kumar (Principal Technical Architect)",
    meetLink: "https://meet.google.com/krtech-live-mentorship",
  },
  {
    id: "cls-02",
    title: "One-on-One Architecture Review: Next.js 15 Server Actions & Multi-Tenant Database",
    date: "Tomorrow",
    time: "8:00 PM - 9:30 PM IST",
    course: "MERN Stack Full Stack Mastery",
    instructor: "Amit Verma (Principal Systems Architect)",
    meetLink: "https://meet.google.com/krtech-live-mentorship",
  },
  {
    id: "cls-03",
    title: "Weekend Capstone Clinic: Multi-Region High-Availability VPC Peering",
    date: "Saturday",
    time: "10:00 AM - 12:00 PM IST",
    course: "AWS Cloud Solutions Architect",
    instructor: "Vikram Nair (Staff Software Engineer Cloud)",
    meetLink: "https://meet.google.com/krtech-live-mentorship",
  },
];

export default function StudentDashboardPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Live Data States
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>(DEFAULT_ENROLLMENTS);
  const [progressList, setProgressList] = useState<CourseProgress[]>(DEFAULT_PROGRESS);
  const [lectures, setLectures] = useState<RecordedLecture[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>(DEFAULT_CERTIFICATES);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClassItem[]>(DEFAULT_UPCOMING_CLASSES);
  const [myBookings, setMyBookings] = useState<DemoBooking[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentRecord[]>([]);

  // UI / Modal States
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [activeLectureModal, setActiveLectureModal] = useState<RecordedLecture | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentItem | null>(null);
  const [githubUrlInput, setGithubUrlInput] = useState<string>("");
  const [liveDemoUrlInput, setLiveDemoUrlInput] = useState<string>("");
  const [notesInput, setNotesInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || "Aditya Sharma");
  const [profileEmail, setProfileEmail] = useState(user?.email || "aditya.sharma@krtech.edu");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "+91 98765 43210");
  const [profileTimezone, setProfileTimezone] = useState("IST (UTC+5:30)");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      if (user.phone) setProfilePhone(user.phone);
    }
  }, [user]);

  // Load all student dashboard data from MongoDB Atlas
  useEffect(() => {
    const loadData = async () => {
      try {
        const summary: DashboardSummary = await studentDashboardService.getDashboardSummary(user?.email);
        if (summary) {
          if (summary.enrollments?.length) setEnrollments(summary.enrollments);
          if (summary.progress?.length) setProgressList(summary.progress);
          if (summary.recentLectures?.length) setLectures(summary.recentLectures);
          if (summary.assignments?.length) setAssignments(summary.assignments);
          if (summary.certificates?.length) setCertificates(summary.certificates);
          if (summary.upcomingClasses?.length) setUpcomingClasses(summary.upcomingClasses);
        }
      } catch (err) {
        console.warn("Using default student data fallback:", err);
      }

      // Fetch all recorded lectures
      try {
        const allLectures = await studentDashboardService.getLectures();
        if (allLectures && allLectures.length > 0) {
          setLectures(allLectures);
        }
      } catch (err) {
        console.warn("Failed to fetch full lecture list:", err);
      }

      // Fetch assignments
      try {
        const allAssignments = await studentDashboardService.getAssignments();
        if (allAssignments && allAssignments.length > 0) {
          setAssignments(allAssignments);
        }
      } catch (err) {
        console.warn("Failed to fetch assignments:", err);
      }

      // Fetch bookings & payments
      try {
        const bookings = await authService.getMyBookings();
        if (bookings) setMyBookings(bookings);
      } catch {}

      try {
        const payments = await paymentService.getMyPayments();
        if (payments) setMyPayments(payments);
      } catch {}
    };

    loadData();
  }, [user]);

  // Calculate Overall Progress
  const overallProgress = useMemo(() => {
    if (progressList.length === 0) return 75;
    const total = progressList.reduce((acc, p) => acc + (p.progressPercent || 0), 0);
    return Math.round(total / progressList.length);
  }, [progressList]);

  // Filtered Lectures
  const filteredLectures = useMemo(() => {
    if (selectedCourseFilter === "all") return lectures;
    return lectures.filter((l) => l.courseId === selectedCourseFilter);
  }, [lectures, selectedCourseFilter]);

  // Handle Mark Lecture Completed
  const handleToggleLectureComplete = async (lecture: RecordedLecture) => {
    const courseProgress = progressList.find((p) => p.courseId === lecture.courseId);
    const isCompleted = courseProgress?.completedLectures?.includes(lecture._id);
    const newStatus = !isCompleted;

    try {
      const updatedProgress = await studentDashboardService.markLectureCompleted(
        lecture.courseId,
        lecture._id,
        newStatus
      );

      setProgressList((prev) =>
        prev.map((p) => (p.courseId === lecture.courseId ? updatedProgress : p))
      );

      showToast(
        newStatus
          ? `✓ Lecture marked completed! Course progress updated to ${updatedProgress.progressPercent}%.`
          : `✓ Lecture marked as uncompleted.`
      );
    } catch (err: any) {
      showToast(err.message || "Failed to update lecture status");
    }
  };

  // Handle Assignment Submission
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    if (!githubUrlInput.trim()) {
      showToast("Please provide a valid GitHub repository URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await studentDashboardService.submitAssignment(submittingAssignment._id, {
        githubUrl: githubUrlInput.trim(),
        liveDemoUrl: liveDemoUrlInput.trim(),
        notes: notesInput.trim(),
      });

      if (res.success) {
        showToast("🎉 Capstone Assignment submitted successfully to your mentor!");
        setSubmittingAssignment(null);
        setGithubUrlInput("");
        setLiveDemoUrlInput("");
        setNotesInput("");

        // Refresh assignments
        const refreshed = await studentDashboardService.getAssignments();
        if (refreshed?.length) setAssignments(refreshed);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to submit assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Certificate Text
  const handleDownloadCertificate = (cert: CertificateItem) => {
    const certContent = `
================================================================================
            KR GLOBAL LEARNING CERTIFICATE OF ACCOMPLISHMENT
================================================================================
This is to certify that:
Recipient:        ${user?.name || "Aditya Sharma"}
Course Completed: ${cert.courseName}
Grade Achieved:   ${cert.grade}
Issue Date:       ${cert.issueDate}
Credential ID:    ${cert.certificateId}
Verification:    KR Global Learning Registry Verified Training Credential
================================================================================
    `;

    const blob = new Blob([certContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.certificateId}_Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded credential text for: ${cert.courseName}`);
  };

  // Profile Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      showToast("✓ Profile saved to MongoDB Atlas successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save profile changes");
    } finally {
      setSavingProfile(false);
    }
  };

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "progress", label: "Progress & XP", icon: "🔥", count: "Level 8" },
    { key: "courses", label: "My Courses", icon: "📚", count: `${enrollments.length}` },
    { key: "ai_assistant", label: "AI Study Assistant", icon: "🤖", count: "24×7", path: "/ai-assistant" },
    { key: "portfolio_builder", label: "Portfolio Builder", icon: "✨", path: "/portfolio/builder" },
    { key: "lectures", label: "Recorded Lectures", icon: "🎥", count: `${lectures.length}` },
    { key: "notes", label: "Notes Download", icon: "📥", count: `${lectures.length}` },
    { key: "assignments", label: "Assignments", icon: "📝", count: `${assignments.length}` },
    { key: "certificates", label: "Certificates", icon: "🏆", count: `${certificates.length}` },
    { key: "classes", label: "Upcoming Classes", icon: "🗓", count: `${upcomingClasses.length}` },
    { key: "payments", label: "Payments & Invoices", icon: "💳", count: `${myPayments.length}` },
    { key: "profile", label: "Student Profile", icon: "👤" },
  ];

  return (
    <main className="pt-20 min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <DashboardSidebar
        role="student"
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        items={sidebarItems}
      />

      {/* Main Content Area */}
      <section className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Welcome to KR Global Learning
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300">
                {user?.name || "Aditya Sharma"}
              </span>{" "}
              🚀
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Access your enrolled tracks, recorded One-on-One classes, downloadable lecture notes, and assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown isDark={true} />
            <Link
              to="/courses"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline flex items-center gap-1.5"
            >
              <span>+</span> Explore All Courses
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD OVERVIEW
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Learning Progress */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Overall Progress</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/20">
                    Active Sync
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {overallProgress}% <span className="text-xs font-normal text-slate-400">Average</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>Across {enrollments.length} Enrolled Tracks</span>
                  <span className="text-purple-400 font-semibold">Tier-1 Pace</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${overallProgress}%` }}
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* Metric 2: Enrolled Tracks */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Enrolled Tracks</span>
                  <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full text-[10px] border border-purple-500/20">
                    One-on-One Mentored
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {enrollments.length} <span className="text-xs font-normal text-purple-300">Tracks</span>
                </div>
                <div className="text-[11px] text-slate-400">Live One-on-One Pair Programming with Senior Industry Mentors</div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[80%]" />
                </div>
              </div>

              {/* Metric 3: Recorded Lectures */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Recorded Lectures</span>
                  <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full text-[10px] border border-cyan-500/20">
                    HD Video
                  </span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {lectures.length} <span className="text-xs font-normal text-cyan-300">Archive Lessons</span>
                </div>
                <div className="text-[11px] text-slate-400">Includes Architecture Notes & Cheatsheets</div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-3">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full w-[65%]" />
                </div>
              </div>

              {/* Metric 4: Next Live Class */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border border-purple-500/30 hover:border-purple-500 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Next Live One-on-One Class
                  </span>
                  <span className="text-purple-300 font-bold text-[10px]">Today 7 PM</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1 mb-1">
                  {upcomingClasses[0]?.title || "Event-Driven Kafka Architecture"}
                </div>
                <div className="text-[11px] text-slate-300 mb-3">
                  Mentor: <strong className="text-purple-300">{upcomingClasses[0]?.instructor || "Rajesh Kumar (Principal Technical Architect)"}</strong>
                </div>
                <a
                  href={upcomingClasses[0]?.meetLink || "https://meet.google.com/krtech-live-mentorship"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md text-center block no-underline"
                >
                  Join Live Room 🔴
                </a>
              </div>
            </div>

            {/* Gamified Progress & Streak Quick Widget */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20 flex-shrink-0">
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white">Gamified Level 8 · Senior Systems Builder</span>
                    <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                      5-Day Streak Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Earn XP, track live attendance (94.1%), unlock engineering badges, and climb cohort rankings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("progress")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <span>View Full Progress Tracker</span>
                <span>→</span>
              </button>
            </div>

            {/* Enrolled Tracks Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-extrabold text-xl text-white">My Enrolled Certification Tracks</h3>
                  <p className="text-xs text-slate-400">Live progress tracking synced with MongoDB Atlas</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("courses")}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  View All Tracks ({enrollments.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((course) => {
                  const prog = progressList.find((p) => p.courseId === course.courseId);
                  const percent = prog ? prog.progressPercent : 50;

                  return (
                    <div
                      key={course._id}
                      className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden shadow-xl flex flex-col justify-between group"
                    >
                      <div>
                        {/* Thumbnail with overlay */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.courseTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                          <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                            {course.category}
                          </span>
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold rounded-full border border-slate-700">
                            {course.status === "completed" ? "✓ Completed" : "⚡ Active Track"}
                          </span>
                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="text-[10px] font-bold text-purple-300 block mb-0.5">BATCH</span>
                            <h4 className="text-xs font-bold text-white truncate">{course.batch}</h4>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          <h3 className="font-sans font-bold text-sm text-white line-clamp-2 leading-snug">
                            {course.courseTitle}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Mentor: <strong className="text-slate-200">{course.mentor}</strong></span>
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-purple-300 font-semibold">
                              {course.mentorCompany || "Senior Architect"}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Course Progress</span>
                              <span className="font-bold text-emerald-400">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                              <div
                                style={{ width: `${percent}%` }}
                                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="p-5 pt-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseFilter(course.courseId);
                            setActiveTab("lectures");
                          }}
                          className="flex-1 py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold rounded-2xl text-xs transition-all border border-purple-500/30 hover:border-purple-600 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>🎥</span> Watch Lectures
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseFilter(course.courseId);
                            setActiveTab("notes");
                          }}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold transition cursor-pointer"
                          title="Download Notes"
                        >
                          📥 Notes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 2: MY COURSES & PROGRESS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">My Enrolled Courses & Progress</h2>
                <p className="text-xs text-slate-400 mt-1">
                  One-on-One mentorship cohort tracks registered in MongoDB Atlas with module checklists
                </p>
              </div>
              <div className="text-xs text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-xl font-mono">
                Collection: `enrollments` & `progress`
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((course) => {
                const prog = progressList.find((p) => p.courseId === course.courseId);
                const percent = prog ? prog.progressPercent : 50;
                const completedCount = prog?.completedLectures?.length || 0;

                return (
                  <div
                    key={course._id}
                    className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <img
                        src={course.thumbnail}
                        alt={course.courseTitle}
                        className="w-full h-40 object-cover rounded-2xl border border-slate-800"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          {course.category} · {course.batch}
                        </span>
                        <h3 className="font-bold text-sm text-white line-clamp-2 mt-1">{course.courseTitle}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Mentor: <strong className="text-slate-200">{course.mentor}</strong> ({course.mentorCompany})
                        </p>
                      </div>

                      {/* Live Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{completedCount} Lectures Finished</span>
                          <span className="font-bold text-emerald-400">{percent}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            style={{ width: `${percent}%` }}
                            className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseFilter(course.courseId);
                          setActiveTab("lectures");
                        }}
                        className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer text-center"
                      >
                        Go to Lectures →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseFilter(course.courseId);
                          setActiveTab("assignments");
                        }}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Assignments
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 3: RECORDED LECTURES PORTAL (KR GLOBAL LEARNING)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "lectures" && (
          <RecordedLecturePortal
            userEmail={user?.email}
            userName={user?.name}
            onToast={showToast}
          />
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 4: NOTES & RESOURCES DOWNLOAD
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">Lecture Notes & Architecture Handbooks</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Download official lecture slides, Redis caching cheat sheets, and production capstone blueprints
                </p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold">
                ✓ Free Unlimited Access for Enrolled Students
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lectures.map((lec) => (
                <div
                  key={lec._id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                        PDF Notes
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Module #{lec.moduleNumber}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white line-clamp-2">{lec.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{lec.description}</p>
                    <div className="text-[11px] text-purple-300 font-mono pt-1">
                      File: {lec.notesFileName || "Architecture_Notes.pdf"}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{lec.instructor}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const content = `KR GLOBAL LEARNING OFFICIAL LECTURE NOTES\n\nCourse: ${lec.courseId}\nLecture: ${lec.title}\nInstructor: ${lec.instructor}\nDate: ${lec.recordedDate}\n\nTopics Covered:\n- ${lec.description}\n- Architecture best practices & enterprise code standards\n- Recommended Next Steps: Complete Capstone Assignment\n\nKR Global Learning Management System © 2026`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = lec.notesFileName || "Lecture_Notes.txt";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast(`✓ Downloaded ${lec.notesFileName}`);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📥</span> Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 5: ASSIGNMENTS HUB (From MongoDB Atlas assignments Collection)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">Capstone Assignments & Code Reviews</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Submit your GitHub repositories for One-on-One senior architect code review and grading
                </p>
              </div>
              <span className="text-xs text-purple-300 bg-purple-950 border border-purple-800 px-3 py-1.5 rounded-xl font-mono">
                Collection: `assignments`
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignments.map((asg) => {
                const sub = asg.studentSubmission || asg.submissions?.[0];
                const isSubmitted = !!sub;

                return (
                  <div
                    key={asg._id}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                          {asg.moduleTitle}
                        </span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          Max Score: {asg.maxScore} pts
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white">{asg.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{asg.description}</p>

                      {/* Requirements Checklist */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                          Key Architecture Requirements
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {asg.requirements?.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">✓</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Submission Status */}
                      {isSubmitted ? (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <span>✓</span> Submitted for Review
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Grade: {sub.grade || "Under Evaluation"} ({sub.score ? `${sub.score}/100` : "Pending"})
                            </span>
                          </div>
                          {sub.feedback && (
                            <p className="text-xs text-slate-300 italic">
                              "{sub.feedback}"
                            </p>
                          )}
                          <div className="text-[11px] text-cyan-300 truncate">
                            Repo: {sub.githubUrl}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Deadline: <strong className="text-slate-200">{asg.deadline}</strong></span>
                          <span className="text-amber-400 font-semibold">Pending Submission</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      {asg.starterRepoUrl && (
                        <a
                          href={asg.starterRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition text-center no-underline flex items-center gap-1.5"
                        >
                          <I.Github /> Starter Code
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSubmittingAssignment(asg)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer text-center"
                      >
                        {isSubmitted ? "Resubmit / Update Project" : "Submit Capstone Project 🚀"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 6: CERTIFICATES (Verifiable Credentials)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">Earned Professional Certificates</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verifiable completion credentials certified by KR Global Learning
                </p>
              </div>
              <Link
                to="/certificates"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 no-underline"
              >
                Public Verification Portal →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id || cert.certificateId}
                  className="rounded-3xl bg-slate-900/80 border border-purple-500/30 overflow-hidden shadow-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {cert.grade}
                      </span>
                      <h3 className="font-bold text-base text-white mt-1">{cert.courseName}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">
                      {cert.certificateId}
                    </span>
                  </div>

                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-4xl mb-1">🏆</span>
                    <h4 className="text-sm font-bold text-white">KR Global Learning Certified Full Stack Professional</h4>
                    <p className="text-xs text-slate-300 mt-1">Conferred upon {user?.name || "Aditya Sharma"}</p>
                    <span className="text-[10px] text-purple-300 mt-1">Issued: {cert.issueDate}</span>
                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                      {cert.skills?.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span> Cryptographically Verified on Ledger
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownloadCertificate(cert)}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <span>📥</span> Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 7: UPCOMING LIVE One-on-One CLASSES
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "classes" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">Upcoming One-on-One Live Classes & Clinics</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Private pairing sessions with your assigned senior staff mentor
                </p>
              </div>
              <Link
                to="/free-demo"
                className="px-4 py-2 bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold border border-purple-500/30 transition no-underline"
              >
                + Schedule Extra One-on-One Clinic
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        Live Mentorship Session
                      </span>
                      <span className="text-xs font-bold text-purple-300">{cls.date}</span>
                    </div>

                    <h3 className="font-bold text-base text-white">{cls.title}</h3>
                    <p className="text-xs text-slate-400">Course: <strong className="text-slate-300">{cls.course}</strong></p>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timing</span>
                        <span className="font-bold text-white">{cls.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mentor</span>
                        <span className="font-bold text-purple-300">{cls.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={cls.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg text-center block no-underline"
                  >
                    Join Live Class Room 🔴
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 8: PAYMENTS & INVOICES (Integrated from Step 5.1)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white flex items-center gap-2">
                  <span>💳</span> Payment History & Tax Invoices
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Official Razorpay payment receipts and active course enrollments registered to your account
                </p>
              </div>
              <Link
                to="/courses"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md transition no-underline"
              >
                Browse More Courses →
              </Link>
            </div>

            {myPayments.length > 0 ? (
              <div className="space-y-4">
                {myPayments.map((pay) => (
                  <div
                    key={pay._id || pay.paymentId}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          ✓ Paid & Enrolled
                        </span>
                        <span className="font-mono text-xs text-cyan-300">
                          {pay.paymentId}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{pay.courseTitle}</h4>
                      <p className="text-xs text-slate-400">
                        Order Ref: <span className="font-mono text-slate-300">{pay.orderId}</span> · Date:{" "}
                        {new Date(pay.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Amount Paid</span>
                        <span className="text-2xl font-black text-white">
                          ₹{(pay.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📄</span> Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mx-auto">
                  💳
                </div>
                <h3 className="text-lg font-bold text-white">No Payment History Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you purchase or enroll in a One-on-One mentorship course using Razorpay, your payment receipt and tax invoice will appear here automatically.
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition no-underline"
                >
                  Explore Course Catalog
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 9: STUDENT PROFILE & SETTINGS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-white">Student Profile & Credentials</h2>
              <p className="text-xs text-slate-400 mt-1">Live identity and account settings registered in MongoDB Atlas</p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces&auto=format"}
                  alt={user?.name || "Student"}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/50 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans font-bold text-lg text-white">{user?.name || "Aditya Sharma"}</h3>
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email || "aditya.sharma@krtech.edu"}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Atlas ID: #{user?.id || "6aa3..."}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-lg font-bold text-purple-300">{enrollments.length}</div>
                  <div className="text-[10px] text-slate-400">Courses</div>
                </div>
                <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-lg font-bold text-emerald-400">{certificates.length}</div>
                  <div className="text-[10px] text-slate-400">Certificates</div>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveSettings} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Account Details</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  MongoDB Atlas Synchronized
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                    <span className="text-[10px] text-purple-400 font-bold">Read-Only</span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Timezone</label>
                <select
                  value={profileTimezone}
                  onChange={(e) => setProfileTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="IST (UTC+5:30)">IST (India · UTC+5:30)</option>
                  <option value="EST (UTC-5)">EST (USA East · UTC-5)</option>
                  <option value="PST (UTC-8)">PST (USA West · UTC-8)</option>
                  <option value="GMT (UTC+0)">GMT (UK/Europe · UTC+0)</option>
                  <option value="SGT (UTC+8)">SGT (Singapore · UTC+8)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    authService.logout();
                    window.location.href = "/login";
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition cursor-pointer"
                >
                  Log Out
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {savingProfile ? "Saving to Atlas..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: PROGRESS & XP TRACKER (KR GLOBAL LEARNING)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "progress" && (
          <StudentProgressTrackerView
            userEmail={user?.email}
            userName={user?.name}
            onToast={showToast}
          />
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL 1: INTERACTIVE VIDEO PLAYER MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeLectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  {activeLectureModal.moduleTitle} · Lecture #{activeLectureModal.lectureNumber}
                </span>
                <h3 className="font-bold text-lg text-white">{activeLectureModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLectureModal(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-inner">
              <iframe
                src={activeLectureModal.videoUrl}
                title={activeLectureModal.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLectureModal.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Instructor: <strong className="text-purple-300">{activeLectureModal.instructor}</strong></span>
                <span>Duration: <strong className="text-slate-200">{activeLectureModal.duration}</strong></span>
                <span>Date: <strong className="text-slate-200">{activeLectureModal.recordedDate}</strong></span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleLectureComplete(activeLectureModal)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                ✓ Mark Lecture as Completed
              </button>

              <div className="flex items-center gap-2">
                {activeLectureModal.notesUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`✓ Downloading notes: ${activeLectureModal.notesFileName}`);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    📥 Download Notes
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveLectureModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL 2: ASSIGNMENT SUBMISSION MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Submit Capstone Assignment
                </span>
                <h3 className="font-bold text-base text-white">{submittingAssignment.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingAssignment(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub Repository URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username/my-capstone-project"
                  value={githubUrlInput}
                  onChange={(e) => setGithubUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Live Demo / Deployment URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app or AWS ALB Endpoint"
                  value={liveDemoUrlInput}
                  onChange={(e) => setLiveDemoUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Architecture Notes & Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief explanation of design patterns, microservice discovery, caching strategy..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit to Mentor 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
