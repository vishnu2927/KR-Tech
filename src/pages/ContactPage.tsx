import React, { useState } from "react";
import { I } from "../components/Icons";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    {
      title: "Call Us Directly",
      subtitle: "Toll-Free Learner Helpline",
      contact: "1800-123-4567",
      href: "tel:18001234567",
      icon: <I.Phone />,
      color: "#7C3AED",
      bg: "#EDE9FE",
      action: "Call Now",
    },
    {
      title: "Email Support",
      subtitle: "Fast response within 2 hours",
      contact: "support@krtech.in",
      href: "mailto:support@krtech.in",
      icon: <I.Mail />,
      color: "#0891B2",
      bg: "#CFFAFE",
      action: "Send Email",
    },
    {
      title: "WhatsApp Chat",
      subtitle: "Instant 1:1 guidance & queries",
      contact: "+91 98765 43210",
      href: "https://wa.me/919876543210",
      icon: <I.MessageCircle />,
      color: "#10B981",
      bg: "#D1FAE5",
      action: "Chat on WhatsApp",
    },
    {
      title: "Office Hours",
      subtitle: "Mon - Sun · 9 AM - 9 PM IST",
      contact: "Always Open for Learners",
      href: "#",
      icon: <I.Clock />,
      color: "#F59E0B",
      bg: "#FEF3C7",
      action: "View Schedule",
    },
  ];

  return (
    <main style={{ paddingTop: 90, minHeight: "100vh", background: "#FDFDFE" }}>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F0A1E 0%,#1B0E33 100%)",
          padding: "60px 0 70px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          className="orb"
          style={{ width: 400, height: 400, top: -150, right: -50, background: "rgba(124,58,237,0.3)" }}
        />
        <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge badge-dark" style={{ marginBottom: 16, display: "inline-block" }}>
            Get in Touch
          </span>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              color: "white",
              marginBottom: 16,
            }}
          >
            We're Here to <span className="gradient-text-warm">Guide Your Journey</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 1.8vw, 17px)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Have questions regarding our 1:1 live training, course roadmaps, timings, or mentors? Reach out anytime!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container-xl">
          {/* 4 Info Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 50,
            }}
          >
            {contactCards.map((c, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 24,
                  background: "white",
                  borderRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: c.bg,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0F0A1E",
                      marginBottom: 4,
                    }}
                  >
                    {c.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{c.subtitle}</div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: c.color }}>
                    {c.contact}
                  </div>
                </div>
                {c.href !== "#" && (
                  <a
                    href={c.href}
                    style={{
                      marginTop: 18,
                      fontSize: 12,
                      fontWeight: 700,
                      color: c.color,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {c.action} <I.ChevronRight />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Form & Location Grid */}
          <div className="two-col items-start">
            {/* Contact Form */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                padding: "36px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 22, color: "#0F0A1E", marginBottom: 6 }}>
                Send Us a Message
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                Fill out the form below and an academic counselor will get in touch with you shortly.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: "32px 24px",
                    textAlign: "center",
                    background: "#F0FDF4",
                    borderRadius: 16,
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#DCFCE7",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <I.Check />
                  </div>
                  <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#166534" }}>
                    Message Sent Successfully!
                  </h4>
                  <p style={{ fontSize: 14, color: "#15803D", marginTop: 8 }}>
                    Thank you, <strong>{name}</strong>. We have received your message regarding <strong>{subject}</strong>.
                    Our team will contact you at <strong>{email}</strong> or <strong>{phone}</strong> within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="btn-primary"
                    style={{ marginTop: 20 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      style={{
                        width: "100%",
                        padding: "11px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "Inter, sans-serif",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        style={{
                          width: "100%",
                          padding: "11px 16px",
                          borderRadius: 12,
                          border: "1.5px solid #E5E7EB",
                          fontSize: 14,
                          outline: "none",
                          fontFamily: "Inter, sans-serif",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        style={{
                          width: "100%",
                          padding: "11px 16px",
                          borderRadius: 12,
                          border: "1.5px solid #E5E7EB",
                          fontSize: 14,
                          outline: "none",
                          fontFamily: "Inter, sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Subject / Course of Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "Inter, sans-serif",
                        background: "white",
                      }}
                    >
                      <option value="General Inquiry / Academic Counseling">General Inquiry / Academic Counseling</option>
                      <option value="Cloud Computing Certification Tracks">Cloud Computing (AWS / Azure / GCP)</option>
                      <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
                      <option value="Cisco & Enterprise Networking">Cisco & Enterprise Networking</option>
                      <option value="Microsoft 365 & IT Administration">Microsoft 365 & IT Administration</option>
                      <option value="Data & Analytics / Power BI">Data & Analytics (Power BI / Tableau / Splunk)</option>
                      <option value="Project Management & Agile / PMP">Project Management & Agile (PMP / CSM / SAFe)</option>
                      <option value="Enterprise Tech (Salesforce / SAP)">Enterprise Tech (Salesforce / SAP)</option>
                      <option value="Java Backend 1:1 Live Training">Java Backend 1:1 Live Training</option>
                      <option value="MERN Stack Full Stack Bootcamp">MERN Stack Full Stack Bootcamp</option>
                      <option value="AI & Machine Learning with Python">AI & Machine Learning with Python</option>
                      <option value="DSA & Problem Solving Mastery">DSA & Problem Solving Mastery</option>
                      <option value="Custom 1:1 Mentorship / Doubt Clearing">Custom 1:1 Mentorship / Doubt Clearing</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      Your Message or Questions *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your learning goals, current background, or any specific questions…"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "Inter, sans-serif",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: "14px 24px",
                      borderRadius: 14,
                      fontSize: 15,
                      justifyContent: "center",
                      marginTop: 6,
                    }}
                  >
                    Send Message <I.Send />
                  </button>
                </form>
              )}
            </div>

            {/* Location & Academy Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  padding: "32px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "#EDE9FE",
                      color: "#7C3AED",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <I.MapPin />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0A1E" }}>
                      KR Tech Headquarters
                    </h3>
                    <p style={{ fontSize: 12, color: "#6B7280" }}>Learning Center & Tech Hub</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7, marginBottom: 16 }}>
                  KR Tech Academy Tower, Tech Hub Corridor, Bengaluru, Karnataka 560103, India.
                </p>
                <div
                  style={{
                    height: 180,
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#0F0A1E,#20103A)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid #DDD6FE",
                  }}
                >
                  <div className="orb" style={{ width: 140, height: 140, top: -20, right: -20, background: "rgba(124,58,237,0.4)" }} />
                  <I.MapPin />
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, marginTop: 8 }}>
                    Bengaluru Tech Hub & Global Remote
                  </div>
                  <div style={{ fontSize: 12, color: "#A78BFA", marginTop: 4 }}>
                    100% Online 1:1 Live Globally
                  </div>
                </div>
              </div>

              {/* Student Trust Box */}
              <div
                style={{
                  background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)",
                  borderRadius: 24,
                  padding: "28px 32px",
                  color: "white",
                }}
              >
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                  Prefer a Free Live Demo Class?
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 18 }}>
                  Meet directly with a mentor before committing. We will show you our live coding environment and plan
                  your custom syllabus.
                </p>
                <a
                  href="/free-demo"
                  className="btn-ghost-white"
                  style={{ display: "inline-flex", textDecoration: "none", fontSize: 13, borderRadius: 12 }}
                >
                  Book 1:1 Live Demo Session
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
