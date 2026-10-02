import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Blog, blogService } from "../services/blogService";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch blog data
  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await blogService.getBlogBySlug(slug);
        if (!result.blog) {
          setError("Article not found or has been moved.");
          return;
        }
        setBlog(result.blog);
        setRelatedBlogs(result.relatedBlogs || []);
        setLikeCount(result.blog.likes || 0);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load blog article."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Handle Like
  const handleLike = async () => {
    if (!blog) return;
    try {
      const res = await blogService.likeBlog(blog._id);
      setIsLiked(true);
      setLikeCount(res.likes);
      showToast("❤️ Thanks for liking this article!");
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  // Share Handlers
  const handleCopyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("✓ Article link copied to clipboard!");
  };

  const handleShareTwitter = () => {
    if (!blog) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${blog.title}" by KR Global Learning:`);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  const handleShareWhatsApp = () => {
    if (!blog) return;
    const text = encodeURIComponent(
      `Read this engineering article on KR Global Learning: ${blog.title}\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" label="Loading Technical Article from Atlas..." />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-slate-200 flex flex-col items-center justify-center p-6 pt-28">
        <div className="max-w-md w-full text-center p-8 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/30 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <I.FileText />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            {error || "The requested engineering article does not exist or has been removed."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    image: blog.featuredImage,
    author: {
      "@type": "Person",
      name: blog.author?.name || "KR Global Learning Architect",
      jobTitle: blog.author?.role || "Software Architect",
    },
    publisher: {
      "@type": "Organization",
      name: "KR Global Learning",
      logo: {
        "@type": "ImageObject",
        url: "https://krtech.in/logo.png",
      },
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blog.seo?.canonicalUrl || `https://krtech.in/blogs/${blog.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-purple-600/30 selection:text-purple-200 pb-28">
      {/* Dynamic SEO Meta Injection */}
      <SEO
        title={blog.seo?.metaTitle || `${blog.title} | KR Global Learning Engineering`}
        description={blog.seo?.metaDescription || blog.excerpt}
        keywords={
          blog.seo?.keywords && blog.seo.keywords.length > 0
            ? blog.seo.keywords.join(", ")
            : blog.tags.join(", ")
        }
        canonical={blog.seo?.canonicalUrl || `https://krtech.in/blogs/${blog.slug}`}
        ogType="article"
        ogTitle={blog.seo?.metaTitle || blog.title}
        ogDescription={blog.seo?.metaDescription || blog.excerpt}
        ogImage={blog.featuredImage}
        ogUrl={`https://krtech.in/blogs/${blog.slug}`}
        structuredData={structuredData}
      />

      {/* Reading Progress Indicator Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 border border-purple-500/40 rounded-xl shadow-2xl backdrop-blur-md text-slate-100 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ARTICLE HEADER HERO */}
      <div className="pt-28 pb-12 border-b border-slate-800/60 bg-gradient-to-b from-purple-950/20 via-[#0A0D14] to-[#0A0D14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-purple-300 transition"
            >
              ← Back to Engineering Blog
            </Link>
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-900/50 text-purple-300 border border-purple-700/50">
              {blog.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <I.Clock /> {blog.readTime || "8 min read"}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              )}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <I.FileText /> {blog.views} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            {blog.excerpt}
          </p>

          {/* Author Card & Social Actions Header */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={blog.author?.avatar}
                alt={blog.author?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40"
              />
              <div>
                <p className="text-white font-bold text-sm">
                  {blog.author?.name || "Karthik R."}
                </p>
                <p className="text-slate-400 text-xs">
                  {blog.author?.role || "Staff Systems Architect"}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isLiked
                    ? "bg-pink-950/60 border-pink-700 text-pink-300"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-pink-500/50 hover:text-pink-300"
                }`}
              >
                <span>❤️</span>
                <span>{likeCount}</span>
              </button>

              <button
                onClick={handleCopyArticleLink}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Copy Link"
              >
                🔗 Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED BANNER IMAGE */}
      {blog.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-purple-950/20 bg-slate-950">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      )}

      {/* ARTICLE BODY & MARKDOWN RENDERER */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-slate-300 text-base leading-relaxed">
          {blog.content.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();

            // Heading 2
            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-6 pb-2 border-b border-slate-800/80"
                >
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            // Heading 3
            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  className="text-xl font-bold text-purple-300 pt-4"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            // Code Block
            if (trimmed.startsWith("```")) {
              const lines = trimmed.split("\n");
              const language = lines[0].replace("```", "") || "code";
              const codeBody = lines.slice(1, -1).join("\n");

              return (
                <div
                  key={idx}
                  className="relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#07090E] shadow-xl"
                >
                  <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono uppercase font-semibold text-purple-400">
                      {language}
                    </span>
                    <button
                      onClick={() => handleCopyCode(codeBody, idx)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
                    >
                      {copiedCodeIndex === idx ? (
                        <>
                          <I.Check /> <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span> <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{codeBody}</code>
                  </pre>
                </div>
              );
            }

            // Blockquote
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote
                  key={idx}
                  className="p-4 my-6 rounded-r-xl border-l-4 border-purple-500 bg-purple-950/15 text-slate-300 italic text-sm sm:text-base leading-relaxed"
                >
                  {trimmed.replace(/^>\s*/, "")}
                </blockquote>
              );
            }

            // Unordered List
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s*/, ""));
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 text-slate-300 my-4 pl-2">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            // Ordered List
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
              return (
                <ol key={idx} className="list-decimal list-inside space-y-2 text-slate-300 my-4 pl-2">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }

            // Standard Paragraph
            return (
              <p key={idx} className="leading-relaxed text-slate-300">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* TAGS SECTION */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Article Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 text-xs transition border border-slate-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* SOCIAL SHARE & LIKE FOOTER BAR */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition ${
                isLiked
                  ? "bg-pink-950/60 border-pink-600 text-pink-300"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              }`}
            >
              <span>❤️</span>
              <span>{isLiked ? "Liked" : "Like Article"}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-xs">
                {likeCount}
              </span>
            </button>
            <span className="text-xs text-slate-400">
              Enjoyed this deep dive? Share it with your engineering team.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLinkedIn}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-[#0077b5] text-slate-300 hover:text-white transition"
              title="Share on LinkedIn"
            >
              <I.Linkedin />
            </button>
            <button
              onClick={handleShareTwitter}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Share on Twitter / X"
            >
              <I.Twitter />
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-[#25D366] text-slate-300 hover:text-white transition"
              title="Share on WhatsApp"
            >
              <I.MessageCircle />
            </button>
            <button
              onClick={handleCopyArticleLink}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
              title="Copy Link"
            >
              🔗 Copy
            </button>
          </div>
        </div>

        {/* CTA CARD FOR TECH TRACKS */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-blue-950/60 border border-purple-500/30 text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 text-xs font-semibold mb-3 border border-purple-600/40">
              Master Level Engineering
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to Design Systems at Scale?
            </h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
              Join KR Global Learning live cohorts mentored by Principal Architects from top tech companies. Learn real-world microservices, distributed cache design, and high-volume data pipelines.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/courses"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition"
              >
                Explore Live Cohorts →
              </Link>
              <Link
                to="/free-demo"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition"
              >
                Book Free Demo Session
              </Link>
            </div>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">
              Related Engineering Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/blogs/${rel.slug}`}
                  className="group flex gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition"
                >
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-purple-400 uppercase">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-300 transition line-clamp-2 mt-0.5 mb-1">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <I.Clock /> {rel.readTime || "7 min"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
