import React, { useState } from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";
import { leadService } from "../services/leadService";
import { ALL_COURSES } from "../data/coursesData";

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
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

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
      console.error("Failed to create lead", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,10,30,0.75)",
        backdropFilter: "blur(12px)",
        padding: 20,
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
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          position: "relative",
          animation: "scaleIn 0.25s ease-out",
        }}
      >
        {/* Header banner */}
        <div
          style={{
            padding: "24px 28px",
            background: "linear-gradient(135deg,#7C3AED 0%,#06B6D4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "rgba(255,255,255,0.2)",
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              100% Free · 1:1 Live Demo
            </span>
            <h3
              style={{
                fontFamily: "Poppins,sans-serif",
                fontWeight: 800,
                fontSize: 20,
                marginTop: 8,
                marginBottom: 2,
              }}
            >
              Book Your Free 1:1 Live Demo
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              Experience our live mentorship before enrolling.
            </p>
          </div>
          <button
            onClick={onClose}
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
            }}
          >
            <I.Close />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "26px 32px", maxHeight: "80vh", overflowY: "auto" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
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
              <h4 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: 22, color: "#0F0A1E" }}>
                Thank you for booking a free demo.
              </h4>
              <p style={{ color: "#4B5563", fontSize: 15, lineHeight: 1.6, marginTop: 8, maxWidth: 440, margin: "8px auto 24px" }}>
                Our team will contact you shortly to confirm your 1:1 session for{" "}
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
                <div style={{ fontWeight: 700, marginBottom: 4 }}>📌 Booking Summary:</div>
                <div>• Time Slot: {timeSlot}</div>
                <div>• Time Zone: {timezone}</div>
                <div>• Email: {email}</div>
                <div>• Phone: {phone}</div>
              </div>

              {/* Dual Action Buttons: Go Home & WhatsApp Us */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Link
                  to="/"
                  onClick={handleReset}
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
                  placeholder="e.g. Rahul Sharma"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: errors.name ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                {errors.name && <span style={{ color: "#EF4444", fontSize: 11, marginTop: 3, display: "block" }}>{errors.name}</span>}
              </div>

              {/* Email & Phone Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
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
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
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
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    background: "white",
                    fontFamily: "Inter, sans-serif",
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
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 13,
                      outline: "none",
                      background: "white",
                      fontFamily: "Inter, sans-serif",
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
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 13,
                      outline: "none",
                      background: "white",
                      fontFamily: "Inter, sans-serif",
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
                  placeholder="Share your goals, current programming background, or specific questions..."
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
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Scheduling Your Demo..." : "Confirm Free 1:1 Live Demo Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
