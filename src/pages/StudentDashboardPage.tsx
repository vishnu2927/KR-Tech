import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import { courseService, Course } from "../services/courseService";
import { authService, DemoBooking, EnrolledCourse } from "../services/authService";
import { I } from "../components/Icons";

interface EnrolledTrack {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  progress: number;
  currentLesson: string;
  totalModules: number;
  completedModules: number;
  mentor: string;
  mentorCompany: string;
  duration: string;
  nextSession: string;
}

interface CertificateItem {
  id: string;
  title: string;
  issueDate: string;
  grade: string;
  verifyCode: string;
  image: string;
}

interface BatchItem {
  id: string;
  track: string;
  timing: string;
  startDate: string;
  seatsLeft: number;
  mode: "Weekend 1:1" | "Weekday Evening" | "Fast-Track";
}

const DEFAULT_ENROLLED_COURSES: EnrolledTrack[] = [
  {
    id: "java-backend",
    title: "Complete Java Backend Development with Spring Boot & Microservices",
    category: "Java Backend",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    progress: 78,
    currentLesson: "Kafka Event-Driven Architecture & Consumer Groups",
    totalModules: 32,
    completedModules: 25,
    mentor: "Rajesh Kumar",
    mentorCompany: "Ex-Amazon",
    duration: "6 Months",
    nextSession: "Today, 7:00 PM IST",
  },
  {
    id: "mern-stack",
    title: "MERN Stack Full Stack Web Development Mastery Bootcamp",
    category: "MERN Stack",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop&auto=format",
    progress: 45,
    currentLesson: "React 19 Server Actions & Next.js 15 App Router",
    totalModules: 28,
    completedModules: 13,
    mentor: "Amit Verma",
    mentorCompany: "Ex-Meta",
    duration: "5 Months",
    nextSession: "Tomorrow, 8:30 PM IST",
  },
  {
    id: "aws-architect",
    title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
    category: "AWS Cloud",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format",
    progress: 92,
    currentLesson: "Multi-Region VPC Peering & Transit Gateway Transit",
    totalModules: 24,
    completedModules: 22,
    mentor: "Vikram Nair",
    mentorCompany: "Ex-Google Cloud",
    duration: "4 Months",
    nextSession: "Saturday, 10:00 AM IST",
  },
];

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "CERT-KR-2026-8841",
    title: "AWS Certified Solutions Architect Associate (SAA-C03)",
    issueDate: "Sep 01, 2026",
    grade: "Distinction (96%)",
    verifyCode: "KR-AWS-88419",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "CERT-KR-2026-9204",
    title: "Core Java 21 & Distributed Microservices Engineering",
    issueDate: "Aug 15, 2026",
    grade: "Distinction (94%)",
    verifyCode: "KR-JAV-92041",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&auto=format",
  },
];

const UPCOMING_BATCHES: BatchItem[] = [
  {
    id: "batch-1",
    track: "Full Stack Java 21 & High-Scale Microservices",
    timing: "Sat & Sun (10:00 AM - 1:00 PM IST)",
    startDate: "Sep 15, 2026",
    seatsLeft: 3,
    mode: "Weekend 1:1",
  },
  {
    id: "batch-2",
    track: "MERN Stack SaaS Architect (React 19 + Next.js 15)",
    timing: "Mon - Thu (8:00 PM - 9:30 PM IST)",
    startDate: "Sep 18, 2026",
    seatsLeft: 5,
    mode: "Weekday Evening",
  },
  {
    id: "batch-3",
    track: "AWS Cloud & DevOps Professional CI/CD Pipeline",
    timing: "Sat & Sun (6:00 PM - 9:00 PM IST)",
    startDate: "Sep 22, 2026",
    seatsLeft: 2,
    mode: "Weekend 1:1",
  },
  {
    id: "batch-4",
    track: "Cyber Security & Certified Ethical Hacker (CEH v12)",
    timing: "Tue & Thu (7:00 PM - 9:30 PM IST)",
    startDate: "Oct 01, 2026",
    seatsLeft: 6,
    mode: "Fast-Track",
  },
];

