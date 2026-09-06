import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { I } from "../components/Icons";
import { leadService } from "../services/leadService";
import { ALL_COURSES } from "../data/coursesData";

export default function FreeDemoPage() {
  const [searchParams] = useSearchParams();
  const requestedCourse = searchParams.get("course") || "Complete Java Backend (Spring Boot 3.x)";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(requestedCourse);
  const [timeSlot, setTimeSlot] = useState("Evening (6:00 PM - 8:00 PM IST)");
  const [timezone, setTimezone] = useState("IST (India · UTC+5:30)");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    const cleanPhone = phone.replace(/[\s-+()]/g, "");
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid phone number (at least 10 digits)";
    }
    if (!course) errs.course = "Please select a course";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await leadService.createLead({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course,
        timeSlot,
        timezone,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit lead", error);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    {
      title: "100% Free & Zero Commitment",
      desc: "No payment or credit card needed. Evaluate our 1:1 live pair-programming approach first-hand.",
      icon: <I.Award />,
    },
    {
      title: "1-on-1 with a 10+ Yrs Mentor",
      desc: "Learn directly from an industry engineer from Amazon, Google, or Razorpay.",
      icon: <I.Users />,
    },
    {
      title: "Personalized Syllabus Roadmap",
      desc: "We evaluate your current level and craft a custom learning path tailored to your timeline.",
      icon: <I.Code />,
    },
    {
      title: "Live Interactive Coding Session",
      desc: "Write code live, debug real issues, and experience our direct screen-sharing workflow.",
      icon: <I.Play />,
    },
  ];

  return (
    <main style={{ paddingTop: 80, minHeight: "100vh", background: "#F8F7FF" }}>
      {/* Page Header */}
      <section
        style={{
          background: "linear-gradient(135deg,#0F0A1E 0%,#1B0E33 100%)",
          padding: "60px 0 70px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div className="orb" style={{ width: 450, height: 450, top: -160, right: -60, background: "rgba(124,58,237,0.3)" }} />
        <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge badge-dark" style={{ marginBottom: 16, display: "inline-block" }}>
            100% Free · 1:1 Live Demo
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
            Experience KR Tech with a <span className="gradient-text-warm">Free Live Demo</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 1.8vw, 17px)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 620,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Schedule a personalized 1:1 session with an expert trainer. Understand our curriculum, write real code, and
            plan your roadmap.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container-xl">
          <div className="two-col items-start">
            {/* Left Perks List */}
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 16, display: "inline-block" }}>
                What to Expect
              </span>
              <h2 className="section-title">
                How Your <span className="gradient-text">Demo Class</span> Works
              </h2>
              <p className="section-desc" style={{ marginTop: 14 }}>
                In this 45-minute live 1-on-1 session, we introduce you to our teaching approach, evaluate your current
                coding background, and demonstrate practical live programming.
              </p>

              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                {perks.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "white",
                      padding: "20px 22px",
                      borderRadius: 18,
                      border: "1px solid #EDE9FE",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "#EDE9FE",
                        color: "#7C3AED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#0F0A1E",
                          marginBottom: 4,
                        }}
                      >
                        {p.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Booking Form */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                padding: "36px",
                border: "1px solid #EDE9FE",
                boxShadow: "0 16px 48px rgba(124,58,237,0.1)",
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "20px 10px" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "#DCFCE7",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px",
                    }}
                  >
                    <I.Check />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "#0F0A1E",
                      marginBottom: 8,
                    }}
                  >
                    Thank you for booking a free demo.
                  </h3>
                  <p style={{ color: "#4B5563", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                    Our team will contact you shortly to confirm your session for{" "}
                    <strong style={{ color: "#7C3AED" }}>{course}</strong>.
                  </p>
                  <div
                    style={{
                      background: "#F5F3FF",
                      border: "1px solid #DDD6FE",
                      borderRadius: 16,
                      padding: "16px 20px",
                      textAlign: "left",
                      marginBottom: 24,
                      fontSize: 13,
                      color: "#5B21B6",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>📌 Session Summary:</div>
                    <div>• Time Slot: {timeSlot}</div>
                    <div>• Time Zone: {timezone}</div>
                    <div>• Meeting Invite: Sent to {email}</div>
                    <div>• WhatsApp Alert: Sent to {phone}</div>
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <Link
                      to="/"
                      className="btn-ghost flex-1"
                      style={{ justifyContent: "center", textDecoration: "none", padding: "12px 18px" }}
                    >
                      Go Home
                    </Link>
                    <a
                      href={`https://wa.me/919876543210?text=Hi%20KR%20Tech%2C%20I%20just%20booked%20a%20free%20demo%20for%20${encodeURIComponent(course)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1"
                      style={{
                        justifyContent: "center",
                        textDecoration: "none",
                        padding: "12px 18px",
                        background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)",
                      }}
                    >
                      <I.MessageCircle /> WhatsApp Us
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 20, color: "#0F0A1E" }}>
                      Book Your Free Demo Session
                    </h3>
                    <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                      Fill out the form below to reserve your 1:1 live mentor slot.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Full Name */}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        style={{
                          width: "100%",
                          padding: "11px 16px",
                          borderRadius: 12,
                          border: errors.name ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                          fontSize: 14,
                          outline: "none",
                          fontFamily: "Inter, sans-serif",
                        }}
                      />
                      {errors.name && <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>{errors.name}</span>}
                    </div>

                    {/* Email & Phone */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@gmail.com"
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: errors.email ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                          }}
                        />
                        {errors.email && <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>{errors.email}</span>}
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: errors.phone ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                          }}
                        />
                        {errors.phone && <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>{errors.phone}</span>}
                      </div>
                    </div>

                    {/* Interested Course */}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                        Interested Course *
                      </label>
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
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
                        <option value="">-- Select a Course / Certification --</option>
                        {["Cloud Computing", "Cyber Security", "Networking", "Microsoft & IT", "Data & Analytics", "Project Management", "Enterprise Technologies", "Software Development"].map((group) => {
                          const groupCourses = ALL_COURSES.filter((c) => c.categoryGroup === group);
                          if (groupCourses.length === 0) return null;
                          return (
                            <optgroup key={group} label={`── ${group} ──`}>
                              {groupCourses.map((c) => (
                                <option key={c.id} value={c.title}>
                                  {c.title}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>

                    {/* Time Slot & Timezone */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                          Preferred Time Slot
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: "1.5px solid #E5E7EB",
                            fontSize: 13,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                            background: "white",
                          }}
                        >
                          <option value="Morning (9:00 AM - 12:00 PM IST)">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon (2:00 PM - 5:00 PM IST)">Afternoon (2 PM - 5 PM)</option>
                          <option value="Evening (6:00 PM - 8:00 PM IST)">Evening (6 PM - 8 PM)</option>
                          <option value="Night (8:00 PM - 10:30 PM IST)">Night (8 PM - 10:30 PM)</option>
                          <option value="Weekend Special Slot">Weekend Slot</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                          Preferred Time Zone
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: "1.5px solid #E5E7EB",
                            fontSize: 13,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                            background: "white",
                          }}
                        >
                          <option value="IST (India · UTC+5:30)">IST (India · UTC+5:30)</option>
                          <option value="EST (USA East · UTC-5)">EST (USA East · UTC-5)</option>
                          <option value="PST (USA West · UTC-8)">PST (USA West · UTC-8)</option>
                          <option value="GMT / BST (UK & Europe)">GMT / BST (UK & Europe)</option>
                          <option value="SGT / AEST (Singapore & Australia)">SGT / AEST (Asia-Pacific)</option>
                        </select>
                      </div>
                    </div>

                    {/* Additional Message */}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                        Additional Message (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your learning goals or questions..."
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          borderRadius: 12,
                          border: "1.5px solid #E5E7EB",
                          fontSize: 13,
                          outline: "none",
                          fontFamily: "Inter, sans-serif",
                          resize: "none",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{
                        padding: "14px 20px",
                        fontSize: 15,
                        borderRadius: 14,
                        justifyContent: "center",
                        marginTop: 6,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "Scheduling Demo..." : "Confirm Free 1:1 Live Demo Booking"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
