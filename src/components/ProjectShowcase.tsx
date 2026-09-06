import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

interface Project {
  title: string;
  tagline: string;
  tech: string[];
  stars: string;
  forks: string;
  builtBy: string;
  course: string;
  previewUrl: string;
  image: string;
  highlights: string[];
}

export default function ProjectShowcase({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const projects: Project[] = [
    {
      title: "Netflix Streaming Platform Clone",
      tagline: "Full-featured video streaming web app with authentication and recommendation feeds.",
      tech: ["React 19", "Tailwind CSS", "Firebase Auth", "TMDB API", "Stripe"],
      stars: "1.4k",
      forks: "380",
      builtBy: "Aman Gupta",
      course: "MERN Stack Bootcamp",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=340&fit=crop&auto=format",
      highlights: ["Custom video player controls", "User watch history & playlists", "Stripe payment simulation"],
    },
    {
      title: "High-Scale E-Commerce Microservices",
      tagline: "Distributed microservices engine with event-driven architecture and real-time inventory.",
      tech: ["Java 21", "Spring Boot", "Kafka", "Docker", "PostgreSQL", "Next.js"],
      stars: "2.1k",
      forks: "620",
      builtBy: "Rohan V.",
      course: "Java Backend Bootcamp",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=340&fit=crop&auto=format",
      highlights: ["CQRS pattern implementation", "Distributed tracing with Zipkin", "Kafka event streaming"],
    },
    {
      title: "Real-Time Collaboration Chat & Code App",
      tagline: "Multi-room instant messaging and live collaborative code editor with syntax highlighting.",
      tech: ["Node.js", "WebSockets", "Redis", "MongoDB", "Monaco Editor"],
      stars: "940",
      forks: "210",
      builtBy: "Sneha P.",
      course: "Full Stack Engineering",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=340&fit=crop&auto=format",
      highlights: ["End-to-end WebSocket rooms", "Redis Pub/Sub scaling", "Live multi-cursor editing"],
    },
    {
      title: "AI Developer Assistant & Code Debugger",
      tagline: "Intelligent chatbot with automated error trace debugging and unit test generator.",
      tech: ["Python", "FastAPI", "OpenAI API", "PyTorch", "React"],
      stars: "1.8k",
      forks: "490",
      builtBy: "Karthik R.",
      course: "AI & ML Program",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&h=340&fit=crop&auto=format",
      highlights: ["Automated AST parsing", "Prompt chaining & embeddings", "Zero-shot bug diagnosis"],
    },
    {
      title: "Cloud Weather & Climate Analytics Dashboard",
      tagline: "Interactive multi-city weather forecasting platform with historical climate trends.",
      tech: ["TypeScript", "React 19", "Chart.js", "OpenWeather", "Vite"],
      stars: "820",
      forks: "140",
      builtBy: "Meera Nair",
      course: "Modern Frontend Mastery",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=340&fit=crop&auto=format",
      highlights: ["Dynamic interactive charts", "Geolocation auto-detect", "Offline cached forecasts"],
    },
    {
      title: "Interactive 3D Developer Portfolio",
      tagline: "Immersive 3D interactive portfolio featuring custom shaders and smooth camera motion.",
      tech: ["Three.js", "React Three Fiber", "Framer Motion", "Tailwind CSS"],
      stars: "1.6k",
      forks: "330",
      builtBy: "Aditya S.",
      course: "Full Stack Web Development",
      previewUrl: "#",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=340&fit=crop&auto=format",
      highlights: ["Custom 3D model loaders", "Physics-based particles", "60 FPS mobile optimization"],
    },
  ];

  return (
    <section id="projects" style={{ padding: "80px 0", background: "white" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Student Showcase"
            badgeClass="badge-cyan"
            title="Real Projects Built in"
            accent="1:1 Live Training"
            desc="Explore real capstone applications built, deployed, and published by KR Tech learners under 10+ years mentor supervision."
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((p, i) => (
            <div
              key={i}
              className="card"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1.5px solid #EDE9FE",
                display: "flex",
                flexDirection: "column",
                background: "white",
              }}
            >
              {/* Image banner */}
              <div className="card-img-wrap" style={{ position: "relative", height: 180 }}>
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(15,10,30,0.7) 0%, transparent 60%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(15,10,30,0.85)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <I.Github /> ★ {p.stars}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    background: "rgba(124,58,237,0.85)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  By {p.builtBy} · {p.course}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#0F0A1E",
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>{p.tagline}</p>

                {/* Tech tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {p.tech.map((t) => (
                    <span key={t} className="github-tag">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  {p.highlights.map((h, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#4B5563" }}>
                      <span style={{ color: "#10B981" }}><I.Check /></span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>1:1 Project Guidance</span>
                  <button
                    onClick={onOpenDemo}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#7C3AED",
                      background: "#EDE9FE",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Build This 1:1 <I.ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
