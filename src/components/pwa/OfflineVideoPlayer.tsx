import React, { useState, useRef, useEffect } from "react";
import { offlineStorage, OfflineLessonRecord } from "../../utils/offlineStorage";

interface OfflineVideoPlayerProps {
  lesson: OfflineLessonRecord;
  onClose: () => void;
}

export default function OfflineVideoPlayer({ lesson, onClose }: OfflineVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [toastText, setToastText] = useState("");

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(""), 2500);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Save progress to IndexedDB
      if (Math.floor(video.currentTime) % 10 === 0 && Math.floor(video.currentTime) > 0) {
        offlineStorage.recordOfflineProgress({
          courseId: lesson.courseId,
          lessonId: lesson.id,
          durationWatchedSeconds: Math.floor(video.currentTime),
          completed: video.currentTime / (video.duration || 1) > 0.85,
          offlineTimestamp: new Date().toISOString(),
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      offlineStorage.recordOfflineProgress({
        courseId: lesson.courseId,
        lessonId: lesson.id,
        durationWatchedSeconds: Math.floor(video.duration),
        completed: true,
        offlineTimestamp: new Date().toISOString(),
      });
      showToast("✓ Lesson marked complete & saved to offline sync queue");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [lesson]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`${speed}x Playback Speed`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-2 sm:p-6 animate-in fade-in">
      {/* Toast Alert */}
      {toastText && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-purple-600/90 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl border border-purple-400/40 backdrop-blur-md">
          {toastText}
        </div>
      )}

      {/* Player Header */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full font-bold text-[10px] uppercase shrink-0">
            Offline Playback
          </span>
          <h3 className="font-bold text-white truncate text-sm sm:text-base">{lesson.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all ml-3 shrink-0"
        >
          ✕ Close Player
        </button>
      </div>

      {/* Video Container */}
      <div className="w-full max-w-5xl bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          poster={lesson.thumbnail}
          onClick={togglePlay}
          className="w-full aspect-video object-contain cursor-pointer"
          playsInline
        />

        {/* Custom Play Overlay when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center text-2xl shadow-2xl shadow-purple-600/50 hover:scale-105 transition-all">
              ▶
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-3">
          {/* Progress Slider */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white font-bold transition-all"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <span className="font-mono text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Speed Buttons */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    playbackRate === s
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details Footer */}
      <div className="w-full max-w-5xl pt-3 flex items-center justify-between text-xs text-slate-400">
        <p>Mentor: <strong className="text-purple-300">{lesson.mentor}</strong> · {lesson.module}</p>
        <span className="text-[11px] text-emerald-400">✓ Progress auto-saved locally & ready for cloud sync</span>
      </div>
    </div>
  );
}
