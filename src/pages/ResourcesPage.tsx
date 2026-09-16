import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PdfViewerModal from "../components/resources/PdfViewerModal";
import { Resource, resourceService } from "../services/resourceService";
import { analytics } from "../utils/analytics";

interface ResourcesPageProps {
  onOpenDemoModal?: (course?: string) => void;
}

export default function ResourcesPage({ onOpenDemoModal }: ResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // In-app PDF Viewer state
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = [
    "All",
    "PDF Notes",
    "Cheat Sheets",
    "Interview Questions",
    "Resume Templates",
    "Roadmaps",
  ];

  // Fetch from live MongoDB Atlas
  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } catch (err: any) {
      console.error("Resources fetch error:", err);
      setError("Unable to load resources from MongoDB Atlas. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Filter resources based on category and search query
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
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
  }, [resources, selectedCategory, searchQuery]);

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
      title="Free Learning Resources, Cheat Sheets & Interview Questions | KR Tech"
      description="Download free PDF cheat sheets, System Design interview roadmaps, Java/Spring Boot handbooks, and ATS resume templates verified by KR Tech mentors."
      canonical="https://krtech.in/resources"
    >
      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 via-white to-purple-50/20">
        {/* ─────────────────────────────────────────────────────────────────────────────
            1. Hero Section
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="relative py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white overflow-hidden text-center">
          <div className="container-xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
              <span>📚</span> Live MongoDB Atlas Resources Portal
            </span>

            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
              Student Resource{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">
                Library
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Download hand-crafted PDF notes, cheat sheets, ATS resume templates, and interview prep guides created by senior industry mentors.
            </p>

            <div className="flex justify-center gap-6 flex-wrap text-xs text-purple-200">
              <span className="flex items-center gap-1.5 font-medium">✓ 100% Free & Open Access</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Direct High-Speed Download</span>
              <span className="flex items-center gap-1.5 font-medium">✓ In-App Instant PDF Reader</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Verified by MAANG Mentors</span>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. Search & Category Filters
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-10">
          <div className="container-xl">
            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center gap-3 px-5 py-3.5 bg-white rounded-2xl border border-purple-200 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                <span className="text-purple-600"><I.Search /></span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, cheat sheets, interview questions, resume templates, roadmaps…"
                  className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200 border border-purple-600"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <div>
                Showing <strong className="text-gray-900">{filteredResources.length}</strong> Resources
                {selectedCategory !== "All" && (
                  <span>
                    {" "}in <strong className="text-purple-700">{selectedCategory}</strong>
                  </span>
                )}
              </div>
              <span className="text-xs text-purple-600 font-medium">
                Live Atlas Collection
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" label="Connecting to MongoDB Atlas resource collection..." />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-8 my-6 rounded-2xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto">
                <p className="text-red-700 font-semibold mb-3">{error}</p>
                <button
                  type="button"
                  onClick={loadResources}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Retry Connecting
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredResources.length === 0 && (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  🔍
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">No matching resources found</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Try adjusting your search query or switching to another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Resource Cards Grid */}
            {!loading && !error && filteredResources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div
                    key={res.id || res._id}
                    className="group relative flex flex-col justify-between bg-white rounded-3xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] hover:border-purple-300 p-6"
                  >
                    <div>
                      {/* Top Bar (Badge + Format) */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          {res.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-gray-100 text-gray-700 font-mono">
                          {res.format} · {res.fileSize}
                        </span>
                      </div>

                      {/* Title linking to Detail Page */}
                      <h2 className="font-sans font-extrabold text-base text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
                        <Link to={`/resources/${res.id}`} className="hover:underline">
                          {res.title}
                        </Link>
                      </h2>

                      {/* Description */}
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {res.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {res.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div>
                      <div className="pt-3 pb-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>🔥 <strong>{res.downloadsCount}</strong> downloads</span>
                        <Link
                          to={`/resources/${res.id}`}
                          className="font-bold text-purple-600 hover:text-purple-800 text-[11px] flex items-center gap-0.5"
                        >
                          Full Details →
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {/* View PDF / In-App Reader Button */}
                        <button
                          type="button"
                          onClick={(e) => handleViewPdf(res, e)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Open In-App PDF Reader"
                        >
                          <I.FileText />
                          <span>View PDF</span>
                        </button>

                        {/* Direct Download Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDownload(res, e)}
                          disabled={downloadingId === res.id}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                          title="Download Resource"
                        >
                          <I.Download />
                          <span>{downloadingId === res.id ? "Saving..." : "Download"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. Need More Materials Banner
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="container-xl">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-purple-500/20">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">
                  1:1 Student Portal
                </span>
                <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-white mb-2">
                  Enrolled Students Get 500+ GB of Private Course Assets
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
                  Access production starter code repos, Docker setup scripts, sandbox lab environments, and recorded lecture archives directly in your dashboard.
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenDemoModal && onOpenDemoModal("Full Stack Web Development")}
                  className="px-5 py-3 rounded-xl font-bold text-xs text-purple-950 bg-white hover:bg-purple-50 transition-all shadow-md cursor-pointer"
                >
                  Book Free Demo Class →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* In-App PDF Reader Modal */}
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
            }
          }}
          onOpenDemoModal={onOpenDemoModal}
        />
      </main>
    </SEO>
  );
}
