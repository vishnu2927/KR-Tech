import { useState, useEffect } from "react";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";
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
    <section id="mentors" style={{ padding: "80px 0", background: "white" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 52 }}>
          <SectionHeading
            badge="Industry Mentors"
            badgeClass="badge-cyan"
            title="Learn Directly From"
            accent="10+ Yrs Mentors"
            desc="Our trainers are active senior engineers and architects from tier-1 tech firms. No teaching assistants."
          />
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm animate-pulse flex flex-col gap-4"
                style={{ minHeight: 280 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-md w-full" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                  <div className="h-9 bg-purple-200 rounded-xl w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
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
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {mentors.map((m) => {
              const taughtCourses = Array.isArray(m.coursesTaught) && m.coursesTaught.length > 0
                ? m.coursesTaught.join(", ")
                : m.specialization;

              return (
                <div
                  key={m.id}
                  className="card mentor-card"
                  style={{
                    padding: 24,
                    background: "white",
                    borderRadius: 24,
                    border: "1.5px solid #EDE9FE",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                      <img
                        src={m.image}
                        alt={m.name}
                        className="mentor-avatar"
                        style={{ width: 68, height: 68, borderRadius: 18, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0A1E" }}>
                          {m.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "Poppins,sans-serif",
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#7C3AED",
                            marginTop: 2,
                          }}
                        >
                          {m.role}
                        </div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                          {m.company || "Top Tech MNC"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: 99,
                        }}
                      >
                        ⭐ {m.exp}
                      </span>
                      <span className="badge" style={{ background: "#F3F4F6", color: "#4B5563" }}>
                        {taughtCourses}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {(m.languages || ["English", "Hindi"]).map((l) => (
                        <span
                          key={l}
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "#EDE9FE",
                            color: "#6D28D9",
                            fontWeight: 500,
                          }}
                        >
                          🗣 {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #F3F4F6",
                      paddingTop: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <a
                      href={m.linkedin || "https://linkedin.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0891B2",
                        fontFamily: "Poppins,sans-serif",
                        textDecoration: "none",
                      }}
                    >
                      <I.Linkedin /> LinkedIn Profile
                    </a>

                    <button
                      onClick={() => onOpenDemo && onOpenDemo(m.name)}
                      className="btn-primary"
                      style={{ fontSize: 12, padding: "8px 14px", borderRadius: 10 }}
                    >
                      Book 1:1 Session
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
