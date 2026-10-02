import React, { useState, useEffect, useRef } from "react";
import lecturePortalService, {
  LectureDetail,
  LectureChapter,
  LectureAttachment,
  ContinueWatchingItem,
  WatchHistoryItem,
} from "../../services/lecturePortalService";

interface Props {
  userEmail?: string;
  userName?: string;
  onToast?: (msg: string) => void;
  initialLectureId?: string;
}

export default function RecordedLecturePortal({
  userEmail,
  userName,
  onToast,
  initialLectureId,
}: Props) {
  // State
  const [lectures, setLectures] = useState<LectureDetail[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [activeLecture, setActiveLecture] = useState<LectureDetail | null>(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"chapters" | "notes" | "attachments" | "history">(
    "chapters"
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [currentPlaybackSeconds, setCurrentPlaybackSeconds] = useState<number>(0);
  const [personalNotes, setPersonalNotes] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCompletedState, setIsCompletedState] = useState<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    let isMounted = true;
    async function loadPortalData() {
      try {
        setLoading(true);
        const [lecData, cwData, histData] = await Promise.all([
          lecturePortalService.getLectures({ email: userEmail }),
          lecturePortalService.getContinueWatching(userEmail),
          lecturePortalService.getWatchHistory(userEmail),
        ]);

        if (!isMounted) return;

        setLectures(lecData);
        setContinueWatching(cwData);
        setWatchHistory(histData);

        // Pick initial active lecture
        if (initialLectureId) {
          const matched = lecData.find(
            (l) => String(l._id) === initialLectureId || String(l.lectureNumber) === initialLectureId
          );
          if (matched) {
            selectLecture(matched);
            return;
          }
        }

        // Default to first continue watching, or first lecture
        if (cwData.length > 0) {
          const firstCw = lecData.find((l) => String(l._id) === String(cwData[0].lectureId));
          if (firstCw) {
            selectLecture(firstCw, cwData[0].watchedSeconds);
            return;
          }
        }

        if (lecData.length > 0) {
          selectLecture(lecData[0]);
        }
      } catch (err) {
        console.warn("Failed to load lecture portal data from Atlas:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPortalData();
    return () => {
      isMounted = false;
    };
  }, [userEmail, initialLectureId]);

  // Select lecture helper
  const selectLecture = (lecture: LectureDetail, resumeSeconds?: number) => {
    setActiveLecture(lecture);
    const initialSec =
      resumeSeconds !== undefined
        ? resumeSeconds
        : lecture.userProgress?.watchedSeconds || 0;
    setCurrentPlaybackSeconds(initialSec);
    setIsCompletedState(lecture.userProgress?.completed || false);
    setPersonalNotes(lecture.userProgress?.personalNotes || "");
    setActiveChapterIndex(0);

    // If lecture has chapters, determine active chapter
    if (lecture.chapters && lecture.chapters.length > 0) {
      const idx = lecture.chapters.findIndex((c, i) => {
        const nextSec = lecture.chapters![i + 1]?.seconds || 999999;
        return initialSec >= c.seconds && initialSec < nextSec;
      });
      if (idx !== -1) setActiveChapterIndex(idx);
    }

    // Scroll to player smoothly
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Build embedded video URL with timestamp
  const getEmbedUrl = () => {
    if (!activeLecture?.videoUrl) return "";
    let base = activeLecture.videoUrl;
    if (!base.includes("embed")) {
      base = "https://www.youtube-nocookie.com/embed/R873BlNVUB4";
    }
    const params = new URLSearchParams();
    params.set("enablejsapi", "1");
    params.set("rel", "0");
    if (currentPlaybackSeconds > 0) {
      params.set("start", Math.floor(currentPlaybackSeconds).toString());
      params.set("autoplay", "1");
    }
    return `${base}?${params.toString()}`;
  };

  // Handle seeking to a chapter
  const handleSeekToChapter = (chapter: LectureChapter, index: number) => {
    setActiveChapterIndex(index);
    setCurrentPlaybackSeconds(chapter.seconds);

    if (onToast) {
      onToast(`⚡ Jumped to Chapter: ${chapter.title} (${chapter.timestamp})`);
    }

    // Record progress to Atlas
    if (activeLecture) {
      lecturePortalService.updateWatchProgress(activeLecture._id, {
        email: userEmail,
        watchedSeconds: chapter.seconds,
        durationSeconds: (activeLecture.durationMinutes || 45) * 60,
      }).catch(console.warn);
    }
  };

  // Toggle Completed status
  const handleToggleComplete = async () => {
    if (!activeLecture) return;
    const nextCompleted = !isCompletedState;
    setIsCompletedState(nextCompleted);

    try {
      const totalSec = (activeLecture.durationMinutes || 45) * 60;
      await lecturePortalService.updateWatchProgress(activeLecture._id, {
        email: userEmail,
        watchedSeconds: nextCompleted ? totalSec : currentPlaybackSeconds,
        durationSeconds: totalSec,
        completed: nextCompleted,
      });

      // Update local lecture state
      setLectures((prev) =>
        prev.map((l) =>
          l._id === activeLecture._id
            ? {
                ...l,
                userProgress: {
                  ...l.userProgress!,
                  completed: nextCompleted,
                  progressPercent: nextCompleted ? 100 : l.userProgress?.progressPercent || 0,
                },
              }
            : l
        )
      );

      // Refresh continue watching & history
      const [cwData, histData] = await Promise.all([
        lecturePortalService.getContinueWatching(userEmail),
        lecturePortalService.getWatchHistory(userEmail),
      ]);
      setContinueWatching(cwData);
      setWatchHistory(histData);

      if (onToast) {
        onToast(
          nextCompleted
            ? `✓ Marked as Completed! +50 XP awarded to your profile! 🎓`
            : `Marked as In-Progress`
        );
      }
    } catch (err: any) {
      if (onToast) onToast("Failed to update lecture status");
    }
  };

  // Save personal student notes
  const handleSaveNotes = async () => {
    if (!activeLecture) return;
    setSavingNotes(true);
    try {
      await lecturePortalService.saveStudentNotes(activeLecture._id, personalNotes, userEmail);
      if (onToast) onToast("✓ Personal lecture notes saved to MongoDB Atlas!");
    } catch (err: any) {
      if (onToast) onToast("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  // Download attachment
  const handleDownloadAttachment = async (att: LectureAttachment) => {
    if (!activeLecture) return;
    try {
      const attId = att.id || att._id || "";
      const res = await lecturePortalService.downloadAttachment(activeLecture._id, attId);

      // Trigger actual file download
      const link = document.createElement("a");
      link.href = att.fileUrl;
      link.download = att.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local download count
      setActiveLecture((prev) => {
        if (!prev || !prev.attachments) return prev;
        return {
          ...prev,
          attachments: prev.attachments.map((a) =>
            (a.id === attId || a._id === attId)
              ? { ...a, downloadCount: res.downloadCount || (a.downloadCount || 0) + 1 }
              : a
          ),
        };
      });

      if (onToast) onToast(`📥 Downloaded ${att.name} (${att.fileSize})`);
    } catch (err) {
      // Fallback direct download
      const link = document.createElement("a");
      link.href = att.fileUrl;
      link.download = att.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onToast) onToast(`📥 Downloading ${att.name}`);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Filter lectures
  const filteredLectures = lectures.filter((lec) => {
    if (selectedCourseFilter !== "all" && lec.courseId !== selectedCourseFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = lec.title.toLowerCase().includes(q);
      const inDesc = lec.description.toLowerCase().includes(q);
      const inTags = lec.tags?.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: TOP CONTINUE WATCHING SHELF
      ───────────────────────────────────────────────────────────────────────────── */}
      {continueWatching.length > 0 && (
        <div className="rounded-3xl bg-slate-900/80 border border-purple-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Continue Watching
              </h3>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                {continueWatching.length} In-Progress
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Picks up where you left off across all devices
            </span>
          </div>

          {/* Horizontal Shelf Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatching.map((item) => (
              <div
                key={item.lectureId}
                onClick={() => {
                  const matched = lectures.find((l) => String(l._id) === item.lectureId);
                  if (matched) selectLecture(matched, item.watchedSeconds);
                }}
                className="group relative rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 p-4 transition-all duration-300 cursor-pointer flex gap-3.5 items-center shadow-lg hover:shadow-purple-900/20"
              >
                {/* Thumbnail with Resume overlay */}
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600/90 text-white flex items-center justify-center text-xs shadow group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                  </div>
                  {/* Miniature progress bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-900">
                    <div
                      style={{ width: `${item.progressPercent}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block truncate">
                    {item.courseTitle}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="text-amber-400 font-mono font-bold">
                      {item.progressPercent}% watched
                    </span>
                    <span>·</span>
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-300">
                      Resume at {item.resumeTimestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 2: MAIN THEATER VIDEO PLAYER & TABBED INTERACTION SUITE
      ───────────────────────────────────────────────────────────────────────────── */}
      <div ref={videoContainerRef} className="space-y-6">
        {activeLecture ? (
          <div
            className={`grid gap-6 transition-all duration-300 ${
              theaterMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
            }`}
          >
            {/* Left/Main Column: Video Player Frame & Controls */}
            <div className={`space-y-4 ${theaterMode ? "w-full" : "lg:col-span-2"}`}>
              {/* Player Container */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-purple-500/30 shadow-2xl group">
                <iframe
                  key={`${activeLecture._id}-${currentPlaybackSeconds}`}
                  src={getEmbedUrl()}
                  title={activeLecture.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

                {/* Overlay Badge for Active Chapter */}
                {activeLecture.chapters && activeLecture.chapters[activeChapterIndex] && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-purple-500/30 text-white text-xs font-semibold flex items-center gap-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>
                      Chapter {activeChapterIndex + 1}:{" "}
                      <strong className="text-purple-300">
                        {activeLecture.chapters[activeChapterIndex].title}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Custom Player Action Bar */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                {/* Left controls: Speed chips & jump */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        if (onToast) onToast(`Playback speed set to ${spd}x`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        playbackSpeed === spd
                          ? "bg-purple-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Right controls: Theater Mode toggle & Complete status */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition cursor-pointer flex items-center gap-1.5"
                    title="Toggle Theater Mode"
                  >
                    <span>{theaterMode ? "🗗 Standard View" : "🗖 Theater Mode"}</span>
                  </button>

                  <button
                    onClick={handleToggleComplete}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5 ${
                      isCompletedState
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{isCompletedState ? "✓ Completed (+50 XP)" : "Mark as Completed"}</span>
                  </button>
                </div>
              </div>

              {/* Lecture Metadata Title Card */}
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    {activeLecture.moduleTitle} · Lecture #{activeLecture.lectureNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ⏱ {activeLecture.duration} · Recorded {activeLecture.recordedDate}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {activeLecture.title}
                </h1>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {activeLecture.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Mentor Instructor:</span>
                    <strong className="text-purple-300 font-semibold">
                      {activeLecture.instructor}
                    </strong>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeLecture.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-slate-950 text-slate-300 text-[10px] font-medium rounded-full border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tabbed Resource Suite (Chapters, Notes, Attachments, History) */}
            <div className={`space-y-4 ${theaterMode ? "w-full" : "lg:col-span-1"}`}>
              {/* Tab Navigation */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-1.5 flex items-center justify-between gap-1 shadow-lg">
                <button
                  onClick={() => setActiveTab("chapters")}
                  className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "chapters"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📑 Chapters ({activeLecture.chapters?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "notes"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📝 Notes
                </button>
                <button
                  onClick={() => setActiveTab("attachments")}
                  className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "attachments"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📎 Files ({activeLecture.attachments?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🕒 History
                </button>
              </div>

              {/* Tab 1 Content: Chapters */}
              {activeTab === "chapters" && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-3 max-h-[580px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">Timed Video Chapters</span>
                    <span className="text-[11px] text-purple-400 font-semibold">Click to seek video</span>
                  </div>

                  {activeLecture.chapters && activeLecture.chapters.length > 0 ? (
                    <div className="space-y-2">
                      {activeLecture.chapters.map((ch, idx) => {
                        const isCurrent = activeChapterIndex === idx;
                        return (
                          <div
                            key={ch.id || idx}
                            onClick={() => handleSeekToChapter(ch, idx)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isCurrent
                                ? "bg-purple-600/15 border-purple-500/60 shadow-md shadow-purple-900/20"
                                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                                    isCurrent
                                      ? "bg-purple-500 text-white"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {ch.timestamp}
                                </span>
                                <h5
                                  className={`text-xs font-bold ${
                                    isCurrent ? "text-purple-300" : "text-white"
                                  }`}
                                >
                                  {ch.title}
                                </h5>
                              </div>
                              {ch.summary && (
                                <p className="text-[11px] text-slate-400 leading-snug pl-1">
                                  {ch.summary}
                                </p>
                              )}
                            </div>
                            <span className="text-purple-400 text-xs font-black">▶</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-500">
                      No chapter markers configured for this lecture session.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2 Content: Notes & Student Notepad */}
              {activeTab === "notes" && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-5 max-h-[580px] overflow-y-auto">
                  {/* Official Architecture Notes */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="text-xs font-bold text-slate-300">
                        Staff Architecture Summary
                      </span>
                      {activeLecture.notesUrl && (
                        <a
                          href={activeLecture.notesUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-purple-400 hover:text-purple-300 no-underline"
                        >
                          Download Full PDF 📥
                        </a>
                      )}
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {activeLecture.notes || "Official architectural notes available in PDF download."}
                    </div>
                  </div>

                  {/* Student's Personal Notepad */}
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>✍️</span> My Personal Lecture Notes
                      </span>
                      <span className="text-[10px] text-slate-400">Synced to MongoDB Atlas</span>
                    </div>

                    <textarea
                      rows={4}
                      value={personalNotes}
                      onChange={(e) => setPersonalNotes(e.target.value)}
                      placeholder="Type your own notes, key commands, code snippets, or architectural reminders..."
                      className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none font-mono"
                    />

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="w-full mt-2.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>💾</span>
                      <span>{savingNotes ? "Saving to Atlas..." : "Save My Notes to Atlas"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3 Content: Downloadable Attachments */}
              {activeTab === "attachments" && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-3 max-h-[580px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      Downloadable Lab Artifacts
                    </span>
                    <span className="text-[11px] text-slate-400">Source code & architecture diagrams</span>
                  </div>

                  {activeLecture.attachments && activeLecture.attachments.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeLecture.attachments.map((att, idx) => (
                        <div
                          key={att.id || idx}
                          className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-black bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              {att.fileType || "FILE"}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{att.name}</h5>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {att.fileSize} · {att.downloadCount || 0} downloads
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownloadAttachment(att)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex-shrink-0"
                          >
                            📥 Download
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-500">
                      No attachments attached to this lecture.
                    </div>
                  )}

                  {/* External resources */}
                  {activeLecture.resources && activeLecture.resources.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Recommended Repositories & Docs
                      </span>
                      {activeLecture.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300 hover:text-purple-300 hover:border-purple-500/30 transition no-underline"
                        >
                          <span>{res.title}</span>
                          <span className="text-purple-400 text-xs">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4 Content: Watch History */}
              {activeTab === "history" && (
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-3 max-h-[580px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">My Watch History</span>
                    <span className="text-[11px] text-purple-400 font-semibold">
                      {watchHistory.length} Sessions
                    </span>
                  </div>

                  {watchHistory.length > 0 ? (
                    <div className="space-y-2.5">
                      {watchHistory.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            const matched = lectures.find((l) => String(l._id) === item.lectureId);
                            if (matched) selectLecture(matched, item.watchedSeconds);
                          }}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-purple-400 block truncate">
                              {item.courseTitle || "KR Global Learning Cohort"}
                            </span>
                            <h5 className="text-xs font-bold text-white truncate">
                              {item.lectureTitle}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span className={item.completed ? "text-emerald-400 font-bold" : ""}>
                                {item.completed ? "✓ 100% Completed" : `${item.progressPercent}% Watched`}
                              </span>
                              <span>·</span>
                              <span>{new Date(item.lastWatchedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className="text-purple-400 text-xs font-black">▶</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-500">
                      No watch history recorded yet. Start watching lectures!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
            Select a lecture below to start watching.
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: COMPLETE LECTURES CATALOG & TRACK FILTER
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Full Recorded Lectures Library</h3>
            <p className="text-xs text-slate-400">
              Browse, filter, and stream complete architectural lessons recorded with senior mentors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search lectures, topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            {/* Course Filter Dropdown */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Tracks ({lectures.length})</option>
              <option value="java-backend">Java Backend Microservices</option>
              <option value="aws-architect">AWS Solutions Architect</option>
              <option value="mern-stack">MERN Stack Mastery</option>
            </select>
          </div>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lec) => {
            const isSelected = activeLecture?._id === lec._id;
            const isCompleted = lec.userProgress?.completed;
            const hasProgress = (lec.userProgress?.progressPercent || 0) > 0;

            return (
              <div
                key={lec._id}
                className={`rounded-3xl bg-slate-950/70 border transition-all overflow-hidden flex flex-col justify-between group shadow-lg ${
                  isSelected
                    ? "border-purple-500 shadow-purple-900/30"
                    : "border-slate-800 hover:border-purple-500/40"
                }`}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={lec.thumbnail}
                      alt={lec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30">
                      {lec.courseId.replace("-", " ").toUpperCase()}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-mono rounded-full border border-slate-700">
                      ⏱ {lec.duration}
                    </span>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => selectLecture(lec)}
                        className="w-12 h-12 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center text-xl shadow-xl shadow-purple-600/40 cursor-pointer transform group-hover:scale-110 transition-all"
                      >
                        ▶
                      </button>
                    </div>

                    {/* Completed / Progress Ribbon */}
                    {isCompleted ? (
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded-full shadow">
                        ✓ Completed
                      </span>
                    ) : (
                      hasProgress && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-bold rounded-full shadow">
                          {lec.userProgress?.progressPercent}% Watched
                        </span>
                      )
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lecture #{lec.lectureNumber} · {lec.recordedDate}
                    </span>

                    <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                      {lec.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lec.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 font-mono">
                      <span>📑 {lec.chapters?.length || 0} Chapters</span>
                      <span>📎 {lec.attachments?.length || 0} Files</span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => selectLecture(lec)}
                    className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold transition shadow cursor-pointer text-center"
                  >
                    {isSelected ? "Currently Playing ▶" : "Watch Lecture ▶"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
