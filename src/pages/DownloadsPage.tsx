import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import SEO from "../components/common/SEO";
import { offlineStorage, OfflineLessonRecord } from "../utils/offlineStorage";
import { pwaService } from "../services/pwaService";
import DownloadManager from "../components/pwa/DownloadManager";
import OfflineVideoPlayer from "../components/pwa/OfflineVideoPlayer";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<OfflineLessonRecord[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [activePlayerLesson, setActivePlayerLesson] = useState<OfflineLessonRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const loadDownloads = async () => {
    const records = await offlineStorage.getOfflineLessons();
    setDownloads(records);
  };

  useEffect(() => {
    loadDownloads();
    pwaService.getOfflineLessons().then((data) => {
      if (data && data.lessons) setCatalog(data.lessons);
    });
  }, []);

  const handleDownload = async (lesson: any) => {
    setDownloadingId(lesson.id);
    showToast(`Downloading "${lesson.title}" to local IndexedDB storage...`);

    setTimeout(async () => {
      const record: OfflineLessonRecord = {
        ...lesson,
        downloadedAt: new Date().toISOString(),
      };
      await offlineStorage.saveOfflineLesson(record);
      await loadDownloads();
      setDownloadingId(null);
      showToast("✓ Lesson saved for offline viewing!");
    }, 1200);
  };

  const handleDelete = async (id: string) => {
    await offlineStorage.removeOfflineLesson(id);
    await loadDownloads();
    showToast("✓ Download removed from device storage");
  };

  const filteredDownloads = downloads.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-purple-600 selection:text-white">
      <SEO
        title="Offline Downloads & Library — KR Global Learning"
        description="Access and watch your downloaded coding video lectures and notes offline without internet."
      />

      <DashboardSidebar role="student" activeTab="downloads" onTabChange={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-80px)] space-y-8">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                  PWA Mobile · Offline Learning
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/30">
                  IndexedDB Persistent Sandbox
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Offline <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Downloads Library</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Download your technical masterclasses and PDF notes to your device storage. Learn on commutes or flights with zero buffering.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
              >
                <span>←</span> Student Portal
              </Link>
              <a
                href="https://wa.me/919311073936?text=Hi%20KR%20Global%20Learning%20Team,%20I%20have%20a%20question%20regarding%20offline%20learning"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <span>💬</span> WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        {/* Storage Quota Component */}
        <DownloadManager
          downloads={downloads}
          onDeleteDownload={handleDelete}
          onRefresh={loadDownloads}
        />

        {/* Downloaded Content Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📥</span> Downloaded Lessons ({downloads.length})
            </h3>
            {downloads.length > 0 && (
              <input
                type="text"
                placeholder="Search downloaded lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          {downloads.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <span className="text-4xl">💾</span>
              <p className="font-bold text-white text-sm">No offline lessons downloaded yet</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore available lessons below and tap "Download for Offline" to save them to your browser storage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDownloads.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setActivePlayerLesson(item)}
                        className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                          ▶
                        </div>
                      </button>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded-md">
                        {item.durationMinutes} mins · {item.fileSizeFormatted}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                        {item.module}
                      </span>
                      <h4 className="font-bold text-white text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.mentor}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePlayerLesson(item)}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
                    >
                      ▶ Watch Offline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-xl border border-slate-700 transition-all text-xs"
                      title="Delete Download"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catalog of Available Content to Download */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> Available Masterclasses for Offline Download
            </h3>
            <p className="text-xs text-slate-400">
              One-click download to your local IndexedDB storage cache.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalog.map((lesson) => {
              const isDownloaded = downloads.some((d) => d.id === lesson.id);
              const isDownloading = downloadingId === lesson.id;

              return (
                <div
                  key={lesson.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all"
                >
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="w-24 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-purple-300 font-bold block">{lesson.module}</span>
                    <h5 className="font-bold text-white text-xs truncate">{lesson.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lesson.durationMinutes} mins · {lesson.fileSizeFormatted} · {lesson.mentor}
                    </p>
                  </div>

                  {isDownloaded ? (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl shrink-0">
                      ✓ Ready Offline
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownload(lesson)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-purple-600 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all shrink-0"
                    >
                      {isDownloading ? "Saving..." : "↓ Download"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Offline Player Overlay */}
        {activePlayerLesson && (
          <OfflineVideoPlayer
            lesson={activePlayerLesson}
            onClose={() => setActivePlayerLesson(null)}
          />
        )}
      </main>
    </div>
  );
}
