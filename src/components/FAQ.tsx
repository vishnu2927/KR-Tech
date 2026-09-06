import { useState } from "react";
import { I } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {
      q: "Is KR Tech suitable for complete beginners with no prior coding knowledge?",
      a: "Absolutely! Our programs are customized to each student. For beginners, our mentors start with basic fundamentals and build step-by-step with practical hands-on exercises.",
    },
    {
      q: "How does one-on-one live training work?",
      a: "You get a dedicated mentor conducting live 1:1 sessions customized to your schedule, pace, and domain interests. You write code together, receive instant feedback, and have full individual attention.",
    },
    {
      q: "Are classes live or recorded?",
      a: "Every session is held live with your mentor. In addition, every session is automatically recorded and uploaded to your student dashboard with comprehensive class notes for lifetime review.",
    },
    {
      q: "What is the fee structure and are there flexible EMI options?",
      a: "Our course fees range from ₹8,999 to ₹16,999 with zero hidden charges. We offer flexible zero-cost EMI plans starting at ₹1,200/month as well as merit scholarships for deserving candidates.",
    },
    {
      q: "Do you provide project and resume support?",
      a: "Yes! You will build full-scale real-world projects guided end-to-end by your mentor. We also provide complete ATS-friendly resume review and LinkedIn profile enhancement.",
    },
    {
      q: "Can I take a free demo class before enrolling?",
      a: "Yes! We encourage every student to book a free 1:1 live demo class. Meet your mentor, evaluate our personalized teaching model, and plan your curriculum before making any payment.",
    },
  ];

  return (
    <section id="faq" className="bg-lavender" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <SectionHeading
              badge="FAQ"
              title="Frequently Asked"
              accent="Questions"
              desc="Got questions about 1:1 live classes, timings, or mentors? Find answers here."
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "white",
                  border: `1.5px solid ${open === i ? "#C4B5FD" : "#F3F4F6"}`,
                  boxShadow: open === i ? "0 4px 24px rgba(124,58,237,0.09)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins,sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#0F0A1E",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: open === i ? "#7C3AED" : "#F3F4F6",
                      color: open === i ? "white" : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {open === i ? <I.Minus /> : <I.Plus />}
                  </span>
                </button>
                {open === i && (
                  <div
                    style={{
                      padding: "0 24px 22px",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "#6B7280",
                      fontFamily: "Inter,sans-serif",
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
