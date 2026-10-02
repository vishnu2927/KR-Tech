import React, { useState, useEffect } from "react";
import { learningService, type PortfolioData, type PortfolioProject } from "../services/learningService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function PortfolioBuilderPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"editor" | "preview">("editor");

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setIsLoading(true);
    try {
      const data = await learningService.getMyPortfolio();
      setPortfolio(data);
    } catch (err) {
      console.error("Load portfolio error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!portfolio) return;

    setIsSaving(true);
    try {
      const updated = await learningService.savePortfolio(portfolio);
      setPortfolio(updated);
      setSaveSuccessMsg("Portfolio published successfully!");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Save portfolio error:", err);
      setSaveSuccessMsg("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    if (!portfolio) return;
    const newProj: PortfolioProject = {
      title: "New Enterprise Project",
      description: "Briefly explain the architecture, concurrency challenges, and tech choices.",
      techStack: ["Java 21", "Spring Boot", "React 19"],
      liveUrl: "https://demo.krtech.edu",
      githubUrl: "https://github.com",
      stars: 10,
    };
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, newProj],
    });
  };

  if (isLoading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Student Portfolio Builder | KR Global Learning"
        description="Build, customize, and publish your verified software engineering portfolio with live preview and shareable showcase link."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>🌐</span> Student Web Portfolio
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Portfolio Builder & Live Preview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Public link: <span className="text-cyan-400 font-mono">krtech.edu/p/{portfolio.handle}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch for mobile */}
            <div className="flex lg:hidden bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewTab("editor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${previewTab === "editor" ? "bg-slate-800 text-white" : "text-slate-400"}`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${previewTab === "preview" ? "bg-slate-800 text-white" : "text-slate-400"}`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? "Saving..." : "Publish Portfolio ✓"}
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-semibold text-center">
            {saveSuccessMsg}
          </div>
        )}

        {/* Split Screen Editor & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Form Controls */}
          <div className={`space-y-6 ${previewTab === "preview" ? "hidden lg:block" : ""}`}>
            {/* Basic Info */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
                1. Personal Details & Headline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={portfolio.fullName}
                    onChange={(e) => setPortfolio({ ...portfolio, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Public Handle (Slug)</label>
                  <input
                    type="text"
                    value={portfolio.handle}
                    onChange={(e) => setPortfolio({ ...portfolio, handle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={portfolio.title}
                  onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">About Bio</label>
                <textarea
                  rows={3}
                  value={portfolio.bio}
                  onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={portfolio.skills.join(", ")}
                  onChange={(e) =>
                    setPortfolio({
                      ...portfolio,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Projects Editor */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Featured Projects ({portfolio.projects.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="text-xs px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 font-semibold cursor-pointer"
                >
                  + Add Project
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = portfolio.projects.filter((_, i) => i !== idx);
                          setPortfolio({ ...portfolio, projects: filtered });
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].title = e.target.value;
                        setPortfolio({ ...portfolio, projects: updated });
                      }}
                      placeholder="Project Title"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold"
                    />

                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].description = e.target.value;
                        setPortfolio({ ...portfolio, projects: updated });
                      }}
                      placeholder="Project Description & Metrics"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={proj.githubUrl || ""}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].githubUrl = e.target.value;
                          setPortfolio({ ...portfolio, projects: updated });
                        }}
                        placeholder="GitHub URL"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={proj.liveUrl || ""}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].liveUrl = e.target.value;
                          setPortfolio({ ...portfolio, projects: updated });
                        }}
                        placeholder="Live Demo URL"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Rendered Portfolio Preview */}
          <div className={`space-y-6 ${previewTab === "editor" ? "hidden lg:block" : ""}`}>
            <div className="bg-slate-950 rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl space-y-8 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Preview
                </span>
                <span>krtech.edu/p/{portfolio.handle}</span>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-4">
                <img
                  src={portfolio.avatar}
                  alt={portfolio.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg shrink-0"
                />
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {portfolio.fullName}
                  </h2>
                  <h4 className="text-xs font-semibold text-cyan-400 mt-0.5">
                    {portfolio.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    📍 {portfolio.location}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                "{portfolio.bio}"
              </p>

              {/* Skills */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Technical Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects Preview */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Production Projects ({portfolio.projects.length})
                </span>
                <div className="space-y-3">
                  {portfolio.projects.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-xs font-bold text-white">{p.title}</h5>
                        <span className="text-[10px] text-amber-400 font-mono">⭐ {p.stars || 12}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.map((t, tidx) => (
                          <span key={tidx} className="text-[10px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Preview */}
              {portfolio.certifications && portfolio.certifications.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Verified Certifications
                  </span>
                  <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-300 block">{portfolio.certifications[0].title}</span>
                      <span className="text-[10px] text-slate-400">{portfolio.certifications[0].credentialId}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Verified ✓
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
