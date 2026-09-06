import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function CommunitySection() {
  const channels = [
    {
      name: "Discord Server",
      members: "18,500+ Members",
      desc: "24/7 active voice rooms, pair-programming channels, and weekly live coding meetups with mentors.",
      badge: "Active 24/7",
      actionText: "Join Discord Server",
      url: "https://discord.com",
      color: "#5865F2",
      bg: "#EEF2FF",
      icon: <I.Bot />,
    },
    {
      name: "Telegram Channel",
      members: "35,000+ Subscribers",
      desc: "Daily DSA coding problems, system design notes, developer interview tips, and tech news.",
      badge: "Daily Updates",
      actionText: "Join Telegram Channel",
      url: "https://telegram.org",
      color: "#0088CC",
      bg: "#E0F2FE",
      icon: <I.Send />,
    },
    {
      name: "WhatsApp Community",
      members: "12,000+ Learners",
      desc: "Class schedules, 1:1 live demo alerts, scholarship notifications, and direct advisor support.",
      badge: "Instant Alerts",
      actionText: "Join WhatsApp Broadcast",
      url: "https://whatsapp.com",
      color: "#25D366",
      bg: "#DCFCE7",
      icon: <I.MessageCircle />,
    },
    {
      name: "LinkedIn Network",
      members: "50,000+ Alumni",
      desc: "Connect with KR Tech alumni working at top tech firms, read learner success stories, and network.",
      badge: "Alumni Network",
      actionText: "Follow on LinkedIn",
      url: "https://linkedin.com",
      color: "#0A66C2",
      bg: "#EFF6FF",
      icon: <I.Linkedin />,
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
            desc="You never learn alone at KR Tech. Connect with fellow developers, share code, and get mentor support 24/7."
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
