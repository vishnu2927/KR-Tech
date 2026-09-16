import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PdfViewerModal from "../components/resources/PdfViewerModal";
import { Resource, resourceService } from "../services/resourceService";
import { analytics } from "../utils/analytics";

interface ResourceDetailPageProps {
  onOpenDemoModal?: (course?: string) => void;
}

export default function ResourceDetailPage({ onOpenDemoModal }: ResourceDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const item = await resourceService.getResourceById(id);
        if (!isMounted) return;

        if (!item) {
          setError("This resource could not be found in the KR Tech Atlas library.");
          setLoading(false);
          return;
        }

        setResource(item);

        // Fetch related resources in the same category
        try {
          const all = await resourceService.getResources({ category: item.category });
          if (isMounted) {
            setRelatedResources(
              all.filter((r) => r.id !== item.id && r._id !== item._id).slice(0, 3)
            );
          }
        } catch {
          // Non-blocking
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load resource from MongoDB Atlas.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDownload = async () => {
    if (!resource) return;
    setDownloading(true);
    try {
      analytics.trackResourceDownload(resource.title, resource.format);
      resourceService.downloadResourceFile(resource);
      const res = await resourceService.trackDownload(resource.id);
      if (res.success && res.downloadsCount) {
        setResource((prev) => (prev ? { ...prev, downloadsCount: res.downloadsCount } : prev));
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const renderContentBlocks = (rawContent?: string) => {
    if (!rawContent) {
      return (
        <div className="py-8 text-gray-500 italic text-sm">
          No detailed markdown content available for this artifact. Please use the download button to access the full package.
        </div>
      );
    }

    const lines = rawContent.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = "";
    let codeBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim() || "code";
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const currentIdx = codeBlockCount++;
          const codeText = codeBuffer.join("\n");
          elements.push(
            <div key={`block-${currentIdx}`} className="my-6 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 shadow-lg">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-mono uppercase font-bold tracking-wider text-purple-400">
                  {codeLanguage}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(codeText, currentIdx)}
                  className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-semibold cursor-pointer"
                >
                  {copiedCodeIdx === currentIdx ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-emerald-300">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-8 mb-4 pb-3 border-b border-gray-200">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-purple-950 mt-8 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold text-slate-800 mt-5 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={`li-${i}`} className="ml-6 list-disc text-sm sm:text-base text-slate-700 my-1.5 leading-relaxed">
            {line.replace(/^[-*]\s+/, "")}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} className="text-sm sm:text-base text-slate-700 leading-relaxed my-3">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" label="Fetching verified resource from MongoDB Atlas..." />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h1>
        <p className="text-gray-600 max-w-md mb-6">{error || "The requested resource could not be found."}</p>
        <div className="flex gap-4">
          <Link
            to="/resources"
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all text-sm"
          >
            ← Back to All Resources
          </Link>
          <button
            type="button"
            onClick={() => navigate(0)}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SEO
      title={`${resource.title} | Free Download | KR Tech`}
      description={resource.description}
      canonical={`https://krtech.in/resources/${resource.id}`}
    >
      <main className="min-h-screen pt-20 bg-gradient-to-b from-purple-50/40 via-white to-gray-50">
        {/* Breadcrumb Navigation */}
        <div className="container-xl pt-6 pb-2">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-purple-600 transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-purple-700 font-semibold truncate max-w-xs">{resource.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="py-10 bg-white border-b border-purple-100">
          <div className="container-xl">
            <div className="max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                  {resource.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {resource.format} · {resource.fileSize}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  ✓ Verified by {resource.author || "KR Tech Council"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  🔥 {resource.downloadsCount} Downloads
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4 font-sans">
                {resource.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                {resource.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <I.Download />
                  <span>{downloading ? "Starting Download..." : `Download ${resource.format} (${resource.fileSize})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsViewerOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <I.FileText />
                  <span>View PDF / In-App Reader</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{copiedLink ? "✓ Copied Link!" : "Share"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar Grid */}
        <section className="py-12">
          <div className="container-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Full Document Reading Sheet (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-purple-100 p-6 sm:p-10 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <span>DOCUMENT PREVIEW</span>
                    <span>•</span>
                    <span className="text-purple-700 font-semibold">100% UNRESTRICTED ACCESS</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsViewerOpen(true)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    Open In Full Screen ↗
                  </button>
                </div>

                {/* Formatted Content */}
                <div className="prose prose-slate max-w-none">
                  {renderContentBlocks(resource.content)}
                </div>

                {/* End of Document Callout */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-purple-950 mb-1">
                      Save this guide to your local machine
                    </h3>
                    <p className="text-xs text-purple-700">
                      Download the clean formatted offline document to revise anytime.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    Direct Download ({resource.fileSize})
                  </button>
                </div>
              </div>

              {/* Right Column: Sticky Sidebar Info & Mentorship CTA (4 cols) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Quick File Specs Card */}
                <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                    Artifact Specifications
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Document Type</span>
                      <strong className="text-gray-900 font-mono">{resource.format}</strong>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">File Size</span>
                      <strong className="text-gray-900 font-mono">{resource.fileSize}</strong>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Total Downloads</span>
                      <strong className="text-purple-700 font-mono font-bold">{resource.downloadsCount}</strong>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Category</span>
                      <strong className="text-gray-900">{resource.category}</strong>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500">Access Level</span>
                      <strong className="text-emerald-600 font-bold">100% Free</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full mt-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <I.Download />
                    <span>Download Resource</span>
                  </button>
                </div>

                {/* 1:1 Mentorship Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/30 text-purple-300 border border-purple-400/30 mb-3">
                    Personalized Training
                  </span>
                  <h2 className="text-base font-bold text-white mb-2">
                    Struggling to crack technical rounds on this topic?
                  </h2>
                  <p className="text-xs text-purple-200/90 leading-relaxed mb-5">
                    Connect 1-on-1 with senior architects from Amazon, Microsoft & PayPal. Book a free live demonstration class.
                  </p>

                  <button
                    type="button"
                    onClick={() => onOpenDemoModal && onOpenDemoModal(resource.title)}
                    className="w-full py-3 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-xs transition-all shadow-lg text-center cursor-pointer"
                  >
                    Book Free 1-on-1 Demo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources Section */}
        {relatedResources.length > 0 && (
          <section className="py-16 bg-white border-t border-purple-100">
            <div className="container-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Recommended Study Material
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Related in {resource.category}
                  </h2>
                </div>
                <Link
                  to="/resources"
                  className="text-xs font-bold text-purple-700 hover:text-purple-900"
                >
                  View All Resources →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedResources.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="p-6 rounded-3xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">
                          {item.format} · {item.fileSize}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                        <Link to={`/resources/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">
                        🔥 {item.downloadsCount}
                      </span>
                      <Link
                        to={`/resources/${item.id}`}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800"
                      >
                        View Guide →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* In-App PDF Viewer Modal */}
        <PdfViewerModal
          resource={resource}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          onDownloadSuccess={(newCount) => {
            setResource((prev) => (prev ? { ...prev, downloadsCount: newCount } : prev));
          }}
          onOpenDemoModal={onOpenDemoModal}
        />
      </main>
    </SEO>
  );
}
