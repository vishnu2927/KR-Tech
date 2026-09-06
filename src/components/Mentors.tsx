import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function Mentors({ onOpenDemo }: { onOpenDemo?: (mentorName?: string) => void }) {
  const mentors = [
    {
      name: "Rajesh Kumar",
      role: "Senior SDE @ Amazon",
      exp: "10+ yrs exp",
      courses: "Java Backend, Spring Boot, Microservices",
      languages: ["English", "Hindi"],
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-Microsoft · IIT Delhi",
      rating: "4.9★ (380+ sessions)",
    },
    {
      name: "Ananya Singh",
      role: "Lead ML Engineer @ Google",
      exp: "10+ yrs exp",
      courses: "AI & ML, Deep Learning, PyTorch",
      languages: ["English", "Hindi"],
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-Flipkart · IIT Bombay",
      rating: "4.9★ (420+ sessions)",
    },
    {
      name: "Vikram Nair",
      role: "Staff Frontend Engineer @ Razorpay",
      exp: "10+ yrs exp",
      courses: "React 19, MERN Stack, Next.js",
      languages: ["English", "Tamil", "Hindi"],
      avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-Swiggy · BITS Pilani",
      rating: "4.8★ (510+ sessions)",
    },
    {
      name: "Divya Menon",
      role: "Principal Data Scientist @ Microsoft",
      exp: "10+ yrs exp",
      courses: "Data Science, Python, SQL, BI",
      languages: ["English", "Malayalam"],
      avatar: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-Walmart Labs · NIT Trichy",
      rating: "4.9★ (290+ sessions)",
    },
    {
      name: "Karan Shah",
      role: "Principal Architect @ Paytm",
      exp: "12+ yrs exp",
      courses: "System Design, DSA, Node.js",
      languages: ["English", "Hindi", "Gujarati"],
      avatar: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-Ola · IIT Madras",
      rating: "5.0★ (640+ sessions)",
    },
    {
      name: "Pooja Reddy",
      role: "AI & NLP Specialist @ Infosys",
      exp: "10+ yrs exp",
      courses: "NLP, LLMs, GenAI & Python",
      languages: ["English", "Telugu"],
      avatar: "https://images.unsplash.com/photo-1604872412583-53667c1a6fcf?w=200&h=200&fit=crop&auto=format",
      prev: "Ex-TCS Innovation · VIT",
      rating: "4.8★ (310+ sessions)",
    },
  ];

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {mentors.map((m, i) => (
            <div
              key={i}
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
                    src={m.avatar}
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
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{m.prev}</div>
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
                    {m.courses}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {m.languages.map((l) => (
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
                  href="https://linkedin.com"
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
          ))}
        </div>
      </div>
    </section>
  );
}
