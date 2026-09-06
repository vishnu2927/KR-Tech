import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function FreeDemoSection({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <section className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            textAlign: "center",
            background: "white",
            borderRadius: 28,
            padding: "54px 36px",
            border: "1px solid #EDE9FE",
            boxShadow: "0 20px 60px rgba(124,58,237,0.08)",
          }}
        >
          <span className="badge badge-green" style={{ marginBottom: 16, display: "inline-block" }}>
            Zero Cost · Zero Commitment
          </span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            Start with a <span className="gradient-text">Free 1:1 Live Demo</span>
          </h2>
          <p className="section-desc" style={{ margin: "16px auto 0", maxWidth: 580 }}>
            Experience KR Tech before enrolling. Attend a personalized one-on-one live demo session with our senior
            industry mentor, understand the curriculum, and get a tailored career roadmap.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginTop: 28,
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            {[
              "1:1 Live Interaction",
              "Personalized Roadmap",
              "Meet Your Trainer",
              "Direct Q&A",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#4B5563",
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#DCFCE7",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <I.Check />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onOpenModal}
              className="btn-primary"
              style={{ padding: "14px 34px", fontSize: 15, borderRadius: 16 }}
            >
              <I.Sparkles /> Book Your Free Demo
            </button>
            <Link
              to="/courses"
              className="btn-ghost"
              style={{ padding: "14px 30px", fontSize: 15, borderRadius: 16, textDecoration: "none" }}
            >
              Explore All Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
