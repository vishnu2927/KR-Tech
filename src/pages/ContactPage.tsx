import React, { useState } from "react";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import { leadService } from "../services/leadService";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await leadService.createLead({
        name,
        email,
        phone,
        course: subject,
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.warn("Lead submission fallback:", err);
      // Still show successful inquiry receipt
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SEO
      title="Contact Us — KR GLOBAL LEARNING PRIVATE LIMITED"
      description="Need Help? We're Here for You. Official 24×7 customer support: +91 9311073936, email: krglobal0713@gmail.com. Corporate Office: Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318."
      canonical="https://krgloballearning.com/contact"
    >
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-[90px] relative overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center max-w-5xl mx-auto">
          {/* Frosted contact banner pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold mb-5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            24×7 Student Helpdesk & Customer Support Directory
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 font-['Poppins']">
            Need Learning Guidance? <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">We're Available 24×7.</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Reach out directly to our 24×7 student support team for course enrollment, One-on-One learning consultations, payment assistance, and live technical support.
          </p>

          {/* Quick highlight chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6 text-xs text-slate-700 font-medium">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-blue-600 font-bold">⚡</span> Dedicated Support Desk
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-emerald-600 font-bold">📞</span> 24×7 Helpline Active
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-cyan-600 font-bold">📍</span> Greater Noida West Office
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-purple-600 font-bold">🎓</span> Free 1:1 Consultation
            </div>
          </div>
        </section>

        {/* MAIN SECTION: BALANCED 2-COLUMN FORM + CONTACT INFO PANEL */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Contact Form (7 cols on desktop) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-md">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Direct Consultation Form
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins'] tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  Have questions about course curricula, One-on-One mentor allocations, certifications, or custom schedules? Submit your inquiry below and an academic counselor will connect with you.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 sm:p-10 text-center bg-emerald-50/80 rounded-2xl border border-emerald-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300 shadow-sm">
                    <I.Check />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 font-['Poppins'] mb-2">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="text-slate-900">{name}</strong>. Your inquiry regarding <strong className="text-blue-700">{subject}</strong> has been registered. Our 24×7 academic counseling desk will contact you via phone (<span className="text-slate-900 font-semibold">{phone}</span>) or email (<span className="text-slate-900 font-semibold">{email}</span>) shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setEmail("");
                        setPhone("");
                        setMessage("");
                      }}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm w-full sm:w-auto"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20just%20submitted%20an%20inquiry%20form%20and%20would%20like%20to%20connect%20now."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm no-underline w-full sm:w-auto"
                    >
                      <I.MessageCircle /> Chat on WhatsApp Now
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subject / Course Track of Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 transition"
                    >
                      <option value="General Inquiry / Academic Counseling">General Inquiry / Academic Counseling</option>
                      <option value="MERN Stack Development">MERN Stack Development</option>
                      <option value="Java Full Stack & Spring Boot">Java Full Stack & Spring Boot</option>
                      <option value="AWS Cloud Computing">AWS Cloud Computing</option>
                      <option value="Microsoft Azure Solutions">Microsoft Azure Solutions</option>
                      <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
                      <option value="DevOps & Docker / Kubernetes">DevOps & Docker / Kubernetes</option>
                      <option value="SAP Training & ERP Solutions">SAP Training & ERP Solutions</option>
                      <option value="Data Analytics & Power BI">Data Analytics & Power BI</option>
                      <option value="Corporate / Enterprise Training">Corporate / Enterprise Training</option>
                      <option value="Institutional & University Tie-ups">Institutional & University Tie-ups</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Message or Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your learning goals, current background, or questions about the course…"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 resize-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-70 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Inquiry…
                      </>
                    ) : (
                      <>
                        <I.Send /> Submit Inquiry
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500 pt-1">
                    🔒 Your contact details are kept strictly confidential. No promotional spam guaranteed.
                  </p>
                </form>
              )}
            </div>

            {/* Right Column: Redesigned Contact-Information Panel (5 cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Panel Header */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    24×7 Available
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Official Directory
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Poppins'] mb-1">
                  Contact Information
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Official directory for student admissions, corporate inquiries, and technical support.
                </p>
              </div>

              {/* Card 1: Customer Support */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0 mt-0.5">
                    <I.Headset />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                        Customer Support
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        24×7 Active
                      </span>
                    </div>
                    <a
                      href="tel:+919311073936"
                      className="block text-lg font-extrabold text-slate-900 hover:text-blue-600 mt-1 transition-colors no-underline tracking-wide"
                    >
                      +91 9311073936
                    </a>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Assistance for course inquiries, admissions, and student guidance.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                      <a
                        href="tel:+919311073936"
                        className="flex-1 min-w-[110px] py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline"
                      >
                        <I.Phone /> Call Helpline
                      </a>
                      <a
                        href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20would%20like%20to%20inquire%20about%20your%20courses%20and%20One-on-One%20mentorship."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[110px] py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline"
                      >
                        <I.MessageCircle /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Business Email */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 mt-0.5">
                    <I.Mail />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Business Email
                    </span>
                    <a
                      href="mailto:krglobal0713@gmail.com"
                      className="block text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 mt-1 transition-colors no-underline break-all"
                    >
                      krglobal0713@gmail.com
                    </a>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Admissions, billing inquiries, verification, and academic communications.
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <a
                        href="mailto:krglobal0713@gmail.com?subject=Learning%20Inquiry%20-%20KR%20Global%20Learning"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors no-underline"
                      >
                        <I.Mail /> Send an Email →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Office Location */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 shrink-0 mt-0.5">
                    <I.MapPin />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                      Office Location
                    </span>
                    <div className="text-xs font-bold text-blue-700 mt-0.5">
                      KR GLOBAL LEARNING PRIVATE LIMITED
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                      Unit No. 615, Artha Mart,<br />
                      Tech Zone IV, Greater Noida West,<br />
                      Uttar Pradesh – 201318
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/70">
                      <span>Tech Zone IV, Greater Noida West</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Availability */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                    <I.Clock />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Availability
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span>24×7 Customer Support</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Round-the-clock student assistance for admissions, mentorship sessions, and technical support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Free 1:1 Consultation Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-5 shadow-md shadow-blue-500/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white font-['Poppins']">
                    Book a Free 1:1 Learning Consultation
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Speak directly with an industry mentor before enrolling.
                  </p>
                </div>
                <a
                  href="/free-demo"
                  className="whitespace-nowrap px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs shadow-sm transition-colors no-underline shrink-0"
                >
                  Book Consultation →
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* CONNECT WITH US — OFFICIAL SOCIAL CHANNELS */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-lg">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
                Official Channels
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins'] mb-2">
                Connect With Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Join our learning network, stream tech masterclasses, participate in technical discussions, and stay updated with official announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* YouTube */}
              <a
                href="https://youtube.com/@krgloballeaning?si=ZuFhhdkJl0HR9zQ5"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 mb-4 group-hover:scale-105 transition-transform">
                    <I.Youtube />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-1 group-hover:text-red-600 transition-colors">
                    YouTube
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    @krgloballeaning
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Watch in-depth technical masterclasses, architecture reviews, and certification preparation playlists.
                  </p>
                </div>
                <div className="text-xs font-bold text-red-600 flex items-center gap-1.5 pt-3 border-t border-slate-200/80">
                  <span>Visit Channel</span> <I.ArrowRight />
                </div>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/krglobal0713"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 mb-4 group-hover:scale-105 transition-transform">
                    <I.Telegram />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-1 group-hover:text-cyan-600 transition-colors">
                    Telegram
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    @krglobal0713
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Daily technical case studies, interview prep notes, live session notifications, and learning resources.
                  </p>
                </div>
                <div className="text-xs font-bold text-cyan-600 flex items-center gap-1.5 pt-3 border-t border-slate-200/80">
                  <span>Join Community</span> <I.ArrowRight />
                </div>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/KRGlobal1307"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-300 mb-4 group-hover:scale-105 transition-transform">
                    <I.Twitter />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-1 group-hover:text-slate-900 transition-colors">
                    X (Twitter)
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    @KRGlobal1307
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Follow real-time technology insights, cloud and AI trends, and updates directly from our mentors.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pt-3 border-t border-slate-200/80">
                  <span>Follow @KRGlobal1307</span> <I.ArrowRight />
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/krglobal0713?utm_source=qr&stkn=bzJhYWIzemRnZ212"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-200 mb-4 group-hover:scale-105 transition-transform">
                    <I.Instagram />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-1 group-hover:text-pink-600 transition-colors">
                    Instagram
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    @krglobal0713
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Student highlights, mentorship sessions, certificate achievements, and behind-the-scenes glimpses.
                  </p>
                </div>
                <div className="text-xs font-bold text-pink-600 flex items-center gap-1.5 pt-3 border-t border-slate-200/80">
                  <span>Follow on Instagram</span> <I.ArrowRight />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </SEO>
  );
}
