import { useState, useEffect } from "react";
import { I } from "./Icons";
import { mentorService, Mentor } from "../services/mentorService";

export default function Mentors({ onOpenDemo }: { onOpenDemo?: (mentorName?: string) => void }) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mentorService.getMentors();
      setMentors(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load mentors from Atlas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <section id="mentors" className="py-24 bg-dark-obsidian relative overflow-hidden text-white border-t border-purple-500/15">
      {/* Background ambient lighting */}
      <div className="orb" style={{ width: 550, height: 550, top: -100, right: -80, background: "rgba(6,182,212,0.2)" }} />
      <div className="orb" style={{ width: 500, height: 500, bottom: -120, left: -60, background: "rgba(124,58,237,0.22)" }} />

      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-3">
            <I.Sparkles /> TECH ARCHITECTS & PRACTITIONERS
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Learn Directly From <span className="gradient-text-warm">Experienced Mentors</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl mx-auto">
            Our trainers are experienced engineers and software architects who guide you One-on-One through hands-on technical sessions.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="glass-card-dark p-6 animate-pulse flex flex-col gap-4"
                style={{ minHeight: 280 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/15 rounded-md w-3/4" />
                    <div className="h-4 bg-white/10 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-white/10 rounded-md w-full" />
                <div className="h-4 bg-white/10 rounded-md w-3/4" />
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="h-6 bg-white/10 rounded-full w-24" />
                  <div className="h-9 bg-purple-500/20 rounded-xl w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12 px-6 bg-rose-950/40 rounded-3xl border border-rose-500/30 max-w-2xl mx-auto my-8">
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="font-bold text-lg text-rose-200 mb-2">Unable to Load Mentors</h3>
            <p className="text-sm text-rose-300/80 mb-5">{error}</p>
            <button
              type="button"
              onClick={fetchMentors}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition-colors shadow-lg cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Live Mentors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m) => {
              const taughtCourses = Array.isArray(m.coursesTaught) && m.coursesTaught.length > 0
                ? m.coursesTaught.join(", ")
                : m.specialization;

              return (
                <div
                  key={m.id || (m as any)._id}
                  className="glass-card-dark p-6 flex flex-col justify-between group hover:border-purple-400/50"
                  style={{
                    background: "rgba(18, 12, 38, 0.8)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                  }}
                >
                  <div>
                    {/* Mentor Header: Avatar, Name, Company */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative shrink-0">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-purple-400/30 group-hover:border-cyan-400 transition-colors"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0F0A1E] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </span>
                      </div>

                      <div className="text-left flex-1 min-w-0">
                        <div className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors truncate">
                          {m.name}
                        </div>
                        <div className="text-xs font-semibold text-purple-300 mt-0.5 truncate">
                          {m.role}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                          <span className="text-cyan-400">🏢</span>
                          <span className="font-medium text-gray-300">{m.company || "Top Tech MNC"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges: Experience & Specialization */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
                        ⭐ {m.exp}
                      </span>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 truncate max-w-[200px]">
                        {taughtCourses}
                      </span>
                    </div>

                    {/* Bio / Key strengths preview */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-4 text-left line-clamp-2">
                      {m.bio || "Specialized in distributed cloud architectures, high-concurrency microservices, and live pair-programming mentorship."}
                    </p>

                    {/* Spoken Languages */}
                    <div className="flex gap-1.5 mb-5 flex-wrap">
                      {(m.languages || ["English", "Hindi"]).map((l) => (
                        <span
                          key={l}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-purple-200 border border-purple-500/20 font-medium"
                        >
                          🗣 {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: LinkedIn & One-on-One Booking Action */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <a
                      href={m.linkedin || "https://linkedin.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors no-underline"
                    >
                      <I.Linkedin /> Profile
                    </a>

                    <button
                      type="button"
                      onClick={() => onOpenDemo && onOpenDemo(m.name)}
                      className="btn-primary text-xs py-2 px-4 rounded-xl cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                      }}
                    >
                      Book One-on-One Learning Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
