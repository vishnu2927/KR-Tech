import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Blog, blogService, CreateBlogPayload } from "../services/blogService";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "All",
  "System Design",
  "Backend Engineering",
  "Cloud & DevOps",
  "Career & Interviews",
  "Frontend & Full Stack",
];

const PRESET_IMAGES = [
  {
    label: "Distributed Systems",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  },
  {
    label: "Cloud Architecture",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  },
  {
    label: "Microservices & Code",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
  },
  {
    label: "Tech Interview / Career",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
  },
  {
    label: "Cybersecurity & Zero-Trust",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
  },
  {
    label: "Frontend & Full Stack",
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
  },
];

export default function BlogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [activeTag, setActiveTag] = useState<string | null>(
    searchParams.get("tag") || null
  );

  // Modal CMS States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [modalTab, setModalTab] = useState<"content" | "seo" | "preview">("content");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete State
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States for Editor
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("System Design");
  const [formTags, setFormTags] = useState("Microservices, Architecture, Distributed Systems");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formFeaturedImage, setFormFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [formAuthorName, setFormAuthorName] = useState("Karthik R.");
  const [formAuthorRole, setFormAuthorRole] = useState("Principal Systems Architect");
  const [formAuthorAvatar, setFormAuthorAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
  );
  const [formReadTime, setFormReadTime] = useState("8 min read");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");

  // SEO Fields
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");
  const [formCanonicalUrl, setFormCanonicalUrl] = useState("");
  const [formKeywords, setFormKeywords] = useState("");

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load blogs from API
  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getBlogs();
      setBlogs(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load blogs from KR Global Learning server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Sync category changes with URL search params
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTag(null);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    newParams.delete("tag");
    setSearchParams(newParams);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tag", tag);
    setSearchParams(newParams);
  };

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat =
        selectedCategory === "All" ||
        b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchTag = !activeTag || b.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query)) ||
        (b.author?.name && b.author.name.toLowerCase().includes(query));

      return matchCat && matchTag && matchSearch;
    });
  }, [blogs, selectedCategory, activeTag, searchQuery]);

  // Handle Like
  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const res = await blogService.likeBlog(id);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, likes: res.likes } : b))
      );
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingBlog(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("System Design");
    setFormTags("Microservices, Scalability, Architecture");
    setFormExcerpt("");
    setFormContent(
      "## Introduction\n\nIn modern cloud architectures, building scalable and resilient distributed systems is paramount...\n\n### Key Principles\n\n1. **Decoupled Services**: Microservices should remain autonomous.\n2. **Circuit Breakers**: Prevent cascading failure.\n3. **Idempotency**: Guarantee safe retries.\n\n```java\n@CircuitBreaker(name = \"orderService\", fallbackMethod = \"fallbackOrder\")\npublic Order createOrder(OrderRequest request) {\n    return paymentClient.charge(request);\n}\n```\n\n### Summary\n\nDesign for failure from Day 1 to achieve true 99.99% availability."
    );
    setFormFeaturedImage(PRESET_IMAGES[0].url);
    setFormAuthorName(user?.name || "Karthik R.");
    setFormAuthorRole("Principal Systems Architect");
    setFormAuthorAvatar(
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
    );
    setFormReadTime("8 min read");
    setFormStatus("published");
    setFormMetaTitle("");
    setFormMetaDescription("");
    setFormCanonicalUrl("");
    setFormKeywords("System Design, Distributed Systems, Software Architecture");
    setModalTab("content");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (blog: Blog, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormCategory(blog.category);
    setFormTags(blog.tags.join(", "));
    setFormExcerpt(blog.excerpt);
    setFormContent(blog.content);
    setFormFeaturedImage(blog.featuredImage || PRESET_IMAGES[0].url);
    setFormAuthorName(blog.author?.name || "Karthik R.");
    setFormAuthorRole(blog.author?.role || "Staff Software Engineer");
    setFormAuthorAvatar(
      blog.author?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
    );
    setFormReadTime(blog.readTime || "7 min read");
    setFormStatus(blog.status === "draft" ? "draft" : "published");

    // SEO
    setFormMetaTitle(blog.seo?.metaTitle || blog.title);
    setFormMetaDescription(blog.seo?.metaDescription || blog.excerpt);
    setFormCanonicalUrl(blog.seo?.canonicalUrl || "");
    setFormKeywords(
      blog.seo?.keywords && blog.seo.keywords.length > 0
        ? blog.seo.keywords.join(", ")
        : blog.tags.join(", ")
    );
    setModalTab("content");
    setIsModalOpen(true);
  };

  // Auto-generate slug and default SEO when title changes (for new posts)
  const handleTitleChange = (newTitle: string) => {
    setFormTitle(newTitle);
    if (!editingBlog) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generatedSlug);
      setFormMetaTitle(newTitle.slice(0, 60));
    }
  };

  // Auto calculate read time when content changes
  const handleContentChange = (newContent: string) => {
    setFormContent(newContent);
    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setFormReadTime(`${minutes} min read`);
  };

  // Toolbar Formatting helper
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = text.substring(0, start) + replacement + text.substring(end);
    setFormContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  // Submit Blog (Create or Update)
  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Please enter an article title.");
      return;
    }
    if (!formContent.trim()) {
      showToast("Please enter article content.");
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedTags = formTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const parsedKeywords = formKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const payload: CreateBlogPayload = {
        title: formTitle.trim(),
        slug: formSlug.trim() || undefined,
        category: formCategory,
        tags: parsedTags,
        excerpt: formExcerpt.trim() || formContent.slice(0, 160).replace(/[#*`]/g, "") + "...",
        content: formContent,
        featuredImage: formFeaturedImage,
        readTime: formReadTime,
        status: formStatus,
        author: {
          name: formAuthorName.trim() || "KR Global Learning Architect",
          role: formAuthorRole.trim() || "Senior Engineering Mentor",
          avatar: formAuthorAvatar.trim(),
        },
        seo: {
          metaTitle: formMetaTitle.trim() || formTitle.trim(),
          metaDescription:
            formMetaDescription.trim() ||
            (formExcerpt.trim() || formContent.slice(0, 155)),
          canonicalUrl: formCanonicalUrl.trim() || undefined,
          keywords: parsedKeywords,
        },
      };

      if (editingBlog) {
        const updated = await blogService.updateBlog(editingBlog._id, payload);
        setBlogs((prev) => prev.map((b) => (b._id === editingBlog._id ? updated : b)));
        showToast("✓ Blog article updated successfully in Atlas!");
      } else {
        const created = await blogService.createBlog(payload);
        setBlogs((prev) => [created, ...prev]);
        showToast("✓ New blog article published to Atlas!");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || "Failed to save blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      setIsDeleting(true);
      await blogService.deleteBlog(blogToDelete._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete._id));
      showToast("✓ Blog deleted successfully from MongoDB Atlas.");
      setBlogToDelete(null);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete article.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "System Design":
        return "bg-purple-900/60 text-purple-300 border-purple-700/50";
      case "Backend Engineering":
        return "bg-blue-900/60 text-blue-300 border-blue-700/50";
      case "Cloud & DevOps":
        return "bg-emerald-900/60 text-emerald-300 border-emerald-700/50";
      case "Career & Interviews":
        return "bg-amber-900/60 text-amber-300 border-amber-700/50";
      case "Frontend & Full Stack":
        return "bg-cyan-900/60 text-cyan-300 border-cyan-700/50";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 pb-24">
      <SEO
        title="Engineering Blog & System Design Insights | KR Global Learning"
        description="Deep-dive articles on Distributed Systems, High-Scale Backend Engineering, AWS Cloud DevOps, and Technical Interview strategies by Senior Technical Mentors."
        keywords="System Design Blog, Microservices, Redis Caching, Kubernetes EKS, Tech Interview, React 19, Spring Boot, KR Global Learning"
        canonical="https://krtech.in/blogs"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 border border-purple-500/40 rounded-xl shadow-2xl backdrop-blur-md text-slate-100 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-purple-950/20 via-[#0A0D14] to-[#0A0D14]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <I.Sparkles /> KR Global Learning Engineering Blog & System Design CMS
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Architectural Insights for{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  High-Impact Engineers
                </span>
              </h1>
              <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl">
                Battle-tested production patterns, distributed systems case studies, and Staff+ interview playbooks authored by industry leaders.
              </p>
            </div>

            {/* Action CTAs: Add Article CMS button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition duration-200"
              >
                <I.Plus />
                <span>Write Article</span>
              </button>
            </div>
          </div>

          {/* Search & Tag Bar */}
          <div className="mt-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <I.Search />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, microservices, AWS, caching, tags..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  <I.Close />
                </button>
              )}
            </div>

            {/* Tag Filter Reset if active */}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-900/40 border border-purple-500/40 rounded-xl text-xs text-purple-300 hover:bg-purple-800/50"
              >
                <span>Tag: #{activeTag}</span>
                <I.Close />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                    active
                      ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARTICLE LISTINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="py-24 text-center">
            <LoadingSpinner size="lg" label="Fetching live engineering articles from MongoDB Atlas..." />
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-red-950/30 border border-red-800/50 text-center my-8">
            <p className="text-red-400 font-medium mb-3">{error}</p>
            <button
              onClick={loadBlogs}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/80 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-900/30 flex items-center justify-center text-purple-400">
              <I.FileText />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              No engineering articles match "{searchQuery || selectedCategory}". Try adjusting your filters or write a new one with the CMS.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setActiveTag(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "Article" : "Articles"}
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-950/20"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <img
                      src={blog.featuredImage || PRESET_IMAGES[0].url}
                      alt={blog.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadgeClass(
                          blog.category
                        )}`}
                      >
                        {blog.category}
                      </span>
                    </div>

                    {/* Read Time & Date */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
                      <span className="flex items-center gap-1">
                        <I.Clock /> {blog.readTime || "7 min"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="group-hover:text-purple-300 transition text-lg font-bold text-white line-clamp-2 leading-snug mb-2"
                    >
                      {blog.title}
                    </Link>

                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4 flex-1">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tag);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-purple-300 text-[11px] transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {/* Author & Stats Footer */}
                    <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      {/* Author Info */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={blog.author?.avatar || PRESET_IMAGES[0].url}
                          alt={blog.author?.name || "Author"}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                        />
                        <div className="truncate max-w-[120px]">
                          <p className="text-slate-200 font-semibold text-[11px] truncate">
                            {blog.author?.name || "Karthik R."}
                          </p>
                          <p className="text-slate-500 text-[10px] truncate">
                            {blog.author?.role || "Architect"}
                          </p>
                        </div>
                      </div>

                      {/* Views & Interactive Like Button */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400" title="Total Views">
                          <I.FileText /> {blog.views || 0}
                        </span>

                        <button
                          onClick={(e) => handleLike(e, blog._id)}
                          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-800/60 hover:bg-pink-950/40 text-pink-400 hover:text-pink-300 border border-transparent hover:border-pink-800/40 transition"
                          title="Like Article"
                        >
                          ❤️ {blog.likes || 0}
                        </button>
                      </div>
                    </div>

                    {/* Admin Actions: Edit / Delete */}
                    <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                      >
                        Read Full Article <I.ChevronRight />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleOpenEditModal(blog, e)}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-purple-900/50 text-slate-300 hover:text-purple-300 border border-slate-700 transition"
                          title="Edit in CMS"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setBlogToDelete(blog);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-900/50 text-slate-300 hover:text-red-300 border border-slate-700 transition"
                          title="Delete from Atlas"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* BLOG CMS MODAL (CREATE & EDIT WITH RICH TOOLBAR & LIVE SEO SERP PREVIEW) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <I.FileText />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingBlog ? "Edit Blog Article" : "Write New Technical Article"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    KR Global Learning Blog CMS with Rich Markdown & SEO Engine
                  </p>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalTab("content")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    modalTab === "content"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("seo")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    modalTab === "seo"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  SEO & SERP
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("preview")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    modalTab === "preview"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Preview
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <I.Close />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitBlog}>
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
                {/* TAB 1: CONTENT & EDITOR */}
                {modalTab === "content" && (
                  <>
                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Building Resilient Microservices with Spring Boot"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          URL Slug (unique)
                        </label>
                        <div className="flex items-center">
                          <span className="px-3 py-2.5 bg-slate-800 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400 select-none">
                            /blogs/
                          </span>
                          <input
                            type="text"
                            value={formSlug}
                            onChange={(e) => setFormSlug(e.target.value)}
                            placeholder="building-resilient-microservices"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category & Tags & ReadTime */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Category
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                        >
                          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          placeholder="Microservices, Kafka, Redis"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={formReadTime}
                          onChange={(e) => setFormReadTime(e.target.value)}
                          placeholder="8 min read"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Featured Image Selector */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        value={formFeaturedImage}
                        onChange={(e) => setFormFeaturedImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 mb-2"
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap gap-2">
                        {PRESET_IMAGES.map((img) => (
                          <button
                            key={img.label}
                            type="button"
                            onClick={() => setFormFeaturedImage(img.url)}
                            className={`px-2.5 py-1 text-[11px] rounded-lg border transition ${
                              formFeaturedImage === img.url
                                ? "bg-purple-900/50 border-purple-500 text-purple-300"
                                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Article Excerpt / Brief Summary
                      </label>
                      <textarea
                        rows={2}
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        placeholder="A concise 2-sentence summary that appears on blog cards and search results..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Rich Formatting Toolbar & Markdown Content */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          Markdown Article Content *
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {formContent.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>

                      {/* Formatting Bar */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950 border border-b-0 border-slate-800 rounded-t-xl">
                        <button
                          type="button"
                          onClick={() => insertFormatting("## ", "\n")}
                          className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-800 text-slate-300"
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("### ", "\n")}
                          className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-800 text-slate-300"
                          title="Heading 3"
                        >
                          H3
                        </button>
                        <div className="w-[1px] h-4 bg-slate-800 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting("**", "**")}
                          className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-800 text-slate-300"
                          title="Bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("*", "*")}
                          className="px-2 py-1 text-xs italic rounded hover:bg-slate-800 text-slate-300"
                          title="Italic"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("`", "`")}
                          className="px-2 py-1 text-xs font-mono rounded hover:bg-slate-800 text-slate-300"
                          title="Inline Code"
                        >
                          &lt;/&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("\n```typescript\n", "\n```\n")}
                          className="px-2 py-1 text-xs font-mono rounded hover:bg-slate-800 text-slate-300"
                          title="Code Block"
                        >
                          Code Block
                        </button>
                        <div className="w-[1px] h-4 bg-slate-800 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting("> ")}
                          className="px-2 py-1 text-xs rounded hover:bg-slate-800 text-slate-300"
                          title="Quote"
                        >
                          Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("- ")}
                          className="px-2 py-1 text-xs rounded hover:bg-slate-800 text-slate-300"
                          title="Bullet List"
                        >
                          List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("[link text](", ")")}
                          className="px-2 py-1 text-xs rounded hover:bg-slate-800 text-slate-300"
                          title="Link"
                        >
                          Link
                        </button>
                      </div>

                      <textarea
                        ref={contentTextareaRef}
                        required
                        rows={12}
                        value={formContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Write your in-depth engineering article using Markdown..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-b-xl text-slate-100 font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Author Section */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        Author Profile
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={formAuthorName}
                            onChange={(e) => setFormAuthorName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Author Role
                          </label>
                          <input
                            type="text"
                            value={formAuthorRole}
                            onChange={(e) => setFormAuthorRole(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Avatar URL
                          </label>
                          <input
                            type="url"
                            value={formAuthorAvatar}
                            onChange={(e) => setFormAuthorAvatar(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: SEO & GOOGLE SERP PREVIEW */}
                {modalTab === "seo" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40">
                      <h4 className="text-sm font-semibold text-purple-300 mb-1">
                        Search Engine Optimization Engine
                      </h4>
                      <p className="text-xs text-slate-400">
                        Customize meta title, meta description, and indexing tags. Preview how Google and social platforms will render this post.
                      </p>
                    </div>

                    {/* Meta Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          SEO Meta Title (recommended 50-60 characters)
                        </label>
                        <span
                          className={`text-xs font-semibold ${
                            formMetaTitle.length >= 40 && formMetaTitle.length <= 60
                              ? "text-emerald-400"
                              : formMetaTitle.length > 60
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {formMetaTitle.length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formMetaTitle}
                        onChange={(e) => setFormMetaTitle(e.target.value)}
                        placeholder="Building Resilient Microservices with Spring Boot | KR Global Learning"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          SEO Meta Description (recommended 120-160 characters)
                        </label>
                        <span
                          className={`text-xs font-semibold ${
                            formMetaDescription.length >= 120 && formMetaDescription.length <= 160
                              ? "text-emerald-400"
                              : formMetaDescription.length > 160
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {formMetaDescription.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={formMetaDescription}
                        onChange={(e) => setFormMetaDescription(e.target.value)}
                        placeholder="Comprehensive architectural guide for production resilient microservices with circuit breakers, idempotency, and distributed tracing."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Canonical URL & Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Canonical URL (optional)
                        </label>
                        <input
                          type="text"
                          value={formCanonicalUrl}
                          onChange={(e) => setFormCanonicalUrl(e.target.value)}
                          placeholder="https://krtech.in/blogs/my-custom-slug"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Target Keywords
                        </label>
                        <input
                          type="text"
                          value={formKeywords}
                          onChange={(e) => setFormKeywords(e.target.value)}
                          placeholder="Microservices, Spring Cloud, Kafka, Circuit Breaker"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* LIVE GOOGLE SERP PREVIEW BOX */}
                    <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-300">
                      <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                        <span className="w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[10px]">
                          G
                        </span>
                        <span>Google Search Result Snippet Preview</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-[#202124] flex items-center gap-1">
                          <span>https://krtech.in</span>
                          <span>› blogs › {formSlug || "article-slug"}</span>
                        </div>
                        <h4 className="text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                          {formMetaTitle || formTitle || "Article Title | KR Global Learning"}
                        </h4>
                        <p className="text-xs text-[#4d5156] leading-relaxed max-w-2xl">
                          {formMetaDescription ||
                            formExcerpt ||
                            "Article summary and insights snippet for Google Search..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: LIVE MARKDOWN PREVIEW */}
                {modalTab === "preview" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        {formCategory}
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1 mb-2">
                        {formTitle || "Untitled Article"}
                      </h2>
                      <p className="text-slate-400 text-sm mb-4">{formExcerpt}</p>

                      <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4">
                        {formContent.split("\n\n").map((block, idx) => {
                          if (block.startsWith("### ")) {
                            return (
                              <h3 key={idx} className="text-lg font-bold text-purple-300 mt-4">
                                {block.replace("### ", "")}
                              </h3>
                            );
                          }
                          if (block.startsWith("## ")) {
                            return (
                              <h2 key={idx} className="text-xl font-bold text-white mt-5">
                                {block.replace("## ", "")}
                              </h2>
                            );
                          }
                          if (block.startsWith("```")) {
                            return (
                              <pre
                                key={idx}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs overflow-x-auto"
                              >
                                {block.replace(/```[a-z]*/g, "")}
                              </pre>
                            );
                          }
                          if (block.startsWith("> ")) {
                            return (
                              <blockquote
                                key={idx}
                                className="pl-4 border-l-2 border-purple-500 italic text-slate-400 my-3"
                              >
                                {block.replace("> ", "")}
                              </blockquote>
                            );
                          }
                          return (
                            <p key={idx} className="leading-relaxed">
                              {block}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Status:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" fullScreen={false} />
                    ) : (
                      <>
                        <I.Check />
                        <span>{editingBlog ? "Save Changes" : "Publish Article"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-900/30 border border-red-700/50 flex items-center justify-center text-red-400 mx-auto mb-4">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">
              Delete Blog Article?
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              Are you sure you want to permanently delete "{blogToDelete.title}" from MongoDB Atlas? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
