import { useState } from "react";
import { I } from "./Icons";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const stories = [
    {
      name: "Arjun Mehta",
      role: "Full Stack Developer",
      prev: "B.Tech Student, NIT Trichy",
      quote:
        "The one-on-one live training at KR Tech was a game changer. My mentor tailored every session to my pace, and the project support helped me build a real portfolio. The flexible schedule made it easy to learn alongside college.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&auto=format",
      highlight: "1:1 Live Training",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Data Analyst",
      prev: "Commerce Graduate",
      quote:
        "Coming from a non-CS background was intimidating. But KR Tech's recorded lectures and doubt-clearing sessions made learning so accessible. I could rewatch classes anytime and get my doubts resolved one-on-one. Best investment ever!",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&auto=format",
      highlight: "Recorded Lectures",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Backend Developer",
      prev: "Engineering Graduate",
      quote:
        "KR Tech's Java Backend course is incredibly comprehensive. The resume building support helped me create an ATS-friendly resume, and the project guidance gave me real work to showcase. My confidence skyrocketed!",
      avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&h=120&fit=crop&auto=format",
      highlight: "Resume Building",
      rating: 5,
    },
    {
      name: "Sneha Patel",
      role: "ML Enthusiast",
      prev: "Working Professional",
      quote:
        "As a working professional, I needed flexible timings — and KR Tech delivered perfectly. My mentor scheduled sessions around my work hours. The doubt-clearing sessions and recorded notes meant I never felt lost.",
      avatar: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?w=120&h=120&fit=crop&auto=format",
      highlight: "Flexible Schedule",
      rating: 5,
    },
  ];

  return (
    <section className="bg-dark-purple" style={{ padding: "88px 0" }}>
      <div className="container-xl">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="badge badge-dark">Success Stories</span>
          <h2 className="section-title section-title-white" style={{ marginTop: 12 }}>
            Hear From Our <span className="gradient-text-warm">Learners</span>
          </h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 28 }}>
          {stories.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 18px",
                borderRadius: 16,
                cursor: "pointer",
                border: `1px solid ${i === active ? "#7C3AED" : "rgba(255,255,255,0.1)"}`,
                background: i === active ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.05)",
                transition: "all 0.2s",
              }}
            >
              <img
                src={s.avatar}
                alt={s.name}
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: 13, color: "white" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.role}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Active card */}
        <div
          className="card-dark"
          style={{ padding: "40px 44px", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}
        >
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <img
              src={stories[active].avatar}
              alt={stories[active].name}
              style={{ width: 100, height: 100, borderRadius: 20, objectFit: "cover", border: "3px solid #7C3AED" }}
            />
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, color: "white", marginTop: 14 }}>
              {stories[active].name}
            </div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: 13, color: "#A78BFA", marginTop: 4 }}>
              {stories[active].highlight}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {[...Array(stories[active].rating)].map((_, j) => (
                <I.Star key={j} />
              ))}
            </div>
            <p
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: "clamp(15px,2vw,18px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.9)",
                fontStyle: "italic",
                marginBottom: 20,
              }}
            >
              "{stories[active].quote}"
            </p>
            <div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14, color: "white" }}>
                {stories[active].name}
              </div>
              <div style={{ fontSize: 13, color: "#A78BFA", marginTop: 2 }}>{stories[active].role}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", marginTop: 4 }}>
                Background: {stories[active].prev}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
