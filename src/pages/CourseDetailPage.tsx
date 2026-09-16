import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService, Course } from "../services/courseService";
import { CourseCard } from "../components/Courses";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import { SchemaBuilder } from "../utils/seo";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Toast from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";

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
                    KR TECH OFFICIAL COURSE CURRICULUM
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

CERTIFICATION & ACCREDITATION:
ISO 9001:2015 & Global Industry Cloud Consortium Accredited
Direct 1:1 Screen-Sharing & Hands-On Production Capstones Included.
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
              Browse 55+ Courses
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
      tags: ["ISO 9001", "Security Audits", "IAM", "Encryption"],
    },
  ];

  const faqs = [
    {
      q: "How does the 1:1 live training work?",
      a: "Unlike prerecorded courses or 50+ student Zoom webinars, our sessions are private 1-on-1 calls with a dedicated Senior Principal Mentor. You share your screen, write real production code together, and debug live architecture issues.",
    },
    {
      q: "What are the session timings and schedule flexibility?",
      a: "You have complete flexibility to pick your preferred batch: Weekday Evenings (7:00 PM - 9:00 PM IST), Morning slots, or Weekend intensive bootcamps. You can reschedule sessions directly with your mentor with 12 hours advance notice.",
    },
    {
      q: "Do I receive recordings of every live session?",
      a: "Yes! Every single 1:1 live session is recorded in HD 1080p and automatically archived into your Student Dashboard within 30 minutes of session completion for lifetime review.",
    },
    {
      q: "Is placement assistance and mock interview prep included?",
      a: "Yes. Our senior architects conduct 3 rounds of realistic technical mock interviews (System Design, Coding & Live Debugging, Behavioral), optimize your GitHub/LinkedIn portfolio, and offer direct referrals.",
    },
    {
      q: "Can I try a class before enrolling?",
      a: "Absolutely! We offer a 100% Free 45-Minute 1:1 Live Demo Session with zero financial commitment. You evaluate our pair-programming approach first-hand.",
    },
  ];

  return (
    <SEO
      title={`${course.title} — 1:1 Live Mentorship & Certification | KR Tech`}
      description={`Master ${course.title} with 1:1 live senior mentorship. 100% hands-on curriculum, real-world capstone projects, ISO 9001:2015 certification.`}
      canonical={`https://krtech.in/courses/${course.id || course._id}`}
      ogType="article"
      ogImage={course.image}
      keywords={`${course.title}, ${course.category}, 1:1 coding classes, learn ${course.title}, live mentorship, project defense`}
      structuredData={[
        SchemaBuilder.getCourseSchema({
          title: course.title,
          description: course.description,
          category: course.category,
          duration: course.duration,
          slug: course.id || course._id,
        }),
        SchemaBuilder.getBreadcrumbSchema([
          { name: "Home", url: "https://krtech.in/" },
          { name: "Courses", url: "https://krtech.in/courses" },
          { name: course.title, url: `https://krtech.in/courses/${course.id || course._id}` },
        ]),
      ]}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white pt-20">
        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 1: HERO SECTION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-8 pb-16 border-b border-slate-800/80">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
              <Link to="/" className="text-slate-400 hover:text-purple-300 no-underline transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/courses" className="text-slate-400 hover:text-purple-300 no-underline transition-colors">
                Courses
              </Link>
              <span>/</span>
              <span className="text-purple-400 font-semibold">{course.category}</span>
              <span>/</span>
              <span className="text-slate-200 truncate max-w-xs">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    1:1 Live Pair-Programming
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {course.badge || "Bestseller"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Verified in Atlas Cloud
                  </span>
                </div>

                <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {course.description ||
                    `Master modern ${course.category} architecture with our 1:1 live senior mentorship program. Build real-world production capstones, debug complex issues live, and earn an accredited certificate.`}
                </p>

                {/* Key Meta Chips Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="text-purple-400">⏳</span> Duration
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{course.duration}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="text-amber-400">📊</span> Level
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{course.level}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="text-amber-400">⭐</span> Rating
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {course.rating} / 5.0 <span className="text-[11px] font-normal text-slate-400">({course.students})</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="text-emerald-400">🌐</span> Language
                    </div>
                    <div className="text-sm font-bold text-white mt-1 truncate">{course.language}</div>
                  </div>
                </div>

                {/* Mentor Quick Bio Banner */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-lg border border-purple-500/40">
                      👨‍🏫
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Lead Senior Mentor:</div>
                      <div className="text-sm font-bold text-white">
                        {course.mentor}{" "}
                        <span className="text-xs font-normal text-purple-300">({course.mentorCompany})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    ⭐ {course.mentorExp || "10+ Years"} Industry Experience
                  </div>
                </div>
              </div>

              {/* Right Enrollment Sticky Card */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/95 border border-purple-500/30 shadow-2xl shadow-purple-950/60 space-y-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={handleBookDemo}
                        className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-purple-600/50 hover:scale-110 transition-transform cursor-pointer"
                        title="Watch Course Preview"
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-white font-sans">{course.price}</span>
                      <span className="text-sm text-slate-500 line-through">{course.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Limited Time Offer
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Includes 1:1 Live Mentorship, HD Recordings & ISO Certification</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {enrolling ? "Enrolling..." : "Enroll in 1:1 Track Now"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBookDemo}
                      className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <I.Sparkles /> Book Free 45-Min Live Demo
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSyllabus}
                      className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>📥</span> Download Full Syllabus PDF
                    </button>
                  </div>

                  {/* Bullet perks */}
                  <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400"><I.Check /></span>
                      <span>1:1 Live Screen-Sharing with Senior Mentor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400"><I.Check /></span>
                      <span>Real-time Code Reviews & Capstone Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400"><I.Check /></span>
                      <span>100% Money-Back Guarantee (7 Days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400"><I.Check /></span>
                      <span>ISO 9001:2015 Accredited Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 2: CURRICULUM & ROADMAP
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wider">
                Comprehensive Syllabus
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mt-3">
                Weekly Step-by-Step Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Designed by senior tech leads. Progress from core architectural fundamentals to complex production deployments.
              </p>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(course.roadmap || [
                {
                  week: "Week 1 - 2",
                  title: "Core Architecture & Design Foundations",
                  topics: ["Deep-dive Syntax & Runtime Internals", "SOLID Principles & Clean Code", "Scalable System Patterns"],
                  milestone: "Foundations Mastery Checkpoint",
                },
                {
                  week: "Week 3 - 4",
                  title: "Enterprise Frameworks & Microservices",
                  topics: ["REST APIs & Event-Driven Architecture", "Database Sharding & Connection Pools", "Docker Containerization"],
                  milestone: "Microservices Deployment Checkpoint",
                },
                {
                  week: "Week 5 - 6",
                  title: "Production CI/CD & Cloud Orchestration",
                  topics: ["Kubernetes Clusters & Ingress Controllers", "Automated Pipelines (GitHub Actions)", "Cloud Infrastructure as Code"],
                  milestone: "Full Pipeline Integration",
                },
                {
                  week: "Week 7 - 8",
                  title: "Real-World Capstone & Zero-Downtime Deployment",
                  topics: ["Resilience Engineering & Chaos Testing", "Distributed Caching with Redis", "Production Security Hardening"],
                  milestone: "Live Capstone Demo & Code Review",
                },
              ]).map((mod, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                        {mod.week}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">1:1 Pair Coding</span>
                    </div>
                    <h3 className="font-sans font-bold text-base text-white">{mod.title}</h3>

                    <ul className="space-y-2 text-xs text-slate-300 pt-1">
                      {mod.topics.map((t, tidx) => (
                        <li key={tidx} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5 font-bold">✓</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Milestone:</span>
                    <strong className="text-slate-200">{mod.milestone}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 3: REAL-WORLD CAPSTONE PROJECTS
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30 uppercase tracking-wider">
                Hands-On Engineering
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mt-3">
                Production Capstones You Will Build
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Employers don't want toy projects. You will build and deploy real-world production-grade architectures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {capstoneProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl font-bold border border-cyan-500/20">
                    💻
                  </div>
                  <h3 className="font-sans font-bold text-base text-white">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tags.map((t, tidx) => (
                      <span key={tidx} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
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
            SECTION 4: ACCREDITATION & CERTIFICATION PREVIEW
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 uppercase tracking-wider">
                  Accredited Credential
                </span>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                  Earn Your Industry-Recognized Certificate
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Upon completion of your capstone code review and syllabus milestones, you will be awarded an official KR Tech Certificate of Accomplishment.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>ISO 9001:2015</strong> Quality Management Accredited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Cryptographically verifiable online QR code & unique certificate ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Easily exportable to LinkedIn Licenses & Certifications</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/certificates"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all no-underline"
                  >
                    <span>🏆</span> Learn About Certification Process
                  </Link>
                </div>
              </div>

              {/* Certificate Mockup Visual */}
              <div className="lg:col-span-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-2 border-amber-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
                  <div className="absolute top-2 right-4 text-xs font-bold text-amber-400 uppercase tracking-widest opacity-60">
                    KR TECH VERIFIED
                  </div>
                  <div className="text-2xl font-extrabold text-white tracking-wide font-sans">
                    CERTIFICATE OF ACCOMPLISHMENT
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">This is proudly presented to</p>
                  <div className="text-xl font-bold text-purple-300 font-serif italic underline decoration-purple-500">
                    {user?.name || "Student Name"}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    For successfully mastering the 1:1 Live Mentorship program in{" "}
                    <strong className="text-white">{course.title}</strong>
                  </p>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Accreditation: ISO 9001:2015</span>
                    <span className="font-mono text-purple-400">ID: KR-{course.id?.toUpperCase() || "TECH-2026"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            SECTION 5: FREQUENTLY ASKED QUESTIONS
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16 border-b border-slate-800/80 bg-slate-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wider">
                Clear Answers
              </span>
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <span className="text-purple-400 text-base">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
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
        <section className="py-16 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-b border-slate-800/80 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 uppercase tracking-wider">
              Zero Commitment · 100% Free
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white">
              Try a Free 45-Minute 1:1 Live Demo Session
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Meet your senior mentor, evaluate our 1:1 pair-programming curriculum for{" "}
              <strong className="text-purple-300">{course.title}</strong>, and ask any questions before enrolling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleBookDemo}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-900/50 transition-all cursor-pointer flex items-center gap-2"
              >
                <I.Sparkles /> Book Free 1:1 Demo for This Course
              </button>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hi KR Tech, I want to inquire about enrolling in "${course.title}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-sm rounded-2xl border border-emerald-500/40 transition-all no-underline flex items-center gap-2"
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
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Explore More</span>
                  <h2 className="font-sans font-extrabold text-2xl text-white mt-1">Related Courses in {course.category}</h2>
                </div>
                <Link to="/courses" className="text-xs font-bold text-purple-400 hover:text-purple-300 no-underline">
                  View All 55+ Courses →
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
      </main>
    </SEO>
  );
}
