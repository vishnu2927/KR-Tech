import { Link } from "react-router-dom";
import { I } from "./Icons";

export default function Footer() {
  const footerCols = [
    {
      title: "Services",
      links: [
        { label: "One-on-One Live Training", href: "/#services" },
        { label: "Flexible Timings", href: "/#services" },
        { label: "Student Dashboard", href: "/dashboard" },
        { label: "Recorded Lectures & Notes", href: "/dashboard" },
        { label: "Certificate Gallery", href: "/certificates" },
        { label: "Resume & Project Support", href: "/resources" },
      ],
    },
    {
      title: "Top Courses",
      links: [
        { label: "Java Backend with Spring Boot", href: "/courses" },
        { label: "MERN Full Stack Bootcamp", href: "/courses" },
        { label: "AWS Solutions Architect", href: "/courses" },
        { label: "Cyber Security & CEH", href: "/courses" },
        { label: "Power BI Data Analyst", href: "/courses" },
        { label: "SAP S/4HANA & Salesforce", href: "/courses" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Free Resources Library", href: "/resources" },
        { label: "Meet 10+ Yrs Mentors", href: "/mentors" },
        { label: "Student Dashboard Portal", href: "/dashboard" },
        { label: "Certificate Verification", href: "/certificates" },
        { label: "Book Free 1:1 Demo", href: "/free-demo" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About KR Tech", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Community & Events", href: "/contact" },
        { label: "Become a Mentor", href: "/contact" },
      ],
    },
    {
      title: "Legal & Trust",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Refund Policy", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: <I.Linkedin />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <I.Github />, label: "GitHub", href: "https://github.com" },
    { icon: <I.Twitter />, label: "Twitter", href: "https://twitter.com" },
    { icon: <I.Instagram />, label: "Instagram", href: "https://instagram.com" },
    { icon: <I.Youtube />, label: "YouTube", href: "https://youtube.com" },
  ];

  return (
    <footer className="footer-bg">
      <div className="container-xl" style={{ paddingTop: 64, paddingBottom: 40 }}>
        {/* Main Grid */}
        <div className="footer-grid" style={{ marginBottom: 56 }}>
          {/* Brand Col */}
          <div style={{ maxWidth: 320 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, textDecoration: "none" }}>
              <I.Logo />
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 19, color: "white" }}>
                  KR Tech
                </div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 500, fontSize: 10, color: "#A78BFA", marginTop: 1 }}>
                  Learn. Build. Grow.
                </div>
              </div>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 22 }}>
              India's premier coding academy offering personalized one-on-one live training with industry mentors
              having 10+ years of experience. Trusted by 50,000+ students.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact quick links */}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              <a
                href="tel:18001234567"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                }}
              >
                <I.Phone /> 1800-123-4567 (Toll Free)
              </a>
              <a
                href="mailto:support@krtech.in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                }}
              >
                <I.Mail /> support@krtech.in
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "white",
                  marginBottom: 18,
                  letterSpacing: "0.02em",
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {col.links.map((l, idx) => (
                  <li key={idx}>
                    {l.href.startsWith("/") ? (
                      <Link to={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="footer-link">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Support Banner Bar */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 28px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(124,58,237,0.35)",
          }}
        >
          <div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, color: "white" }}>
              KR Tech Learner Support & 1:1 Guidance
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>
              Monday to Sunday · 9:00 AM to 9:00 PM IST
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="tel:18001234567"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "white",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                textDecoration: "none",
              }}
            >
              <I.Phone /> 1800-123-4567
            </a>
            <Link
              to="/free-demo"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                fontFamily: "Poppins,sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#0F0A1E",
                background: "#67E8F9",
                textDecoration: "none",
              }}
            >
              <I.Sparkles /> Book Free Demo
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
            © 2026 KR Tech. All rights reserved. Personalized 1:1 Live Coding Academy.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((l) => (
              <a key={l} href="#" className="footer-link" style={{ padding: 0 }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
