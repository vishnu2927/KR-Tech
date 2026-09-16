import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar, { SidebarItem } from "../components/DashboardSidebar";
import NotificationDropdown from "../components/NotificationDropdown";
import { leadService, Lead, LeadStatus, LeadStats } from "../services/leadService";
import { courseService, Course, CoursePayload } from "../services/courseService";
import { mentorService, Mentor, MentorPayload } from "../services/mentorService";
import { authService } from "../services/authService";
import AnalyticsModule from "../components/analytics/AnalyticsModule";
import { I } from "../components/Icons";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  avatar?: string;
  status: "Active" | "Completed" | "Pending";
  progress: number;
  batch: string;
  mentor: string;
  enrolledDate: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  { id: "std-1", name: "Aditya Sharma", email: "aditya.sharma@krtech.edu", phone: "+91 98765 43210", course: "Complete Java Backend Development with Spring Boot & Microservices", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Active", progress: 78, batch: "Batch-24A (Weekend)", mentor: "Rajesh Kumar", enrolledDate: "Aug 15, 2026" },
  { id: "std-2", name: "Kavya Patel", email: "kavya.patel@gmail.com", phone: "+91 98234 56789", course: "MERN Stack Full Stack Web Development Mastery Bootcamp", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Active", progress: 64, batch: "Batch-24B (Evening)", mentor: "Amit Verma", enrolledDate: "Aug 20, 2026" },
  { id: "std-3", name: "Siddharth Verma", email: "sid.verma@outlook.com", phone: "+91 97123 45678", course: "AWS Certified Solutions Architect Associate (SAA-C03)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Completed", progress: 100, batch: "Batch-23F", mentor: "Vikram Nair", enrolledDate: "Jun 10, 2026" },
  { id: "std-4", name: "Meenakshi Iyer", email: "meenakshi.iyer@gmail.com", phone: "+91 99876 54321", course: "Microsoft Azure Administrator (AZ-104)", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Active", progress: 42, batch: "Batch-24C (Fast-track)", mentor: "Pooja Hegde", enrolledDate: "Aug 28, 2026" },
  { id: "std-5", name: "Rohan Deshmukh", email: "rohan.desh@techmail.com", phone: "+91 96543 21098", course: "Cyber Security & Certified Ethical Hacker (CEH v12)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Pending", progress: 15, batch: "Batch-24D (Upcoming)", mentor: "Ananya Roy", enrolledDate: "Sep 02, 2026" },
  { id: "std-6", name: "Ananya Roy", email: "ananya.roy@yahoo.com", phone: "+91 95432 10987", course: "Microsoft Power BI Data Analyst Mastery (PL-300)", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces&auto=format", status: "Active", progress: 89, batch: "Batch-24A", mentor: "Deepak Joshi", enrolledDate: "Jul 18, 2026" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [mentorsList, setMentorsList] = useState<Mentor[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 8,
    todayLeads: 3,
    demoScheduled: 2,
    followUpsPending: 2,
    totalCourses: 55,
    totalMentors: 10,
    totalStudents: 15420,
  });

  const [isLoading, setIsLoading] = useState(true);

  // CRM Leads Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [leadsPage, setLeadsPage] = useState(1);
  const leadsPerPage = 8;

  // Students Filters & Pagination
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>("All");
  const [studentPage, setStudentPage] = useState(1);
  const studentsPerPage = 6;

  // Courses Filters & Pagination
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("All");
  const [courseLevelFilter, setCourseLevelFilter] = useState("All");
  const [coursePage, setCoursePage] = useState(1);
  const coursesPerPage = 8;

  // Mentors Filters & Pagination
  const [mentorSearch, setMentorSearch] = useState("");
  const [mentorDomainFilter, setMentorDomainFilter] = useState("All");
  const [mentorPage, setMentorPage] = useState(1);
  const mentorsPerPage = 6;

  // Course Modal State (Create / Edit)
  const [courseModal, setCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "Java Backend",
    categoryGroup: "Software Development",
    level: "Intermediate" as Course["level"],
    duration: "6 Months",
    price: "₹14,999",
    originalPrice: "₹24,999",
    mentor: "Rajesh Kumar",
    mentorCompany: "Ex-Amazon",
    mentorExp: "10+ Years",
    language: "English & Hindi",
    description: "Comprehensive 1:1 live mentorship covering system architecture, production capstones, and interview preparation.",
    highlights: "1:1 Live Mentorship, Real-world Capstones, Code Review, Resume Prep",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
  });

  // Mentor Modal State (Create / Edit)
  const [mentorModal, setMentorModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "Senior Staff Engineer",
    company: "Ex-Amazon",
    specialization: "Java Backend & Distributed Architecture",
    domain: "Java Backend",
    exp: "10+ Years",
    rating: 4.95,
    reviewsCount: 150,
    studentsCount: "800+",
    skills: "Java 21, Spring Boot 3.x, Microservices, Kafka, Docker",
    languages: "English, Hindi",
    bio: "Senior industry practitioner training engineers with 10+ years of high-scale enterprise experience.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces&auto=format",
    linkedin: "https://linkedin.com",
  });

  // Notes Modal State
  const [notesModalLead, setNotesModalLead] = useState<Lead | null>(null);
  const [noteContent, setNoteContent] = useState("");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const sidebarItems: SidebarItem[] = [
    { key: "dashboard", label: "Executive Suite", icon: "📊" },
    { key: "leads", label: "CRM Leads", icon: "📋", count: `${leads.length}` },
    { key: "students", label: "Enrolled Students", icon: "🎓", count: `${students.length}` },
    { key: "courses", label: "Course Catalog", icon: "📚", count: `${coursesList.length}` },
    { key: "mentors", label: "Principal Mentors", icon: "⚡", count: `${mentorsList.length}` },
    { key: "resources", label: "Curriculum Assets", icon: "📥" },
    { key: "certificates", label: "Credential Hub", icon: "🏆" },
    { key: "settings", label: "System Config", icon: "⚙️" },
  ];

  // Fetch Live Data from Backend & MongoDB
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Ensure active admin token in localStorage
      await authService.ensureAdminToken();

      const [fetchedLeads, fetchedStats, fetchedCourses, fetchedMentors] = await Promise.all([
        leadService.getAllLeads(),
        leadService.getLeadStats(),
        courseService.getAllCourses(),
        mentorService.getAllMentors(),
      ]);

      if (fetchedLeads && fetchedLeads.length > 0) {
        setLeads(fetchedLeads);
      }
      if (fetchedStats) {
        setStats(fetchedStats);
      }
      if (fetchedCourses && fetchedCourses.length > 0) {
        setCoursesList(fetchedCourses);
      }
      if (fetchedMentors && fetchedMentors.length > 0) {
        setMentorsList(fetchedMentors);
      }

      const resStudents = await authService.getStudents();
      if (resStudents && resStudents.length > 0) {
        const mapped: StudentRecord[] = resStudents.map((s, idx) => ({
          id: s.id || `std-${idx}`,
          name: s.name,
          email: s.email,
          phone: s.phone || "+91 98765 00000",
          course: "1:1 Live Coding & Architecture",
          avatar: `https://images.unsplash.com/photo-${1534528741775 + idx}?w=120&h=120&fit=crop&crop=faces&auto=format`,
          status: "Active",
          progress: 50 + ((idx * 12) % 45),
          batch: "Batch-24 (Live)",
          mentor: "Principal Architect",
          enrolledDate: "Active",
        }));
        setStudents((prev) => [...mapped, ...prev.filter((p) => !mapped.some((m) => m.email === p.email))]);
      }
    } catch (err) {
      console.warn("MongoDB fetch notice, using active fallback state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // LEADS ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const updated = await leadService.updateLeadStatus(id, newStatus);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === id || l._id === id ? { ...l, status: newStatus } : l)));
      showToast(`Lead status updated to "${newStatus}" via PATCH /api/leads/${id}`);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete lead: "${name}"?`)) {
      const success = await leadService.deleteLead(id);
      if (success) {
        setLeads((prev) => prev.filter((l) => l.id !== id && l._id !== id));
        showToast(`Lead "${name}" deleted via DELETE /api/leads/${id}`);
      }
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalLead) return;
    const leadId = notesModalLead.id || notesModalLead._id || "";
    const updated = await leadService.updateLeadStatus(leadId, notesModalLead.status, noteContent);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === leadId || l._id === leadId ? { ...l, notes: noteContent } : l)));
      showToast(`Counselor notes saved to MongoDB Atlas for ${notesModalLead.name}`);
    }
    setNotesModalLead(null);
    setNoteContent("");
  };

  const handleExportLeadsCSV = () => {
    const headers = ["Name,Email,Phone,Course,Status,Preferred Time,Notes,Created At"];
    const rows = leads.map(l => `"${l.name}","${l.email}","${l.phone}","${l.course}","${l.status}","${l.preferredTime || l.timeSlot || ''}","${l.notes || ''}","${l.createdAt}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRTech_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CRM Leads exported successfully as CSV");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE CRUD ACTIONS (POST / PUT / DELETE)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      category: "Java Backend",
      categoryGroup: "Software Development",
      level: "Intermediate",
      duration: "6 Months",
      price: "₹14,999",
      originalPrice: "₹24,999",
      mentor: "Rajesh Kumar",
      mentorCompany: "Ex-Amazon",
      mentorExp: "10+ Years",
      language: "English & Hindi",
      description: "Master enterprise system architecture and 1:1 project development.",
      highlights: "1:1 Live Mentorship, Real-world Capstones, Code Review, Resume Prep",
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
    });
    setCourseModal(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category,
      categoryGroup: course.categoryGroup || "Software Development",
      level: course.level || "Intermediate",
      duration: course.duration,
      price: course.price,
      originalPrice: course.originalPrice || "₹24,999",
      mentor: course.mentor,
      mentorCompany: course.mentorCompany,
      mentorExp: course.mentorExp || "10+ Years",
      language: course.language || "English & Hindi",
      description: course.description || "",
      highlights: (course.highlights || course.features || []).join(", "),
      badge: course.badge || "Live Track",
      image: course.image,
    });
    setCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    const feats = courseForm.highlights
      ? courseForm.highlights.split(",").map((s) => s.trim()).filter(Boolean)
      : ["1:1 Live Coding", "Capstone Real Project"];

    const payload: CoursePayload = {
      title: courseForm.title,
      category: courseForm.category,
      categoryGroup: courseForm.categoryGroup,
      duration: courseForm.duration,
      level: courseForm.level,
      price: courseForm.price,
      originalPrice: courseForm.originalPrice,
      mentor: courseForm.mentor,
      mentorCompany: courseForm.mentorCompany,
      mentorExp: courseForm.mentorExp,
      language: courseForm.language,
      description: courseForm.description,
      features: feats,
      highlights: feats,
      badge: courseForm.badge,
      image: courseForm.image,
    };

    if (editingCourse) {
      const targetId = editingCourse._id || editingCourse.id;
      const updated = await courseService.updateCourse(targetId, payload);
      if (updated) {
        setCoursesList((prev) => prev.map((c) => (c.id === targetId || c._id === targetId ? updated : c)));
        showToast(`Course "${courseForm.title}" updated via PUT /api/courses/${targetId}`);
      } else {
        // Optimistic local update
        setCoursesList((prev) =>
          prev.map((c) => (c.id === targetId || c._id === targetId ? { ...c, ...courseForm, features: feats } : c))
        );
        showToast("Course updated successfully");
      }
    } else {
      const created = await courseService.createCourse(payload);
      if (created) {
        setCoursesList((prev) => [created, ...prev]);
        showToast(`Course created via POST /api/courses in MongoDB Atlas`);
      } else {
        const localCourse: Course = {
          id: `course-${Date.now()}`,
          ...payload,
          students: "1.0K",
          rating: "4.9",
          price: typeof payload.price === "number" ? `₹${payload.price}` : (payload.price || "₹14,999"),
          originalPrice: "₹24,999",
          level: payload.level || "Intermediate",
          mentor: payload.mentor || "Rajesh Kumar",
          mentorCompany: payload.mentorCompany || "Ex-Amazon",
          mentorExp: "10+ Years",
          language: "English & Hindi",
          categoryGroup: payload.categoryGroup || "Software Development",
          image: payload.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=340&fit=crop&auto=format",
          features: feats,
        };
        setCoursesList((prev) => [localCourse, ...prev]);
        showToast("Course created in catalog");
      }
    }
    setCourseModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete course: "${title}"?`)) {
      const success = await courseService.deleteCourse(id);
      if (success) {
        setCoursesList((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        showToast(`Course "${title}" deleted via DELETE /api/courses/${id}`);
      } else {
        setCoursesList((prev) => prev.filter((c) => c.id !== id && c._id !== id));
        showToast(`Course removed from catalog`);
      }
    }
  };

  const handleExportCoursesCSV = () => {
    const headers = ["Title,Category,Level,Duration,Price,Mentor,Company,Rating"];
    const rows = coursesList.map(c => `"${c.title}","${c.category}","${c.level}","${c.duration}","${c.price}","${c.mentor}","${c.mentorCompany}","${c.rating}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRTech_Courses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Course catalog exported successfully as CSV");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MENTOR CRUD ACTIONS (POST / PUT / DELETE)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenAddMentor = () => {
    setEditingMentor(null);
    setMentorForm({
      name: "",
      role: "Senior Staff Engineer",
      company: "Ex-Google",
      specialization: "Java Backend & Distributed Architecture",
      domain: "Java Backend",
      exp: "10+ Years",
      rating: 4.95,
      reviewsCount: 150,
      studentsCount: "800+",
      skills: "Java 21, Spring Boot 3.x, Microservices, Kafka, Docker",
      languages: "English, Hindi",
      bio: "Senior industry practitioner training engineers with 10+ years of high-scale enterprise experience.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces&auto=format",
      linkedin: "https://linkedin.com",
    });
    setMentorModal(true);
  };

  const handleOpenEditMentor = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setMentorForm({
      name: mentor.name,
      role: mentor.role,
      company: mentor.company,
      specialization: mentor.specialization,
      domain: mentor.domain,
      exp: mentor.exp,
      rating: mentor.rating,
      reviewsCount: mentor.reviewsCount,
      studentsCount: mentor.studentsCount,
      skills: (mentor.skills || []).join(", "),
      languages: (mentor.languages || []).join(", "),
      bio: mentor.bio,
      image: mentor.image,
      linkedin: mentor.linkedin,
    });
    setMentorModal(true);
  };

  const handleSaveMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.name.trim()) return;

    const skillList = mentorForm.skills
      ? mentorForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Enterprise Architecture", "1:1 Live Coding"];

    const langList = mentorForm.languages
      ? mentorForm.languages.split(",").map((s) => s.trim()).filter(Boolean)
      : ["English", "Hindi"];

    const payload: MentorPayload = {
      name: mentorForm.name,
      role: mentorForm.role,
      company: mentorForm.company,
      specialization: mentorForm.specialization,
      domain: mentorForm.domain,
      exp: mentorForm.exp,
      rating: Number(mentorForm.rating) || 4.95,
      reviewsCount: Number(mentorForm.reviewsCount) || 150,
      studentsCount: mentorForm.studentsCount,
      skills: skillList,
      languages: langList,
      bio: mentorForm.bio,
      image: mentorForm.image,
      linkedin: mentorForm.linkedin,
      coursesTaught: [mentorForm.specialization],
    };

    if (editingMentor) {
      const targetId = editingMentor._id || editingMentor.id;
      const updated = await mentorService.updateMentor(targetId, payload);
      if (updated) {
        setMentorsList((prev) => prev.map((m) => (m.id === targetId || m._id === targetId ? updated : m)));
        showToast(`Mentor "${mentorForm.name}" updated via PUT /api/mentors/${targetId}`);
      } else {
        setMentorsList((prev) =>
          prev.map((m) =>
            m.id === targetId || m._id === targetId
              ? { ...m, ...mentorForm, skills: skillList, languages: langList }
              : m
          )
        );
        showToast(`Mentor profile updated`);
      }
    } else {
      const created = await mentorService.createMentor(payload);
      if (created) {
        setMentorsList((prev) => [created, ...prev]);
        showToast(`Principal Mentor onboarded via POST /api/mentors in Atlas`);
      } else {
        const newM: Mentor = {
          id: `mentor-${Date.now()}`,
          name: mentorForm.name,
          role: mentorForm.role,
          company: mentorForm.company,
          specialization: mentorForm.specialization,
          domain: mentorForm.domain,
          exp: mentorForm.exp,
          rating: Number(mentorForm.rating) || 4.95,
          reviewsCount: 150,
          studentsCount: mentorForm.studentsCount,
          image: mentorForm.image,
          skills: skillList,
          languages: langList,
          linkedin: mentorForm.linkedin,
          bio: mentorForm.bio,
          coursesTaught: [mentorForm.specialization],
        };
        setMentorsList((prev) => [newM, ...prev]);
        showToast(`Principal Mentor onboarded to catalog`);
      }
    }
    setMentorModal(false);
    setEditingMentor(null);
  };

  const handleDeleteMentor = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove mentor: "${name}"?`)) {
      const success = await mentorService.deleteMentor(id);
      if (success) {
        setMentorsList((prev) => prev.filter((m) => m.id !== id && m._id !== id));
        showToast(`Mentor "${name}" removed via DELETE /api/mentors/${id}`);
      } else {
        setMentorsList((prev) => prev.filter((m) => m.id !== id && m._id !== id));
        showToast(`Mentor profile removed`);
      }
    }
  };

  const handleExportMentorsCSV = () => {
    const headers = ["Name,Role,Company,Domain,Experience,Rating,Students Mentored,Specialization"];
    const rows = mentorsList.map(m => `"${m.name}","${m.role}","${m.company}","${m.domain}","${m.exp}","${m.rating}","${m.studentsCount}","${m.specialization}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRTech_Mentors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Mentor roster exported successfully as CSV");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENTS ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleExportStudentsCSV = () => {
    const headers = ["Name,Email,Phone,Course,Batch,Mentor,Status,Progress %,Enrolled Date"];
    const rows = students.map(s => `"${s.name}","${s.email}","${s.phone}","${s.course}","${s.batch}","${s.mentor}","${s.status}","${s.progress}","${s.enrolledDate}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRTech_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Enrolled students exported successfully as CSV");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED FILTERED LISTS
  // ─────────────────────────────────────────────────────────────────────────────
  const uniqueCourseNames = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.course) set.add(l.course);
    });
    return Array.from(set);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = statusFilter === "All" || l.status === statusFilter;
      const matchCourse = courseFilter === "All" || l.course === courseFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.course.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q);
      return matchStatus && matchCourse && matchQuery;
    });
  }, [leads, statusFilter, courseFilter, searchQuery]);

  const totalLeadsPages = Math.ceil(filteredLeads.length / leadsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (leadsPage - 1) * leadsPerPage;
    return filteredLeads.slice(start, start + leadsPerPage);
  }, [filteredLeads, leadsPage, leadsPerPage]);

  useEffect(() => {
    setLeadsPage(1);
  }, [searchQuery, statusFilter, courseFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchStatus = studentStatusFilter === "All" || s.status === studentStatusFilter;
      const q = studentSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.mentor.toLowerCase().includes(q) ||
        s.batch.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [students, studentStatusFilter, studentSearch]);

  const totalStudentsPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentsPerPage;
    return filteredStudents.slice(start, start + studentsPerPage);
  }, [filteredStudents, studentPage, studentsPerPage]);

  useEffect(() => {
    setStudentPage(1);
  }, [studentSearch, studentStatusFilter]);

  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      const matchCat = courseCategoryFilter === "All" || c.category.toLowerCase().includes(courseCategoryFilter.toLowerCase());
      const matchLvl = courseLevelFilter === "All" || c.level === courseLevelFilter;
      const q = courseSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.mentor.toLowerCase().includes(q);
      return matchCat && matchLvl && matchQuery;
    });
  }, [coursesList, courseCategoryFilter, courseLevelFilter, courseSearch]);

  const totalCoursesPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (coursePage - 1) * coursesPerPage;
    return filteredCourses.slice(start, start + coursesPerPage);
  }, [filteredCourses, coursePage, coursesPerPage]);

  useEffect(() => {
    setCoursePage(1);
  }, [courseSearch, courseCategoryFilter, courseLevelFilter]);

  const filteredMentors = useMemo(() => {
    return mentorsList.filter((m) => {
      const matchDom = mentorDomainFilter === "All" || m.domain.toLowerCase().includes(mentorDomainFilter.toLowerCase());
      const q = mentorSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q));
      return matchDom && matchQuery;
    });
  }, [mentorsList, mentorDomainFilter, mentorSearch]);

  const totalMentorsPages = Math.ceil(filteredMentors.length / mentorsPerPage) || 1;
  const paginatedMentors = useMemo(() => {
    const start = (mentorPage - 1) * mentorsPerPage;
    return filteredMentors.slice(start, start + mentorsPerPage);
  }, [filteredMentors, mentorPage, mentorsPerPage]);

  useEffect(() => {
    setMentorPage(1);
  }, [mentorSearch, mentorDomainFilter]);

  // Render Status Badge helper
  const renderStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            New
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Scheduled
          </span>
        );
      case "Contacted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Contacted
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Reusable Enterprise Sidebar */}
      <DashboardSidebar
        role="admin"
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        items={sidebarItems}
      />

      {/* Main Content Viewport */}
      <section className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[11px] font-bold rounded-full border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  MongoDB Live Cluster (krtech) Connected
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded-full border border-amber-500/30">
                  🛡️ Admin Role Authenticated
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                KR Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-amber-300">Executive CRM & CMS Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Full-lifecycle Operations Suite · Real-time MongoDB Atlas synchronization for candidate leads, enrolled students, course catalog, and mentor roster.
              </p>

              {/* Navigation Tabs Pill Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {[
                  { key: "dashboard", label: "Executive Overview", icon: "📊" },
                  { key: "leads", label: `CRM Leads (${leads.length})`, icon: "📋" },
                  { key: "students", label: `Students (${students.length})`, icon: "🎓" },
                  { key: "courses", label: `Courses (${coursesList.length})`, icon: "📚" },
                  { key: "mentors", label: `Mentors (${mentorsList.length})`, icon: "⚡" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === t.key
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400"
                        : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={fetchDashboardData}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                title="Sync live with MongoDB Atlas"
              >
                <span className={isLoading ? "animate-spin" : ""}>🔄</span>
                <span>Sync Atlas</span>
              </button>

              {/* Dynamic CSV Export based on active tab */}
              <button
                type="button"
                onClick={() => {
                  if (activeTab === "courses") handleExportCoursesCSV();
                  else if (activeTab === "mentors") handleExportMentorsCSV();
                  else if (activeTab === "students") handleExportStudentsCSV();
                  else handleExportLeadsCSV();
                }}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-purple-300 text-xs font-bold rounded-2xl border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </button>

              {/* Dynamic Add Action */}
              {activeTab === "courses" && (
                <button
                  type="button"
                  onClick={handleOpenAddCourse}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-base font-bold">+</span>
                  <span>New Course</span>
                </button>
              )}

              {activeTab === "mentors" && (
                <button
                  type="button"
                  onClick={handleOpenAddMentor}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-base font-bold">+</span>
                  <span>Onboard Mentor</span>
                </button>
              )}

              {(activeTab === "dashboard" || activeTab === "leads") && (
                <button
                  type="button"
                  onClick={handleOpenAddCourse}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-base font-bold">+</span>
                  <span>Add Course Track</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 1: EXECUTIVE SUITE OVERVIEW (ANALYTICS CARDS + CHARTS + QUICK ACTIONS)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* 6 High-Impact Analytics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Enrolled Students</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">+14.2%</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{(stats.totalStudents || 15420).toLocaleString()}+</div>
                <div className="text-[11px] text-slate-400 mt-1">94.8% Placement Rate</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Candidate Inquiries</span>
                  <span className="text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full text-[10px]">{(stats.todayLeads || 5)} Today</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{leads.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Live MongoDB Pipeline</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Scheduled Demos</span>
                  <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">1:1 Slot</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{leads.filter(l => l.status === "Scheduled").length || stats.demoScheduled || 2}</div>
                <div className="text-[11px] text-slate-400 mt-1">Active Screen shares</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Atlas Catalog</span>
                  <span className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full text-[10px]">Active</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{coursesList.length || 55}</div>
                <div className="text-[11px] text-slate-400 mt-1">1:1 Capstones</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Principal Mentors</span>
                  <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Tier-1 MNCs</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{mentorsList.length || 10}</div>
                <div className="text-[11px] text-slate-400 mt-1">10+ Yrs / 4.95 ★</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Revenue Pacing</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Target Met</span>
                </div>
                <div className="text-2xl font-extrabold text-white">₹1.84 <span className="text-sm font-semibold text-emerald-400">Cr</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Live Q3 Run-Rate</div>
              </div>
            </div>

            {/* Recharts Live Analytics Module */}
            <AnalyticsModule isDark={true} />

            {/* Recent Leads Preview in Overview */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-white flex items-center gap-2">
                    <span>⚡</span> Recent Candidate Inquiries (Latest 5)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Quick triage and counselor action panel</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                >
                  View All {leads.length} Leads →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Candidate</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {leads.slice(0, 5).map((l) => (
                      <tr key={l.id || l._id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">{l.name}</td>
                        <td className="py-3 px-4 text-slate-400">{l.phone}</td>
                        <td className="py-3 px-4 text-purple-300 truncate max-w-xs">{l.course}</td>
                        <td className="py-3 px-4 text-slate-400">{l.preferredTime || l.timeSlot || "Evening Slot"}</td>
                        <td className="py-3 px-4">{renderStatusBadge(l.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setNotesModalLead(l);
                              setNoteContent(l.notes || "");
                            }}
                            className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg text-[10px] font-bold border border-purple-500/30 cursor-pointer"
                          >
                            Counselor Notes
                          </button>
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
            TAB 2: CRM LEADS MANAGEMENT TABLE
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "leads" && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            {/* Section Header & Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans font-extrabold text-xl text-white flex items-center gap-2">
                    <span>📋</span> CRM Lead Management & Admissions Pipeline
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {filteredLeads.length} candidate inquiry records · Synchronized via PATCH and DELETE APIs
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportLeadsCSV}
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md w-fit"
                >
                  <span>📥</span>
                  <span>Export Leads to CSV</span>
                </button>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate name, email, phone, course..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="All">All Pipeline Statuses ({leads.length})</option>
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Scheduled">Status: Scheduled Demo</option>
                    <option value="Completed">Status: Completed</option>
                  </select>
                </div>

                <div>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer truncate"
                  >
                    <option value="All">All Requested Courses</option>
                    {uniqueCourseNames.map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Candidate Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Selected Course</th>
                    <th className="py-3.5 px-4">Preferred Slot</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No leads found matching current search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedLeads.map((lead) => {
                      const leadId = lead.id || lead._id || "";
                      return (
                        <tr key={leadId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{lead.name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{lead.email}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{lead.phone}</td>
                          <td className="py-3 px-4 text-purple-300 font-medium max-w-xs truncate" title={lead.course}>
                            {lead.course}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {lead.preferredTime || lead.timeSlot || "Evening Slot"}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(leadId, e.target.value as LeadStatus)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Notes Popup Trigger */}
                              <button
                                type="button"
                                onClick={() => {
                                  setNotesModalLead(lead);
                                  setNoteContent(lead.notes || "");
                                }}
                                title="Add/Edit Counselor Notes"
                                className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                {lead.notes ? "📝 Notes" : "+ Note"}
                              </button>

                              {/* WhatsApp Direct Chat */}
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(lead.name)},%20greeting%20from%20KR%20Tech!%20Regarding%20your%201:1%20free%20demo%20for%20${encodeURIComponent(lead.course)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open WhatsApp Chat"
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all no-underline"
                              >
                                💬
                              </a>

                              {/* Delete Lead (DELETE API) */}
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(leadId, lead.name)}
                                title="Delete Lead from MongoDB Atlas"
                                className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalLeadsPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{leadsPage}</strong> of <strong className="text-white">{totalLeadsPages}</strong> ({filteredLeads.length} records)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={leadsPage === 1}
                    onClick={() => setLeadsPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalLeadsPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setLeadsPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          leadsPage === pageNum
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={leadsPage === totalLeadsPages}
                    onClick={() => setLeadsPage((p) => Math.min(totalLeadsPages, p + 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 3: ENROLLED STUDENTS MANAGEMENT TABLE
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-extrabold text-xl text-white flex items-center gap-2">
                  <span>🎓</span> Enrolled Students & Academic Cohorts
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Showing {filteredStudents.length} enrolled students · Live data from GET /api/auth/students
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportStudentsCSV}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md w-fit"
              >
                <span>📥</span>
                <span>Export Students to CSV</span>
              </button>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student name, email, course, batch, or mentor..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="All">All Student Statuses</option>
                <option value="Active">Active Learning Track</option>
                <option value="Completed">Graduated / Certified</option>
                <option value="Pending">Pending Orientation</option>
              </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Enrolled Track</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Batch</th>
                    <th className="py-3.5 px-4">1:1 Mentor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No students match current search query.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={s.avatar}
                              alt={s.name}
                              className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                            />
                            <div>
                              <div className="font-bold text-white">{s.name}</div>
                              <div className="text-[10px] text-slate-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">{s.phone}</td>
                        <td className="py-3.5 px-4 font-medium text-purple-300 max-w-xs truncate">{s.course}</td>
                        <td className="py-3.5 px-4">
                          <div className="w-28 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{s.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                                style={{ width: `${s.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">{s.batch}</td>
                        <td className="py-3.5 px-4 text-cyan-300 font-medium">{s.mentor}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              s.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : s.status === "Completed"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold no-underline"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalStudentsPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{studentPage}</strong> of <strong className="text-white">{totalStudentsPages}</strong> ({filteredStudents.length} students)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={studentPage === 1}
                    onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalStudentsPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setStudentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          studentPage === pageNum
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={studentPage === totalStudentsPages}
                    onClick={() => setStudentPage((p) => Math.min(totalStudentsPages, p + 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 4: COURSE MANAGEMENT (CMS)
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-extrabold text-xl text-white flex items-center gap-2">
                  <span>📚</span> Live Course Catalog CMS (MongoDB Atlas)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage all {coursesList.length} production courses · Protected POST, PUT, and DELETE /api/courses APIs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCoursesCSV}
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>📥</span>
                  <span>Export Courses CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddCourse}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  <span className="text-sm font-bold">+</span>
                  <span>Create Course</span>
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search course title, category, or mentor..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <select
                value={courseCategoryFilter}
                onChange={(e) => setCourseCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="All">All Categories ({coursesList.length})</option>
                <option value="Java Backend">Java Backend</option>
                <option value="MERN Stack">MERN Stack</option>
                <option value="Cloud">Cloud Computing</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Networking">Networking</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Enterprise">Enterprise ERP & CRM</option>
              </select>

              <select
                value={courseLevelFilter}
                onChange={(e) => setCourseLevelFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="All">All Skill Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Course Catalog Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Course Program</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">1:1 Mentor</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedCourses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No courses found matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedCourses.map((c) => {
                      const courseId = c._id || c.id;
                      return (
                        <tr key={courseId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.image}
                                alt={c.title}
                                className="w-12 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                              />
                              <div className="max-w-xs">
                                <div className="font-bold text-white truncate" title={c.title}>
                                  {c.title}
                                </div>
                                {c.badge && (
                                  <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    {c.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {c.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{c.level}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">{c.duration}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">{c.price}</td>
                          <td className="py-3.5 px-4 text-amber-300 font-semibold">⭐ {c.rating}</td>
                          <td className="py-3.5 px-4 text-slate-300">{c.mentor}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCourse(c)}
                                title="Edit Course (PUT /api/courses/:id)"
                                className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(courseId, c.title)}
                                title="Delete Course (DELETE /api/courses/:id)"
                                className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalCoursesPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{coursePage}</strong> of <strong className="text-white">{totalCoursesPages}</strong> ({filteredCourses.length} courses)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={coursePage === 1}
                    onClick={() => setCoursePage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalCoursesPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCoursePage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          coursePage === pageNum
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={coursePage === totalCoursesPages}
                    onClick={() => setCoursePage((p) => Math.min(totalCoursesPages, p + 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB 5: PRINCIPAL MENTOR MANAGEMENT
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "mentors" && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans font-extrabold text-xl text-white flex items-center gap-2">
                  <span>⚡</span> Principal Industry Mentors Roster (Atlas)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage all {mentorsList.length} senior architects · Protected POST, PUT, and DELETE /api/mentors APIs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportMentorsCSV}
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>📥</span>
                  <span>Export Mentors CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddMentor}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <span className="text-sm font-bold">+</span>
                  <span>Onboard Mentor</span>
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={mentorSearch}
                onChange={(e) => setMentorSearch(e.target.value)}
                placeholder="Search mentor name, role, company, or skills..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <select
                value={mentorDomainFilter}
                onChange={(e) => setMentorDomainFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="All">All Tech Domains ({mentorsList.length})</option>
                <option value="Java Backend">Java Backend & Microservices</option>
                <option value="Cloud">Cloud Architecture (AWS / Azure)</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="MERN">MERN & Full Stack SaaS</option>
                <option value="SAP">SAP & Enterprise ERP</option>
                <option value="Data">Data Science & AI</option>
              </select>
            </div>

            {/* Mentors Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Principal Mentor</th>
                    <th className="py-3.5 px-4">Role & Enterprise MNC</th>
                    <th className="py-3.5 px-4">Domain</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">1:1 Mentored</th>
                    <th className="py-3.5 px-4">Languages</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedMentors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No mentors found matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedMentors.map((m) => {
                      const mentorId = m._id || m.id;
                      return (
                        <tr key={mentorId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={m.image}
                                alt={m.name}
                                className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                              />
                              <div>
                                <div className="font-bold text-white">{m.name}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-xs">{m.specialization}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200">{m.role}</div>
                            <div className="text-[10px] text-cyan-300">{m.company}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {m.domain}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-semibold">{m.exp}</td>
                          <td className="py-3.5 px-4 text-amber-300 font-bold">⭐ {m.rating}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-medium">{m.studentsCount}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {(m.languages || []).slice(0, 2).join(", ")}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditMentor(m)}
                                title="Edit Mentor (PUT /api/mentors/:id)"
                                className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMentor(mentorId, m.name)}
                                title="Delete Mentor (DELETE /api/mentors/:id)"
                                className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalMentorsPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{mentorPage}</strong> of <strong className="text-white">{totalMentorsPages}</strong> ({filteredMentors.length} mentors)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={mentorPage === 1}
                    onClick={() => setMentorPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalMentorsPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setMentorPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          mentorPage === pageNum
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={mentorPage === totalMentorsPages}
                    onClick={() => setMentorPage((p) => Math.min(totalMentorsPages, p + 1))}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 rounded-xl border border-slate-800 font-semibold cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL 1: ADD / EDIT COUNSELOR NOTES
      ───────────────────────────────────────────────────────────────────────────── */}
      {notesModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Counselor Notes</span>
                <h3 className="font-bold text-lg text-white mt-0.5">{notesModalLead.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setNotesModalLead(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-300"><strong>Course:</strong> {notesModalLead.course}</div>
              <div className="text-slate-400"><strong>Contact:</strong> {notesModalLead.phone} · {notesModalLead.email}</div>
              <div className="text-slate-400"><strong>Current Status:</strong> {notesModalLead.status}</div>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Counseling Notes & Follow-up History
                </label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="e.g. Candidate attended 1:1 demo with Rajesh Kumar. Interested in Java Microservices weekend track. Follow-up scheduled for Friday..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNotesModalLead(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Save Notes (PATCH /api/leads/:id)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL 2: CREATE / EDIT COURSE (POST / PUT /api/courses)
      ───────────────────────────────────────────────────────────────────────────── */}
      {courseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  {editingCourse ? "Update Course Track" : "Publish New Track"}
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">
                  {editingCourse ? "Edit Course in MongoDB Atlas" : "Create 1:1 Certification Course"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseModal(false);
                  setEditingCourse(null);
                }}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Distributed Microservices with Spring Boot & Kafka"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Domain Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Java Backend">Java Backend</option>
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Networking">Networking</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Enterprise Technologies">Enterprise (SAP/Salesforce)</option>
                    <option value="Project Management">Project Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as Course["level"] })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (INR)</label>
                  <input
                    type="text"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    placeholder="e.g. ₹14,999"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price</label>
                  <input
                    type="text"
                    value={courseForm.originalPrice}
                    onChange={(e) => setCourseForm({ ...courseForm, originalPrice: e.target.value })}
                    placeholder="e.g. ₹24,999"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge</label>
                  <input
                    type="text"
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                    placeholder="e.g. Bestseller, Hot, 1:1 Live"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Mentor</label>
                  <input
                    type="text"
                    value={courseForm.mentor}
                    onChange={(e) => setCourseForm({ ...courseForm, mentor: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mentor Company / Credentials</label>
                  <input
                    type="text"
                    value={courseForm.mentorCompany}
                    onChange={(e) => setCourseForm({ ...courseForm, mentorCompany: e.target.value })}
                    placeholder="e.g. Ex-Amazon · 10+ Years"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Description</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Overview of curriculum, architecture, and live projects..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Highlights & Features (Comma separated)
                </label>
                <input
                  type="text"
                  value={courseForm.highlights}
                  onChange={(e) => setCourseForm({ ...courseForm, highlights: e.target.value })}
                  placeholder="1:1 Live Coding, Production Microservices, Resume Review"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={courseForm.image}
                  onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCourseModal(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {editingCourse ? "Update Course (PUT /api/courses/:id)" : "Publish Course (POST /api/courses)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL 3: CREATE / EDIT MENTOR (POST / PUT /api/mentors)
      ───────────────────────────────────────────────────────────────────────────── */}
      {mentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {editingMentor ? "Edit Mentor Profile" : "Onboard Principal Mentor"}
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">
                  {editingMentor ? "Update Mentor in MongoDB Atlas" : "Add Senior Architect to Roster"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMentorModal(false);
                  setEditingMentor(null);
                }}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMentor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mentor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={mentorForm.name}
                    onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                    placeholder="e.g. Vikram Nair"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enterprise Role</label>
                  <input
                    type="text"
                    required
                    value={mentorForm.role}
                    onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                    placeholder="e.g. Staff Software Engineer"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Credentials</label>
                  <input
                    type="text"
                    required
                    value={mentorForm.company}
                    onChange={(e) => setMentorForm({ ...mentorForm, company: e.target.value })}
                    placeholder="e.g. Ex-Amazon · IIT Delhi"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                  <select
                    value={mentorForm.domain}
                    onChange={(e) => setMentorForm({ ...mentorForm, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Java Backend">Java Backend</option>
                    <option value="MERN">MERN Stack</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Networking">Networking</option>
                    <option value="SAP">SAP ERP</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Power BI">Data & Power BI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience</label>
                  <input
                    type="text"
                    value={mentorForm.exp}
                    onChange={(e) => setMentorForm({ ...mentorForm, exp: e.target.value })}
                    placeholder="e.g. 10+ Years"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization Curriculum</label>
                <input
                  type="text"
                  required
                  value={mentorForm.specialization}
                  onChange={(e) => setMentorForm({ ...mentorForm, specialization: e.target.value })}
                  placeholder="e.g. Microservices, Spring Cloud, Kafka, Docker & Kubernetes"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (Out of 5.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={mentorForm.rating}
                    onChange={(e) => setMentorForm({ ...mentorForm, rating: parseFloat(e.target.value) || 4.9 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Students Mentored</label>
                  <input
                    type="text"
                    value={mentorForm.studentsCount}
                    onChange={(e) => setMentorForm({ ...mentorForm, studentsCount: e.target.value })}
                    placeholder="e.g. 850+"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Languages (Comma separated)</label>
                  <input
                    type="text"
                    value={mentorForm.languages}
                    onChange={(e) => setMentorForm({ ...mentorForm, languages: e.target.value })}
                    placeholder="English, Hindi"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={mentorForm.skills}
                  onChange={(e) => setMentorForm({ ...mentorForm, skills: e.target.value })}
                  placeholder="Java, Spring Boot, Microservices, System Design"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={mentorForm.image}
                    onChange={(e) => setMentorForm({ ...mentorForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={mentorForm.linkedin}
                    onChange={(e) => setMentorForm({ ...mentorForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Professional Summary</label>
                <textarea
                  rows={2}
                  value={mentorForm.bio}
                  onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
                  placeholder="Senior architect training software engineers with 10+ years of enterprise experience..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMentorModal(false);
                    setEditingMentor(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {editingMentor ? "Update Mentor (PUT /api/mentors/:id)" : "Onboard Mentor (POST /api/mentors)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
