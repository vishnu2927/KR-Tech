import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";

interface Resource {
  title: string;
  category: string;
  format: string;
  size: string;
  downloads: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
}

export default function FreeResources() {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const resources: Resource[] = [
    {
      title: "Core Java 21 & Spring Boot 3 Master Blueprint",
      category: "Backend",
      format: "PDF (42 Pages)",
      size: "4.8 MB",
      downloads: "14.2K Downloads",
      desc: "Complete reference for Java 21 records, virtual threads, Spring Boot 3.x annotations, JPA/Hibernate mapping, and REST conventions.",
      icon: <I.FileText />,
      accent: "#06B6D4",
    },
    {
      title: "React 19 & Next.js Architecture Cheat Sheet",
      category: "Frontend",
      format: "PDF (36 Pages)",
      size: "3.9 MB",
      downloads: "18.9K Downloads",
      desc: "Server components, Actions, custom hooks, Tailwind layout patterns, and client-side performance benchmarks.",
      icon: <I.Code />,
      accent: "#A78BFA",
    },
    {
      title: "DSA 250+ LeetCode Patterns & Annotated Solutions",
      category: "DSA",
      format: "PDF (68 Pages)",
      size: "6.2 MB",
      downloads: "28.5K Downloads",
      desc: "14 essential coding patterns (Two Pointers, Sliding Window, DP, Graphs) with annotated code in Java, Python, and C++.",
      icon: <I.Award />,
      accent: "#38BDF8",
    },
    {
      title: "Top 100 System Design Interview Blueprints",
      category: "System Design",
      format: "PDF (50 Pages)",
      size: "8.1 MB",
      downloads: "21.4K Downloads",
      desc: "Architectural blueprints for URL shorteners, Rate limiters, Distributed Caching, Message Queues, and Sharding.",
      icon: <I.Database />,
      accent: "#10B981",
    },
    {
      title: "ATS-Friendly Tech Resume Template & Portfolio Guide",
      category: "Career",
      format: "DOCX & Figma",
      size: "1.8 MB",
      downloads: "32.1K Downloads",
      desc: "Battle-tested technical portfolio and profile template with action verb guides and bullet-point project impact metrics.",
      icon: <I.Briefcase />,
      accent: "#F59E0B",
    },
    {
      title: "Python Automation & Web Scraping Playbook",
      category: "Python",
      format: "PDF (28 Pages)",
      size: "3.2 MB",
      downloads: "12.7K Downloads",
      desc: "Step-by-step handbook covering BeautifulSoup, Selenium, async requests, API consumption, and automated bot workflows.",
      icon: <I.Bot />,
      accent: "#EC4899",
    },
  ];

  const handleDownload = (title: string) => {
    setDownloadedItem(title);
    setTimeout(() => {
      setDownloadedItem(null);
    }, 4000);
  };

  return (
    <section id="resources" className="py-24 bg-dark-purple relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background ambient lighting */}
      <div className="orb" style={{ width: 500, height: 500, top: -100, left: -60, background: "rgba(6,182,212,0.18)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -100, right: -40, background: "rgba(124,58,237,0.22)" }} />

      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md mb-3">
              <I.Sparkles /> 100% FREE STUDY BLUEPRINTS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Developer Cheatsheets & <span className="gradient-text-warm">Free Resources</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl">
              Level up your tech knowledge with our free curated cheat sheets, architecture blueprints, and resume templates.
            </p>
          </div>
          <Link
            to="/resources"
            className="btn-ghost-white flex items-center gap-2 self-start md:self-auto text-cyan-300 font-semibold no-underline text-sm hover:text-white px-5 py-2.5 rounded-xl"
          >
            Explore All Free Materials <I.ChevronRight />
          </Link>
        </div>

        {/* Download Success Toast */}
        {downloadedItem && (
          <div
            className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 shadow-xl backdrop-blur-md animate-scaleIn text-left text-xs sm:text-sm"
          >
            <span className="text-emerald-400 text-lg shrink-0">✓</span>
            <span>
              Downloading <strong>"{downloadedItem}"</strong>! Check your browser downloads.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={i}
              className="glass-card-dark p-6 flex flex-col justify-between text-left group hover:border-purple-400/50"
              style={{
                background: "rgba(18, 12, 38, 0.8)",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                    style={{
                      background: `${r.accent}20`,
                      border: `1px solid ${r.accent}50`,
                      color: r.accent,
                    }}
                  >
                    {r.icon}
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: r.accent,
                      border: `1px solid ${r.accent}40`,
                    }}
                  >
                    {r.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors min-h-[44px]">
                  {r.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-3">
                  {r.desc}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pt-3 border-t border-white/10">
                  <span>{r.format} · {r.size}</span>
                  <span className="text-cyan-400 font-semibold">{r.downloads}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(r.title)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-purple-600/40 hover:border-purple-400/50 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <I.Download /> Download Free Resource
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
