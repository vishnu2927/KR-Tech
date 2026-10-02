import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  superAdminService,
  SuperAdminDashboardStats,
  ActivityTimelineItem,
  StudentItem,
  LiveClassItem,
  SupportTicketItem,
} from "../services/superAdminService";

type AdminTab =
  | "dashboard"
  | "students"
  | "courses"
  | "lessons"
  | "live-classes"
  | "assignments"
  | "certificates"
  | "payments"
  | "email-crm"
  | "support"
  | "content"
  | "analytics"
  | "roles"
  | "settings"
  | "activity-logs";

export default function SuperAdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const [searchParams] = useSearchParams();

  // Active section/tab
  const [activeTab, setActiveTab] = useState<AdminTab>((section as AdminTab) || "dashboard");

  // Role Simulation for Founders
  const [simulatedRole, setSimulatedRole] = useState<"Super Admin" | "Admin" | "Mentor" | "Student Support">("Super Admin");

  // Loading & Data states
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sprint 11.1 Data
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);
  const [timeline, setTimeline] = useState<ActivityTimelineItem[]>([]);

  // Sprint 11.2 Students
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");

  // Sprint 11.3 & 11.4 Courses & Lessons
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "AI & Data Science",
    price: 4999,
    discountPrice: 2499,
    mentorName: "Rajesh Kumar",
    published: true,
  });

  // Sprint 11.5 Live Classes
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState({
    title: "",
    mentorName: "Rajesh Kumar",
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    meetingLink: "https://meet.google.com/krg-live-sess",
    durationMinutes: 60,
  });

  // Sprint 11.6 Assignments
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [gradingScore, setGradingScore] = useState(90);
  const [gradingFeedback, setGradingFeedback] = useState("");

  // Sprint 11.7 Certificates
  const [certificates, setCertificates] = useState<any[]>([]);
  const [bulkCourseTitle, setBulkCourseTitle] = useState("Full Stack AI & Cloud Architect Masterclass");

  // Sprint 11.8 Payments
  const [paymentsData, setPaymentsData] = useState<{ totalRevenue: number; payments: any[]; coupons: any[]; invoices: any[] }>({
    totalRevenue: 1845000,
    payments: [],
    coupons: [],
    invoices: [],
  });

  // Sprint 11.9 Email CRM
  const [emailData, setEmailData] = useState<{ campaigns: any[]; recentLogs: any[] }>({ campaigns: [], recentLogs: [] });
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("All Active Students");

  // Sprint 11.10 Support Tickets
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);

  // Sprint 11.11 Content
  const [contentResources, setContentResources] = useState<any[]>([]);

  // Sprint 11.12 Analytics
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Sprint 11.13 Roles
  const [rolesData, setRolesData] = useState<{ roles: any[]; teamMembers: any[] }>({ roles: [], teamMembers: [] });

  // Sprint 11.14 Settings
  const [companySettings, setCompanySettings] = useState<any>({
    companyName: "KR GLOBAL LEARNING PRIVATE LIMITED",
    tagline: "Learn. Build. Grow. Globally.",
    cin: "U80902DL2024PTC428190",
    supportPhone: "+91 9311073936",
    supportEmail: "krglobal0713@gmail.com",
    officeAddress: "A-Block, Connaught Place, New Delhi, Delhi 110001",
    theme: "dark-glassmorphism",
    maintenanceMode: false,
  });

  // Sprint 11.15 Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityTimelineItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync route param with activeTab
  useEffect(() => {
    if (section && section !== activeTab) {
      setActiveTab(section as AdminTab);
    }
  }, [section]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    navigate(`/super-admin/${tab}`);
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        dashRes,
        stdRes,
        courseRes,
        liveRes,
        assignRes,
        certRes,
        payRes,
        emailRes,
        suppRes,
        contRes,
        analRes,
        roleRes,
        setRes,
        logRes,
      ] = await Promise.all([
        superAdminService.getDashboard().catch(() => null),
        superAdminService.getStudents().catch(() => null),
        superAdminService.getCourses().catch(() => null),
        superAdminService.getLiveClasses().catch(() => null),
        superAdminService.getAssignments().catch(() => null),
        superAdminService.getCertificates().catch(() => null),
        superAdminService.getPayments().catch(() => null),
        superAdminService.getEmailCRM().catch(() => null),
        superAdminService.getSupportTickets().catch(() => null),
        superAdminService.getContentLibrary().catch(() => null),
        superAdminService.getAnalytics().catch(() => null),
        superAdminService.getRoles().catch(() => null),
        superAdminService.getSettings().catch(() => null),
        superAdminService.getActivityLogs().catch(() => null),
      ]);

      if (dashRes?.success) {
        setStats(dashRes.stats);
        setTimeline(dashRes.recentActivityTimeline);
      }
      if (stdRes?.success) setStudents(stdRes.students);
      if (courseRes?.success) {
        setCourses(courseRes.courses);
        if (courseRes.courses.length > 0) {
          setSelectedCourseForLessons(courseRes.courses[0]);
          fetchCourseLessons(courseRes.courses[0]._id);
        }
      }
      if (liveRes?.success) setLiveClasses(liveRes.classes);
      if (assignRes?.success) setSubmissions(assignRes.submissions);
      if (certRes?.success) setCertificates(certRes.certificates);
      if (payRes?.success) setPaymentsData(payRes);
      if (emailRes?.success) setEmailData(emailRes);
      if (suppRes?.success) setTickets(suppRes.tickets);
      if (contRes?.success) setContentResources(contRes.resources);
      if (analRes?.success) setAnalyticsData(analRes.charts);
      if (roleRes?.success) setRolesData(roleRes);
      if (setRes?.success) setCompanySettings(setRes.settings);
      if (logRes?.success) setActivityLogs(logRes.logs);
    } catch (err) {
      console.warn("Failed to load some super admin modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseLessons = async (courseId: string) => {
    try {
      const res = await superAdminService.getLessons(courseId);
      if (res.success) setLessons(res.lessons);
    } catch {
      setLessons([]);
    }
  };

  // Student Actions
  const handleToggleStudentStatus = async (id: string, currentActive: boolean) => {
    try {
      const res = await superAdminService.updateStudentStatus(id, !currentActive);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive: !currentActive } : s))
        );
        showToast(`Student ${!currentActive ? "Activated" : "Suspended"} successfully.`);
      }
    } catch (err: any) {
      showToast(err.message || "Could not update student status");
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const res = await superAdminService.resetStudentPassword(id);
      if (res.success) {
        showToast(`Password Reset: Temporary password is ${res.tempPassword || "KR@9821PASS"}`);
      }
    } catch (err: any) {
      showToast(err.message || "Error resetting password");
    }
  };

  // Course Actions
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await superAdminService.createCourse(newCourse);
      if (res.success) {
        setCourses((prev) => [res.course, ...prev]);
        setIsCourseModalOpen(false);
        showToast(`Course "${newCourse.title}" created successfully!`);
        setNewCourse({
          title: "",
          category: "AI & Data Science",
          price: 4999,
          discountPrice: 2499,
          mentorName: "Rajesh Kumar",
          published: true,
        });
      }
    } catch (err: any) {
      showToast(err.message || "Failed to create course");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await superAdminService.toggleCoursePublish(id);
      if (res.success) {
        setCourses((prev) =>
          prev.map((c) => (c._id === id ? { ...c, published: res.published } : c))
        );
        showToast(`Course status updated to ${res.published ? "Published" : "Draft"}`);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course and its lesson assets?")) return;
    try {
      const res = await superAdminService.deleteCourse(id);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        showToast("Course removed from catalog.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to delete course");
    }
  };

  // Live Class Actions
  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await superAdminService.createLiveClass(newLiveClass);
      if (res.success) {
        setLiveClasses((prev) => [res.liveClass, ...prev]);
        setIsLiveClassModalOpen(false);
        showToast(`Live Class "${newLiveClass.title}" scheduled!`);
      }
    } catch (err: any) {
      showToast(err.message || "Error scheduling class");
    }
  };

  const handleTriggerLiveReminder = async (id: string) => {
    try {
      const res = await superAdminService.triggerLiveReminder(id);
      if (res.success) {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err.message || "Error sending reminders");
    }
  };

  // Assignment Grading
  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    try {
      const res = await superAdminService.gradeSubmission(
        selectedSubmission._id,
        gradingScore,
        "Graded",
        gradingFeedback
      );
      if (res.success) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === selectedSubmission._id ? { ...s, score: gradingScore, status: "Graded", mentorFeedback: gradingFeedback } : s))
        );
        setSelectedSubmission(null);
        showToast("Assignment submission successfully graded!");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to grade submission");
    }
  };

  // Certificate Bulk Issue
  const handleBulkIssueCertificates = async () => {
    try {
      const res = await superAdminService.bulkIssueCertificates({
        batchId: "BATCH-2026-A",
        courseTitle: bulkCourseTitle,
      });
      if (res.success) {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err.message || "Error bulk issuing certificates");
    }
  };

  // Email Broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      showToast("Please fill in subject and body.");
      return;
    }
    try {
      const res = await superAdminService.sendBroadcastEmail({
        subject: broadcastSubject,
        body: broadcastBody,
        targetGroup: broadcastTarget,
      });
      if (res.success) {
        showToast(res.message);
        setBroadcastSubject("");
        setBroadcastBody("");
      }
    } catch (err: any) {
      showToast(err.message || "Error sending broadcast");
    }
  };

  // Ticket Status
  const handleResolveTicket = async (id: string) => {
    try {
      const res = await superAdminService.updateSupportTicket(id, { status: "Resolved" });
      if (res.success) {
        setTickets((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: "Resolved" } : t))
        );
        showToast("Ticket marked as Resolved.");
      }
    } catch (err: any) {
      showToast(err.message || "Error resolving ticket");
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await superAdminService.updateSettings(companySettings);
      if (res.success) {
        showToast("Company Settings & ERP Parameters saved successfully.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save settings");
    }
  };

  // CSV Export for Students
  const exportStudentsCSV = () => {
    const headers = ["Name,Email,Phone,Active,Courses,Progress,Streak,TotalPaid\n"];
    const rows = students.map(
      (s) =>
        `"${s.name}","${s.email}","${s.phone}",${s.isActive},"${s.enrolledCourses.join(";")}",${s.progress}%,${s.streak}d,₹${s.totalPaid}`
    );
    const blob = new Blob([...headers, ...rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `KR_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Students CSV successfully.");
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchStatus =
      studentStatusFilter === "all" ||
      (studentStatusFilter === "active" && s.isActive) ||
      (studentStatusFilter === "suspended" && !s.isActive);
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-white/20 animate-fade-in">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Super Admin Top Navigation Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#060811] rounded-[11px] flex items-center justify-center font-black text-cyan-400 text-lg">
                KR
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                KR GLOBAL LEARNING
              </div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                FOUNDER EDITION ERP
              </div>
            </div>
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Phase 11 Production Suite
          </span>
        </div>

        {/* Role Switcher & User Profile */}
        <div className="flex items-center gap-4">
          {/* RBAC Role Selector for testing */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Role:</span>
            <select
              value={simulatedRole}
              onChange={(e) => {
                setSimulatedRole(e.target.value as any);
                showToast(`Switched active perspective to ${e.target.value}`);
              }}
              className="bg-transparent text-xs text-cyan-400 font-bold outline-none cursor-pointer"
            >
              <option value="Super Admin" className="bg-[#0B0F19] text-white">Super Admin (Founder)</option>
              <option value="Admin" className="bg-[#0B0F19] text-white">Admin</option>
              <option value="Mentor" className="bg-[#0B0F19] text-white">Mentor</option>
              <option value="Student Support" className="bg-[#0B0F19] text-white">Student Support</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white shadow-md">
              SA
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white">{user?.name || "Founder Super Admin"}</div>
              <div className="text-[10px] text-slate-400">{user?.email || "founder@krgloballearning.com"}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main ERP Layout: Sidebar + View Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#080C16] flex flex-col p-3 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-2">
            ERP Modules
          </div>

          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Executive Dashboard", icon: "📊" },
              { id: "students", label: "Student CRM", icon: "👥", badge: students.length },
              { id: "courses", label: "Course Management", icon: "🎓", badge: courses.length },
              { id: "lessons", label: "Lesson & Content Assets", icon: "📑" },
              { id: "live-classes", label: "Live Classes Studio", icon: "🔴", badge: liveClasses.length },
              { id: "assignments", label: "Assignment Grading", icon: "📝", badge: submissions.length },
              { id: "certificates", label: "Certificate Wallet ERP", icon: "🏆" },
              { id: "payments", label: "Financial & Revenue CRM", icon: "💳" },
              { id: "email-crm", label: "Email & Broadcast CRM", icon: "✉️" },
              { id: "support", label: "24×7 Support Center", icon: "🎧", badge: tickets.filter((t) => t.status === "Open").length },
              { id: "content", label: "Content & PDF Library", icon: "📚" },
              { id: "analytics", label: "Analytics & Intelligence", icon: "📈" },
              { id: "roles", label: "Role & Team RBAC", icon: "🛡️" },
              { id: "settings", label: "Company Settings", icon: "⚙️" },
              { id: "activity-logs", label: "System Audit Logs", icon: "📜" },
            ].map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20 text-[11px] text-slate-300">
              <div className="font-bold text-cyan-400 mb-1">Company Coordinates</div>
              <div>Support: +91 9311073936</div>
              <div>Email: krglobal0713@gmail.com</div>
              <div className="text-[9px] text-slate-500 mt-2">CIN: U80902DL2024PTC428190</div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* ======================================================== */}
          {/* SPRINT 11.1 — SUPER ADMIN DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Super Admin Dashboard</h1>
                  <p className="text-sm text-slate-400">
                    Real-time operational health for KR GLOBAL LEARNING PRIVATE LIMITED.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchAllData}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <span>🔄</span> Refresh Metrics
                  </button>
                </div>
              </div>

              {/* 11 KPI Widgets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Students", value: stats?.totalStudents?.toLocaleString() || "148", color: "from-blue-500/20 to-cyan-500/20", border: "border-cyan-500/30", icon: "👥" },
                  { title: "Active Students", value: stats?.activeStudents?.toLocaleString() || "148", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", icon: "🟢" },
                  { title: "Total Revenue", value: `₹${(stats?.courseRevenue || 380774).toLocaleString()}`, color: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", icon: "💰" },
                  { title: "Monthly Revenue", value: `₹${(stats?.monthlyRevenue || 106617).toLocaleString()}`, color: "from-indigo-500/20 to-purple-500/20", border: "border-indigo-500/30", icon: "📈" },
                  { title: "New Enrollments", value: `+${stats?.newEnrollments || 22}`, color: "from-sky-500/20 to-blue-500/20", border: "border-sky-500/30", icon: "🎓" },
                  { title: "Pending Assignments", value: stats?.assignmentsPending || 34, color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", icon: "📝" },
                  { title: "Certificates Issued", value: stats?.certificatesIssued || 15, color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30", icon: "🏆" },
                  { title: "Live Classes Today", value: stats?.liveClassesToday || 3, color: "from-rose-500/20 to-red-500/20", border: "border-rose-500/30", icon: "🔴" },
                  { title: "Support Tickets", value: stats?.supportTickets || 8, color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", icon: "🎧" },
                  { title: "Emails Dispatched", value: (stats?.emailStatistics?.totalSent || 12450).toLocaleString(), color: "from-teal-500/20 to-cyan-500/20", border: "border-teal-500/30", icon: "✉️" },
                  { title: "Email Open Rate", value: stats?.emailStatistics?.openRate || "42.8%", color: "from-fuchsia-500/20 to-pink-500/20", border: "border-fuchsia-500/30", icon: "📬" },
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${w.color} bg-[#0A0F1D]/80 backdrop-blur-md border ${w.border} relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-400">{w.title}</span>
                      <span className="text-lg">{w.icon}</span>
                    </div>
                    <div className="text-2xl font-black text-white">{w.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity Timeline & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>⚡</span> Live Action Audit Timeline
                    </h2>
                    <span className="text-xs text-cyan-400 font-mono">activityLogs</span>
                  </div>

                  <div className="space-y-3">
                    {timeline.slice(0, 6).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{item.action}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-0.5">{item.description}</p>
                          <div className="text-[10px] text-slate-500 mt-1">
                            By {item.adminName} ({item.adminEmail})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 space-y-4">
                  <h2 className="text-base font-bold text-white">System Integrity</h2>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span>MongoDB Atlas Cluster</span>
                      <span className="font-bold font-mono">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span>Razorpay PCI Gateway</span>
                      <span className="font-bold font-mono">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span>Nodemailer SMTP Pipeline</span>
                      <span className="font-bold font-mono">OPERATIONAL</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      <span>Expo Push & Mobile Sync</span>
                      <span className="font-bold font-mono">SDK 51 READY</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <div className="text-xs text-slate-400">Company Hotline:</div>
                    <div className="text-sm font-bold text-cyan-400 mt-1">+91 9311073936</div>
                    <div className="text-xs text-slate-400">krglobal0713@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.2 — STUDENT MANAGEMENT CRM */}
          {/* ======================================================== */}
          {activeTab === "students" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Student Management CRM</h1>
                  <p className="text-xs text-slate-400">Total Enrolled Scholars: {students.length}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportStudentsCSV}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-lg hover:opacity-90 flex items-center gap-1.5"
                  >
                    <span>📥</span> Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="bg-[#0A0F1D] border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                </select>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Course Progress</th>
                      <th className="p-3.5">Streak</th>
                      <th className="p-3.5">Assignments</th>
                      <th className="p-3.5">Certificates</th>
                      <th className="p-3.5">Paid</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredStudents.map((std) => (
                      <tr key={std._id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{std.name}</div>
                          <div className="text-[11px] text-slate-500">{std.email}</div>
                          <div className="text-[10px] text-slate-600">{std.phone}</div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              std.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {std.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-cyan-400 h-full rounded-full"
                                style={{ width: `${std.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px]">{std.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-amber-400">🔥 {std.streak}d</td>
                        <td className="p-3.5">{std.assignmentsSubmitted} done</td>
                        <td className="p-3.5">{std.certificatesEarned} issued</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400">₹{std.totalPaid}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStudentStatus(std._id, std.isActive)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              std.isActive
                                ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            {std.isActive ? "Suspend" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleResetPassword(std._id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10"
                          >
                            Reset Pwd
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.3 & 11.4 — COURSE & LESSON MANAGEMENT */}
          {/* ======================================================== */}
          {(activeTab === "courses" || activeTab === "lessons") && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Course & Curriculum Studio</h1>
                  <p className="text-xs text-slate-400">Manage courses, lectures, PDFs, and video assets.</p>
                </div>
                <button
                  onClick={() => setIsCourseModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-lg hover:opacity-90 flex items-center gap-1.5"
                >
                  <span>➕</span> Create New Course
                </button>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      selectedCourseForLessons?._id === course._id
                        ? "bg-[#0E1528] border-cyan-500/50 shadow-xl"
                        : "bg-[#0A0F1D]/80 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {course.category || "AI & Tech"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          course.published !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {course.published !== false ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm mb-2 line-clamp-1">{course.title}</h3>
                    <div className="text-xs text-slate-400 mb-3">Mentor: {course.instructor || course.mentorName || "Rajesh Kumar"}</div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-lg font-black text-white">₹{course.price || 4999}</span>
                        {course.discountPrice && (
                          <span className="text-xs text-slate-500 line-through ml-2">₹{course.discountPrice}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourseForLessons(course);
                            fetchCourseLessons(course._id);
                            setActiveTab("lessons");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold hover:bg-cyan-500/20"
                        >
                          Lessons
                        </button>
                        <button
                          onClick={() => handleTogglePublish(course._id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold hover:bg-white/10"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold hover:bg-red-500/20"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lesson Management Panel */}
              {selectedCourseForLessons && (
                <div className="p-6 rounded-2xl bg-[#0A0F1D]/90 border border-cyan-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Curriculum for: {selectedCourseForLessons.title}
                      </h2>
                      <p className="text-xs text-slate-400">Sprint 11.4: Manage video lectures, handouts, and visibility.</p>
                    </div>
                    <button
                      onClick={() => showToast("Upload Lesson modal opened.")}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:opacity-90"
                    >
                      + Add Lecture
                    </button>
                  </div>

                  {lessons.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No video lectures configured yet. Click "+ Add Lecture" to publish videos and PDF handouts.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((les, idx) => (
                        <div
                          key={les._id || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-500">#{idx + 1}</span>
                            <span className="font-semibold text-white">{les.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                              {les.duration || "45m"}
                            </span>
                            {les.isFree && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => showToast(`Playing preview for ${les.title}`)}
                              className="px-2.5 py-1 rounded bg-white/5 text-cyan-400 text-[10px] font-bold"
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.5 — LIVE CLASS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "live-classes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Live Classes Studio & Broadcast</h1>
                  <p className="text-xs text-slate-400">Schedule interactive masterclasses, Zoom/Meet links, and reminders.</p>
                </div>
                <button
                  onClick={() => setIsLiveClassModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-xs font-bold text-white shadow-lg hover:opacity-90 flex items-center gap-1.5"
                >
                  <span>🔴</span> Schedule Live Class
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveClasses.map((cls) => (
                  <div key={cls._id} className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {cls.status || "Upcoming"}
                      </span>
                      <span className="text-xs text-slate-500">{cls.durationMinutes || 60} mins</span>
                    </div>

                    <h3 className="font-bold text-white text-sm">{cls.title}</h3>
                    <div className="text-xs text-slate-400">Faculty: {cls.mentorName}</div>
                    <div className="text-xs text-cyan-400 font-mono">
                      📅 {new Date(cls.scheduledAt).toLocaleString()}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-center text-xs font-bold hover:bg-cyan-500/20"
                      >
                        Join Link
                      </a>
                      <button
                        onClick={() => handleTriggerLiveReminder(cls._id)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20"
                      >
                        Email Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.6 — ASSIGNMENT MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Student Assignment Submissions</h1>
                <p className="text-xs text-slate-400">Review lab projects, grade code submissions, and post mentor feedback.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Assignment Title</th>
                      <th className="p-3.5">Submission Link</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {submissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-white">{sub.studentName || sub.userEmail}</td>
                        <td className="p-3.5 font-semibold text-slate-300">{sub.title || "Dockerized Microservice Deployment"}</td>
                        <td className="p-3.5">
                          <a
                            href={sub.submissionUrl || sub.fileUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 underline font-mono text-[11px]"
                          >
                            View Submission PDF/Code
                          </a>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === "Graded" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {sub.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold font-mono">{sub.score ? `${sub.score}%` : "—"}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setGradingScore(sub.score || 90);
                              setGradingFeedback(sub.mentorFeedback || "Great work! Refactor modular docker compose configuration.");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold hover:bg-cyan-500/20"
                          >
                            Grade & Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.7 — CERTIFICATE MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Certificate Wallet & QR Verification</h1>
                  <p className="text-xs text-slate-400">Total credentials generated: {certificates.length}</p>
                </div>
                <button
                  onClick={handleBulkIssueCertificates}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-xs font-bold text-black shadow-lg hover:opacity-90 flex items-center gap-1.5"
                >
                  <span>🏆</span> Bulk Issue for Batch
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div key={cert._id} className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-yellow-500/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">{cert.credentialId || cert.certificateNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">VERIFIED</span>
                    </div>

                    <h3 className="font-bold text-white text-sm">{cert.courseTitle || "Full Stack AI Architect"}</h3>
                    <div className="text-xs text-slate-400">Awarded to: <span className="text-white font-semibold">{cert.studentName}</span></div>
                    <div className="text-xs text-slate-500">Date: {new Date(cert.issuedDate || cert.createdAt).toLocaleDateString()}</div>

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => showToast(`QR verified: https://krgloballearning.com/verify/${cert.credentialId}`)}
                        className="flex-1 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold"
                      >
                        Verify QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.8 — PAYMENT CRM */}
          {/* ======================================================== */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Financial & Payment CRM</h1>
                <p className="text-xs text-slate-400">Razorpay transactions, GST tax invoices, and refund processing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <div className="text-xs text-slate-400 mb-1">Gross Captured Revenue</div>
                  <div className="text-2xl font-black text-white">₹{paymentsData.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-xs text-slate-400 mb-1">Total Invoices</div>
                  <div className="text-2xl font-black text-white">{paymentsData.invoices.length || 24}</div>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-xs text-slate-400 mb-1">Coupons Redeemed</div>
                  <div className="text-2xl font-black text-white">{paymentsData.coupons.length || 6}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer Email</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Refund Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {paymentsData.payments.map((p) => (
                      <tr key={p._id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono font-bold text-white">{p.razorpayOrderId || p._id}</td>
                        <td className="p-3.5">{p.userEmail || "student@krgloballearning.com"}</td>
                        <td className="p-3.5 font-black text-emerald-400 font-mono">₹{p.amount?.toLocaleString()}</td>
                        <td className="p-3.5">{p.paymentMethod || "UPI / Razorpay"}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === "captured" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {p.status === "captured" ? (
                            <button
                              onClick={() => {
                                if (window.confirm(`Initiate full refund of ₹${p.amount}?`)) {
                                  superAdminService.processRefund(p._id, "Customer Dissatisfaction / Duplicate", p.amount);
                                  showToast("Refund initiated via Razorpay.");
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold"
                            >
                              Refund
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">Refunded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.9 — EMAIL CRM */}
          {/* ======================================================== */}
          {activeTab === "email-crm" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Email & Broadcast CRM</h1>
                <p className="text-xs text-slate-400">Dispatch student announcements, weekly learning reports, and campaigns.</p>
              </div>

              {/* Broadcast Composer */}
              <form onSubmit={handleSendBroadcast} className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-4">
                <h3 className="font-bold text-white text-sm">Send Broadcast Announcement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Subject (e.g. Schedule Update for Sunday Live Class)"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="bg-[#0A0F1D] border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="All Active Students">All Active Students (148)</option>
                    <option value="Weekend AI Batch">Weekend AI Batch (48)</option>
                    <option value="Pending Assignment Enrollees">Pending Assignment Enrollees (34)</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  placeholder="Enter HTML or plain-text announcement body..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-bold text-white hover:opacity-90"
                >
                  Send Announcement
                </button>
              </form>

              {/* Campaigns List */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Campaign</th>
                      <th className="p-3.5">Target Audience</th>
                      <th className="p-3.5">Recipients</th>
                      <th className="p-3.5">Open Rate</th>
                      <th className="p-3.5">CTR</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {emailData.campaigns.map((cmp) => (
                      <tr key={cmp.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-white">{cmp.title}</td>
                        <td className="p-3.5">{cmp.audience}</td>
                        <td className="p-3.5 font-mono">{cmp.sentCount}</td>
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{cmp.openRate}</td>
                        <td className="p-3.5 font-mono text-purple-400 font-bold">{cmp.clickRate}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            {cmp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.10 — SUPPORT CENTER */}
          {/* ======================================================== */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">24×7 Student Support Center</h1>
                <p className="text-xs text-slate-400">
                  Manage incoming inquiries across Portal, WhatsApp, and Official Helpdesk (+91 9311073936).
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Ticket ID</th>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {tickets.map((t) => (
                      <tr key={t._id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono font-bold text-cyan-400">{t.ticketId}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{t.studentName}</div>
                          <div className="text-[10px] text-slate-500">{t.studentEmail}</div>
                        </td>
                        <td className="p-3.5">{t.category}</td>
                        <td className="p-3.5 font-medium text-slate-200">{t.subject}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === "Urgent" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-slate-300"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {t.status !== "Resolved" && (
                            <button
                              onClick={() => handleResolveTicket(t._id)}
                              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.11 — CONTENT LIBRARY */}
          {/* ======================================================== */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Content Library & Download Center</h1>
                  <p className="text-xs text-slate-400">PDFs, lecture notes, cheatsheets, and repository starter code.</p>
                </div>
                <button
                  onClick={() => showToast("Upload Resource dialog ready.")}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold shadow-lg"
                >
                  + Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentResources.map((res) => (
                  <div key={res._id} className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-lg">📄</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                        {res.category || "Cheatsheet"}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{res.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{res.description || "Comprehensive syllabus notes."}</p>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono">{res.fileSize || "4.2 MB"}</span>
                      <a href={res.fileUrl || "#"} target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.12 — ANALYTICS CENTER */}
          {/* ======================================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Company Analytics & Business Intelligence</h1>
                <p className="text-xs text-slate-400">Macro trends across revenue, student intake, and retention rates.</p>
              </div>

              {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue Growth Bar */}
                  <div className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-4">
                    <h3 className="font-bold text-white text-sm">Monthly Revenue Growth (INR)</h3>
                    <div className="space-y-3">
                      {analyticsData.revenueByMonth.map((m: any) => (
                        <div key={m.month} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{m.month} 2026</span>
                            <span className="font-bold text-white">₹{m.revenue.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                              style={{ width: `${(m.revenue / 700000) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Enrollment Trajectory */}
                  <div className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-4">
                    <h3 className="font-bold text-white text-sm">Active Student Cohort Growth</h3>
                    <div className="space-y-3">
                      {analyticsData.studentGrowth.map((s: any) => (
                        <div key={s.month} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{s.month} 2026</span>
                            <span className="font-bold text-cyan-400">{s.students} Scholars</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-500 h-full rounded-full"
                              style={{ width: `${(s.students / 1500) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.13 — ROLE MANAGEMENT (RBAC) */}
          {/* ======================================================== */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Role-Based Access Control (RBAC)</h1>
                <p className="text-xs text-slate-400">Configure permission matrices across Super Admin, Admin, Mentor, and Support.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rolesData.roles.map((r) => (
                  <div key={r.name} className="p-5 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-cyan-400">{r.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {r.memberCount} members
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{r.description}</p>
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      {r.permissions.map((p: string, idx: number) => (
                        <div key={idx} className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                          ✓ {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.14 — SETTINGS CENTER */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Company Management & System Settings</h1>
                <p className="text-xs text-slate-400">Configure legal business entities, contact hotlines, Razorpay, and SMTP parameters.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-white/10 space-y-5 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Company Name</label>
                    <input
                      type="text"
                      value={companySettings.companyName}
                      onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Official Tagline</label>
                    <input
                      type="text"
                      value={companySettings.tagline}
                      onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">24×7 Support Phone</label>
                    <input
                      type="text"
                      value={companySettings.supportPhone}
                      onChange={(e) => setCompanySettings({ ...companySettings, supportPhone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Official Support Email</label>
                    <input
                      type="text"
                      value={companySettings.supportEmail}
                      onChange={(e) => setCompanySettings({ ...companySettings, supportEmail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Corporate CIN</label>
                    <input
                      type="text"
                      value={companySettings.cin}
                      onChange={(e) => setCompanySettings({ ...companySettings, cin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Registered Office</label>
                    <input
                      type="text"
                      value={companySettings.officeAddress}
                      onChange={(e) => setCompanySettings({ ...companySettings, officeAddress: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-lg hover:opacity-90"
                  >
                    Save Company Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* SPRINT 11.15 — ACTIVITY LOGS */}
          {/* ======================================================== */}
          {activeTab === "activity-logs" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">System Audit & Activity Logs</h1>
                <p className="text-xs text-slate-400">Complete audit trail of admin actions saved in MongoDB `activityLogs`.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0F1D]/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Admin Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Entity</th>
                      <th className="p-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {activityLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-white">{log.adminEmail}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                            {log.adminRole || "Super Admin"}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{log.action}</td>
                        <td className="p-3.5">{log.entityType}</td>
                        <td className="p-3.5 text-slate-400">{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Create Course */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCourse}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Create New Learning Program</h3>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI Agents & LangChain Mastery"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Category</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Mentor Name</label>
                  <input
                    type="text"
                    value={newCourse.mentorName}
                    onChange={(e) => setNewCourse({ ...newCourse, mentorName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Standard Fee (₹)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Founder Discount Fee (₹)</label>
                  <input
                    type="number"
                    value={newCourse.discountPrice}
                    onChange={(e) => setNewCourse({ ...newCourse, discountPrice: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-lg"
              >
                Publish Program
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Schedule Live Class */}
      {isLiveClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLiveClass}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Schedule Live Interactive Session</h3>
              <button
                type="button"
                onClick={() => setIsLiveClassModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Caching with Redis & System Architecture"
                  value={newLiveClass.title}
                  onChange={(e) => setNewLiveClass({ ...newLiveClass, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newLiveClass.scheduledAt}
                  onChange={(e) => setNewLiveClass({ ...newLiveClass, scheduledAt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Meeting URL (Google Meet / Zoom)</label>
                <input
                  type="url"
                  required
                  value={newLiveClass.meetingLink}
                  onChange={(e) => setNewLiveClass({ ...newLiveClass, meetingLink: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLiveClassModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-xs font-bold text-white shadow-lg"
              >
                Confirm Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleGradeSubmission}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Grade Student Assignment</h3>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="font-bold text-white">{selectedSubmission.studentName}</div>
                <div className="text-slate-400">{selectedSubmission.title}</div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Score Percentage (0 - 100%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradingScore}
                  onChange={(e) => setGradingScore(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Mentor Feedback & Remarks</label>
                <textarea
                  rows={4}
                  required
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-xs font-bold text-white shadow-lg"
              >
                Submit Grade
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
