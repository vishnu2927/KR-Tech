import api from "./api";

export interface Resource {
  _id?: string;
  id: string;
  title: string;
  category: "PDF Notes" | "Cheat Sheets" | "Interview Questions" | "Resume Templates" | "Roadmaps" | string;
  description: string;
  format: string;
  fileSize: string;
  downloadsCount: string;
  tags: string[];
  content?: string;
  author?: string;
  downloadUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const resourceService = {
  // Fetch all resources with optional category and search query
  async getResources(params?: { category?: string; search?: string }): Promise<Resource[]> {
    try {
      const response = await api.get("/resources", { params });
      return response.data?.resources || [];
    } catch (error) {
      console.error("Failed to fetch resources from Atlas:", error);
      throw error;
    }
  },

  // Fetch single resource by ID or slug
  async getResourceById(id: string): Promise<Resource | null> {
    try {
      const response = await api.get(`/resources/${encodeURIComponent(id)}`);
      return response.data?.resource || null;
    } catch (error) {
      console.error(`Failed to fetch resource ${id} from Atlas:`, error);
      return null;
    }
  },

  // Track download in Atlas (increments download counter)
  async trackDownload(id: string): Promise<{ success: boolean; downloadsCount: string }> {
    try {
      const response = await api.post(`/resources/${encodeURIComponent(id)}/download`);
      return {
        success: response.data?.success ?? true,
        downloadsCount: response.data?.downloadsCount || "",
      };
    } catch (error) {
      console.error(`Failed to track download for ${id}:`, error);
      return { success: false, downloadsCount: "" };
    }
  },

  // Client-side helper to trigger file download with formatted document content
  downloadResourceFile(resource: Resource) {
    const filename = `${resource.id || resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    const header = `================================================================================
KR TECH FREE RESOURCES PORTAL
Title: ${resource.title}
Category: ${resource.category}
Author: ${resource.author || "KR Tech Expert Guild"}
Format: ${resource.format} | File Size: ${resource.fileSize}
Verified by KR Tech Academy (https://krtech.academy)
================================================================================\n\n`;

    const body = resource.content || resource.description;
    const footer = `\n\n================================================================================
Need 1-on-1 mentorship or live instructor training?
Book your free demo session at KR Tech: https://krtech.academy/free-demo
================================================================================`;

    const blob = new Blob([header + body + footer], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

export default resourceService;
