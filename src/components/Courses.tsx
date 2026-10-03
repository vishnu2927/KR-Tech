import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { I } from "./Icons";
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
    <div className="group relative flex flex-col overflow-hidden text-left bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Thumbnail */}
      <Link to={`/courses/${course.id || course._id}`} className="block relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-600 text-white shadow-md border border-blue-400/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            One-on-One Live
          </span>

          {course.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-md">
              {course.badge}
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/90 text-white backdrop-blur-md shadow-xs">
            Recorded LMS
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Mentorship Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {course.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
              Dedicated Mentor
            </span>
          </div>

          {/* Course Title */}
          <Link to={`/courses/${course.id || course._id}`} className="no-underline block">
            <h3 className="font-display font-bold text-base text-slate-900 leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Mentor Experience */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2.5 border-b border-slate-100">
            <span className="font-medium text-slate-700 truncate mr-2">
              Mentor: <strong className="text-indigo-600 font-bold">{course.mentor}</strong>{" "}
              <span className="text-slate-400 text-[11px]">({course.mentorCompany})</span>
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md shrink-0">
              {course.mentorExp || "10+ Years"}
            </span>
          </div>

          {/* Meta Info: Duration, Rating, Language */}
          <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 mb-3.5 border border-slate-200/80">
            <div className="flex items-center gap-1 font-medium">
              <span className="text-indigo-600"><I.Clock /></span>
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <span className="text-amber-500"><I.Star /></span>
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 truncate font-medium" title={course.language}>
              <span className="text-cyan-600 text-[11px]">🌐</span>
              <span className="truncate text-[11px]">{course.language}</span>
            </div>
          </div>

          {/* Features bullet preview */}
          <ul className="space-y-1.5 mb-4">
            {course.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-emerald-600 mt-0.5"><I.Check /></span>
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Dual Action Buttons */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-black text-slate-900 font-display">{course.price}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">Live Slots Available</span>
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
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-all text-center cursor-pointer border border-slate-200 shadow-xs"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={handleBookDemo}
              className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all text-center cursor-pointer"
            >
              Consultation
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
    <section id="courses" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-xs">
              <I.Sparkles /> INDUSTRY-ALIGNED COURSES
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Explore One-on-One <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Live Courses</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Hands-on, project-based One-on-One curricula taught by experienced industry mentors.
            </p>
          </div>
          {limit && (
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 self-start md:self-auto text-blue-600 font-bold no-underline text-sm hover:text-blue-800 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all"
            >
              <span>View All 84 Courses</span>
              <I.ChevronRight />
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
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm border border-blue-600"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-xs"
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
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 animate-pulse space-y-4"
                style={{ minHeight: 380 }}
              >
                <div className="h-44 bg-slate-200 rounded-xl w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div className="h-5 bg-blue-100 rounded w-16" />
                  <div className="h-8 bg-slate-200 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 p-6 bg-rose-50 rounded-2xl border border-rose-200 max-w-lg mx-auto">
            <p className="text-rose-700 font-semibold text-sm mb-3">⚠️ {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 cursor-pointer"
            >
              Retry Sync with Atlas
            </button>
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDetailsCourse(null);
          }}
        >
          <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-200 bg-white text-left animate-scaleIn">
            <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full mb-2">
                  One-on-One Live Curriculum & Syllabus
                </span>
                <h3 className="font-display font-extrabold text-xl leading-tight text-white">
                  {activeDetailsCourse.title}
                </h3>
                <p className="text-xs text-blue-100 mt-1 font-medium">
                  Mentor: {activeDetailsCourse.mentor} ({activeDetailsCourse.mentorCompany}) · {activeDetailsCourse.duration} · {activeDetailsCourse.language}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailsCourse(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-4"
              >
                <I.Close />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 font-display">
                  Structured Weekly Milestones
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {activeDetailsCourse.roadmap?.length || 0} Modules
                </span>
              </div>

              <div className="space-y-3">
                {activeDetailsCourse.roadmap?.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-700">
                        {r.week} — {r.title}
                      </span>
                    </div>
                    <ul className="pl-4 list-disc text-xs text-slate-600 space-y-1 mb-2.5">
                      {r.topics.map((top, tIdx) => (
                        <li key={tIdx}>{top}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                      <span>🎯 Milestone:</span>
                      <span>{r.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Course Tuition</span>
                <span className="text-2xl font-black text-slate-900 font-display">{activeDetailsCourse.price}</span>
              </div>
              <Link
                to={`/free-demo?course=${encodeURIComponent(activeDetailsCourse.title)}`}
                onClick={() => setActiveDetailsCourse(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center gap-1.5 no-underline"
              >
                <I.Sparkles /> Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

