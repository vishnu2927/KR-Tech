import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import { ALL_COURSES, Course } from "../data/coursesData";
import { MENTORS_DATA, Mentor } from "../data/mentorsData";
import { leadService, Lead, LeadStatus } from "../services/leadService";
import { I } from "../components/Icons";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: "Active" | "Completed" | "Pending";
  enrolledDate: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  { id: "std-1", name: "Aditya Sharma", email: "aditya.sharma@krtech.edu", phone: "+91 98765 43210", course: "Java Backend with Spring Boot", status: "Active", enrolledDate: "Aug 15, 2026" },
  { id: "std-2", name: "Kavya Patel", email: "kavya.patel@gmail.com", phone: "+91 98234 56789", course: "MERN Stack Mastery Bootcamp", status: "Active", enrolledDate: "Aug 20, 2026" },
  { id: "std-3", name: "Siddharth Verma", email: "sid.verma@outlook.com", phone: "+91 97123 45678", course: "AWS Solutions Architect Associate", status: "Completed", enrolledDate: "Jun 10, 2026" },
  { id: "std-4", name: "Meenakshi Iyer", email: "meenakshi.iyer@gmail.com", phone: "+91 99876 54321", course: "Microsoft Azure Administrator (AZ-104)", status: "Active", enrolledDate: "Aug 28, 2026" },
  { id: "std-5", name: "Rohan Deshmukh", email: "rohan.desh@techmail.com", phone: "+91 96543 21098", course: "Cyber Security & CEH v12", status: "Pending", enrolledDate: "Sep 02, 2026" },
  { id: "std-6", name: "Ananya Roy", email: "ananya.roy@yahoo.com", phone: "+91 95432 10987", course: "Microsoft Power BI Data Analyst", status: "Active", enrolledDate: "Jul 18, 2026" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [coursesList, setCoursesList] = useState<Course[]>(ALL_COURSES);
  const [mentorsList, setMentorsList] = useState<Mentor[]>(MENTORS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [courseModal, setCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ title: "", category: "Java Backend", price: "₹12,999", mentor: "Rajesh Kumar", duration: "6 Months" });

  const [mentorModal, setMentorModal] = useState(false);
  const [mentorForm, setMentorForm] = useState({ name: "", specialization: "", company: "Ex-Google", exp: "10+ Years", domain: "Java Backend" as const });

  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<"Notes" | "Lecture" | "PDF">("Notes");
  const [uploadTitle, setUploadTitle] = useState("");

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "students", label: "Students", icon: "🎓", count: `${students.length}` },
    { key: "courses", label: "Courses", icon: "📚", count: `${coursesList.length}` },
    { key: "mentors", label: "Mentors", icon: "⚡", count: `${mentorsList.length}` },
    { key: "leads", label: "Demo Leads", icon: "📋", count: `${leads.length}` },
    { key: "resources", label: "Resources", icon: "📥" },
    { key: "certificates", label: "Certificates", icon: "🏆" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  useEffect(() => {
    leadService.getAllLeads().then((data) => setLeads(data));
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const updated = await leadService.updateLeadStatus(id, newStatus);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    }
  };

  // Course Add/Edit/Delete
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    if (editingCourse) {
      setCoursesList((prev) =>
        prev.map((c) => (c.id === editingCourse.id ? { ...c, ...courseForm } : c))
      );
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseForm.title,
        category: courseForm.category,
        categoryGroup: "Software Development",
        duration: courseForm.duration,
        students: "1.2K",
        rating: "4.9",
        level: "Beginner",
        mentor: courseForm.mentor,
        mentorCompany: "Ex-Tech Lead",
        mentorExp: "10+ Years",
        language: "English & Hindi",
        price: courseForm.price,
        originalPrice: "₹24,999",
        badge: "New",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
        features: ["1:1 Live Coding", "Capstone Real Project", "Resume Review"],
        roadmap: [
          { week: "Week 1-2", title: "Fundamentals", topics: ["Core Syntax", "Design Patterns"], milestone: "Foundation Build" },
          { week: "Week 3-4", title: "Advanced", topics: ["Frameworks", "Deployment"], milestone: "Production Release" },
        ],
      };
      setCoursesList((prev) => [newCourse, ...prev]);
    }
    setCourseModal(false);
    setEditingCourse(null);
    setCourseForm({ title: "", category: "Java Backend", price: "₹12,999", mentor: "Rajesh Kumar", duration: "6 Months" });
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCoursesList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Mentor Add
  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.name.trim()) return;
    const newM: Mentor = {
      id: `mentor-${Date.now()}`,
      name: mentorForm.name,
      role: "Lead Architect",
      company: mentorForm.company,
      specialization: mentorForm.specialization,
      domain: mentorForm.domain,
      exp: mentorForm.exp,
      rating: 4.95,
      reviewsCount: 150,
      studentsCount: "800+",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format",
      skills: ["Enterprise Systems", "1:1 Live Code Review"],
      languages: ["English", "Hindi"],
      linkedin: "https://linkedin.com",
      bio: "Industry veteran training engineers with 10+ years of enterprise experience.",
      coursesTaught: [mentorForm.specialization],
    };
    setMentorsList((prev) => [newM, ...prev]);
    setMentorModal(false);
    setMentorForm({ name: "", specialization: "", company: "Ex-Google", exp: "10+ Years", domain: "Java Backend" });
  };

  // Upload simulation
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    alert(`✓ Successfully uploaded ${uploadType}: "${uploadTitle}" to the student resource portal.`);
    setUploadModal(false);
    setUploadTitle("");
  };

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.course.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <main className="pt-20 min-h-screen bg-slate-900 text-gray-100 flex flex-col md:flex-row">
      {/* Reusable Sidebar */}
      <DashboardSidebar
        role="admin"
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        items={sidebarItems}
      />

      {/* Main Content Area */}
      <section className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-white">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">Portal</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Operations Control Center · Welcome back, <strong className="text-gray-200">{user?.name || "Admin Lead"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown isDark={true} />
            <button
              type="button"
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({ title: "", category: "Java Backend", price: "₹12,999", mentor: "Rajesh Kumar", duration: "6 Months" });
                setCourseModal(true);
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Add New Course
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: DASHBOARD OVERVIEW (Cards + Tables)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* 4 Admin Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Total Students</span>
                  <span className="text-emerald-400 font-bold">15,420</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  15,420 <span className="text-xs font-normal text-emerald-400">+12% this mo</span>
                </div>
                <div className="text-[11px] text-gray-400">Enrolled across 1:1 tracks</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Demo Bookings</span>
                  <span className="text-purple-400 font-bold">{leads.length} Leads</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  {leads.length} <span className="text-xs font-normal text-purple-300">Total in CRM</span>
                </div>
                <div className="text-[11px] text-gray-400">Active evaluation requests</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Active Courses</span>
                  <span className="text-cyan-400 font-bold">{coursesList.length} Tracks</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  {coursesList.length} <span className="text-xs font-normal text-cyan-300">Live Programs</span>
                </div>
                <div className="text-[11px] text-gray-400">7 Certification domains</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Expert Mentors</span>
                  <span className="text-amber-400 font-bold">{mentorsList.length} Leads</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-sans mb-1">
                  {mentorsList.length} <span className="text-xs font-normal text-amber-300">Architects</span>
                </div>
                <div className="text-[11px] text-gray-400">10+ Years Avg Experience</div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setUploadType("Notes");
                  setUploadModal(true);
                }}
                className="p-4 bg-slate-950/80 hover:bg-slate-900 border border-purple-500/30 rounded-2xl text-left transition-all cursor-pointer"
              >
                <div className="text-xl mb-1">📝</div>
                <h4 className="text-xs font-bold text-white">Upload Notes / PDF</h4>
                <p className="text-[11px] text-gray-400">Distribute study handbooks to students</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType("Lecture");
                  setUploadModal(true);
                }}
                className="p-4 bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 rounded-2xl text-left transition-all cursor-pointer"
              >
                <div className="text-xl mb-1">🎥</div>
                <h4 className="text-xs font-bold text-white">Upload Recorded Lecture</h4>
                <p className="text-[11px] text-gray-400">Add 1:1 session replay to video archive</p>
              </button>

              <button
                type="button"
                onClick={() => setMentorModal(true)}
                className="p-4 bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 rounded-2xl text-left transition-all cursor-pointer"
              >
                <div className="text-xl mb-1">⚡</div>
                <h4 className="text-xs font-bold text-white">Add Expert Mentor</h4>
                <p className="text-[11px] text-gray-400">Onboard new senior industry architect</p>
              </button>
            </div>

            {/* Students Table Preview */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-bold text-base text-white">Active Students List</h3>
                <button type="button" onClick={() => setActiveTab("students")} className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                  View All ({students.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {students.slice(0, 4).map((std) => (
                      <tr key={std.id} className="hover:bg-slate-900/50">
                        <td className="py-3 font-bold text-white">{std.name}</td>
                        <td className="py-3 text-gray-400">{std.email}</td>
                        <td className="py-3 text-gray-400">{std.phone}</td>
                        <td className="py-3 text-purple-300 truncate max-w-xs">{std.course}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            std.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                          }`}>
                            {std.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demo Leads Table Preview */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-bold text-base text-white">Recent Demo Bookings & Leads</h3>
                <button type="button" onClick={() => setActiveTab("leads")} className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                  Manage Leads ({leads.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Preferred Time</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leads.slice(0, 4).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/50">
                        <td className="py-3 font-bold text-white">{l.name}</td>
                        <td className="py-3 text-purple-300 truncate max-w-xs">{l.course}</td>
                        <td className="py-3 text-gray-400">{l.preferredTime || "Evening"}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <a
                            href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] no-underline inline-block"
                          >
                            Contact
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: STUDENTS TABLE
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-sans">Students Management</h2>
              <span className="text-xs text-gray-400">{students.length} Enrolled</span>
            </div>

            <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Enrolled</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-900/50">
                      <td className="py-3 font-bold text-white">{std.name}</td>
                      <td className="py-3 text-gray-400">{std.email}</td>
                      <td className="py-3 text-gray-400">{std.phone}</td>
                      <td className="py-3 text-purple-300">{std.course}</td>
                      <td className="py-3 text-gray-400">{std.enrolledDate}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          std.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                        }`}>
                          {std.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: COURSES MANAGEMENT
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-sans">Course Management</h2>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ title: "", category: "Java Backend", price: "₹12,999", mentor: "Rajesh Kumar", duration: "6 Months" });
                  setCourseModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
              >
                + Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesList.map((c) => (
                <div key={c.id} className="p-5 bg-slate-950/80 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">{c.category}</span>
                      <span className="text-xs font-bold text-emerald-400">{c.price}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">Mentor: {c.mentor} · {c.duration}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCourse(c);
                        setCourseForm({ title: c.title, category: c.category, price: c.price, mentor: c.mentor, duration: c.duration });
                        setCourseModal(true);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-purple-600 text-gray-200 hover:text-white text-xs font-bold rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(c.id)}
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: MENTORS MANAGEMENT
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "mentors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-sans">Mentor Management</h2>
              <button
                type="button"
                onClick={() => setMentorModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
              >
                + Add Mentor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentorsList.map((m) => (
                <div key={m.id} className="p-5 bg-slate-950/80 rounded-3xl border border-slate-800 flex items-start gap-3.5">
                  <img src={m.image} alt={m.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{m.name}</h3>
                    <p className="text-xs text-purple-300 truncate">{m.specialization}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{m.company} · {m.exp} Exp</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: DEMO LEADS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-extrabold text-white font-sans">Demo Leads Management ({filteredLeads.length})</h2>
              <div className="flex gap-2">
                {["All", "New", "Scheduled", "Completed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusFilter === st ? "bg-purple-600 text-white" : "bg-slate-800 text-gray-400"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-gray-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Preferred Time</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-900/50">
                      <td className="py-3 font-bold text-white">{l.name}</td>
                      <td className="py-3 text-purple-300 max-w-xs truncate">{l.course}</td>
                      <td className="py-3 text-gray-400">{l.preferredTime || "Evening"}</td>
                      <td className="py-3 text-gray-400">{l.phone}</td>
                      <td className="py-3">
                        <select
                          value={l.status}
                          onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                          className="bg-slate-800 text-white text-[11px] rounded px-2 py-1 border border-slate-700 outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] no-underline inline-block"
                        >
                          Contact
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: RESOURCES MANAGEMENT
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white font-sans">Resource Management</h2>
              <button
                type="button"
                onClick={() => setUploadModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
              >
                + Upload New Asset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="text-sm font-bold text-white mb-1">Upload Notes</h3>
                <p className="text-xs text-gray-400 mb-4">Publish markdown or PDF lecture notes for students.</p>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("Notes");
                    setUploadModal(true);
                  }}
                  className="w-full py-2 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold rounded-xl"
                >
                  Upload Notes
                </button>
              </div>

              <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800">
                <div className="text-3xl mb-2">🎥</div>
                <h3 className="text-sm font-bold text-white mb-1">Upload Recorded Lecture</h3>
                <p className="text-xs text-gray-400 mb-4">Post 1080p class video replay to student dashboard.</p>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("Lecture");
                    setUploadModal(true);
                  }}
                  className="w-full py-2 bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl"
                >
                  Upload Lecture
                </button>
              </div>

              <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="text-sm font-bold text-white mb-1">Upload PDF Handbook</h3>
                <p className="text-xs text-gray-400 mb-4">Distribute cheat sheets and interview roadmaps.</p>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("PDF");
                    setUploadModal(true);
                  }}
                  className="w-full py-2 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold rounded-xl"
                >
                  Upload PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: CERTIFICATES & SETTINGS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Certificate Issuance Control</h2>
            <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 max-w-xl">
              <p className="text-xs text-gray-400 mb-4">
                Automated certificate generation is enabled. All students who pass capstone code defense are issued a verifiable credential ID.
              </p>
              <Link to="/certificates" className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl no-underline inline-block">
                View Certificate Gallery →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 max-w-xl space-y-4">
            <h2 className="text-xl font-extrabold text-white font-sans">Admin Settings</h2>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Platform Name</label>
              <input defaultValue="KR Tech — 1:1 Live Coding Academy" className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Admin Notification Email</label>
              <input defaultValue="admin@krtech.edu" className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white" />
            </div>
            <button
              type="button"
              onClick={() => alert("Admin settings updated successfully!")}
              className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Save Configuration
            </button>
          </div>
        )}
      </section>

      {/* Course Add/Edit Modal */}
      {courseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setCourseModal(false)}>
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-4">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <form onSubmit={handleSaveCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Course Title</label>
                <input
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Master React 19 Architecture"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Category</label>
                <input
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Price</label>
                  <input
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Duration</label>
                  <input
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setCourseModal(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Add Modal */}
      {mentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setMentorModal(false)}>
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-4">Add Expert Mentor</h3>
            <form onSubmit={handleSaveMentor} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Mentor Name</label>
                <input
                  required
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  placeholder="e.g. Arvind Swaminathan"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Specialization</label>
                <input
                  required
                  value={mentorForm.specialization}
                  onChange={(e) => setMentorForm({ ...mentorForm, specialization: e.target.value })}
                  placeholder="e.g. AI & Generative AI Systems"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setMentorModal(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl">Save Mentor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setUploadModal(false)}>
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-4">Upload {uploadType}</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Asset Title / Document Name</label>
                <input
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={`e.g. ${uploadType === "Lecture" ? "Class #15: Kafka Dead Letter Queues" : "Kafka Architecture Guide.pdf"}`}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <div className="p-4 border-2 border-dashed border-slate-700 rounded-2xl text-center text-xs text-gray-400">
                Drag & Drop file here or <span className="text-purple-400 font-bold">Browse Files</span>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setUploadModal(false)} className="px-4 py-2 text-xs text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl">Publish Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
