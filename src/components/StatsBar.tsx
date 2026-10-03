export default function StatsBar() {
  const stats = [
    { n: "One-on-One", l: "Live Mentorship" },
    { n: "Hands-On", l: "Practical Projects" },
    { n: "Personalized", l: "Learning Pace" },
    { n: "Verified", l: "Certifications" },
    { n: "24/7", l: "Student Support" },
  ];

  return (
    <div style={{ background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)", padding: "28px 0" }}>
      <div className="container-xl">
        <div className="flex flex-wrap justify-center gap-6 md:gap-0 md:justify-between items-center">
          {stats.map((s, i) => (
            <div key={i} className="text-center px-4 md:px-6">
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 26, color: "white" }}>{s.n}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: "rgba(255,255,255,0.72)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
