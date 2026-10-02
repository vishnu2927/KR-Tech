import React, { useState } from "react";

export interface LessonItem {
  _id: string;
  courseId: string;
  moduleId: string;
  moduleTitle?: string;
  lessonNumber: number;
  title: string;
  duration: string;
  durationSeconds?: number;
  videoUrl: string;
  description?: string;
  notes?: string;
  resources?: { title: string; url: string; type?: string }[];
  isFreePreview?: boolean;
  order?: number;
  isCompleted?: boolean;
}

export interface ModuleItem {
  _id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  duration?: string;
  progressPercent?: number;
  totalLessonsCount?: number;
  completedLessonsCount?: number;
  lessons: LessonItem[];
}

interface LessonSidebarProps {
  modules: ModuleItem[];
  activeLessonId: string;
  onSelectLesson: (lesson: LessonItem) => void;
  onToggleComplete: (lessonId: string, completed: boolean) => void;
  overallProgress: number;
  completedCount: number;
  totalLessons: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function LessonSidebar({
  modules,
  activeLessonId,
  onSelectLesson,
  onToggleComplete,
  overallProgress,
  completedCount,
  totalLessons,
  isOpenMobile = false,
  onCloseMobile,
}: LessonSidebarProps) {
  // Store expanded module states (default all expanded)
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>(() => {
    const init: { [key: string]: boolean } = {};
    modules.forEach((mod) => {
      init[mod._id] = true;
    });
    return init;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const filteredModules = modules.map((mod) => {
    if (!searchQuery.trim()) return mod;
    const query = searchQuery.toLowerCase();
    const matchedLessons = mod.lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        (l.description && l.description.toLowerCase().includes(query))
    );
    return {
      ...mod,
      lessons: matchedLessons,
    };
  });

  const content = (
    <div className="flex flex-col h-full bg-slate-950/95 border-l border-slate-800 backdrop-blur-2xl text-slate-100">
      {/* Header & Overall Progress */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Course Curriculum
          </h2>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-300">
            {completedCount} of {totalLessons} Lessons Done
          </span>
          <span className="font-mono font-bold text-cyan-400">{overallProgress}%</span>
        </div>

        {/* Top Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(2, Math.min(100, overallProgress))}%` }}
          />
        </div>

        {/* Lesson Search Filter */}
        <div className="mt-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search lessons or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Modules & Lessons List (Scrollable) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 sm:p-3 space-y-3">
        {filteredModules.map((mod, modIdx) => {
          const isExpanded = expandedModules[mod._id] ?? true;
          const modProgress = mod.progressPercent || 0;
          const completedInMod =
            mod.completedLessonsCount ??
            mod.lessons.filter((l) => l.isCompleted).length;
          const totalInMod = mod.totalLessonsCount ?? mod.lessons.length;

          return (
            <div
              key={mod._id || modIdx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-sm hover:border-slate-700/80 transition-all"
            >
              {/* Module Accordion Header */}
              <button
                type="button"
                onClick={() => toggleModule(mod._id)}
                className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 font-mono">
                      Module {mod.moduleNumber || modIdx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">{mod.duration || "2 hrs"}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {mod.title}
                  </h3>

                  {/* Per-Module Progress Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, modProgress)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {completedInMod}/{totalInMod} ({modProgress}%)
                    </span>
                  </div>
                </div>

                <span className="text-slate-500 text-xs mt-1 transition-transform duration-200">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {/* Lessons within Module */}
              {isExpanded && (
                <div className="px-2 pb-2 space-y-1 bg-slate-950/40 border-t border-slate-800/40 pt-1.5">
                  {mod.lessons.length === 0 ? (
                    <p className="text-[11px] text-slate-500 p-2 text-center">
                      No matching lessons found.
                    </p>
                  ) : (
                    mod.lessons.map((lesson) => {
                      const isActive =
                        activeLessonId === lesson._id ||
                        activeLessonId === String(lesson.lessonNumber);
                      const isCompleted = !!lesson.isCompleted;

                      return (
                        <div
                          key={lesson._id}
                          className={`group flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/40 shadow-md shadow-cyan-950/30"
                              : "hover:bg-slate-800/50 border border-transparent"
                          }`}
                        >
                          {/* Completion Checkbox */}
                          <button
                            type="button"
                            title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson._id, !isCompleted);
                            }}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isCompleted
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-950/40"
                                : "border-slate-700 bg-slate-900/60 text-transparent hover:border-slate-500"
                            }`}
                          >
                            ✓
                          </button>

                          {/* Lesson Title & Details (Click to Play) */}
                          <div
                            onClick={() => {
                              onSelectLesson(lesson);
                              if (onCloseMobile) onCloseMobile();
                            }}
                            className="flex-1 min-w-0 mx-2.5 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                              )}
                              <h4
                                className={`text-xs font-semibold line-clamp-1 ${
                                  isActive
                                    ? "text-cyan-300 font-bold"
                                    : isCompleted
                                    ? "text-slate-300"
                                    : "text-slate-200"
                                }`}
                              >
                                {lesson.lessonNumber}. {lesson.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                              <span>⏱️ {lesson.duration || "15:00"}</span>
                              {lesson.isFreePreview && (
                                <span className="text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                  Preview
                                </span>
                              )}
                              {lesson.resources && lesson.resources.length > 0 && (
                                <span className="text-cyan-400">📎 {lesson.resources.length} res</span>
                              )}
                            </div>
                          </div>

                          {/* Play / Active Icon */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectLesson(lesson);
                              if (onCloseMobile) onCloseMobile();
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isActive
                                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/40 font-bold"
                                : "bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700"
                            }`}
                          >
                            {isActive ? "▶" : "▷"}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-80 xl:w-96 h-full shrink-0">
        {content}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
          />
          <div className="relative w-full max-w-sm sm:max-w-md h-full z-10 animate-slideInLeft">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
