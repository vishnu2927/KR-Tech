import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DownloadItem {
  id: string;
  type: "video" | "pdf" | "certificate";
  title: string;
  courseTitle?: string;
  fileUri: string;
  remoteUrl: string;
  sizeBytes: number;
  downloadedAt: string;
}

export type DownloadedItem = DownloadItem;

const DOWNLOADS_KEY = "kr_offline_downloads";

export const DownloadService = {
  // Download directory on device
  getStorageDir: () => `${FileSystem.documentDirectory}kr_offline/`,

  async initStorage(): Promise<void> {
    const dir = this.getStorageDir();
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  },

  async getDownloads(): Promise<DownloadItem[]> {
    try {
      const data = await AsyncStorage.getItem(DOWNLOADS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveDownloadMetadata(item: DownloadItem): Promise<void> {
    const current = await this.getDownloads();
    const filtered = current.filter((d) => d.id !== item.id);
    filtered.push(item);
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(filtered));
  },

  async downloadFile(
    id: string,
    type: "video" | "pdf" | "certificate",
    title: string,
    remoteUrl: string,
    courseTitle?: string,
    onProgress?: (progress: number) => void
  ): Promise<DownloadItem> {
    await this.initStorage();
    const ext = type === "video" ? "mp4" : "pdf";
    const filename = `${id}_${Date.now()}.${ext}`;
    const destination = `${this.getStorageDir()}${filename}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      remoteUrl,
      destination,
      {},
      (downloadProgress: any) => {
        const progress =
          downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) onProgress(Math.min(Math.max(progress, 0), 1));
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result || !result.uri) {
      throw new Error("Download failed");
    }

    const fileInfo = await FileSystem.getInfoAsync(result.uri);

    const item: DownloadItem = {
      id,
      type,
      title,
      courseTitle,
      fileUri: result.uri,
      remoteUrl,
      sizeBytes: fileInfo.exists && "size" in fileInfo ? fileInfo.size || 0 : 0,
      downloadedAt: new Date().toISOString(),
    };

    await this.saveDownloadMetadata(item);
    return item;
  },

  async removeDownload(id: string): Promise<void> {
    const current = await this.getDownloads();
    const target = current.find((d) => d.id === id);
    if (target) {
      try {
        const info = await FileSystem.getInfoAsync(target.fileUri);
        if (info.exists) {
          await FileSystem.deleteAsync(target.fileUri, { idempotent: true });
        }
      } catch (e) {
        console.warn("File deletion error:", e);
      }
      const updated = current.filter((d) => d.id !== id);
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated));
    }
  },

  async clearAllDownloads(): Promise<void> {
    try {
      const dir = this.getStorageDir();
      const info = await FileSystem.getInfoAsync(dir);
      if (info.exists) {
        await FileSystem.deleteAsync(dir, { idempotent: true });
      }
      await AsyncStorage.removeItem(DOWNLOADS_KEY);
      await this.initStorage();
    } catch (e) {
      console.warn("Clear downloads error:", e);
    }
  },

  async getTotalStorageUsed(): Promise<{ totalBytes: number; formatted: string }> {
    const downloads = await this.getDownloads();
    const totalBytes = downloads.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
    const mb = (totalBytes / (1024 * 1024)).toFixed(1);
    return {
      totalBytes,
      formatted: `${mb} MB`,
    };
  },
};

export const downloadService = DownloadService;
