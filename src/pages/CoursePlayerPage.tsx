import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import studentDashboardService from "../services/studentDashboardService";
import LessonSidebar, { LessonItem, ModuleItem } from "../components/student/LessonSidebar";
import LessonNotes from "../components/student/LessonNotes";
import AssignmentUploadModal, { AssignmentData } from "../components/student/AssignmentUploadModal";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function CoursePlayerPage() {
  const { courseId = "java-backend" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // LMS Data States
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [allLessons, setAllLessons] = useState<LessonItem[]>([]);
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);

  // Player & UX States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [showPlayerFallback, setShowPlayerFallback] = useState(false);

  // Overall Progress
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const playerRef = useRef<any>(null);

  // 1. Fetch Course, Modules, Lessons, Progress on Mount
  useEffect(() => {
    let isMounted = true;

    async function loadLMS() {
      try {
        setLoading(true);
        setError(null);

        // Parallel fetch for optimal load speed
        const [detailsRes, modulesRes, lessonsRes, assignmentsRes] = await Promise.all([
          studentDashboardService.getCourseDetails(courseId),
          studentDashboardService.getCourseModules(courseId),
          studentDashboardService.getCourseLessons(courseId),
          studentDashboardService.getAssignments(courseId).catch(() => []),
        ]);

        if (!isMounted) return;

        setCourseDetails(detailsRes.course);
        setOverallProgress(detailsRes.progress?.progressPercent || 0);
        setCompletedCount(detailsRes.progress?.completedCount || 0);

        const fetchedModules: ModuleItem[] = modulesRes.modules || [];
        const fetchedLessons: LessonItem[] = lessonsRes.lessons || [];

        setModules(fetchedModules);
        setAllLessons(fetchedLessons);

        // Resume last lesson: find either matching currentLesson or first uncompleted lesson
        const savedCurrentTitle = detailsRes.progress?.currentLesson;
        let initialLesson: LessonItem | undefined;

        if (savedCurrentTitle) {
          initialLesson = fetchedLessons.find(
            (l) => l.title.toLowerCase() === savedCurrentTitle.toLowerCase()
          );
        }

        if (!initialLesson) {
          initialLesson = fetchedLessons.find((l) => !l.isCompleted) || fetchedLessons[0];
        }

        setActiveLesson(initialLesson || fetchedLessons[0] || null);

        // Assignment for course
        if (assignmentsRes && assignmentsRes.length > 0) {
          const firstAsg = assignmentsRes[0];
          setAssignment({
            _id: firstAsg._id,
            title: firstAsg.title,
            description: firstAsg.description,
            moduleTitle: firstAsg.moduleTitle,
            deadline: firstAsg.deadline,
            maxScore: firstAsg.maxScore,
            requirements: firstAsg.requirements,
            starterRepoUrl: firstAsg.starterRepoUrl,
          });
        }
      } catch (err: any) {
        console.error("Failed to load Course LMS:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load course video player. Please check your network or try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLMS();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Handle Mark Complete / Incomplete
  const handleToggleComplete = async (lessonId: string, completed: boolean) => {
    try {
      setUpdatingProgress(true);

      // Optimistic update in UI
      setAllLessons((prev) =>
        prev.map((l) => (l._id === lessonId ? { ...l, isCompleted: completed } : l))
      );

      setModules((prev) =>
        prev.map((m) => {
          const updatedLessons = m.lessons.map((l) =>
            l._id === lessonId ? { ...l, isCompleted: completed } : l
          );
          const done = updatedLessons.filter((l) => l.isCompleted).length;
          const total = updatedLessons.length;
          return {
            ...m,
            lessons: updatedLessons,
            completedLessonsCount: done,
            progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
          };
        })
      );

      if (activeLesson?._id === lessonId) {
        setActiveLesson((prev) => (prev ? { ...prev, isCompleted: completed } : null));
      }

      // Persist to backend
      const res = await studentDashboardService.updateCourseProgress(courseId, {
        lessonId,
        completed,
        currentLessonTitle: activeLesson?.title,
        watchTimeSeconds: 60,
      });

      if (res.progress) {
        setOverallProgress(res.progress.progressPercent);
        setCompletedCount(res.progress.completedCount);
      }
    } catch (err) {
      console.error("Progress update failed:", err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Next / Previous Navigation
  const currentIndex = allLessons.findIndex(
    (l) => l._id === activeLesson?._id || l.lessonNumber === activeLesson?.lessonNumber
  );

  const hasNext = currentIndex >= 0 && currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNextLesson = () => {
    if (hasNext) {
      const next = allLessons[currentIndex + 1];
      setActiveLesson(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      const prev = allLessons[currentIndex - 1];
      setActiveLesson(prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Auto update progress when video completes
  const handleVideoEnded = () => {
    if (activeLesson) {
      handleToggleComplete(activeLesson._id, true);
    }
    if (autoPlayNext && hasNext) {
      setTimeout(() => {
        handleNextLesson();
      }, 1200);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300">
        <LoadingSpinner />
        <p className="mt-4 text-sm font-semibold animate-pulse text-cyan-400">
          Loading HD Course Player & Curriculum...
        </p>
      </div>
    );
  }

  if (error || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300">
        <div className="max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-white">Course Player Error</h2>
          <p className="text-xs text-slate-400">{error || "No lessons available for this course."}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/my-courses"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all no-underline"
            >
              ← Back to My Courses
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentCompleted = !!activeLesson.isCompleted;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/my-courses"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all shrink-0 no-underline"
            title="Back to Enrolled Courses"
          >
            ←
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 font-mono">
                {activeLesson.moduleTitle || "Core Module"}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline truncate">
                {courseDetails?.title || "Enterprise Architecture"}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-xl">
              {activeLesson.lessonNumber}. {activeLesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Progress:</span>
            <span className="text-cyan-400 font-bold">{overallProgress}%</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden ml-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Toggle Curriculum Sidebar for Mobile/Tablet */}
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile(true)}
            className="lg:hidden px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex items-center gap-1.5 cursor-pointer"
          >
            <span>📚</span>
            <span>Curriculum</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT: PLAYER + SIDEBAR */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: VIDEO PLAYER & LESSON DETAILS (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl shadow-purple-950/30 group">
            {!showPlayerFallback ? (
              <ReactPlayer
                ref={playerRef}
                src={activeLesson.videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                playbackRate={playbackRate}
                onEnded={handleVideoEnded}
                onError={() => setShowPlayerFallback(true)}
              />
            ) : (
              <video
                src={activeLesson.videoUrl}
                controls
                controlsList="nodownload"
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* PLAYER CONTROLS & ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-3">
              {/* Previous Lesson Button */}
              <button
                type="button"
                disabled={!hasPrev}
                onClick={handlePrevLesson}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>← Previous</span>
              </button>

              {/* Next Lesson Button */}
              <button
                type="button"
                disabled={!hasNext}
                onClick={handleNextLesson}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Next →</span>
              </button>

              {/* Mark Complete Toggle */}
              <button
                type="button"
                disabled={updatingProgress}
                onClick={() => handleToggleComplete(activeLesson._id, !isCurrentCompleted)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isCurrentCompleted
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-900/30"
                }`}
              >
                <span>{isCurrentCompleted ? "✓ Completed" : "Mark as Complete"}</span>
              </button>
            </div>

            {/* Playback Preferences */}
            <div className="flex items-center gap-4 text-xs">
              {/* Playback Speed */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-cyan-400 font-mono text-xs focus:outline-none cursor-pointer"
                >
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={1.75}>1.75x</option>
                  <option value={2}>2.0x</option>
                </select>
              </div>

              {/* Auto Play Next */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={autoPlayNext}
                  onChange={(e) => setAutoPlayNext(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="hidden sm:inline">Autoplay Next</span>
              </label>
            </div>
          </div>

          {/* LESSON NOTES, OVERVIEW & MENTOR Q&A COMPONENT */}
          <LessonNotes
            lesson={activeLesson}
            assignment={assignment}
            onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
          />
        </main>

        {/* RIGHT COLUMN: CURRICULUM ACCORDION SIDEBAR */}
        <LessonSidebar
          modules={modules}
          activeLessonId={activeLesson._id}
          onSelectLesson={(lesson) => {
            setActiveLesson(lesson);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onToggleComplete={handleToggleComplete}
          overallProgress={overallProgress}
          completedCount={completedCount}
          totalLessons={allLessons.length}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />
      </div>

      {/* ASSIGNMENT UPLOAD MODAL */}
      <AssignmentUploadModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        courseId={courseId}
        assignment={assignment}
        onSuccess={() => {
          // Re-fetch progress
          studentDashboardService.getCourseDetails(courseId).then((res) => {
            if (res.progress) {
              setOverallProgress(res.progress.progressPercent);
              setCompletedCount(res.progress.completedCount);
            }
          });
        }}
      />
    </div>
  );
}
