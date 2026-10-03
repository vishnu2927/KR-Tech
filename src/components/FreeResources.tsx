import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";

interface Resource {
  title: string;
  category: string;
  format: string;
  size: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeBg: string;
}

export default function FreeResources() {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const resources: Resource[] = [
    {
      title: "Core Java 21 & Spring Boot 3 Master Blueprint",
      category: "Backend",
      format: "PDF (42 Pages)",
      size: "4.8 MB",
      tag: "Architecture Blueprint",
      desc: "Complete reference for Java 21 records, virtual threads, Spring Boot 3.x annotations, JPA/Hibernate mapping, and REST conventions.",
      icon: <I.FileText />,
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "React 19 & Next.js Architecture Cheat Sheet",
      category: "Frontend",
      format: "PDF (36 Pages)",
      size: "3.9 MB",
      tag: "Code Cheat Sheet",
      desc: "Server components, Actions, custom hooks, Tailwind layout patterns, and client-side performance benchmarks.",
      icon: <I.Code />,
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      title: "DSA Coding Patterns & Annotated Solutions",
      category: "DSA",
      format: "PDF (68 Pages)",
      size: "6.2 MB",
      tag: "Problem Solving",
      desc: "14 essential coding patterns (Two Pointers, Sliding Window, DP, Graphs) with annotated code in Java, Python, and C++.",
      icon: <I.Award />,
      iconBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      title: "System Design Architecture Blueprints",
      category: "System Design",
      format: "PDF (50 Pages)",
      size: "8.1 MB",
      tag: "System Design",
      desc: "Architectural blueprints for URL shorteners, Rate limiters, Distributed Caching, Message Queues, and Sharding.",
      icon: <I.Database />,
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Technical Portfolio & Project Presentation Guide",
      category: "Portfolio",
      format: "PDF & Template",
      size: "1.8 MB",
      tag: "Project Guide",
      desc: "Structured guide for presenting software engineering capstones, architectural documentation, and GitHub repositories.",
      icon: <I.Briefcase />,
      iconBg: "bg-amber-50 text-amber-700 border-amber-200",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Python Automation & Web Scraping Playbook",
      category: "Python",
      format: "PDF (28 Pages)",
      size: "3.2 MB",
      tag: "Hands-on Playbook",
      desc: "Step-by-step handbook covering BeautifulSoup, Selenium, async requests, API consumption, and automated workflows.",
      icon: <I.Bot />,
      iconBg: "bg-purple-50 text-purple-700 border-purple-200",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  const handleDownload = (title: string) => {
    setDownloadedItem(title);
    setTimeout(() => {
      setDownloadedItem(null);
    }, 4000);
  };

  return (
    <section id="resources" className="py-24 bg-white relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-xs mb-3">
              <I.Sparkles /> FREE STUDY BLUEPRINTS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Developer Cheatsheets & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Free Resources</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Level up your tech knowledge with our free curated cheat sheets, architecture blueprints, and templates.
            </p>
          </div>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 self-start md:self-auto text-blue-600 font-bold no-underline text-sm hover:text-blue-800 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md transition-all"
          >
            <span>Explore All Materials</span>
            <I.ChevronRight />
          </Link>
        </div>

        {/* Download Success Toast */}
        {downloadedItem && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-md animate-scaleIn text-left text-xs sm:text-sm">
            <span className="text-emerald-600 text-lg shrink-0 font-bold">✓</span>
            <span>
              Downloading <strong>"{downloadedItem}"</strong>! Check your browser downloads.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${r.iconBg}`}
                  >
                    {r.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${r.badgeBg}`}
                  >
                    {r.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors min-h-[44px]">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {r.desc}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
                  <span>{r.format} · {r.size}</span>
                  <span className="text-blue-600 font-bold">{r.tag}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(r.title)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
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

