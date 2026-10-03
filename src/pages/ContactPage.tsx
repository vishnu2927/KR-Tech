import React, { useState } from "react";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";

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
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 text-center max-w-5xl mx-auto">
          {/* Frosted contact banner pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            24×7 Student Helpdesk & Customer Support Directory
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 font-['Poppins']">
            Need Learning Guidance? <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">We're Available 24×7.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Reach out directly to our 24×7 student support team for course enrollment, One-on-One learning consultations, payment assistance, and live technical support.
          </p>
        </section>

        {/* CONTACT CARDS GRID */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 — Customer Support (24×7 Available) */}
            <div className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/60 p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform">
                    <I.Headset />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    24×7 Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] mb-1">
                  Customer Support
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  (24×7 Available Helpline)
                </p>
                <div className="text-lg font-extrabold text-blue-600 mb-3 tracking-wide">
                  +91 9311073936
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Instant guidance for course admissions, One-on-One consultations, and technical help.
                </p>
              </div>

              {/* WhatsApp + Call Button */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                <a
                  href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20would%20like%20to%20inquire%20about%20your%20courses%20and%20One-on-One%20learning%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm no-underline"
                >
                  <I.MessageCircle /> Chat on WhatsApp
                </a>
                <a
                  href="tel:+919311073936"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline"
                >
                  <I.Phone /> Call +91 9311073936
                </a>
              </div>
            </div>

            {/* Card 2 — Business Email */}
            <div className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/60 p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                    <I.Mail />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                    Business Email
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] mb-1">
                  Business Email
                </h3>
                <p className="text-xs text-amber-700 mb-3">
                  Admissions, Billing & Inquiries
                </p>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 mb-3 tracking-wide break-all">
                  krglobal0713@gmail.com
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Expect a prompt response within 2 hours from our dedicated academic coordination team.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href="mailto:krglobal0713@gmail.com?subject=Learning%20Inquiry%20-%20KR%20Global%20Learning"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline"
                >
                  <I.Mail /> Send Email
                </a>
              </div>
            </div>

            {/* Card 3 — Corporate Office */}
            <div className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-cyan-400/60 p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 group-hover:scale-105 transition-transform">
                    <I.MapPin />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-800 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200">
                    Corporate Office
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] mb-1">
                  Corporate Office
                </h3>
                <div className="text-xs font-bold text-blue-700 mb-2">
                  KR GLOBAL LEARNING PRIVATE LIMITED
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Unit No. 615, Artha Mart,<br />
                  Tech Zone IV, Greater Noida West,<br />
                  Uttar Pradesh – 201318
                </p>
              </div>

              {/* Get Directions Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline shadow-sm"
                >
                  <I.MapPin /> Get Directions
                </a>
              </div>
            </div>

            {/* Card 4 — Support Notice Card: Customer Support Availability */}
            <div className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/60 p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                    <I.Clock />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    24×7 Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] mb-1">
                  We're Available 24×7
                </h3>
                <div className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                  <span>🟢 Available 24 Hours × 7 Days</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Get instant support for:
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-emerald-600 font-bold">✓</span> Course Guidance & Enrollment
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-emerald-600 font-bold">✓</span> One-on-One Learning Consultation
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-emerald-600 font-bold">✓</span> Payment & Invoice Issues
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-emerald-600 font-bold">✓</span> Dashboard & Live Classes Help
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="text-emerald-600 font-bold">✓</span> Technical Queries
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <a
                  href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors no-underline"
                >
                  <I.MessageCircle /> WhatsApp
                </a>
                <a
                  href="tel:+919311073936"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors no-underline"
                >
                  <I.Phone /> Call 24×7
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* GOOGLE MAPS EMBED & FORM SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Poppins'] mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill out the form below. An academic counselor will contact you within 2 hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                    <I.Check />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900 font-['Poppins'] mb-2">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto mb-6">
                    Thank you, <strong className="text-slate-900">{name}</strong>. We have registered your request for <strong className="text-blue-700">{subject}</strong>. Our student counseling desk (+91 9311073936) will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      Subject / Course of Interest
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
                      placeholder="Tell us about your learning goals, background, or corporate requirements…"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 resize-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <I.Send /> Submit Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps Section */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
                      <I.MapPin />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                        Artha Mart Office Location
                      </h3>
                      <p className="text-xs text-slate-500">Greater Noida West, Uttar Pradesh – 201318</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold no-underline transition"
                  >
                    Open Full Map
                  </a>
                </div>

                {/* Google Maps Embed Section (Clean light view) */}
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner h-[280px] bg-slate-100 relative">
                  <iframe
                    title="KR GLOBAL LEARNING PRIVATE LIMITED Corporate Office"
                    src="https://maps.google.com/maps?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between shadow-sm pointer-events-none">
                    <span>📍 Unit No. 615, Artha Mart</span>
                    <span className="text-blue-600 font-semibold">Tech Zone IV, Greater Noida West</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Fast Metro & Noida Expressway Connectivity</span>
                  <a
                    href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 no-underline"
                  >
                    Get Driving Directions <I.ChevronRight />
                  </a>
                </div>
              </div>

              {/* Free Consultation Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border border-blue-400/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/15">
                <div>
                  <h4 className="text-base font-bold text-white font-['Poppins'] mb-1">
                    Book a Free One-on-One Learning Consultation
                  </h4>
                  <p className="text-xs text-blue-100">
                    Interact directly with an industry mentor before enrolling in any technical track.
                  </p>
                </div>
                <a
                  href="/free-demo"
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs shadow-md transition-colors no-underline"
                >
                  Book Free Consultation
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
