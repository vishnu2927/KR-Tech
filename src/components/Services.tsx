import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function Services() {
  const services = [
    {
      icon: <I.Play />,
      label: "One-on-One Live Training",
      desc: "Get personalized live training from experienced mentors with 10+ years of industry experience.",
      color: "#7C3AED",
      bg: "#EDE9FE",
      tag: "Personalized",
    },
    {
      icon: <I.Clock />,
      label: "Flexible Training Schedule",
      desc: "Classes are scheduled according to your availability and preferred time zone, making learning convenient for students and working professionals.",
      color: "#0891B2",
      bg: "#CFFAFE",
      tag: "Custom Timings",
    },
    {
      icon: <I.BarChart />,
      label: "Dashboard Access",
      desc: "Get your own student dashboard with course progress, class schedule, assignments, and learning resources.",
      color: "#7C3AED",
      bg: "#EDE9FE",
      tag: "Full Tracking",
    },
    {
      icon: <I.Database />,
      label: "Recorded Lectures & Notes",
      desc: "Access recordings of every live session along with well-structured notes and study materials anytime.",
      color: "#0891B2",
      bg: "#CFFAFE",
      tag: "Lifetime Access",
    },
    {
      icon: <I.Bot />,
      label: "Doubt-Clearing Sessions",
      desc: "Enjoy dedicated one-on-one doubt-solving sessions for personalized guidance and better understanding.",
      color: "#7C3AED",
      bg: "#EDE9FE",
      tag: "1:1 Support",
    },
    {
      icon: <I.Award />,
      label: "Resume Building & Project Support",
      desc: "Receive ATS-friendly resume guidance and complete support for academic and real-world projects.",
      color: "#0891B2",
      bg: "#CFFAFE",
      tag: "End-to-End",
    },
  ];

  return (
    <section id="services" className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Why KR Tech"
            title="Why Choose"
            accent="KR Tech"
            desc="Everything you need to learn, build, and grow — with expert mentors by your side."
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {services.map((c, i) => (
            <div
              key={i}
              className="card service-card"
              style={{
                padding: 28,
                textAlign: "left",
                background: "white",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: c.bg,
                    color: c.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                  }}
                >
                  {c.icon}
                </div>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.color,
                    background: c.bg,
                    padding: "3px 10px",
                    borderRadius: 99,
                  }}
                >
                  {c.tag}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0F0A1E",
                  marginBottom: 8,
                }}
              >
                {c.label}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: "#6B7280" }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
