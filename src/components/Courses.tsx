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
      className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(124,58,237,0.18)] hover:border-purple-200 overflow-hidden"
      style={{ height: "100%" }}
    >
      {/* Thumbnail */}
      <Link to={`/courses/${course.id || course._id}`} className="block relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-600/90 text-white backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            1:1 Live Training
          </span>

          {course.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-amber-950 shadow-sm">
              {course.badge}
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 text-gray-800 backdrop-blur-md">
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-900/80 text-cyan-200 backdrop-blur-md">
            Recorded Included
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Mentorship Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
              {course.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              One-on-One Mentorship
            </span>
          </div>

          {/* Course Title */}
          <Link to={`/courses/${course.id || course._id}`} className="no-underline block">
            <h3 className="font-sans font-bold text-[15px] text-gray-900 leading-snug mb-2 line-clamp-2 min-h-[42px] group-hover:text-purple-700 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Mentor Experience */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3 pb-2.5 border-b border-gray-100">
            <span className="font-medium text-gray-700">
              Mentor: <strong className="text-purple-700 font-semibold">{course.mentor}</strong>{" "}
              <span className="text-gray-400 text-[11px]">({course.mentorCompany})</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {course.mentorExp || "10+ Years"} Exp
            </span>
          </div>

          {/* Meta Info: Duration, Rating, Language */}
          <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-gray-50 text-xs text-gray-600 mb-3.5">
            <div className="flex items-center gap-1">
              <span className="text-purple-600"><I.Clock /></span>
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-500"><I.Star /></span>
              <span className="font-bold text-gray-800">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 truncate" title={course.language}>
              <span className="text-cyan-600 text-[11px]">🌐</span>
              <span className="truncate text-[11px] font-medium">{course.language}</span>
            </div>
          </div>

          {/* Features bullet preview */}
          <ul className="space-y-1.5 mb-4">
            {course.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-emerald-500 mt-0.5"><I.Check /></span>
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Dual Action Buttons */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-extrabold text-purple-700 font-sans">{course.price}</span>
              <span className="text-xs text-gray-400 line-through ml-2">{course.originalPrice}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">Live 1:1 Slots</span>
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
              className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all text-center cursor-pointer"
            >
              View Curriculum
            </button>
            <button
              type="button"
              onClick={handleBookDemo}
              className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all text-center hover:shadow-md"
            >
              Book Free Demo
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
    <section id="courses" className="py-20 bg-white">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-4">
          <SectionHeading
            badge="Featured Programs"
            badgeClass="badge-cyan"
            title="Explore One-on-One"
            accent="Live Courses"
            desc="Hands-on, project-based 1:1 curricula taught by industry mentors with 10+ years of experience from MongoDB Atlas."
            center={false}
          />
          {limit && (
            <Link
              to="/courses"
              className="btn-ghost flex items-center gap-1.5 self-start md:self-auto text-purple-700 font-semibold no-underline text-sm"
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
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200 border border-purple-600"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
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
                className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm animate-pulse space-y-4"
              >
                <div className="h-44 bg-gray-200 rounded-2xl w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="h-5 bg-purple-100 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 p-6 bg-rose-50 rounded-3xl border border-rose-200 max-w-lg mx-auto">
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
          <div className="text-center py-12 text-gray-500 text-sm">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/75 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDetailsCourse(null);
          }}
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scaleIn">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-2">
                  1:1 Live Curriculum & Syllabus
                </span>
                <h3 className="font-sans font-extrabold text-xl leading-tight">
                  {activeDetailsCourse.title}
                </h3>
                <p className="text-xs text-purple-100 mt-1">
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
                <span className="text-sm font-bold text-gray-900 font-sans">
                  Structured Weekly Milestones
                </span>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  {activeDetailsCourse.roadmap.length} Modules
                </span>
              </div>

              <div className="space-y-3">
                {activeDetailsCourse.roadmap.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-700">
                        {r.week} — {r.title}
                      </span>
                    </div>
                    <ul className="pl-4 list-disc text-xs text-gray-600 space-y-1 mb-2.5">
                      {r.topics.map((top, tIdx) => (
                        <li key={tIdx}>{top}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                      <span>🎯 Milestone:</span>
                      <span>{r.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">Course Tuition</span>
                <span className="text-xl font-extrabold text-purple-700 font-sans">{activeDetailsCourse.price}</span>
              </div>
              <Link
                to={`/free-demo?course=${encodeURIComponent(activeDetailsCourse.title)}`}
                onClick={() => setActiveDetailsCourse(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all flex items-center gap-1.5 no-underline"
              >
                <I.Sparkles /> Book Free 1:1 Live Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
