import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

interface Batch {
  course: string;
  startDate: string;
  duration: string;
  trainer: string;
  company: string;
  slotsLeft: number;
  timeSlot: string;
  category: string;
  badge: string;
}

export default function UpcomingBatches({ onOpenDemo }: { onOpenDemo?: (courseName?: string) => void }) {
  const batches: Batch[] = [
    {
      course: "Complete Java Backend Development (Spring Boot 3.x)",
      startDate: "Next Monday · 15th Sep",
      duration: "6 Months · 1:1 Live",
      trainer: "Rajesh Kumar",
      company: "Ex-Amazon",
      slotsLeft: 3,
      timeSlot: "Evening (7:00 PM - 9:00 PM IST)",
      category: "Backend",
      badge: "Filling Fast",
    },
    {
      course: "MERN Stack Full Stack Web Mastery Bootcamp",
      startDate: "This Saturday · 13th Sep",
      duration: "5 Months · 1:1 Live",
      trainer: "Vikram Nair",
      company: "Ex-Razorpay",
      slotsLeft: 2,
      timeSlot: "Morning (10:00 AM - 12:00 PM IST)",
      category: "Full Stack",
      badge: "Popular Batch",
    },
    {
      course: "AI & Machine Learning with Python (LLMs & PyTorch)",
      startDate: "Next Wednesday · 17th Sep",
      duration: "6 Months · 1:1 Live",
      trainer: "Ananya Singh",
      company: "Ex-Google",
      slotsLeft: 4,
      timeSlot: "Night (8:30 PM - 10:30 PM IST)",
      category: "AI & ML",
      badge: "Weekend / Weekday",
    },
    {
      course: "DSA & Problem Solving (Java / C++) Mastery",
      startDate: "Next Monday · 15th Sep",
      duration: "4 Months · 1:1 Live",
      trainer: "Karan Shah",
      company: "Ex-Paytm",
      slotsLeft: 3,
      timeSlot: "Evening (6:00 PM - 8:00 PM IST)",
      category: "DSA",
      badge: "New Batch",
    },
  ];

  return (
    <section id="batches" style={{ padding: "80px 0", background: "white" }}>
      <div className="container-xl">
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Live Batches"
            badgeClass="badge-cyan"
            title="Upcoming 1:1"
            accent="Live Batches"
            desc="Reserve your seat in our upcoming personalized 1:1 live training cohorts with 10+ years expert mentors."
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 22,
          }}
        >
          {batches.map((b, i) => (
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
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top status bar */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span className="badge badge-purple">{b.category}</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#DC2626",
                      background: "#FEE2E2",
                      padding: "4px 10px",
                      borderRadius: 99,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {b.slotsLeft} slots left
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#0F0A1E",
                    lineHeight: 1.45,
                    marginBottom: 16,
                    minHeight: 46,
                  }}
                >
                  {b.course}
                </h3>

                <div
                  style={{
                    background: "#F9FAFB",
                    borderRadius: 16,
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 20,
                    border: "1px solid #F3F4F6",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#374151" }}>
                    <span style={{ color: "#7C3AED" }}><I.Calendar /></span>
                    <strong style={{ color: "#0F0A1E" }}>Start:</strong> {b.startDate}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#374151" }}>
                    <span style={{ color: "#0891B2" }}><I.Clock /></span>
                    <span>{b.duration}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#374151" }}>
                    <span style={{ color: "#10B981" }}><I.Users /></span>
                    <span>
                      Trainer: <strong>{b.trainer}</strong> ({b.company})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenDemo && onOpenDemo(b.course)}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px 18px", fontSize: 13, borderRadius: 14 }}
              >
                <I.Sparkles /> Book Demo for this Batch
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
