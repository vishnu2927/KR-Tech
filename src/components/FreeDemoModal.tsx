import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";
import { leadService, CreateLeadResult } from "../services/leadService";
import { courseService, Course } from "../services/courseService";
import { analytics } from "../utils/analytics";
import Toast from "./common/Toast";

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export default function FreeDemoModal({ isOpen, onClose, defaultCourse }: FreeDemoModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(defaultCourse || "Complete Java Backend (Spring Boot 3.x)");
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

  // Update default course if passed
  useEffect(() => {
    if (defaultCourse) {
      setCourse(defaultCourse);
    }
  }, [defaultCourse]);

  if (!isOpen) return null;

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
      errs.phone = "Enter a valid phone number with at least 10 digits";
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
          message: `Booking confirmed! Your Official ID is #${result.bookingId}`,
          type: "success",
        });
      }
    } catch (error: any) {
      console.error("Failed to create lead", error);
      setToast({
        message: error.message || "Failed to book demo. Please verify your details.",
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
    onClose();
  };

  const activeBookingId = bookingResult?.bookingId || "KRDEMO-PENDING";
  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi KR Tech, I have booked a Free 1:1 Live Demo for "${course}" (Booking ID: #${activeBookingId}). Please confirm my live mentor session slot!`
  )}`;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(15,10,30,0.78)",
          backdropFilter: "blur(14px)",
          padding: 16,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 580,
            background: "white",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
            position: "relative",
            animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: "22px 28px",
              background: bookingResult?.isDuplicate
                ? "linear-gradient(135deg,#D97706 0%,#B45309 100%)"
                : "linear-gradient(135deg,#7C3AED 0%,#06B6D4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "white",
              transition: "background 0.3s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    background: "rgba(255,255,255,0.22)",
                    padding: "3px 10px",
                    borderRadius: 99,
                  }}
                >
                  {bookingResult?.isDuplicate ? "Active Session Found" : "100% Free · 1:1 Live Demo"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "rgba(16, 185, 129, 0.35)",
                    padding: "3px 8px",
                    borderRadius: 99,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} />
                  MongoDB Atlas Live
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  marginTop: 8,
                  marginBottom: 2,
                }}
              >
                {bookingResult?.isDuplicate
                  ? "Existing Demo Booking Found"
                  : bookingResult
                  ? "1:1 Live Demo Reserved!"
                  : "Book Your Free 1:1 Live Demo"}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.88)" }}>
                {bookingResult?.isDuplicate
                  ? "You already have a confirmed slot with our senior mentor."
                  : "Experience interactive screen-share pair-programming."}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 12,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              <I.Close />
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ padding: "26px 30px", maxHeight: "82vh", overflowY: "auto" }}>
            {bookingResult ? (
              /* Success / Duplicate State View */
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: bookingResult.isDuplicate ? "#FEF3C7" : "#DCFCE7",
                    color: bookingResult.isDuplicate ? "#D97706" : "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: bookingResult.isDuplicate
                      ? "0 8px 24px rgba(217, 119, 6, 0.25)"
                      : "0 8px 24px rgba(22, 163, 74, 0.25)",
                  }}
                >
                  {bookingResult.isDuplicate ? <I.Sparkles /> : <I.Check />}
                </div>

                <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 22, color: "#0F0A1E" }}>
                  {bookingResult.isDuplicate ? "Demo Already Registered" : "Live Demo Confirmed!"}
                </h4>

                <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.6, maxWidth: 460, margin: "6px auto 18px" }}>
                  {bookingResult.isDuplicate
                    ? `A live demo is already scheduled for ${email}. We've saved your slot in MongoDB Atlas and assigned your dedicated senior mentor.`
                    : `Your private 1:1 session for "${course}" has been confirmed in MongoDB Atlas. Check your official booking reference below:`}
                </p>

                {/* Booking ID Highlight Card */}
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

                {/* Booking Details Summary */}
                <div
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: 16,
                    padding: "16px 20px",
                    textAlign: "left",
                    marginBottom: 24,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                    <span>📌 Session Details</span>
                    <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>✓ Verified in Atlas Cloud</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                    <div>
                      <strong style={{ color: "#6B7280" }}>Course:</strong>{" "}
                      <span style={{ fontWeight: 600, color: "#0F0A1E" }}>{course}</span>
                    </div>
                    <div>
                      <strong style={{ color: "#6B7280" }}>Time Slot:</strong>{" "}
                      <span style={{ fontWeight: 600, color: "#0F0A1E" }}>{timeSlot}</span>
                    </div>
                    <div>
                      <strong style={{ color: "#6B7280" }}>Time Zone:</strong>{" "}
                      <span style={{ fontWeight: 600, color: "#0F0A1E" }}>{timezone}</span>
                    </div>
                    <div>
                      <strong style={{ color: "#6B7280" }}>Candidate:</strong>{" "}
                      <span style={{ fontWeight: 600, color: "#0F0A1E" }}>{name || "Candidate"}</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Direct Connect Button & Close */}
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
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(22,163,74,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(22,163,74,0.3)";
                    }}
                  >
                    <I.MessageCircle />
                    <span>Connect with Counselor on WhatsApp (Booking #{activeBookingId})</span>
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
                      Book Another Track
                    </button>
                    <Link
                      to="/"
                      onClick={handleReset}
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
              /* Booking Form */
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
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: errors.name ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                      fontSize: 14,
                      outline: "none",
                      fontFamily: "Inter, sans-serif",
                      background: errors.name ? "#FEF2F2" : "white",
                    }}
                  />
                </div>

                {/* Email & Phone Grid */}
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
                      placeholder="name@email.com"
                      style={{
                        width: "100%",
                        padding: "10px 16px",
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
                        Phone / WhatsApp <span style={{ color: "#EF4444" }}>*</span>
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
                        padding: "10px 16px",
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
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 14,
                      outline: "none",
                      background: "white",
                      fontFamily: "Inter, sans-serif",
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
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 13,
                        outline: "none",
                        background: "white",
                        fontFamily: "Inter, sans-serif",
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
                      Time Zone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 13,
                        outline: "none",
                        background: "white",
                        fontFamily: "Inter, sans-serif",
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

                {/* Optional Message */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                    Questions or Specific Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your background, target certifications, or interview timeline..."
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    marginTop: 6,
                    padding: "13px 20px",
                    fontSize: 14,
                    borderRadius: 14,
                    justifyContent: "center",
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
                      Reserving Slot in Atlas Cloud...
                    </>
                  ) : (
                    <>
                      <I.Check />
                      Confirm Free 1:1 Live Demo Booking
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