export default function StudentDashboardPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledTrack[]>(DEFAULT_ENROLLED_COURSES);
  const [certificates, setCertificates] = useState<CertificateItem[]>(DEFAULT_CERTIFICATES);
  const [batches, setBatches] = useState<BatchItem[]>(UPCOMING_BATCHES);
  const [myBookings, setMyBookings] = useState<DemoBooking[]>([]);
  const [userCourses, setUserCourses] = useState<EnrolledCourse[]>([]);
  const [resumeModal, setResumeModal] = useState<EnrolledTrack | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Profile Form State synced with Atlas User
  const [profileName, setProfileName] = useState(user?.name || "Student");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
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
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  // Load Demo Bookings and Enrolled Courses from MongoDB Atlas
  useEffect(() => {
    authService.getMyBookings().then((b) => {
      if (b) setMyBookings(b);
    });
    authService.getMyCourses().then((c) => {
      if (c) setUserCourses(c);
    });
  }, []);

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "courses", label: "My Courses", icon: "📚", count: `${userCourses.length > 0 ? userCourses.length : enrolledCourses.length}` },
    { key: "bookings", label: "My Demo Bookings", icon: "🎯", count: `${myBookings.length}` },
    { key: "resources", label: "Resources", icon: "📥", count: "16" },
    { key: "certificates", label: "Certificates", icon: "🏆", count: `${certificates.length}` },
    { key: "batches", label: "Upcoming Batches", icon: "📅", count: "4" },
    { key: "settings", label: "Student Profile", icon: "👤" },
  ];

  // Fetch MongoDB courses on load to sync any updates
  useEffect(() => {
    courseService.getAllCourses().then((dbCourses) => {
      if (dbCourses && dbCourses.length > 0) {
        // Enriched tracks with live database metadata
        const enriched = DEFAULT_ENROLLED_COURSES.map((track) => {
          const matched = dbCourses.find((c) => c.id === track.id || c.title.toLowerCase().includes(track.category.toLowerCase()));
          return matched
            ? { ...track, title: matched.title, duration: matched.duration || track.duration }
            : track;
        });
        setEnrolledCourses(enriched);
      }
    });
  }, []);

  // Download PDF Handler
  const handleDownloadCertificate = (cert: CertificateItem) => {
    const certContent = `
================================================================================
                    KR TECH CERTIFICATE OF ACCOMPLISHMENT
================================================================================
This is to certify that:
Recipient:        ${user?.name || "Student"}
Course Completed: ${cert.title}
Grade Achieved:   ${cert.grade}
Issue Date:       ${cert.issueDate}
Credential ID:    ${cert.verifyCode}
Verification URL: https://krtech.com/verify/${cert.verifyCode}
Accreditation:    ISO 9001:2015 & Industry Cloud Consortium Verified
================================================================================
    `;

    const blob = new Blob([certContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.verifyCode}_Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded certificate for: ${cert.title}`);
  };

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

  // Calculate Overall Progress
  const overallProgress = Math.round(
    enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length
  );

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
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                1:1 Student Portal
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
              Track your syllabus milestones, join 1:1 live mentor sessions, and download certified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown isDark={true} />
            <Link
              to="/courses"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline flex items-center gap-1.5"
            >
              <span>+</span> Explore New Tracks
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD (4 Key Widgets + Enrolled Cards)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* 4 Dashboard Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Widget 1: Learning Progress */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Learning Progress</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/20">On Track</span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {overallProgress}% <span className="text-xs font-normal text-slate-400">Average</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>60 of 84 Modules</span>
                  <span className="text-purple-400 font-semibold">Tier-1 Progress</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${overallProgress}%` }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Widget 2: Courses Enrolled */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Courses Enrolled</span>
                  <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full text-[10px] border border-purple-500/20">Active</span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {enrolledCourses.length} <span className="text-xs font-normal text-purple-300">Certification Tracks</span>
                </div>
                <div className="text-[11px] text-slate-400">1:1 Live Interactive Mentorship</div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[75%]" />
                </div>
              </div>

              {/* Widget 3: Completed Certificates */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Completed Certificates</span>
                  <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20">Verified</span>
                </div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-1">
                  {certificates.length} <span className="text-xs font-normal text-amber-300">Credentials</span>
                </div>
                <div className="text-[11px] text-slate-400">Shareable on LinkedIn & Resumes</div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-3">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full w-[100%]" />
                </div>
              </div>

              {/* Widget 4: Upcoming Live Session */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border border-purple-500/30 hover:border-purple-500 transition-all group shadow-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Next Live Class
                  </span>
                  <span className="text-purple-300 font-bold text-[10px]">Today 7 PM</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-1 mb-1">
                  Kafka Event Producer Pipeline
                </div>
                <div className="text-[11px] text-slate-300 mb-3">
                  Mentor: <strong className="text-purple-300">Rajesh Kumar (Ex-Amazon)</strong>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Launching 1:1 Live Classroom Room...")}
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  Join Live Room 🔴
                </button>
              </div>
            </div>

            {/* Enrolled Course Cards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-extrabold text-xl text-white">My Enrolled Certification Tracks</h3>
                  <p className="text-xs text-slate-400">Continue where you left off in your 1:1 mentorship syllabus</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("courses")}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  View All Tracks ({enrolledCourses.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail with overlay */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                          {course.category}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold rounded-full border border-slate-700">
                          ⏱ {course.duration}
                        </span>
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-bold text-purple-300 block mb-0.5">CURRENT LESSON</span>
                          <h4 className="text-xs font-bold text-white truncate">{course.currentLesson}</h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-sans font-bold text-sm text-white line-clamp-2 leading-snug">
                          {course.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Mentor: <strong className="text-slate-200">{course.mentor}</strong></span>
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-purple-300 font-semibold">{course.mentorCompany}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{course.completedModules}/{course.totalModules} Modules</span>
                            <span className="font-bold text-emerald-400">{course.progress}% Complete</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              style={{ width: `${course.progress}%` }}
                              className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => setResumeModal(course)}
                        className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold rounded-2xl text-xs transition-all border border-purple-500/30 hover:border-purple-600 shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>▶</span> Resume Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 2: MY COURSES
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-white">My Enrolled Courses</h2>
              <p className="text-xs text-slate-400 mt-1">Access all 1:1 modules, project capstones, and session archives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-2xl border border-slate-800"
                  />
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{course.category} · {course.duration}</span>
                    <h3 className="font-bold text-sm text-white line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-400">Mentor: <strong className="text-slate-200">{course.mentor}</strong> ({course.mentorCompany})</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-bold text-emerald-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setResumeModal(course)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    Resume Learning →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: MY DEMO BOOKINGS (Live from MongoDB Atlas Leads collection)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-sans font-extrabold text-2xl text-white">My Free Demo Bookings</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    MongoDB Atlas Cloud
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  1:1 Live pair-programming sessions reserved under your email ({user?.email})
                </p>
              </div>
              <Link
                to="/free-demo"
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline inline-flex items-center gap-2 w-fit"
              >
                <span>+</span> Book Another 1:1 Demo
              </Link>
            </div>

            {myBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Official Booking ID
                        </span>
                        <span className="font-mono text-base font-extrabold text-purple-300">
                          #{b.bookingId}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                          b.status === "Scheduled"
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                            : b.status === "Contacted"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : b.status === "Completed"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        ● {b.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-sans font-bold text-base text-white">{b.course}</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Time Slot</span>
                          <span className="font-semibold">{b.timeSlot || "Evening Slot"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Time Zone</span>
                          <span className="font-semibold">{b.timeZone || "IST (UTC+5:30)"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Candidate</span>
                          <span className="font-semibold">{b.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Booked On</span>
                          <span className="font-semibold">
                            {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`https://wa.me/919876543210?text=${encodeURIComponent(
                          `Hi KR Tech, following up on my 1:1 Live Demo for "${b.course}" (Booking ID: #${b.bookingId}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold text-center transition-all no-underline flex items-center justify-center gap-2 shadow-sm shadow-emerald-900/30"
                      >
                        <I.MessageCircle />
                        <span>Chat with Mentor on WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(b.bookingId);
                          showToast(`✓ Copied Booking ID #${b.bookingId}`);
                        }}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        title="Copy Booking ID"
                      >
                        <I.FileText />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center text-2xl">
                  🎯
                </div>
                <h3 className="font-sans font-bold text-lg text-white">No Demo Bookings Yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Experience our 1:1 live pair-programming mentorship for free. Evaluate our curriculum, debug real production code, and meet your senior mentor.
                </p>
                <Link
                  to="/free-demo"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all no-underline"
                >
                  <I.Sparkles /> Book Your Free 1:1 Demo
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 3: RESOURCES
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-white">Student Learning Resources</h2>
              <p className="text-xs text-slate-400 mt-1">Download official architecture handbooks, cheat sheets, and source code repositories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Kafka Event-Driven Architecture Handbook 2026", type: "PDF Guide", size: "4.8 MB", date: "Sep 05, 2026" },
                { title: "Spring Boot 3.x Production Deployment Checklist", type: "Cheatsheet", size: "2.1 MB", date: "Sep 02, 2026" },
                { title: "Distributed Microservices Architecture Diagrams", type: "ZIP Archive", size: "14.2 MB", date: "Aug 28, 2026" },
                { title: "AWS Solutions Architect Exam Cram Sheet (SAA-C03)", type: "PDF Guide", size: "3.5 MB", date: "Aug 20, 2026" },
                { title: "React 19 Server Components Code Recipes", type: "Markdown / Code", size: "1.2 MB", date: "Aug 15, 2026" },
                { title: "System Design Interview Capstone Questions", type: "PDF Guide", size: "5.4 MB", date: "Aug 10, 2026" },
              ].map((res, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                      {res.type}
                    </span>
                    <span className="text-[11px] text-slate-500">{res.size}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white line-clamp-2">{res.title}</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400 text-[11px]">{res.date}</span>
                    <button
                      type="button"
                      onClick={() => showToast(`✓ Downloading: ${res.title}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 4: CERTIFICATES (With Download PDF Button)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-white">Earned Professional Certificates</h2>
              <p className="text-xs text-slate-400 mt-1">Verified industry credentials with cryptographic verification codes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-3xl bg-slate-900/80 border border-purple-500/30 overflow-hidden shadow-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {cert.grade}
                      </span>
                      <h3 className="font-bold text-base text-white mt-1">{cert.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">
                      {cert.verifyCode}
                    </span>
                  </div>

                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center text-center p-4">
                      <span className="text-3xl mb-1">🏆</span>
                      <h4 className="text-sm font-bold text-white">KR Tech Certified Professional</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Awarded to {user?.name || "Aditya Sharma"}</p>
                      <span className="text-[10px] text-purple-300 mt-1">Issued on {cert.issueDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span> Verified on Blockchain Registry
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownloadCertificate(cert)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
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
            TAB 5: UPCOMING BATCHES
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "batches" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-sans font-extrabold text-2xl text-white">Upcoming 1:1 Live Batches</h2>
              <p className="text-xs text-slate-400 mt-1">Explore upcoming weekend cohorts and live fast-track tracks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                      {b.mode}
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      🔥 {b.seatsLeft} Seats Left
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">{b.track}</h3>
                    <p className="text-xs text-slate-400 mt-1">🗓 Starts: <strong className="text-slate-200">{b.startDate}</strong></p>
                    <p className="text-xs text-slate-400">⏰ Timing: <strong className="text-slate-200">{b.timing}</strong></p>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast(`Requested seat reservation for: ${b.track}`)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Reserve Seat in Cohort →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 6: STUDENT PROFILE & SETTINGS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
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
                    <h3 className="font-sans font-bold text-lg text-white">{user?.name || "Student"}</h3>
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Atlas ID: #{user?.id || "6aa3..."}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-lg font-bold text-purple-300">{userCourses.length || enrolledCourses.length}</div>
                  <div className="text-[10px] text-slate-400">Courses</div>
                </div>
                <div className="text-center px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-lg font-bold text-emerald-400">{myBookings.length}</div>
                  <div className="text-[10px] text-slate-400">Demos</div>
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
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all cursor-pointer"
                >
                  Log Out
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {savingProfile ? "Saving to Atlas..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL: RESUME LEARNING / LESSON VIEWER
      ───────────────────────────────────────────────────────────────────────────── */}
      {resumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{resumeModal.category}</span>
                <h3 className="font-bold text-lg text-white">{resumeModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setResumeModal(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
                <img src={resumeModal.thumbnail} alt={resumeModal.title} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center text-2xl shadow-xl shadow-purple-600/40 cursor-pointer hover:scale-110 transition-transform">
                    ▶
                  </div>
                  <h4 className="text-xs font-bold text-white mt-3">{resumeModal.currentLesson}</h4>
                  <p className="text-[11px] text-slate-300">Live 1:1 Architecture Recording · Mentor: {resumeModal.mentor}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Syllabus Completion</span>
                  <span className="font-bold text-emerald-400">{resumeModal.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${resumeModal.progress}%` }}
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setResumeModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Player
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Launching interactive live coding sandbox...");
                  setResumeModal(null);
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Open Code Sandbox 💻
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
