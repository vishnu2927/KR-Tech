import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseService, Course } from "../services/courseService";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";

interface CourseFormData {
  id?: string;
  title: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: string;
  originalPrice: string;
  description: string;
  highlights: string;
  roadmap: string;
  image: string;
  mentor: string;
  mentorCompany: string;
  badge: string;
}

const INITIAL_FORM_STATE: CourseFormData = {
  title: "",
  category: "Java Backend",
  duration: "6 Months",
  level: "Intermediate",
  price: "₹14,999",
  originalPrice: "₹26,999",
  description: "Comprehensive 1:1 mentorship covering enterprise system design, real-world capstone projects, and direct placement support.",
  highlights: "1:1 Live Mentorship, Real-world Capstones, Code Review, Resume & Interview Prep",
  roadmap: "Week 1-2: Core Architecture & Fundamentals\nWeek 3-4: Frameworks & APIs\nWeek 5-6: Microservices & Cloud Deployment",
  image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
  mentor: "Rajesh Kumar",
  mentorCompany: "Ex-Amazon",
  badge: "Bestseller",
};

const CATEGORIES = [
  "All",
  "Java Backend",
  "MERN Stack",
  "AWS",
  "Azure",
  "GCP",
  "Cyber Security",
  "Cisco",
  "SAP",
  "Salesforce",
  "Power BI",
  "Tableau",
  "ServiceNow",
  "PMP",
  "Scrum",
];

