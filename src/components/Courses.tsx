import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";
import { courseService, Course } from "../services/courseService";

export type { Course };

export function CourseCard({
  course,
  onViewDetails,
  onBookDemo,
}: {
  course: Course;
  onViewDetails?: (course: Course) => void;
  onBookDemo?: (courseName: string) => void;
}) {
  const navigate = useNavigate();

  const handleBookDemo = () => {
    if (onBookDemo) {
      onBookDemo(course.title);
    } else {
      navigate(`/free-demo?course=${encodeURIComponent(course.title)}`);
    }
  };

  return (
    <div
      className="glass-card-dark group relative flex flex-col overflow-hidden text-left"
      style={{
        height: "100%",
        background: "rgba(18, 12, 36, 0.8)",
        border: "1px solid rgba(167, 139, 250, 0.2)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Thumbnail */}
      <Link to={`/courses/${course.id || course._id}`} className="block relative h-48 w-full overflow-hidden bg-gray-900">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1E] via-[#0F0A1E]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-600/90 text-white backdrop-blur-md shadow-lg border border-purple-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            One-on-One Live Training
          </span>

          {course.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-black shadow-md">
              {course.badge}
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/15 text-gray-200 backdrop-blur-md border border-white/20">
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-500/20 text-cyan-200 backdrop-blur-md border border-cyan-400/30">
            Recorded LMS
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Mentorship Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {course.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Dedicated Mentor
            </span>
          </div>

          {/* Course Title */}
          <Link to={`/courses/${course.id || course._id}`} className="no-underline block">
            <h3 className="font-display font-bold text-base text-white leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-cyan-300 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Mentor Experience */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3 pb-2.5 border-b border-white/10">
            <span className="font-medium text-gray-300 truncate mr-2">
              Mentor: <strong className="text-purple-300 font-semibold">{course.mentor}</strong>{" "}
              <span className="text-gray-400 text-[11px]">({course.mentorCompany})</span>
            </span>
            <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded shrink-0">
              {course.mentorExp || "10+ Years"} Exp
            </span>
          </div>

          {/* Meta Info: Duration, Rating, Language */}
          <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-white/5 text-xs text-gray-300 mb-3.5 border border-white/5">
            <div className="flex items-center gap-1">
              <span className="text-purple-400"><I.Clock /></span>
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-400"><I.Star /></span>
              <span className="font-bold text-white">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 truncate" title={course.language}>
              <span className="text-cyan-400 text-[11px]">🌐</span>
              <span className="truncate text-[11px] font-medium">{course.language}</span>
            </div>
          </div>

          {/* Features bullet preview */}
          <ul className="space-y-1.5 mb-4">
            {course.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-emerald-400 mt-0.5"><I.Check /></span>
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Dual Action Buttons */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-extrabold text-cyan-300 font-display">{course.price}</span>
              {course.originalPrice && !course.price.startsWith("$") ? (
                <span className="text-xs text-gray-500 line-through ml-2">{course.originalPrice}</span>
              ) : null}
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">One-on-One Live Slots Available</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (onViewDetails) {
                  onViewDetails(course);
                } else {
                  navigate(`/courses/${course.id || course._id}`);
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-gray-300 bg-white/10 hover:bg-purple-600/30 hover:text-white rounded-xl transition-all text-center cursor-pointer border border-white/10"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={handleBookDemo}
              className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl shadow-lg transition-all text-center cursor-pointer"
            >
              Book Your Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses({
  limit,
  showFilter = true,
  categoryFilter,
}: {
  limit?: number;
  showFilter?: boolean;
  categoryFilter?: string;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "All");
  const [activeDetailsCourse, setActiveDetailsCourse] = useState<Course | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourses();
        if (isMounted) {
          setCourses(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load live courses");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "All",
    "Cloud Computing",
    "Cyber Security",
    "Networking",
    "Microsoft & IT",
    "Data & Analytics",
    "Project Management",
    "Enterprise Technologies",
    "Java Backend",
    "MERN Stack",
    "Python",
    "AI & ML",
  ];

  const filtered = courses.filter((c) => {
    if (selectedCategory === "All") return true;
    if (c.categoryGroup?.toLowerCase() === selectedCategory.toLowerCase()) return true;
    if (c.category?.toLowerCase() === selectedCategory.toLowerCase()) return true;
    return false;
  });

  const popularSorted = [...filtered].sort((a, b) => {
    const aPop = (a.badge?.toLowerCase().includes("bestseller") || a.badge?.toLowerCase().includes("popular") || a.badge?.toLowerCase().includes("hot")) ? 1 : 0;
    const bPop = (b.badge?.toLowerCase().includes("bestseller") || b.badge?.toLowerCase().includes("popular") || b.badge?.toLowerCase().includes("hot")) ? 1 : 0;
    if (bPop !== aPop) return bPop - aPop;
    return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
  });

  const displayCourses = limit ? popularSorted.slice(0, limit) : filtered;

  return (
    <section id="courses" className="py-24 bg-dark-purple relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background radial glows */}
      <div className="orb" style={{ width: 600, height: 600, top: -150, left: -100, background: "rgba(124,58,237,0.22)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, right: -50, background: "rgba(6,182,212,0.18)" }} />

      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md mb-3">
              <I.Sparkles /> 55+ INDUSTRY-ALIGNED COURSES
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Explore One-on-One <span className="gradient-text-warm">Live Courses</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl">
              Hands-on, project-based One-on-One curricula taught by industry mentors with 10+ years of experience from MongoDB Atlas.
            </p>
          </div>
          {limit && (
            <Link
              to="/courses"
              className="btn-ghost-white flex items-center gap-2 self-start md:self-auto text-cyan-300 font-semibold no-underline text-sm hover:text-white px-5 py-2.5 rounded-xl"
            >
              View All {courses.length > 0 ? courses.length : "55"} Courses <I.ChevronRight />
            </Link>
          )}
        </div>

        {showFilter && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 border border-purple-400"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit || 8 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card-dark p-4 shadow-sm animate-pulse space-y-4"
                style={{ minHeight: 380 }}
              >
                <div className="h-44 bg-white/5 rounded-2xl w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <div className="h-5 bg-purple-500/20 rounded w-16" />
                  <div className="h-8 bg-white/10 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 p-6 bg-rose-950/40 rounded-3xl border border-rose-500/30 max-w-lg mx-auto">
            <p className="text-rose-300 font-semibold text-sm mb-3">⚠️ {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 cursor-pointer"
            >
              Retry Sync with Atlas
            </button>
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No courses found matching "{selectedCategory}".
          </div>
        ) : (
          /* Responsive Grid: Desktop 4, Tablet 2, Mobile 1 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCourses.map((c) => (
              <CourseCard
                key={c.id || c._id}
                course={c}
                onViewDetails={(course) => setActiveDetailsCourse(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Curriculum / Details Modal */}
      {activeDetailsCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDetailsCourse(null);
          }}
        >
          <div
            className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-purple-500/30 text-left animate-scaleIn"
            style={{ background: "#0F0A1E" }}
          >
            <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full mb-2">
                  One-on-One Live Curriculum & Syllabus
                </span>
                <h3 className="font-display font-extrabold text-xl leading-tight text-white">
                  {activeDetailsCourse.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Mentor: {activeDetailsCourse.mentor} ({activeDetailsCourse.mentorCompany}) · {activeDetailsCourse.duration} · {activeDetailsCourse.language}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailsCourse(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-4"
              >
                <I.Close />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">
                  Structured Weekly Milestones
                </span>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                  {activeDetailsCourse.roadmap?.length || 0} Modules
                </span>
              </div>

              <div className="space-y-3">
                {activeDetailsCourse.roadmap?.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-cyan-300">
                        {r.week} — {r.title}
                      </span>
                    </div>
                    <ul className="pl-4 list-disc text-xs text-gray-300 space-y-1 mb-2.5">
                      {r.topics.map((top, tIdx) => (
                        <li key={tIdx}>{top}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                      <span>🎯 Milestone:</span>
                      <span>{r.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Course Tuition</span>
                <span className="text-xl font-extrabold text-cyan-300 font-display">{activeDetailsCourse.price}</span>
              </div>
              <Link
                to={`/free-demo?course=${encodeURIComponent(activeDetailsCourse.title)}`}
                onClick={() => setActiveDetailsCourse(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg transition-all flex items-center gap-1.5 no-underline"
              >
                <I.Sparkles /> Book Free Free One-on-One Learning Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
