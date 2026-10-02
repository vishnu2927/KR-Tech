import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function CommunitySection() {
  const channels = [
    {
      name: "YouTube Hub",
      members: "Official Video Learning",
      desc: "Watch in-depth technical architecture breakdowns, coding tutorials, live stream archives, and certification guides.",
      badge: "Watch Free",
      actionText: "Subscribe on YouTube",
      url: "https://youtube.com/@krgloballeaning?si=ZuFhhdkJl0HR9zQ5",
      color: "#DC2626",
      bg: "#FEF2F2",
      icon: <I.Youtube />,
    },
    {
      name: "Telegram Channel",
      members: "Active Tech Community",
      desc: "Daily system design notes, architecture case studies, practice questions, and direct batch announcements.",
      badge: "Daily Updates",
      actionText: "Join Telegram Channel",
      url: "https://t.me/krglobal0713",
      color: "#0284C7",
      bg: "#E0F2FE",
      icon: <I.Telegram />,
    },
    {
      name: "X (Twitter) Feed",
      members: "Industry Insights",
      desc: "Follow real-time engineering updates, industry tech trends, and thought leadership from KR Global mentors.",
      badge: "Live Feed",
      actionText: "Follow on X",
      url: "https://x.com/KRGlobal1307",
      color: "#0F172A",
      bg: "#F1F5F9",
      icon: <I.Twitter />,
    },
    {
      name: "Instagram",
      members: "Learner Life & Spotlights",
      desc: "Explore learner highlights, mentor Q&As, daily tech tips, and sneak peeks into live One-on-One sessions.",
      badge: "Community",
      actionText: "Follow on Instagram",
      url: "https://www.instagram.com/krglobal0713?utm_source=qr&stkn=bzJhYWIzemRnZ212",
      color: "#E11D48",
      bg: "#FFF1F2",
      icon: <I.Instagram />,
    },
  ];

  return (
    <section id="community" className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Global Community"
            badgeClass="badge-purple"
            title="Join the 50,000+ Member"
            accent="Developer Network"
            desc="You never learn alone at KR Global Learning. Connect with fellow developers, share code, and get mentor support 24/7."
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 22,
          }}
        >
          {channels.map((c, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "28px",
                borderRadius: 24,
                background: "white",
                border: "1.5px solid #EDE9FE",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(124,58,237,0.05)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: c.bg,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: c.color,
                      background: c.bg,
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {c.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0F0A1E",
                    marginBottom: 4,
                  }}
                >
                  {c.name}
                </h3>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED", marginBottom: 12 }}>
                  {c.members}
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>{c.desc}</p>
              </div>

              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 16px",
                  borderRadius: 12,
                  background: c.bg,
                  color: c.color,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {c.actionText} <I.ArrowRight />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
