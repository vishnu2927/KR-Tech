import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mentorService, Mentor } from "../services/mentorService";
import MentorCard from "../components/MentorCard";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import { SchemaBuilder } from "../utils/seo";

export default function MentorsPage({ onOpenDemoModal }: { onOpenDemoModal?: (mentorOrCourse?: string) => void }) {
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mentorService.getMentors();
      setMentors(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load mentors from live API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const domainCategories = [
    "All",
    "Java Backend",
    "MERN",
    "React",
    "AWS",
    "Azure",
    "Cyber Security",
    "SAP",
    "Salesforce",
    "Power BI",
    "Networking",
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchDomain = selectedDomain === "All" || m.domain === selectedDomain;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.specialization.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q)) ||
      m.languages.some((l) => l.toLowerCase().includes(q));

    return matchDomain && matchQuery;
  });

  return (
    <SEO
      title="Meet Expert Industry Mentors — Ex-Amazon, Razorpay & Google"
      description="Connect 1-on-1 with senior tech mentors with 10+ years experience. Get personalized code reviews, system design coaching, and live project mentorship."
      canonical="https://krtech.in/mentors"
      keywords="tech mentors, 1:1 mentorship, coding mentor, code review, mock interviews, system design mentor, amazon engineer mentor"
      structuredData={SchemaBuilder.getBreadcrumbSchema([
        { name: "Home", url: "https://krtech.in/" },
        { name: "Mentors", url: "https://krtech.in/mentors" },
      ])}
    >
      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 via-white to-purple-50/20">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. Hero Section
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white overflow-hidden text-center">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-xl relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            100% 1-on-1 Dedicated Guidance
          </span>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
            Meet Your Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">Expert Mentors</span>
          </h1>

          <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Learn directly from leaders with <strong className="text-white font-semibold">10+ years of real industry experience</strong> at Amazon, Microsoft, Razorpay, and Atlassian. Get personalized one-on-one sessions tailored to your goals.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-purple-500/20">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans">10+</div>
              <div className="text-xs text-purple-200 mt-1">Specialized Tech Leads</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-sans">10+ Years</div>
              <div className="text-xs text-purple-200 mt-1">Average Industry Exp</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-sans">4.95 / 5.0</div>
              <div className="text-xs text-purple-200 mt-1">Student Satisfaction</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-sans">15,000+</div>
              <div className="text-xs text-purple-200 mt-1">1:1 Sessions Conducted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. Search & Filter Section
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="container-xl">
          {/* Search Input Bar */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white rounded-2xl border border-purple-200 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
              <span className="text-purple-600"><I.Search /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors by name, tech (Java, AWS, React, SAP, Salesforce), or skill…"
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

          {/* Domain Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {domainCategories.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDomain === dom
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200 border border-purple-600"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
            <div>
              Showing <strong className="text-gray-900">{filteredMentors.length}</strong> Mentors
              {selectedDomain !== "All" && <span> in <strong className="text-purple-700">{selectedDomain}</strong></span>}
            </div>
            <Link to="/courses" className="text-xs font-semibold text-purple-600 hover:text-purple-800 no-underline">
              View All Courses & Roadmaps →
            </Link>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm animate-pulse flex flex-col gap-4"
                  style={{ minHeight: 340 }}
                >
                  <div className="h-20 bg-purple-100 rounded-2xl w-full" />
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-full" />
                  <div className="h-4 bg-gray-200 rounded-md w-4/5" />
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-full w-24" />
                    <div className="h-9 bg-purple-200 rounded-xl w-32" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State with Retry */}
          {!loading && error && (
            <div className="text-center py-12 px-6 bg-red-50 rounded-3xl border border-red-200 max-w-2xl mx-auto my-8">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="font-bold text-lg text-red-900 mb-2">Unable to Load Mentors</h3>
              <p className="text-sm text-red-700 mb-5">{error}</p>
              <button
                type="button"
                onClick={fetchMentors}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Live Mentors Grid */}
          {!loading && !error && filteredMentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBookSession={(mentorName) => {
                    if (onOpenDemoModal) onOpenDemoModal(mentorName);
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMentors.length === 0 && (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-purple-200">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-sans font-bold text-lg text-gray-900 mb-1">
                No mentors found matching your query
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Try searching for a different skill or reset your domain filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDomain("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. Mentorship Benefits Section
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-purple-50/50 border-t border-purple-100/60">
        <div className="container-xl">
          <SectionHeading
            badge="The KR Tech Advantage"
            title="How 1:1 Live Mentorship"
            accent="Transforms Careers"
            desc="Unlike pre-recorded MOOCs, you get dedicated private access to an enterprise architect."
            center={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-8 bg-white rounded-3xl border border-purple-100 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold mb-4">
                🎯
              </div>
              <h3 className="font-sans font-extrabold text-base text-gray-900 mb-2">
                Tailored Real-World Capstones
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your mentor reviews your code line-by-line during live screen shares, imparting enterprise design patterns and industry standards.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-cyan-100 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl font-bold mb-4">
                🕒
              </div>
              <h3 className="font-sans font-extrabold text-base text-gray-900 mb-2">
                Flexible Global Timezones
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose convenient slots (morning, evening, or weekends) that align with your work or university schedule without compromising your routine.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4">
                📄
              </div>
              <h3 className="font-sans font-extrabold text-base text-gray-900 mb-2">
                ATS Resume & Portfolio Polish
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Receive senior-level guidance on highlighting your live projects and certification credentials to stand out to global tech recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. CTA Banner
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 shadow-2xl border border-purple-500/20 text-center">
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl lg:text-4xl mb-4">
              Ready to Book Your Free 1:1 Evaluation Session?
            </h2>
            <p className="text-sm md:text-base text-purple-200 max-w-2xl mx-auto mb-8 leading-relaxed">
              Meet your dedicated mentor, discuss your target career path, and receive a customized learning roadmap with zero upfront cost.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/free-demo"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 no-underline"
              >
                <I.Sparkles /> Book Free Demo Class
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-purple-100 bg-white/10 hover:bg-white/15 border border-white/20 transition-all no-underline flex items-center gap-2"
              >
                <I.Code /> Browse All 50+ Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </SEO>
  );
}
