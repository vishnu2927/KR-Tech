import { useState } from "react";
import { I } from "./Icons";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section
      style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(140deg,#7C3AED 0%,#5B21B6 45%,#0891B2 100%)",
      }}
    >
      <div
        className="orb"
        style={{ width: 440, height: 440, top: -160, right: -80, background: "rgba(255,255,255,0.08)" }}
      />
      <div
        className="orb"
        style={{ width: 300, height: 300, bottom: -100, left: "15%", background: "rgba(255,255,255,0.05)" }}
      />

      <div className="container-xl" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span
          className="badge"
          style={{ background: "rgba(255,255,255,0.18)", color: "white", marginBottom: 20, display: "inline-block" }}
        >
          Stay Updated
        </span>
        <h2
          style={{
            fontFamily: "Poppins,sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem,4vw,2.6rem)",
            color: "white",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Get Free Study Materials & Tech Roadmaps
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 36,
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join 50,000+ engineers receiving weekly developer tips, system design cheat sheets, and course updates.
        </p>

        {done ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 32px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <I.Check />
            </span>
            <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, color: "white" }}>
              You're subscribed! Welcome to the KR Tech community.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: 12,
              maxWidth: 540,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 240,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <I.Mail />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 14,
                  color: "white",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "14px 28px",
                borderRadius: 16,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 700,
                fontSize: 14,
                background: "white",
                color: "#7C3AED",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              Subscribe Free
            </button>
          </form>
        )}
        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
