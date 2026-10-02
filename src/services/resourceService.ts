import api from "./api";

export interface Resource {
  _id?: string;
  id: string;
  title: string;
  category: "PDF Notes" | "Cheat Sheets" | "Interview Questions" | "Resume Templates" | "Roadmaps" | string;
  description: string;
  format: string;
  fileSize: string;
  downloadCount?: number;
  downloadsCount: string;
  tags: string[];
  content?: string;
  author?: string;
  downloadUrl?: string;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourcePayload {
  title: string;
  category: string;
  description?: string;
  format?: string;
  fileSize?: string;
  tags?: string[];
  content?: string;
  author?: string;
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
  async trackDownload(id: string): Promise<{ success: boolean; downloadsCount: string; downloadCount?: number }> {
    try {
      const response = await api.post(`/resources/${encodeURIComponent(id)}/download`);
      return {
        success: response.data?.success ?? true,
        downloadsCount: response.data?.downloadsCount || "",
        downloadCount: response.data?.downloadCount,
      };
    } catch (error) {
      console.error(`Failed to track download for ${id}:`, error);
      return { success: false, downloadsCount: "" };
    }
  },

  // Direct backend download URL
  getDownloadUrl(id: string): string {
    const baseUrl = api.defaults.baseURL || "/api";
    return `${baseUrl}/resources/${encodeURIComponent(id)}/download`;
  },

  // Admin upload/create resource
  async createResource(payload: CreateResourcePayload): Promise<{ success: boolean; resource: Resource }> {
    const response = await api.post("/resources", payload);
    return response.data;
  },

  // Admin delete resource
  async deleteResource(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/resources/${encodeURIComponent(id)}`);
    return response.data;
  },

  // Client-side helper to trigger file download with formatted document content
  downloadResourceFile(resource: Resource) {
    const filename = `${resource.id || resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    const header = `================================================================================
KR GLOBAL LEARNING FREE RESOURCES PORTAL
Title: ${resource.title}
Category: ${resource.category}
Author: ${resource.author || "KR Global Learning Senior Architect Council"}
Format: ${resource.format} | File Size: ${resource.fileSize}
Verified by KR Global Learning (https://krgloballearning.com)
================================================================================\n\n`;

    const body = resource.content || resource.description;
    const footer = `\n\n================================================================================
Need 1-on-1 mentorship or live instructor training?
Book your free demo session at KR Global Learning: https://krgloballearning.com/free-demo
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
