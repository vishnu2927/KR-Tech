import api from "./api";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "System Design" | "Backend Engineering" | "Cloud & DevOps" | "Career & Interviews" | "Frontend & Full Stack" | string;
  tags: string[];
  featuredImage: string;
  author: BlogAuthor;
  readTime: string;
  views: number;
  likes: number;
  status: "published" | "draft" | "archived";
  seo: BlogSEO;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  author?: Partial<BlogAuthor>;
  readTime?: string;
  status?: "published" | "draft" | "archived";
  seo?: BlogSEO;
}

export interface BlogQueryParams {
  category?: string;
  tag?: string;
  search?: string;
  status?: string;
}

export const blogService = {
  // Get all blogs with optional query filtering
  async getBlogs(params?: BlogQueryParams): Promise<Blog[]> {
    try {
      const response = await api.get("/blogs", { params });
      return response.data?.blogs || [];
    } catch (error) {
      console.error("Failed to fetch blogs from Atlas:", error);
      throw error;
    }
  },

  // Get single blog by slug or ID with related articles
  async getBlogBySlug(slug: string): Promise<{ blog: Blog; relatedBlogs: Blog[] }> {
    try {
      const response = await api.get(`/blogs/${encodeURIComponent(slug)}`);
      return {
        blog: response.data?.blog,
        relatedBlogs: response.data?.relatedBlogs || [],
      };
    } catch (error) {
      console.error(`Failed to fetch blog by slug ${slug}:`, error);
      throw error;
    }
  },

  // Create a new blog post
  async createBlog(payload: CreateBlogPayload): Promise<Blog> {
    try {
      const response = await api.post("/blogs", payload);
      return response.data?.blog;
    } catch (error) {
      console.error("Failed to create blog post:", error);
      throw error;
    }
  },

  // Update existing blog
  async updateBlog(id: string, payload: Partial<CreateBlogPayload>): Promise<Blog> {
    try {
      const response = await api.put(`/blogs/${encodeURIComponent(id)}`, payload);
      return response.data?.blog;
    } catch (error) {
      console.error(`Failed to update blog ${id}:`, error);
      throw error;
    }
  },

  // Delete blog
  async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/blogs/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete blog ${id}:`, error);
      throw error;
    }
  },

  // Increment like counter
  async likeBlog(id: string): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await api.post(`/blogs/${encodeURIComponent(id)}/like`);
      return {
        success: true,
        likes: response.data?.likes ?? 0,
      };
    } catch (error) {
      console.error(`Failed to like blog ${id}:`, error);
      throw error;
    }
  },
};

export default blogService;
