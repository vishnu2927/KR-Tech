import { useState } from "react";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

interface Resource {
  title: string;
  category: string;
  format: string;
  size: string;
  downloads: string;
  desc: string;
  icon: JSX.Element;
  color: string;
  bg: string;
}

export default function FreeResources() {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const resources: Resource[] = [
    {
      title: "Core Java & Spring Boot Master Cheat Sheet",
      category: "Backend",
      format: "PDF (42 Pages)",
      size: "4.8 MB",
      downloads: "14.2K Downloads",
      desc: "Complete reference for Java 21 features, Spring Boot 3.x annotations, JPA/Hibernate mapping, and REST conventions.",
      icon: <I.FileText />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "React 19 & Next.js Full Stack Architecture Notes",
      category: "Frontend",
      format: "PDF (36 Pages)",
      size: "3.9 MB",
      downloads: "18.9K Downloads",
      desc: "Server components, Actions, custom hooks, Tailwind CSS layout patterns, and client-side performance optimization.",
      icon: <I.Code />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
    {
      title: "DSA 250+ LeetCode Solutions & Pattern Guide",
      category: "DSA",
      format: "PDF (68 Pages)",
      size: "6.2 MB",
      downloads: "28.5K Downloads",
      desc: "14 essential coding patterns (Two Pointers, Sliding Window, DP, Graphs) with annotated code in Java, Python, and C++.",
      icon: <I.Award />,
      color: "#7C3AED",
      bg: "#EDE9FE",
    },
    {
      title: "Top 100 System Design Interview Questions & Diagrams",
      category: "System Design",
      format: "PDF (50 Pages)",
      size: "8.1 MB",
      downloads: "21.4K Downloads",
      desc: "Architectural blueprints for URL shorteners, Rate limiters, Distributed Caching, Message Queues, and Sharding.",
      icon: <I.Database />,
      color: "#0891B2",
      bg: "#CFFAFE",
    },
    {
      title: "ATS-Friendly Tech Resume Template & Portfolio Checklist",
      category: "Career",
      format: "DOCX & Figma",
      size: "1.8 MB",
      downloads: "32.1K Downloads",
      desc: "Battle-tested resume format vetted by top tech recruiters with action verb guides and bullet-point impact metrics.",
      icon: <I.Briefcase />,
      color: "#10B981",
      bg: "#D1FAE5",
    },
    {
      title: "Python Automation & Real-World Web Scraping Guide",
      category: "Python",
      format: "PDF (28 Pages)",
      size: "3.2 MB",
      downloads: "12.7K Downloads",
      desc: "Step-by-step handbook covering BeautifulSoup, Selenium, async requests, API consumption, and automated bot workflows.",
      icon: <I.Bot />,
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
  ];

  const handleDownload = (title: string) => {
    setDownloadedItem(title);
    setTimeout(() => {
      setDownloadedItem(null);
    }, 4000);
  };

  return (
    <section id="resources" style={{ padding: "80px 0", background: "white" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Free Study Materials"
            badgeClass="badge-cyan"
            title="Free Developer Guides &"
            accent="Study Notes"
            desc="Level up your tech knowledge with our free curated cheat sheets, architecture blueprints, and resume templates."
          />
        </div>

        {/* Download Success Toast */}
        {downloadedItem && (
          <div
            style={{
              maxWidth: 580,
              margin: "0 auto 32px",
              padding: "14px 20px",
              borderRadius: 16,
              background: "#DCFCE7",
              border: "1px solid #86EFAC",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "scaleIn 0.25s ease-out",
            }}
          >
            <I.Check />
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Downloading <strong>"{downloadedItem}"</strong>! Check your downloads folder.
            </span>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 22,
          }}
        >
          {resources.map((r, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "26px",
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: r.bg,
                      color: r.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {r.icon}
                  </div>
                  <span className="badge badge-purple">{r.category}</span>
                </div>

                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#0F0A1E",
                    lineHeight: 1.45,
                    marginBottom: 8,
                    minHeight: 46,
                  }}
                >
                  {r.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12,
                    color: "#9CA3AF",
                    marginBottom: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #F3F4F6",
                  }}
                >
                  <span>{r.format} · {r.size}</span>
                  <span style={{ color: "#7C3AED", fontWeight: 600 }}>{r.downloads}</span>
                </div>

                <button
                  onClick={() => handleDownload(r.title)}
                  className="btn-ghost"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "10px 16px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <I.Download /> Download Free PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
