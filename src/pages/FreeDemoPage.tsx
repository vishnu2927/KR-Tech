import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { I } from "../components/Icons";
import { leadService, CreateLeadResult } from "../services/leadService";
import { courseService, Course } from "../services/courseService";
import SEO from "../components/common/SEO";
import { analytics } from "../utils/analytics";
import Toast from "../components/common/Toast";

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
  const [bookingResult, setBookingResult] = useState<CreateLeadResult | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    courseService.getCourses().then(setCourses).catch(() => {});
  }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = "Full name is required";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address (e.g. rahul@example.com)";
    }

    const cleanPhone = phone.replace(/[\s-+()]/g, "");
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Enter a valid phone number (at least 10 digits)";
    }

    if (!course) {
      errs.course = "Please select a course";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyId = (bId: string) => {
    navigator.clipboard.writeText(bId);
    setCopiedId(true);
    setToast({ message: `Booking ID #${bId} copied to clipboard!`, type: "success" });
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ message: "Please fill all required fields correctly.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await leadService.createLead({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        course,
        timeSlot,
        timezone,
        message: message.trim(),
      });

      setBookingResult(result);

      if (result.isDuplicate) {
        setToast({
          message: `Active demo session already registered for ${email}. Booking ID: #${result.bookingId}`,
          type: "warning",
        });
      } else {
        analytics.trackDemoBooking(course, timeSlot);
        setToast({
          message: `1:1 Live Demo booked successfully! Booking ID: #${result.bookingId}`,
          type: "success",
        });
      }
    } catch (error: any) {
      console.error("Failed to submit lead", error);
      setToast({
        message: error.message || "Failed to book demo session. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookingResult(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  const activeBookingId = bookingResult?.bookingId || "KRDEMO-PENDING";
  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi KR Tech, I have booked a Free 1:1 Live Demo for "${course}" (Booking ID: #${activeBookingId}). Please confirm my mentor session slot!`
  )}`;

  const perks = [
    {
      title: "100% Free & Zero Commitment",
      desc: "No payment or credit card required. Experience our 1:1 pair-programming mentorship methodology first-hand.",
      icon: <I.Award />,
    },
    {
      title: "Personalized Roadmap Assessment",
      desc: "Our lead architect analyzes your career goals, target certifications, and prepares a tailored syllabus timeline.",
      icon: <I.Sparkles />,
    },
    {
      title: "Direct Senior Mentor Match",
      desc: "Meet the exact mentor who will guide your capstone projects, code reviews, and technical mock interviews.",
      icon: <I.Users />,
    },
    {
      title: "Live Interactive Coding Session",
      desc: "Write live code, inspect production architecture, and experience our real-time screen-sharing environment.",
      icon: <I.Play />,
    },
  ];

  return (
    <SEO
      title="Book a Free 1:1 Live Demo Class & Career Roadmap Assessment"
      description="Experience KR Tech's 1:1 live tech mentorship for free. Private 45-minute coding session with a senior mentor, customized study roadmap, zero commitment."
      canonical="https://krtech.in/free-demo"
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span className="badge badge-dark">100% Free · 1:1 Live Demo</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#34D399",
                  background: "rgba(16,185,129,0.2)",
                  padding: "4px 10px",
                  borderRadius: 99,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} />
                MongoDB Atlas Connected
              </span>
            </div>
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
              plan your engineering roadmap.
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

              {/* Right Booking Form / Success State */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  padding: "36px",
                  border: "1px solid #EDE9FE",
                  boxShadow: "0 16px 48px rgba(124,58,237,0.1)",
                }}
              >
                {bookingResult ? (
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: bookingResult.isDuplicate ? "#FEF3C7" : "#DCFCE7",
                        color: bookingResult.isDuplicate ? "#D97706" : "#16A34A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 18px",
                        boxShadow: bookingResult.isDuplicate
                          ? "0 8px 24px rgba(217, 119, 6, 0.25)"
                          : "0 8px 24px rgba(22, 163, 74, 0.25)",
                      }}
                    >
                      {bookingResult.isDuplicate ? <I.Sparkles /> : <I.Check />}
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
                      {bookingResult.isDuplicate ? "Demo Already Registered" : "1:1 Live Demo Confirmed!"}
                    </h3>
                    <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                      {bookingResult.isDuplicate
                        ? `A demo booking for ${email} already exists in MongoDB Atlas. Our lead mentor is assigned!`
                        : `Your demo session for "${course}" has been confirmed in MongoDB Atlas. Check your official booking reference:`}
                    </p>

                    {/* Booking ID Badge */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
                        border: "1.5px solid #DDD6FE",
                        borderRadius: 16,
                        padding: "16px 20px",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Official Booking ID
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#4C1D95", marginTop: 2 }}>
                          #{activeBookingId}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyId(activeBookingId)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: copiedId ? "#10B981" : "#7C3AED",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {copiedId ? <I.Check /> : <I.FileText />}
                        {copiedId ? "Copied!" : "Copy ID"}
                      </button>
                    </div>

                    {/* Session Summary Card */}
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
                      <div style={{ fontWeight: 700, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                        <span>📌 Session Summary</span>
                        <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 700 }}>✓ Saved to MongoDB Atlas</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                        <div>• <strong>Course:</strong> {course}</div>
                        <div>• <strong>Time Slot:</strong> {timeSlot}</div>
                        <div>• <strong>Time Zone:</strong> {timezone}</div>
                        <div>• <strong>Candidate:</strong> {name || "Candidate"}</div>
                        <div>• <strong>Email:</strong> {email}</div>
                        <div>• <strong>WhatsApp:</strong> {phone}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setToast({ message: "Redirecting to WhatsApp Counselor...", type: "success" });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)",
                          color: "white",
                          padding: "14px 22px",
                          borderRadius: 14,
                          fontWeight: 700,
                          fontSize: 14,
                          textDecoration: "none",
                          boxShadow: "0 8px 24px rgba(22,163,74,0.3)",
                        }}
                      >
                        <I.MessageCircle />
                        <span>Chat on WhatsApp (Booking #{activeBookingId})</span>
                      </a>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={handleReset}
                          style={{
                            flex: 1,
                            background: "#F3F4F6",
                            color: "#374151",
                            border: "1px solid #E5E7EB",
                            padding: "11px 18px",
                            borderRadius: 12,
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          Book Another Slot
                        </button>
                        <Link
                          to="/"
                          style={{
                            flex: 1,
                            background: "white",
                            color: "#7C3AED",
                            border: "1.5px solid #DDD6FE",
                            padding: "11px 18px",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 13,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Back to Home
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 20, color: "#0F0A1E" }}>
                          Book Your Free Demo Session
                        </h3>
                      </div>
                      <p style={{ fontSize: 13, color: "#6B7280" }}>
                        Fill out the form below to reserve your 1:1 live mentor slot directly in our live cloud portal.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Full Name */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            Full Name <span style={{ color: "#EF4444" }}>*</span>
                          </label>
                          {errors.name && <span style={{ color: "#EF4444", fontSize: 11, fontWeight: 600 }}>{errors.name}</span>}
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          placeholder="e.g. Rahul Verma"
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: errors.name ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                            background: errors.name ? "#FEF2F2" : "white",
                          }}
                        />
                      </div>

                      {/* Email & Phone */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                              Email Address <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            {errors.email && <span style={{ color: "#EF4444", fontSize: 10, fontWeight: 600 }}>Required</span>}
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: "" });
                            }}
                            placeholder="rahul@gmail.com"
                            style={{
                              width: "100%",
                              padding: "11px 16px",
                              borderRadius: 12,
                              border: errors.email ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                              fontSize: 14,
                              outline: "none",
                              fontFamily: "Inter, sans-serif",
                              background: errors.email ? "#FEF2F2" : "white",
                            }}
                          />
                          {errors.email && (
                            <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>
                              {errors.email}
                            </span>
                          )}
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                              WhatsApp / Phone <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            {errors.phone && <span style={{ color: "#EF4444", fontSize: 10, fontWeight: 600 }}>10 digits</span>}
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors({ ...errors, phone: "" });
                            }}
                            placeholder="+91 98765 43210"
                            style={{
                              width: "100%",
                              padding: "11px 16px",
                              borderRadius: 12,
                              border: errors.phone ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                              fontSize: 14,
                              outline: "none",
                              fontFamily: "Inter, sans-serif",
                              background: errors.phone ? "#FEF2F2" : "white",
                            }}
                          />
                          {errors.phone && (
                            <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>
                              {errors.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interested Course */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            Interested Course / Track <span style={{ color: "#EF4444" }}>*</span>
                          </label>
                          {errors.course && <span style={{ color: "#EF4444", fontSize: 11, fontWeight: 600 }}>{errors.course}</span>}
                        </div>
                        <select
                          value={course}
                          onChange={(e) => {
                            setCourse(e.target.value);
                            if (errors.course) setErrors({ ...errors, course: "" });
                          }}
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 12,
                            border: "1.5px solid #E5E7EB",
                            fontSize: 14,
                            outline: "none",
                            fontFamily: "Inter, sans-serif",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">-- Select a Course / Certification --</option>
                          {["Cloud Computing", "Cyber Security", "Networking", "Microsoft & IT", "Data & Analytics", "Project Management", "Enterprise Technologies", "Software Development"].map((group) => {
                            const groupCourses = courses.filter((c) => c.categoryGroup === group);
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
                              cursor: "pointer",
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
                              cursor: "pointer",
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
                          Learning Goals & Specific Questions (Optional)
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
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.75 : 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                            Scheduling Demo in Atlas Cloud...
                          </>
                        ) : (
                          <>
                            <I.Check />
                            Confirm Free 1:1 Live Demo Booking
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </SEO>
  );
}
