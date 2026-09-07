import { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "../components/Icons";
import SectionHeading from "../components/SectionHeading";

interface ResourceItem {
  id: string;
  title: string;
  category: "PDF Notes" | "Cheat Sheets" | "Interview Questions" | "Resume Templates" | "Roadmaps";
  description: string;
  format: "PDF" | "DOCX" | "ZIP" | "PNG";
  fileSize: string;
  downloadsCount: string;
  tags: string[];
  gradient: string;
}

const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "res-1",
    title: "Complete Java 21 & Spring Boot 3.x Production Handbook",
    category: "PDF Notes",
    description: "In-depth notes on Virtual Threads, Spring Security filters, Hibernate ORM, and Kafka event streaming.",
    format: "PDF",
    fileSize: "8.4 MB",
    downloadsCount: "14.2k",
    tags: ["Java", "Spring Boot", "Microservices"],
    gradient: "from-purple-600 to-indigo-700",
  },
  {
    id: "res-2",
    title: "Modern React 19 & Next.js 15 Cheat Sheet",
    category: "Cheat Sheets",
    description: "Syntax reference for Server Components, Server Actions, Custom Hooks, Zustand, and Tailwind styling.",
    format: "PDF",
    fileSize: "2.8 MB",
    downloadsCount: "18.9k",
    tags: ["React", "Next.js", "TypeScript"],
    gradient: "from-cyan-600 to-blue-700",
  },
  {
    id: "res-3",
    title: "Top 100 Backend & System Design Interview Questions",
    category: "Interview Questions",
    description: "Curated questions with detailed architectural answers for SDE 1, SDE 2, and Senior Backend roles.",
    format: "PDF",
    fileSize: "5.1 MB",
    downloadsCount: "22.5k",
    tags: ["System Design", "HLD / LLD", "Interviews"],
    gradient: "from-rose-600 to-red-700",
  },
  {
    id: "res-4",
    title: "ATS-Optimized Full Stack Developer Resume Template",
    category: "Resume Templates",
    description: "Pre-formatted, recruiter-tested LaTeX and Word template designed to score 95+ on enterprise ATS scanners.",
    format: "DOCX",
    fileSize: "1.2 MB",
    downloadsCount: "29.1k",
    tags: ["Resume", "ATS Friendly", "Career"],
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "res-5",
    title: "Complete Cloud Solutions Architect 2026 Roadmap",
    category: "Roadmaps",
    description: "Step-by-step visual blueprint covering AWS, Azure, GCP, Terraform, Kubernetes, and security fundamentals.",
    format: "PNG",
    fileSize: "6.5 MB",
    downloadsCount: "16.8k",
    tags: ["Cloud", "AWS", "DevOps"],
    gradient: "from-amber-600 to-orange-700",
  },
  {
    id: "res-6",
    title: "Cyber Security & Ethical Hacking Command Line Cheat Sheet",
    category: "Cheat Sheets",
    description: "Wireshark filters, Nmap discovery scripts, Burp Suite shortcuts, and Linux privilege escalation commands.",
    format: "PDF",
    fileSize: "3.4 MB",
    downloadsCount: "11.3k",
    tags: ["Security", "CEH", "Ethical Hacking"],
    gradient: "from-purple-700 to-pink-700",
  },
  {
    id: "res-7",
    title: "Power BI DAX Formulas & Data Modeling Field Guide",
    category: "PDF Notes",
    description: "Comprehensive guide to Time Intelligence DAX functions, Star Schemas, and Power Query transformations.",
    format: "PDF",
    fileSize: "4.6 MB",
    downloadsCount: "9.7k",
    tags: ["Power BI", "DAX", "SQL"],
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    id: "res-8",
    title: "Salesforce Admin & Apex Developer Interview Questions",
    category: "Interview Questions",
    description: "Triggers, Governor Limits, LWC lifecycle hooks, and asynchronous Apex scenario-based questions.",
    format: "PDF",
    fileSize: "3.9 MB",
    downloadsCount: "8.4k",
    tags: ["Salesforce", "Apex", "LWC"],
    gradient: "from-blue-600 to-indigo-800",
  },
  {
    id: "res-9",
    title: "SAP S/4HANA FICO Configuration & T-Codes Guide",
    category: "PDF Notes",
    description: "Complete master guide with all primary transaction codes, ledger configuration, and reconciliation steps.",
    format: "PDF",
    fileSize: "7.2 MB",
    downloadsCount: "6.9k",
    tags: ["SAP", "FICO", "ERP"],
    gradient: "from-teal-600 to-cyan-800",
  },
  {
    id: "res-10",
    title: "Data Structures & Algorithms 75 Essential Patterns Roadmap",
    category: "Roadmaps",
    description: "High-yield LeetCode patterns visual flowchart with code templates in Java, Python, and C++.",
    format: "PDF",
    fileSize: "4.1 MB",
    downloadsCount: "35.4k",
    tags: ["DSA", "LeetCode", "Algorithms"],
    gradient: "from-violet-600 to-purple-800",
  },
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "PDF Notes",
    "Cheat Sheets",
    "Interview Questions",
    "Resume Templates",
    "Roadmaps",
  ];

  const filtered = RESOURCES_DATA.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));

    return matchCat && matchQuery;
  });

  const handleDownload = (res: ResourceItem) => {
    alert(`Downloading ${res.title} (${res.format} · ${res.fileSize})...`);
  };

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 via-white to-purple-50/20">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. Hero Section
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white overflow-hidden text-center">
        <div className="container-xl relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
            <span>📚</span> 100% Free Learning Resources
          </span>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
            Student Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">Library</span>
          </h1>

          <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Download hand-crafted PDF notes, cheat sheets, ATS resume templates, and interview prep guides created by senior industry mentors.
          </p>

          <div className="flex justify-center gap-4 flex-wrap text-xs text-purple-200">
            <span className="flex items-center gap-1.5">✓ No Credit Card Required</span>
            <span className="flex items-center gap-1.5">✓ Direct High-Speed Download</span>
            <span className="flex items-center gap-1.5">✓ Verified by 10+ Year Mentors</span>
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
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
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
              Showing <strong className="text-gray-900">{filtered.length}</strong> Resources
              {selectedCategory !== "All" && <span> in <strong className="text-purple-700">{selectedCategory}</strong></span>}
            </div>
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((res) => (
              <div
                key={res.id}
                className="group relative flex flex-col justify-between bg-white rounded-3xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] hover:border-purple-300 p-6"
              >
                <div>
                  {/* Top Bar (Badge + Format) */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {res.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-gray-100 text-gray-700">
                      {res.format} · {res.fileSize}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-sans font-extrabold text-base text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {res.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {res.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar: Downloads Count + Download CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-medium">
                    🔥 <strong>{res.downloadsCount}</strong> downloads
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(res)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <I.Download /> Download Free
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-xl font-bold text-xs text-purple-950 bg-white hover:bg-purple-50 transition-all no-underline shadow-md"
              >
                Go to Student Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
