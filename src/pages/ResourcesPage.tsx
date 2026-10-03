import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PdfViewerModal from "../components/resources/PdfViewerModal";
import { Resource, resourceService } from "../services/resourceService";
import { analytics } from "../utils/analytics";
import { useAuth } from "../context/AuthContext";

interface ResourcesPageProps {
  onOpenDemoModal?: (course?: string) => void;
}

export default function ResourcesPage({ onOpenDemoModal }: ResourcesPageProps) {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);

  // Bookmarks State (persisted to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("krt_bookmarked_resources");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Summary Modal state
  const [aiSummaryModalResource, setAiSummaryModalResource] = useState<Resource | null>(null);

  // In-app PDF Viewer state
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = [
    "All",
    "PDF Notes",
    "Cheat Sheets",
    "Roadmaps",
    "Templates",
    "Code Snippets",
    "Practice Questions",
    "AI Summaries",
  ];

  // Default fallback resources in case backend is empty
  const defaultResources: Resource[] = [
    {
      id: "res-01",
      title: "Java 21 & Spring Boot 3 Microservices Architecture Handbook",
      category: "PDF Notes",
      description: "Complete architectural guide covering Virtual Threads, Kafka event sourcing, CQRS patterns, and Dockerized microservice deployments.",
      format: "PDF",
      fileSize: "6.8 MB",
      downloadsCount: "2,420+",
      tags: ["Java 21", "Spring Boot", "Kafka", "Microservices"],
      author: "Senior Staff Architect",
      content: "# Java 21 & Spring Boot 3 Handbook\n\n## Virtual Threads\nExplore Project Loom concurrency model.\n\n## Kafka Event Sourcing\nIdempotent consumer patterns and transaction management.",
    },
    {
      id: "res-02",
      title: "AWS Cloud Solutions Architect SAA-C03 Quick Reference Sheet",
      category: "Cheat Sheets",
      description: "Comprehensive exam cheat sheet with VPC CIDR subnetting, IAM least-privilege matrix, S3 storage tiers, and Transit Gateway topologies.",
      format: "PDF",
      fileSize: "3.4 MB",
      downloadsCount: "3,890+",
      tags: ["AWS", "Cloud Architecture", "VPC", "SAA-C03"],
      author: "AWS Principal Architect",
      content: "# AWS SAA-C03 Exam Cheat Sheet\n\n- VPC Peering vs Transit Gateway\n- S3 Glacier Instant Retrieval\n- Aurora Multi-Master Replication",
    },
    {
      id: "res-03",
      title: "Full Stack Engineer 2026 Master Learning Roadmap",
      category: "Roadmaps",
      description: "Step-by-step roadmap from frontend fundamentals to advanced distributed systems, Next.js 15, Redis caching, and Docker orchestration.",
      format: "PDF",
      fileSize: "4.1 MB",
      downloadsCount: "5,110+",
      tags: ["Roadmap", "Full Stack", "Next.js", "System Design"],
      author: "Technical Steering Council",
      content: "# Full Stack Roadmap 2026\n\n1. Beginner Foundations\n2. Microservices\n3. Cloud Deployment",
    },
    {
      id: "res-04",
      title: "Production-Grade Kubernetes & Terraform Starter Templates",
      category: "Templates",
      description: "Production-ready Helm charts, Terraform HCL multi-region configurations, and GitHub Actions CI/CD workflow YAML templates.",
      format: "ZIP / Code",
      fileSize: "8.2 MB",
      downloadsCount: "1,940+",
      tags: ["Terraform", "Kubernetes", "Helm", "CI/CD"],
      author: "Cloud Infrastructure Team",
      content: "# Kubernetes & Terraform Starter\n\n- Multi-region VPC IaC\n- Helm deployment configs",
    },
    {
      id: "res-05",
      title: "Top 50 Distributed Systems & Concurrency Code Snippets",
      category: "Code Snippets",
      description: "Reusable code recipes for distributed locking with Redlock, circuit breakers with Resilience4j, and token bucket rate limiters.",
      format: "ZIP / Code",
      fileSize: "2.1 MB",
      downloadsCount: "2,760+",
      tags: ["Code Snippets", "Concurrency", "Redis", "Resilience"],
      author: "Distributed Systems Lead",
      content: "# Distributed Systems Snippets\n\n- Rate Limiting with Redis\n- Optimistic Locking",
    },
    {
      id: "res-06",
      title: "System Design & DSA 250 Diagnostic Practice Questions",
      category: "Practice Questions",
      description: "250 curated questions with step-by-step architectural diagrams, trade-off breakdowns, and time-space complexity proofs.",
      format: "PDF",
      fileSize: "7.5 MB",
      downloadsCount: "4,320+",
      tags: ["Practice Questions", "DSA", "System Design", "Diagnostic"],
      author: "Algorithms Faculty",
      content: "# System Design & DSA Practice Questions\n\n- Distributed Hash Tables\n- LRU Cache Implementation",
    },
    {
      id: "res-07",
      title: "AI & Large Language Models Executive Technical Summary",
      category: "AI Summaries",
      description: "AI-generated synthesis of LangChain RAG architectures, vector similarity reranking algorithms, and model fine-tuning best practices.",
      format: "PDF",
      fileSize: "3.9 MB",
      downloadsCount: "3,150+",
      tags: ["AI Summaries", "LLM", "RAG", "LangChain"],
      author: "AI Research Group",
      content: "# AI & LLM Technical Summary\n\n- Retrieval Augmented Generation\n- Vector Database Indices",
    },
  ];

  // Fetch from live MongoDB Atlas
  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResources();
      if (Array.isArray(data) && data.length > 0) {
        setResources(data);
      } else {
        setResources(defaultResources);
      }
    } catch (err: any) {
      console.error("Resources fetch error, using curated library:", err);
      setResources(defaultResources);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("krt_bookmarked_resources", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save bookmark:", err);
      }
      showToast(prev.includes(id) ? "Removed from bookmarks" : "★ Added to bookmarks!");
      return updated;
    });
  };

  // Filter resources based on category, search query, and bookmarks
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const isBookmarked = bookmarkedIds.includes(r.id || (r as any)._id);
      if (onlyBookmarked && !isBookmarked) return false;

      const matchCat =
        selectedCategory === "All" ||
        r.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        (Array.isArray(r.tags) && r.tags.some((t) => t.toLowerCase().includes(q)));

      return matchCat && matchQuery;
    });
  }, [resources, selectedCategory, searchQuery, onlyBookmarked, bookmarkedIds]);

  // Handle direct file download + track in Atlas
  const handleDownload = async (res: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(res.id);
    try {
      analytics.trackResourceDownload(res.title, res.format);
      resourceService.downloadResourceFile(res);
      const trackRes = await resourceService.trackDownload(res.id);

      if (trackRes.success && trackRes.downloadsCount) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === res.id ? { ...item, downloadsCount: trackRes.downloadsCount } : item
          )
        );
        showToast(`✓ Downloaded "${res.title}"`);
      } else {
        showToast(`✓ Downloaded "${res.title}"`);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  // Open in-app PDF / Document Viewer
  const handleViewPdf = (res: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveResource(res);
    setIsViewerOpen(true);
  };

  return (
    <SEO
      title="Free Learning Resource Library — PDF Notes, Cheat Sheets, Roadmaps & Snippets | KR Global Learning"
      description="Access free PDF notes, architecture cheat sheets, course roadmaps, code snippets, practice questions, and AI summaries curated by KR Global Learning senior mentors."
      canonical="https://krgloballearning.com/resources"
    >
      <main className="pt-24 pb-20 min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-blue-700 border border-blue-200 shadow-sm mb-4">
            <span>📚</span> VERIFIED RESOURCE LIBRARY
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight mb-4 font-['Poppins']">
            Curated Technology{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
              Resource Library
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Hand-crafted PDF notes, architecture cheat sheets, learning roadmaps, code snippets, practice questions, and AI summaries curated by senior tech architects.
          </p>

          <div className="flex justify-center items-center gap-4 flex-wrap text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">✓ 100% Open Access</span>
            <span className="flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">✓ Instant Downloads</span>
            <span className="flex items-center gap-1.5 font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">✓ In-App Document Reader</span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">✓ AI Study Summaries</span>
          </div>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="w-full md:max-w-md">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 shadow-sm transition-all">
                <span className="text-blue-600"><I.Search /></span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PDF notes, cheat sheets, roadmaps, snippets..."
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Bookmarks Toggle Filter */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                  onlyBookmarked
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-amber-400"
                }`}
              >
                <span>★</span>
                <span>Saved Bookmarks ({bookmarkedIds.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOnlyBookmarked(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat && !onlyBookmarked
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
            <div>
              Showing <strong className="text-slate-900">{filteredResources.length}</strong> resources
              {selectedCategory !== "All" && (
                <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>
              )}
              {onlyBookmarked && (
                <span className="text-amber-600 font-semibold"> (Filtered by Bookmarks)</span>
              )}
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-slate-900 text-base mb-1">No resources found</h3>
              <p className="text-xs text-slate-500 mb-4">
                Try adjusting your search query or reset the category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setOnlyBookmarked(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => {
                const isBookmarked = bookmarkedIds.includes(res.id || (res as any)._id);
                return (
                  <div
                    key={res.id || (res as any)._id}
                    className="group relative flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6 shadow-sm"
                  >
                    <div>
                      {/* Top Bar (Category + Format + Bookmark Star) */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {res.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                            {res.format} · {res.fileSize}
                          </span>

                          {/* Bookmark Toggle */}
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(res.id || (res as any)._id, e)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isBookmarked
                                ? "bg-amber-50 border-amber-300 text-amber-600"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                            }`}
                            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                          >
                            ★
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="font-sans font-bold text-base text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                        {res.title}
                      </h2>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {res.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {res.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-blue-700 border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div>
                      <div className="pt-3 pb-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>🔥 <strong>{res.downloadsCount}</strong> downloads</span>
                        {/* AI Summary Trigger */}
                        <button
                          type="button"
                          onClick={() => setAiSummaryModalResource(res)}
                          className="font-bold text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <I.Sparkles /> AI Summary →
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {/* Preview / Read Button */}
                        <button
                          type="button"
                          onClick={(e) => handleViewPdf(res, e)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                        >
                          <I.FileText />
                          <span>Preview</span>
                        </button>

                        {/* Direct Download Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownload(res, e)}
                          disabled={downloadingId === res.id}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <I.Download />
                          <span>{downloadingId === res.id ? "Saving..." : "Download"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* AI Summary Modal */}
        {aiSummaryModalResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setAiSummaryModalResource(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <I.Sparkles /> AI Generated Study Summary
              </div>

              <h2 className="font-display font-bold text-lg text-slate-900">
                {aiSummaryModalResource.title}
              </h2>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-blue-800 uppercase tracking-wider text-[10px]">
                  Key Concept Takeaways:
                </div>
                <p className="leading-relaxed">
                  {aiSummaryModalResource.description}
                </p>
                <ul className="space-y-1 list-disc list-inside text-slate-600 pt-1">
                  <li>Master foundational architecture patterns before writing microservice code.</li>
                  <li>Incorporate automated unit & integration testing in your Git pipeline.</li>
                  <li>Align implementation with official vendor certification blueprints.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Format: {aiSummaryModalResource.format}</span>
                <button
                  type="button"
                  onClick={() => {
                    handleDownload(aiSummaryModalResource);
                    setAiSummaryModalResource(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  Download Full Material
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-App PDF / Document Viewer Modal */}
        <PdfViewerModal
          resource={activeResource}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          onDownloadSuccess={(newCount) => {
            if (activeResource) {
              setResources((prev) =>
                prev.map((item) =>
                  item.id === activeResource.id ? { ...item, downloadsCount: newCount } : item
                )
              );
              showToast(`✓ Download counter updated to ${newCount}`);
            }
          }}
          onOpenDemoModal={onOpenDemoModal}
        />

      </main>
    </SEO>
  );
}
