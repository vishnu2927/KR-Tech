import React, { useState, useEffect } from "react";
import { I } from "../Icons";
import { Resource, resourceService } from "../../services/resourceService";

interface PdfViewerModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadSuccess?: (newCount: string) => void;
  onOpenDemoModal?: (course?: string) => void;
}

export default function PdfViewerModal({
  resource,
  isOpen,
  onClose,
  onDownloadSuccess,
  onOpenDemoModal,
}: PdfViewerModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !resource) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      resourceService.downloadResourceFile(resource);
      const res = await resourceService.trackDownload(resource.id);
      if (res.success && res.downloadsCount && onDownloadSuccess) {
        onDownloadSuccess(res.downloadsCount);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to render formatted markdown-like content cleanly
  const renderFormattedContent = (rawContent?: string) => {
    if (!rawContent) {
      return (
        <div className="py-12 text-center text-gray-500">
          <p className="text-sm">Full content document preview is rendering...</p>
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
          const currentCount = codeBlockCount++;
          const codeText = codeBuffer.join("\n");
          elements.push(
            <div key={`code-${currentCount}`} className="my-5 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-md">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-mono uppercase font-bold tracking-wider">{codeLanguage}</span>
                <button
                  type="button"
                  onClick={() => copyCode(codeText, currentCount)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px] font-semibold"
                >
                  {copiedCodeIdx === currentCount ? "✓ Copied" : "Copy Snippet"}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-emerald-300">
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
          <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-6 mb-3 pb-2 border-b border-gray-200">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold text-purple-900 mt-5 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-bold text-slate-800 mt-4 mb-1">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-sm text-slate-700 my-1 leading-relaxed">
            {line.replace(/^[-*]\s+/, "")}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} className="text-sm text-slate-700 leading-relaxed my-2">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
        {/* Top Viewer Control Bar */}
        <header className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800 shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-purple-600 text-white shrink-0">
              {resource.format || "PDF"}
            </span>
            <h2 className="text-sm sm:text-base font-bold truncate text-slate-100" title={resource.title}>
              {resource.title}
            </h2>
            <span className="hidden md:inline-block text-xs text-slate-400 shrink-0">
              ({resource.fileSize} · {resource.downloadsCount} downloads)
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                disabled={zoomLevel <= 75}
                className="px-2 py-1 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                title="Zoom Out"
              >
                -
              </button>
              <span className="px-2 text-xs font-mono text-slate-300">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                disabled={zoomLevel >= 150}
                className="px-2 py-1 text-xs text-slate-300 hover:text-white disabled:opacity-40"
                title="Zoom In"
              >
                +
              </button>
            </div>

            {/* Print / Save */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print document"
            >
              Print
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <I.Download />
              <span>{downloading ? "Downloading..." : "Download"}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close reader"
            >
              <I.Close />
            </button>
          </div>
        </header>

        {/* Document Scroll Viewport */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center bg-slate-200/90">
          {/* Simulated A4 PDF Document Sheet */}
          <article
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6 sm:p-10 md:p-14 transition-transform duration-200 my-2 relative border border-gray-200"
          >
            {/* Document Header Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-purple-600 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <I.Logo />
                <div>
                  <span className="font-extrabold text-sm text-purple-950 tracking-wider uppercase block">
                    KR TECH ACADEMY
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">
                    Free Student Resource Division · Verified Atlas Artifact
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  {resource.category}
                </span>
                <p className="text-[11px] text-gray-400 mt-1 font-mono">{resource.format} · {resource.fileSize}</p>
              </div>
            </div>

            {/* Resource Description Banner */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 mb-6 text-xs text-purple-900 leading-relaxed">
              <strong className="block font-bold mb-0.5">Overview:</strong>
              {resource.description}
            </div>

            {/* Formatted Content */}
            <div className="prose prose-slate max-w-none">
              {renderFormattedContent(resource.content)}
            </div>

            {/* Document Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <span>Verified by: {resource.author || "KR Tech Technical Council"}</span>
              <span>KR Tech Learning Portal · Page 1 of 1</span>
            </div>
          </article>
        </div>

        {/* Floating Bottom Action Bar */}
        <footer className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 text-gray-600">
            <span>🔥 {resource.downloadsCount} engineers have downloaded this</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span className="hidden md:inline text-emerald-600 font-semibold">✓ 100% Free & Open Access</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDemoModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDemoModal(resource.title);
                }}
                className="px-3 py-1.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold transition-colors cursor-pointer"
              >
                Need 1-on-1 Guidance? Book Free Demo →
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-sm cursor-pointer"
            >
              Download PDF ({resource.fileSize})
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
