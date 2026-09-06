import { useState, useRef } from "react";
import { I } from "./Icons";

export default function AIMentor() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi! I'm Kira, your KR Tech AI Mentor. What would you like to learn or build today?" },
    { from: "user", text: "What's the best way to prepare for Java backend and Spring Boot?" },
    {
      from: "bot",
      text: "Great question! Focus on: 1) Core Java (OOP, Collections, Streams), 2) Spring Boot internals & REST APIs, 3) Microservices & Docker, 4) Real projects. In KR Tech's 1:1 Live Training, our mentor guides you step-by-step with code reviews. Would you like a sample roadmap?",
    },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!msg.trim()) return;
    const userText = msg;
    setChat((c) => [
      ...c,
      { from: "user", text: userText },
      {
        from: "bot",
        text: "That's a fantastic goal! With KR Tech's 1:1 mentorship, we create a personalized curriculum specifically around this. You can book a free demo class to discuss this with an expert mentor directly!",
      },
    ]);
    setMsg("");
    setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const feats = [
    "Instant doubt resolution, 24/7",
    "Personalized study plan generation",
    "Code review and debugging assistance",
    "Conceptual explanations with step-by-step examples",
    "Seamless transition to 1:1 human mentor sessions",
  ];

  return (
    <section id="ai-mentor" style={{ padding: "80px 0", background: "white" }}>
      <div className="container-xl">
        <div className="two-col items-center">
          <div>
            <span
              className="badge"
              style={{
                background: "linear-gradient(135deg,#EDE9FE,#CFFAFE)",
                color: "#7C3AED",
                border: "1px solid #DDD6FE",
                marginBottom: 16,
                display: "inline-block",
              }}
            >
              AI-Powered Assistant
            </span>
            <h2 className="section-title">
              Meet <span className="gradient-text">Kira</span> — Your AI Mentor
            </h2>
            <p className="section-desc">
              Available 24/7, Kira helps you understand tough programming concepts, debug errors, plan study schedules,
              and prepare for 1:1 live sessions.
            </p>
            <ul style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {feats.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#4B5563" }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <I.Check />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32 }}>
              <a
                href="#chat-box"
                className="btn-primary"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                Chat with Kira <I.Bot />
              </a>
            </div>
          </div>

          <div
            id="chat-box"
            style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid #E5E7EB",
              boxShadow: "0 20px 64px rgba(124,58,237,0.1)",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <I.Bot />
              </div>
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: 14, color: "white" }}>
                  Kira — AI Mentor
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.78)" }}>Always online · Instant reply</span>
                </div>
              </div>
            </div>

            <div
              ref={chatRef}
              style={{
                height: 290,
                overflowY: "auto",
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "#FAFAFA",
              }}
            >
              {chat.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "12px 16px",
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: "Inter,sans-serif",
                      background: m.from === "user" ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "white",
                      color: m.from === "user" ? "white" : "#374151",
                      borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                gap: 10,
                background: "white",
              }}
            >
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask Kira anything about programming, courses, doubts…"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 14,
                  border: "1px solid #E5E7EB",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 13,
                  color: "#374151",
                  outline: "none",
                  background: "#F9FAFB",
                }}
              />
              <button
                onClick={send}
                className="btn-primary"
                style={{ padding: "10px 18px", borderRadius: 14, fontSize: 13 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
