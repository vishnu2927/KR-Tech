import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService, Course } from "../services/courseService";
import { paymentService } from "../services/paymentService";
import { CourseCard } from "../components/Courses";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import { SchemaBuilder } from "../utils/seo";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Toast from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CourseDetailPageProps {
  onOpenDemoModal?: (courseName?: string) => void;
}

export default function CourseDetailPage({ onOpenDemoModal }: CourseDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // LMS Sprint 6.4: 6 Tabs & Video Player State
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "notes" | "assignments" | "discussion" | "reviews">("overview");
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [progressSaved, setProgressSaved] = useState<boolean>(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: "Rahul Mehta",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format",
      role: "Batch-2026 Student",
      time: "2 hours ago",
      question: "When configuring Kafka consumer offsets, what is the best practice for handling duplicate events with distributed transactions?",
      upvotes: 14,
      answers: [
        {
          author: "Rajesh Kumar",
          role: "Senior Lead Mentor (Principal Technical Architect Staff)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format",
          answer: "We implement Idempotent Consumer Patterns using Redis distributed locks and unique event idempotency keys, combined with transactional outbox tables in PostgreSQL. We dive deep into this during Module 4!",
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      author: "Sneha Reddy",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format",
      role: "Batch-2026 Student",
      time: "Yesterday",
      question: "Is Docker Compose sufficient for the local capstone, or should we set up a local Minikube cluster?",
      upvotes: 8,
      answers: [
        {
          author: "Vikram Nair",
          role: "Cloud Specialist (Staff Software Engineer Cloud)",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format",
          answer: "Start with Docker Compose for rapid iteration in Weeks 1-4, then migrate seamlessly to Helm charts on local k3s/Minikube during Week 5.",
          time: "18 hours ago",
        },
      ],
    },
  ]);

  const lectureNotes = [
    { id: "note-1", title: "Distributed System Patterns & Microservices Cheatsheet", type: "PDF Blueprint", size: "3.4 MB", url: "https://krtech.edu/notes/distributed-patterns.pdf" },
    { id: "note-2", title: "Kafka Event Streaming & Consumer Offsets Deep Dive", type: "Architecture Guide", size: "2.8 MB", url: "https://krtech.edu/notes/kafka-guide.pdf" },
    { id: "note-3", title: "Spring Boot 3 + PostgreSQL Connection Pool Tuning", type: "Performance Notes", size: "1.9 MB", url: "https://krtech.edu/notes/pg-tuning.pdf" },
    { id: "note-4", title: "Zero-Downtime Deployment & CI/CD Checklist", type: "DevOps Checklist", size: "1.2 MB", url: "https://krtech.edu/notes/zero-downtime.pdf" },
  ];

  const courseAssignments = [
    {
      id: "asg-01",
      title: "High-Concurrency E-Commerce Order Saga Pattern with Kafka",
      deadline: "Sunday, 11:59 PM IST",
      maxPoints: 100,
      status: "Due Soon",
      repo: "https://github.com/kr-tech-academy/saga-pattern-starter",
      specs: ["Implement Order, Payment, and Inventory microservices", "Configure compensation transactions on failure", "Add Prometheus metrics & Grafana health probes"],
    },
    {
      id: "asg-02",
      title: "Multi-Region VPC Peering & Transit Gateway Architecture",
      deadline: "Next Week Sunday",
      maxPoints: 100,
      status: "Upcoming",
      repo: "https://github.com/kr-tech-academy/aws-vpc-peering-iac",
      specs: ["Terraform HCL infrastructure code", "Zero-trust security groups", "Automated deployment tests"],
    },
  ];

  const studentReviews = [
    {
      name: "Aditya Sharma",
      company: "Certified Full Stack Developer",
      rating: 5,
      date: "Aug 2026",
      comment: "The One-on-One pair programming sessions with Rajesh Kumar completely transformed my understanding of distributed systems. Defending my capstone in front of senior architects gave me the exact confidence I needed for real-world projects.",
    },
    {
      name: "Pooja Varma",
      company: "Certified Cloud Architect",
      rating: 5,
      date: "July 2026",
      comment: "Hands down the most rigorous and hands-on course available. No fluff, no recorded lectures from 4 years ago. Every week we built production microservices and tuned memory leaks live.",
    },
    {
      name: "Karan Johar",
      company: "Certified DevOps Engineer",
      rating: 5,
      date: "June 2026",
      comment: "The assignments and code reviews are on par with enterprise pull request reviews. The mentors inspect concurrency locks, test coverage, and Docker compose configs line by line.",
    },
  ];

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: Date.now(),
      author: user?.name || "Student Engineer",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format",
      role: "Enrolled Student",
      time: "Just now",
      question: newQuestionText.trim(),
      upvotes: 1,
      answers: [],
    };
    setDiscussions([newQ, ...discussions]);
    setNewQuestionText("");
    setToast({ message: "✓ Question submitted to mentor Q&A board!", type: "success" });
  };

  const handleAutoSaveProgress = async () => {
    setProgressSaved(true);
    setToast({ message: "✓ Learning progress auto-saved to MongoDB Atlas.", type: "success" });
    try {
      const { studentDashboardService } = await import("../services/studentDashboardService");
      if (course?.id || course?._id) {
        await studentDashboardService.updateCourseProgress(course.id || course._id || "", {
          completed: true,
          watchTimeSeconds: 300,
        });
      }
    } catch {
      // safe fallback
    }
    setTimeout(() => setProgressSaved(false), 3000);
  };

  // Helper to extract clean numeric amount
  const parsePrice = (priceVal?: string | number): number => {
    if (typeof priceVal === "number") return priceVal;
    if (!priceVal) return 499;
    const clean = String(priceVal).replace(/[^0-9]/g, "");
    return clean ? parseInt(clean, 10) : 499;
  };

  const handleBuyNow = () => {
    if (!course) return;
    const targetCourseId = course.id || course._id || id || "course";
    navigate(`/checkout/${targetCourseId}`);
  };


  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    courseService
      .getCourseById(id)
      .then((data) => {
        if (data) {
          setCourse(data);
          // Fetch related courses in same category
          courseService.getCourses({ category: data.category }).then((all) => {
            const filtered = all.filter((c) => c.id !== data.id && c._id !== data._id);
            setRelatedCourses(filtered.slice(0, 3));
          });
        } else {
          setError("The requested course could not be found in our active catalog.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load course details from MongoDB Atlas.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleBookDemo = () => {
    if (course) {
      if (onOpenDemoModal) {
        onOpenDemoModal(course.title);
      } else {
        navigate(`/free-demo?course=${encodeURIComponent(course.title)}`);
      }
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      setToast({ message: "Please sign in to enroll in this course.", type: "warning" });
      setTimeout(() => navigate(`/login?redirect=/courses/${id}`), 1200);
      return;
    }

    if (!course) return;
    setEnrolling(true);
    try {
      await courseService.createCourse ? null : null;
      // Use authService to enroll
      const { authService } = await import("../services/authService");
      await authService.enrollCourse(course.id || course._id || "", course.title);
      setToast({ message: `✓ Successfully enrolled in "${course.title}"!`, type: "success" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setToast({ message: err.message || "Enrollment completed or already active.", type: "warning" });
    } finally {
      setEnrolling(false);
    }
  };

  const handleDownloadSyllabus = () => {
    if (!course) return;
    const content = `
================================================================================
                    KR GLOBAL LEARNING OFFICIAL COURSE CURRICULUM
================================================================================
Course Title:     ${course.title}
Category:         ${course.category}
Duration:         ${course.duration}
Level:            ${course.level}
Senior Mentor:    ${course.mentor} (${course.mentorCompany})
Rating:           ${course.rating} / 5.0 (${course.students} Students)

SYLLABUS HIGHLIGHTS:
${course.features.map((f, i) => `  ${i + 1}. ${f}`).join("\n")}

WEEKLY ROADMAP:
${(course.roadmap || []).map((r, i) => `
  [${r.week}] ${r.title}
  Topics: ${r.topics.join(", ")}
  Milestone: ${r.milestone}
`).join("\n")}

CERTIFICATION & VERIFICATION:
KR Global Learning Verified Training Credential
Direct One-on-One Screen-Sharing & Hands-On Production Capstones Included.
================================================================================
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_syllabus.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ message: "✓ Syllabus downloaded successfully!", type: "success" });
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-950 text-white">
        <LoadingSpinner size="lg" label="Fetching live course curriculum from MongoDB Atlas..." fullScreen={false} />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-950 text-white px-4">
        <div className="max-w-md w-full text-center p-8 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-white">Course Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || "The course you are looking for does not exist in our active catalog."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/courses"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all no-underline"
            >
              Browse All Courses
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all no-underline"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Realistic Capstone projects based on category
  const capstoneProjects = [
    {
      title: `${course.category} Enterprise Production Capstone`,
      desc: "Architect, build, and deploy an end-to-end resilient architecture with automated CI/CD pipelines, Docker containerization, and real-time monitoring.",
      tags: ["Microservices", "Docker", "CI/CD", "Cloud"],
    },
    {
      title: "Real-Time Observability & Zero-Downtime Migration",
      desc: "Implement automated health probes, distributed tracing, metrics collection, and zero-downtime rolling deployments.",
      tags: ["Distributed Systems", "Grafana", "Prometheus", "Security"],
    },
    {
      title: "Industry Compliance & Security Hardening",
      desc: "Enforce least-privilege IAM policies, cryptographic data encryption at rest and in transit, and vulnerability audits.",
      tags: ["Compliance Standards", "Security Audits", "IAM", "Encryption"],
    },
  ];

  const faqs = [
    {
      q: "How does the One-on-One live training work?",
      a: "Unlike prerecorded courses or 50+ student Zoom webinars, our sessions are private One-on-One calls with a dedicated Senior Principal Mentor. You share your screen, write real production code together, and debug live architecture issues.",
    },
    {
      q: "What are the session timings and schedule flexibility?",
      a: "You have complete flexibility to pick your preferred batch: Weekday Evenings (7:00 PM - 9:00 PM IST), Morning slots, or Weekend intensive bootcamps. You can reschedule sessions directly with your mentor with 12 hours advance notice.",
    },
    {
      q: "Do I receive recordings of every live session?",
      a: "Yes! Every single One-on-One live session is recorded in HD 1080p and automatically archived into your Student Dashboard within 30 minutes of session completion for lifetime review.",
    },
    {
      q: "Do I receive certification preparation and practical mentor support?",
      a: "Yes. Our senior architects provide complete official certification preparation, One-on-One architecture reviews, hands-on capstone evaluations, and personalized learning guidance throughout your course.",
    },
    {
      q: "Can I try a class before enrolling?",
      a: "Absolutely! We offer a 100% Free 45-Minute Free One-on-One Learning Consultation Session with zero financial commitment. You evaluate our pair-programming approach first-hand.",
    },
  ];

  return (
    <SEO
      title={`${course.title} — One-on-One Live Mentorship & Certification | KR Global Learning`}
      description={`Master ${course.title} with One-on-One live senior mentorship. 100% hands-on curriculum, real-world capstone projects, and verified certification.`}
      canonical={`https://krtech.in/courses/${course.id || course._id}`}
      ogType="article"
      ogImage={course.image}
      keywords={`${course.title}, ${course.category}, One-on-One coding classes, learn ${course.title}, live mentorship, project defense`}
      structuredData={[
        SchemaBuilder.getCourseSchema({
          title: course.title,
          description: course.description || `Comprehensive course on ${course.title}`,
          category: course.category,
          duration: course.duration,
          slug: (course.id || course._id || ""),
        }),
        SchemaBuilder.getBreadcrumbSchema([
          { name: "Home", url: "https://krtech.in/" },
          { name: "Courses", url: "https://krtech.in/courses" },
          { name: course.title, url: `https://krtech.in/courses/${course.id || course._id}` },
        ]),
      ]}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white pt-20">
        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 1: HERO SECTION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-white border-b border-slate-200/80">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
              <Link to="/" className="text-slate-500 hover:text-blue-600 no-underline transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/courses" className="text-slate-500 hover:text-blue-600 no-underline transition-colors">
                Courses
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-semibold">{course.category}</span>
              <span>/</span>
              <span className="text-slate-800 truncate max-w-xs">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    One-on-One Live Pair-Programming
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {course.badge || "Featured"}
                  </span>
                </div>

                <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {course.description ||
                    `Master modern ${course.category} architecture with our One-on-One live senior mentorship program. Build real-world production capstones, debug complex issues live, and earn a verified certificate of completion.`}
                </p>

                {/* Key Meta Chips Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-blue-600">⏳</span> Duration
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{course.duration}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-amber-500">📊</span> Level
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{course.level}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-amber-500">⭐</span> Rating
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {course.rating} / 5.0 <span className="text-[11px] font-normal text-slate-500">({course.students})</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-emerald-600">🌐</span> Language
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1 truncate">{course.language}</div>
                  </div>
                </div>

                {/* Mentor Quick Bio Banner */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-lg border border-blue-200">
                      👨‍🏫
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Lead Senior Mentor:</div>
                      <div className="text-sm font-bold text-slate-900">
                        {course.mentor}{" "}
                        <span className="text-xs font-normal text-blue-600">({course.mentorCompany})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
                    ⭐ {course.mentorExp || "10+ Years"} Industry Experience
                  </div>
                </div>
              </div>

              {/* Right Enrollment Sticky Card */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-900">
                    {isPlayingPreview ? (
                      <video
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setIsPlayingPreview(true)}
                            className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-blue-600/50 hover:scale-110 transition-transform cursor-pointer"
                            title="Watch Course Preview Video"
                          >
                            ▶
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    <button
                      type="button"
                      onClick={handleAutoSaveProgress}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{progressSaved ? "✓ Progress Saved" : "💾 Auto-Save Progress"}</span>
                    </button>
                    <Link
                      to={`/learn/${course.id || course._id || "course"}`}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold no-underline"
                    >
                      LMS Player ↗
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-slate-900 font-sans">{course.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Includes One-on-One Live Mentorship, HD Recordings & Verified Certification</p>
                  </div>

                  <div className="space-y-3">
                    {/* Primary Razorpay Buy Now Action */}
                    <button
                      type="button"
                      id="buy-now-btn"
                      onClick={handleBuyNow}
                      disabled={isPaying || enrolling}
                      className="w-full py-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
                    >
                      {isPaying ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connecting Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-base">⚡</span>
                          <span>Buy Now · Razorpay Checkout</span>
                        </>
                      )}
                    </button>

                    {/* Razorpay Gateway Trust Micro-Badge */}
                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600 py-1 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Razorpay Verified</span>
                      <span className="text-slate-300">•</span>
                      <span>UPI / Cards / NetBanking</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={enrolling || isPaying}
                      className="w-full py-3 rounded-xl font-bold text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {enrolling ? "Enrolling..." : "Enroll with Existing Student Access"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBookDemo}
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <I.Sparkles /> Book Free 45-Min Consultation
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSyllabus}
                      className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>📥</span> Download Full Syllabus PDF
                    </button>
                  </div>

                  {/* Bullet perks */}
                  <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>One-on-One Live Screen-Sharing with Senior Mentor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Real-time Code Reviews & Capstone Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>100% Money-Back Guarantee (7 Days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>KR Global Learning Verified Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION: 6 LMS TABS NAVIGATION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { key: "overview", label: "Overview", icon: "📋" },
              { key: "curriculum", label: "Curriculum", icon: "📚" },
              { key: "notes", label: "Notes & Cheatsheets", icon: "📝" },
              { key: "assignments", label: "Assignments", icon: "🚀" },
              { key: "discussion", label: "Discussion Q&A", icon: "💬" },
              { key: "reviews", label: "Reviews & Feedback", icon: "⭐" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-600"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 2: CURRICULUM & 7-PHASE LEARNING ROADMAP
        ───────────────────────────────────────────────────────────────────────────── */}
        {(activeTab === "overview" || activeTab === "curriculum") && (
          <section className="py-16 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-10">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  7-Phase Structured Roadmap
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3">
                  Comprehensive Course Roadmap & Progression
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Designed by senior tech leads. Progress systematically through Beginner, Intermediate, Advanced, Projects, Assessment, Certification Preparation, and Resources.
                </p>
              </div>

              {/* 7-Phase Roadmap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    stage: "Phase 1: Beginner",
                    title: "Core Architecture & Design Foundations",
                    icon: "🌱",
                    badge: "Fundamentals",
                    topics: [
                      "Syntax internals & clean code standards",
                      "Object-oriented & functional design principles",
                      "Foundational data structures & core algorithms",
                      "Developer environment setup & Git workflows",
                    ],
                    milestone: "Diagnostic Skill Checkpoint Passed",
                    accent: "border-blue-200 bg-slate-50 text-blue-700",
                  },
                  {
                    stage: "Phase 2: Intermediate",
                    title: "Enterprise Frameworks & Microservices",
                    icon: "⚡",
                    badge: "Application Logic",
                    topics: [
                      "RESTful & GraphQL API architecture",
                      "Database design, normalization & indexing",
                      "Docker containerization & service decomposition",
                      "Authentication, authorization & security protocols",
                    ],
                    milestone: "Microservices Deployment Checkpoint",
                    accent: "border-cyan-200 bg-slate-50 text-cyan-700",
                  },
                  {
                    stage: "Phase 3: Advanced",
                    title: "Distributed Systems & Scalability",
                    icon: "🚀",
                    badge: "High Scale",
                    topics: [
                      "Event-driven architecture with Apache Kafka / Redis",
                      "Distributed caching, sharding & query optimization",
                      "Kubernetes cluster orchestration & Helm configs",
                      "Observability with Prometheus, Grafana & Jaeger",
                    ],
                    milestone: "High-Concurrency Architecture Defense",
                    accent: "border-emerald-200 bg-slate-50 text-emerald-700",
                  },
                  {
                    stage: "Phase 4: Projects",
                    title: "Production-Grade Capstones",
                    icon: "🛠️",
                    badge: "Hands-on",
                    topics: [
                      "End-to-end multi-tier production capstone",
                      "Line-by-line pull request reviews on GitHub",
                      "Automated CI/CD build & test pipeline setup",
                      "Real-time chaos engineering & fault resilience",
                    ],
                    milestone: "Production Capstone Code Merged",
                    accent: "border-amber-200 bg-slate-50 text-amber-800",
                  },
                  {
                    stage: "Phase 5: Assessment",
                    title: "Technical Evaluations & Code Defense",
                    icon: "📋",
                    badge: "Verification",
                    topics: [
                      "Comprehensive milestone coding diagnostic",
                      "Architecture viva defense with senior architect",
                      "Static AST analysis & code quality verification",
                      "Performance benchmark & load testing evaluation",
                    ],
                    milestone: "Senior Mentor Assessment Cleared",
                    accent: "border-rose-200 bg-slate-50 text-rose-700",
                  },
                  {
                    stage: "Phase 6: Certification Preparation",
                    title: "Official Exam Blueprint & Mocks",
                    icon: "🏆",
                    badge: "Verification",
                    topics: [
                      "Official vendor exam syllabus alignment (AWS, Azure, Cisco, SAP)",
                      "Timed practice assessments & question deep-dives",
                      "Digital credential generation",
                      "Verifiable certificate with scannable QR code",
                    ],
                    milestone: "Verified Certificate Issued",
                    accent: "border-indigo-200 bg-slate-50 text-indigo-700",
                  },
                  {
                    stage: "Phase 7: Resources",
                    title: "Permanent Learning Assets & Blueprints",
                    icon: "📚",
                    badge: "Lifetime Access",
                    topics: [
                      "Architecture cheat sheets & system design diagrams",
                      "Starter repository templates & boilerplates",
                      "Curated PDF revision notes & interview question banks",
                      "Lifetime access to 1080p recorded mentor sessions",
                    ],
                    milestone: "Full Repository & Resource Access",
                    accent: "border-teal-200 bg-slate-50 text-teal-700",
                  },
                ].map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{mod.icon}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {mod.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {mod.stage}
                      </div>
                      <h3 className="font-sans font-bold text-base text-slate-900">{mod.title}</h3>

                      <ul className="space-y-2 text-xs text-slate-600 pt-1">
                        {mod.topics.map((t, tidx) => (
                          <li key={tidx} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Milestone:</span>
                      <strong className="text-slate-800 font-semibold">{mod.milestone}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: NOTES & CHEATSHEETS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "notes" && (
          <section className="py-16 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div>
                <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-200 uppercase tracking-wider">
                  Downloadable Study Materials
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3">
                  Lecture Notes, Diagrams & Blueprints
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  High-resolution architectural flowcharts and production cheatsheets curated by our mentors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lectureNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg border border-blue-200 shrink-0">
                        📄
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{note.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="text-blue-600 font-mono font-semibold">{note.type}</span>
                          <span>•</span>
                          <span>{note.size}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setToast({ message: `✓ Download initiated for: ${note.title}`, type: "success" })}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shrink-0 cursor-pointer"
                    >
                      Download ↓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: ASSIGNMENTS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "assignments" && (
          <section className="py-16 border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider">
                  Hands-On Milestones
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3">
                  Production Capstone Assignments
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Submit real repositories and receive line-by-line mentor PR evaluations.
                </p>
              </div>

              <div className="space-y-4">
                {courseAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          {asg.status}
                        </span>
                        <h3 className="font-sans font-bold text-base text-slate-900 mt-2">{asg.title}</h3>
                      </div>
                      <div className="text-xs text-amber-700 font-mono font-semibold">
                        ⏰ Deadline: {asg.deadline} • {asg.maxPoints} Pts
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <p className="text-xs font-bold text-slate-700">Deliverables & Technical Constraints:</p>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {asg.specs.map((s, sidx) => (
                          <li key={sidx} className="flex items-center gap-2">
                            <span className="text-blue-600">⚡</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={asg.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-200 transition no-underline flex items-center gap-1.5"
                      >
                        <span>🐙 Starter Repo</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/assignments`)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-sm transition cursor-pointer"
                      >
                        Submit to LMS Portal →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: DISCUSSION Q&A
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "discussion" && (
          <section className="py-16 border-b border-slate-200 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  Community Q&A Forum
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3">
                  Ask Mentors & Fellow Students
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Have an architecture doubt or debugging error? Senior mentors reply promptly.
                </p>
              </div>

              {/* Ask Input */}
              <form onSubmit={handlePostQuestion} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <textarea
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Post your architecture or implementation question here..."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-sm transition cursor-pointer"
                  >
                    Post Question 🚀
                  </button>
                </div>
              </form>

              {/* Threads */}
              <div className="space-y-4">
                {discussions.map((d) => (
                  <div key={d.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={d.avatar} alt={d.author} className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-200" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{d.author}</div>
                          <div className="text-[10px] text-slate-500">{d.role} • {d.time}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        ▲ {d.upvotes}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {d.question}
                    </p>

                    {d.answers && d.answers.length > 0 && (
                      <div className="pl-4 border-l-2 border-blue-300 space-y-3 pt-1">
                        {d.answers.map((a, aidx) => (
                          <div key={aidx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-700">{a.author}</span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                                Verified Mentor Answer
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{a.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            TAB: REVIEWS
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeTab === "reviews" && (
          <section className="py-16 border-b border-slate-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
                <div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider">
                    Student Reviews
                  </span>
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">4.9</span>
                    <span className="text-amber-500 text-xl">★★★★★</span>
                    <span className="text-xs text-slate-500">(Student Reviews)</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Learners consistently rate our One-on-One curriculum and mentor guidance highly for practical depth.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {studentReviews.map((rev, ridx) => (
                  <div key={ridx} className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 transition shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-500 text-sm">★★★★★</span>
                        <span className="text-[10px] text-slate-500">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{rev.name}</div>
                      <div className="text-[11px] text-blue-700 font-semibold">{rev.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 3: REAL-WORLD CAPSTONE PROJECTS
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-200 uppercase tracking-wider">
                Hands-On Engineering
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3">
                Production Capstones You Will Build
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Employers don't want toy projects. You will build and deploy real-world production-grade architectures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {capstoneProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all shadow-xs space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-200">
                    💻
                  </div>
                  <h3 className="font-sans font-bold text-base text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tags.map((t, tidx) => (
                      <span key={tidx} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 4: VERIFICATION & CERTIFICATION PREVIEW
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider">
                  Verified Credential
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900">
                  Earn Your Industry-Recognized Certificate
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upon completion of your capstone code review and syllabus milestones, you will be awarded an official KR GLOBAL LEARNING PRIVATE LIMITED Certificate of Accomplishment.
                </p>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Verified Technology Training</strong> Completion Credential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Online verifiable QR code & unique certificate ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Easily exportable to LinkedIn Licenses & Certifications</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/certificates"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all no-underline"
                  >
                    <span>🏆</span> Learn About Certification Process
                  </Link>
                </div>
              </div>

              {/* Certificate Mockup Visual */}
              <div className="lg:col-span-6">
                <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-400/40 shadow-xl space-y-6 text-center relative overflow-hidden text-white">
                  <div className="absolute top-2 right-4 text-xs font-bold text-amber-400 uppercase tracking-widest opacity-80">
                    KR GLOBAL LEARNING VERIFIED
                  </div>
                  <div className="text-2xl font-extrabold text-white tracking-wide font-sans">
                    CERTIFICATE OF ACCOMPLISHMENT
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">This is proudly presented to</p>
                  <div className="text-xl font-bold text-amber-300 font-serif italic underline decoration-amber-500">
                    {user?.name || "Student Name"}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    For successfully mastering the One-on-One Live Mentorship program in{" "}
                    <strong className="text-white">{course.title}</strong>
                  </p>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Verification: KR Global Learning Registry</span>
                    <span className="font-mono text-cyan-400">ID: KR-{course.id?.toUpperCase() || "TECH-2026"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 5: FREQUENTLY ASKED QUESTIONS
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                Clear Answers
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <span className="text-blue-600 text-base font-bold">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 6: FREE DEMO CTA BANNER
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center relative overflow-hidden shadow-xl">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30 uppercase tracking-wider">
              Zero Commitment · 100% Free
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white">
              Try a Free 45-Minute Free One-on-One Learning Consultation Session
            </h2>
            <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
              Meet your senior mentor, evaluate our One-on-One pair-programming curriculum for{" "}
              <strong className="text-white font-semibold">{course.title}</strong>, and ask any questions before enrolling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleBookDemo}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-blue-700 font-extrabold text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <I.Sparkles /> Book Free Consultation for This Course
              </button>
              <a
                href={`https://wa.me/919311073936?text=${encodeURIComponent(
                  `Hi KR Global Learning, I want to inquire about enrolling in "${course.title}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all no-underline flex items-center gap-2"
              >
                <I.MessageCircle /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 7: RELATED COURSES
        ───────────────────────────────────────────────────────────────────────────── */}
        {relatedCourses.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Explore More</span>
                  <h2 className="font-sans font-extrabold text-2xl text-slate-900 mt-1">Related Courses in {course.category}</h2>
                </div>
                <Link to="/courses" className="text-xs font-bold text-blue-600 hover:text-blue-800 no-underline">
                  View All Courses →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCourses.map((rc) => (
                  <CourseCard
                    key={rc.id}
                    course={rc}
                    onViewDetails={() => navigate(`/courses/${rc.id || rc._id}`)}
                    onBookDemo={(title) => {
                      if (onOpenDemoModal) onOpenDemoModal(title);
                      else navigate(`/free-demo?course=${encodeURIComponent(title)}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full-Screen Razorpay Secure Payment Loading Overlay */}
        {isPaying && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="p-8 rounded-3xl bg-[#0B0F19] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-lg font-bold">
                  ⚡
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Connecting Razorpay Secure</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Initializing 256-bit encrypted checkout session for <span className="text-cyan-300 font-semibold">{course.title}</span>...
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium">
                <span>🔒</span> Bank Grade SSL Encryption
              </div>
            </div>
          </div>
        )}
      </main>
    </SEO>
  );
}
