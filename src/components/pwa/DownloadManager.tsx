import React, { useState, useEffect } from "react";
import { offlineStorage, OfflineLessonRecord } from "../../utils/offlineStorage";

interface DownloadManagerProps {
  downloads: OfflineLessonRecord[];
  onDeleteDownload: (id: string) => void;
  onRefresh: () => void;
}

export default function DownloadManager({
  downloads,
  onDeleteDownload,
  onRefresh,
}: DownloadManagerProps) {
  const [quota, setQuota] = useState({ usedMB: 420, totalMB: 50000, percentage: 1 });
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    offlineStorage.getStorageQuota().then(setQuota);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [downloads]);

  const handlePurgeAll = async () => {
    if (!confirm("Are you sure you want to remove all offline downloaded lessons?")) return;
    for (const d of downloads) {
      await offlineStorage.removeOfflineLesson(d.id);
    }
    onRefresh();
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Local Device Storage Quota</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border ${
                isOnline
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              {isOnline ? "Connected to Cloud" : "Offline Mode Active"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browser IndexedDB sandbox allocating persistent offline storage for video streams.
          </p>
        </div>

        {downloads.length > 0 && (
          <button
            type="button"
            onClick={handlePurgeAll}
            className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
          >
            Purge All Downloads
          </button>
        )}
      </div>

      {/* Storage Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">
            {quota.usedMB} MB Used ({downloads.length} {downloads.length === 1 ? "lesson" : "lessons"})
          </span>
          <span className="text-slate-400 font-mono">
            {Math.round(quota.totalMB / 1024)} GB Available Quota
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(2, quota.percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
