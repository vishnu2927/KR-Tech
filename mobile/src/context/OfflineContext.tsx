import React, { createContext, useContext, useState, useEffect } from "react";
import { DownloadItem, DownloadService } from "../services/downloadService";

interface OfflineContextType {
  downloads: DownloadItem[];
  storageUsed: string;
  refreshDownloads: () => Promise<void>;
  downloadLessonVideo: (id: string, title: string, url: string, course: string, onProg?: (p: number) => void) => Promise<DownloadItem>;
  downloadPdfDocument: (id: string, title: string, url: string, type?: "pdf" | "certificate") => Promise<DownloadItem>;
  deleteDownload: (id: string) => Promise<void>;
  isDownloaded: (id: string) => boolean;
  getDownloadedUri: (id: string) => string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [storageUsed, setStorageUsed] = useState("0 MB");

  const refreshDownloads = async () => {
    const items = await DownloadService.getDownloads();
    const storage = await DownloadService.getTotalStorageUsed();
    setDownloads(items);
    setStorageUsed(storage.formatted);
  };

  useEffect(() => {
    refreshDownloads();
  }, []);

  const downloadLessonVideo = async (
    id: string,
    title: string,
    url: string,
    course: string,
    onProg?: (p: number) => void
  ) => {
    const item = await DownloadService.downloadFile(id, "video", title, url, course, onProg);
    await refreshDownloads();
    return item;
  };

  const downloadPdfDocument = async (
    id: string,
    title: string,
    url: string,
    type: "pdf" | "certificate" = "pdf"
  ) => {
    const item = await DownloadService.downloadFile(id, type, title, url);
    await refreshDownloads();
    return item;
  };

  const deleteDownload = async (id: string) => {
    await DownloadService.removeDownload(id);
    await refreshDownloads();
  };

  const isDownloaded = (id: string) => {
    return downloads.some((d) => d.id === id);
  };

  const getDownloadedUri = (id: string) => {
    const found = downloads.find((d) => d.id === id);
    return found ? found.fileUri : null;
  };

  return (
    <OfflineContext.Provider
      value={{
        downloads,
        storageUsed,
        refreshDownloads,
        downloadLessonVideo,
        downloadPdfDocument,
        deleteDownload,
        isDownloaded,
        getDownloadedUri,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error("useOffline must be used within OfflineProvider");
  return context;
};