export default function CourseManagementPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTargetCourse, setDeleteTargetCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(INITIAL_FORM_STATE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Executive Suite", icon: "📊" },
    { key: "cms", label: "Course CMS", icon: "📚", count: `${courses.length}` },
    { key: "leads", label: "CRM Leads", icon: "📋" },
    { key: "mentors", label: "Principal Mentors", icon: "⚡" },
    { key: "resources", label: "Curriculum Assets", icon: "📥" },
    { key: "settings", label: "System Config", icon: "⚙️" },
  ];

  // Load live MongoDB courses
  const loadCourses = async () => {
    setLoading(true);
    try {
      const dbCourses = await courseService.getAllCourses();
      if (dbCourses && dbCourses.length > 0) {
        setCourses(dbCourses);
      }
    } catch (err) {
      console.warn("MongoDB courses load notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = categoryFilter === "All" || c.category.toLowerCase() === categoryFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.mentor && c.mentor.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [courses, categoryFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  // Handle Add Course Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const highlightsArray = formData.highlights.split(",").map((h) => h.trim()).filter(Boolean);
    const roadmapItems = formData.roadmap.split("\n").filter(Boolean).map((line, idx) => ({
      week: `Week ${idx * 2 + 1}-${idx * 2 + 2}`,
      title: line,
      topics: ["Architecture Review", "1:1 Live Coding"],
      milestone: "Capstone Delivery",
    }));

    const newCoursePayload = {
      title: formData.title,
      category: formData.category,
      duration: formData.duration,
      level: formData.level,
      price: formData.price,
      originalPrice: formData.originalPrice,
      description: formData.description,
      features: highlightsArray,
      image: formData.image,
      mentor: formData.mentor,
      mentorCompany: formData.mentorCompany,
      badge: formData.badge,
    };

    const created = await courseService.createCourse(newCoursePayload);
    if (created) {
      setCourses((prev) => [created, ...prev]);
      showToast(`✓ Created course: "${formData.title}" in MongoDB`);
    }

    setIsAddModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
  };

  // Open Edit Modal
  const openEditModal = (course: Course) => {
    setFormData({
      id: course.id,
      title: course.title,
      category: course.category,
      duration: course.duration,
      level: (course.level as any) || "Intermediate",
      price: course.price,
      originalPrice: course.originalPrice || "₹24,999",
      description: (course as any).description || "Comprehensive 1:1 tech mentorship with real-world capstone architecture.",
      highlights: (course.features || []).join(", "),
      roadmap: (course.roadmap || []).map((r) => r.title).join("\n"),
      image: course.image || INITIAL_FORM_STATE.image,
      mentor: course.mentor || "Rajesh Kumar",
      mentorCompany: course.mentorCompany || "Ex-Amazon",
      badge: course.badge || "Live Track",
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title.trim()) return;

    const highlightsArray = formData.highlights.split(",").map((h) => h.trim()).filter(Boolean);
    const updated = await courseService.updateCourse(formData.id, {
      title: formData.title,
      category: formData.category,
      duration: formData.duration,
      level: formData.level,
      price: formData.price,
      features: highlightsArray,
      image: formData.image,
      mentor: formData.mentor,
      mentorCompany: formData.mentorCompany,
      badge: formData.badge,
    });

    if (updated) {
      setCourses((prev) =>
        prev.map((c) => (c.id === formData.id ? { ...c, ...formData, features: highlightsArray } : c))
      );
      showToast(`✓ Updated course: "${formData.title}" in MongoDB`);
    }

    setIsEditModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteTargetCourse) return;
    const success = await courseService.deleteCourse(deleteTargetCourse.id);
    if (success) {
      setCourses((prev) => prev.filter((c) => c.id !== deleteTargetCourse.id));
      showToast(`✓ Deleted course: "${deleteTargetCourse.title}" from MongoDB`);
    }
    setDeleteTargetCourse(null);
  };

  // Handle Thumbnail File Simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: fakeUrl }));
      showToast("Uploaded thumbnail preview attached");
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <DashboardSidebar
        role="admin"
        activeTab="cms"
        onTabChange={(key) => {
          if (key === "dashboard" || key === "leads" || key === "mentors" || key === "settings") {
            navigate("/admin");
          }
        }}
        items={sidebarItems}
      />

      {/* Main Content Area */}
      <section className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                  Course Management CMS
                </span>
                <span className="text-xs text-slate-400">MongoDB CRUD Connected</span>
              </div>
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Curriculum & Course CMS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                Manage all 55+ certification tracks, edit tuition pricing, upload thumbnails, update milestone roadmaps, and publish new 1:1 industry syllabi.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={loadCourses}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span className={loading ? "animate-spin" : ""}>🔄</span> Sync
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData(INITIAL_FORM_STATE);
                  setIsAddModalOpen(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="text-base font-bold">+</span> Add New Course
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-8 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search course title, category, mentor..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Showing <strong className="text-white">{filteredCourses.length}</strong> certification courses in catalog
            </span>
            <span className="text-purple-400 font-semibold">1:1 Live Interactive Syllabi</span>
          </div>
        </div>

        {/* Course Cards CMS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-purple-600/90 text-white text-[10px] font-bold rounded-full shadow-md">
                    {course.badge || "Live Track"}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white text-base font-sans">{course.price}</span>
                    <span className="text-slate-300 font-semibold text-[11px] bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                      ⏱ {course.duration}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-sans font-bold text-sm text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Mentor: <strong className="text-slate-200">{course.mentor}</strong></span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-purple-300 font-semibold">{course.mentorCompany || "Ex-Amazon"}</span>
                  </div>

                  {course.features && course.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md text-[10px] border border-slate-800">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(course)}
                  className="flex-1 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold rounded-xl text-xs transition-all border border-purple-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>✏️</span> Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetCourse(course)}
                  className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white font-bold rounded-xl text-xs transition-all border border-rose-800/40 cursor-pointer"
                  title="Delete Course"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredCourses.length} total courses)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT COURSE
      ───────────────────────────────────────────────────────────────────────────── */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  {isEditModalOpen ? "Modify Existing Track" : "Publish New Track"}
                </span>
                <h3 className="font-bold text-lg text-white">
                  {isEditModalOpen ? `Edit: ${formData.title}` : "Add New 1:1 Certification Course"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Complete Java Backend Development with Spring Boot 3.x"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹14,999"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price</label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. ₹26,999"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Mentor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Principal Mentor</label>
                  <input
                    type="text"
                    value={formData.mentor}
                    onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mentor Company Badge</label>
                  <input
                    type="text"
                    value={formData.mentorCompany}
                    onChange={(e) => setFormData({ ...formData, mentorCompany: e.target.value })}
                    placeholder="e.g. Ex-Amazon"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course overview and syllabus highlights..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Highlights (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="1:1 Live Mentorship, Kafka Streams, Docker Architecture"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Roadmap */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Roadmap Milestones (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.roadmap}
                  onChange={(e) => setFormData({ ...formData, roadmap: e.target.value })}
                  placeholder="Week 1-2: Core Architecture & Setup&#10;Week 3-4: Microservices Pipeline"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Thumbnail URL & File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Course Thumbnail</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL (https://...)"
                    className="flex-1 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <label className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer text-center">
                    <span>📁 Upload Local File</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                {formData.image && (
                  <div className="h-20 w-36 rounded-xl overflow-hidden border border-slate-800 mt-2">
                    <img src={formData.image} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isEditModalOpen ? "Save Changes" : "Publish Course to MongoDB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          DELETE CONFIRMATION DIALOG
      ───────────────────────────────────────────────────────────────────────────── */}
      {deleteTargetCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl text-rose-400">
              ⚠️
            </div>

            <div>
              <h3 className="font-bold text-lg text-white">Delete Course Track?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently remove <strong className="text-white">"{deleteTargetCourse.title}"</strong> from MongoDB? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteTargetCourse(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
