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
      <main className="min-h-screen bg-[#070913] text-slate-100 pt-[90px] relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 text-center max-w-5xl mx-auto">
          {/* Glassmorphism contact banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-6 backdrop-blur-xl shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            24×7 Student Helpdesk & Customer Support Directory
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 font-['Poppins']">
            Need Learning Guidance? <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">We're Available 24×7.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Reach out directly to our 24×7 student support team for course enrollment, One-on-One learning consultations, payment assistance, and live technical support.
          </p>
        </section>

        {/* CONTACT CARDS GRID — SECTIONS 1, 2, 8, 9, 11 SPECIFICATION */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 — Customer Support (24×7 Available) */}
            <div className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-purple-500/30 p-6 flex flex-col justify-between hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <I.Headset />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    24×7 Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-1">
                  Customer Support
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  (24×7 Available Helpline)
                </p>
                <div className="text-lg font-extrabold text-purple-300 mb-3 tracking-wide">
                  +91 9311073936
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Instant guidance for course admissions, One-on-One consultations, and technical help.
                </p>
              </div>

              {/* WhatsApp + Call Button */}
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
                <a
                  href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20would%20like%20to%20inquire%20about%20your%20courses%20and%20One-on-One%20learning%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-900/30 no-underline"
                >
                  <I.MessageCircle /> Chat on WhatsApp
                </a>
                <a
                  href="tel:+919311073936"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline"
                >
                  <I.Phone /> Call +91 9311073936
                </a>
              </div>
            </div>

            {/* Card 2 — Business Email */}
            <div className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-amber-500/30 p-6 flex flex-col justify-between hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <I.Mail />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/60">
                    Business Email
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-1">
                  Business Email
                </h3>
                <p className="text-xs text-amber-300/80 mb-3">
                  Admissions, Billing & Inquiries
                </p>
                <div className="text-sm sm:text-base font-extrabold text-amber-300 mb-3 tracking-wide break-all">
                  krglobal0713@gmail.com
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Expect a prompt response within 2 hours from our dedicated academic coordination team.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href="mailto:krglobal0713@gmail.com?subject=Learning%20Inquiry%20-%20KR%20Global%20Learning"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline"
                >
                  <I.Mail /> Send Email
                </a>
              </div>
            </div>

            {/* Card 3 — Corporate Office */}
            <div className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 flex flex-col justify-between hover:border-cyan-400/60 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <I.MapPin />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">
                    Corporate Office
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-1">
                  Corporate Office
                </h3>
                <div className="text-xs font-bold text-purple-300 mb-2">
                  KR GLOBAL LEARNING PRIVATE LIMITED
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Unit No. 615, Artha Mart,<br />
                  Tech Zone IV, Greater Noida West,<br />
                  Uttar Pradesh – 201318
                </p>
              </div>

              {/* Get Directions Button */}
              <div className="pt-3 border-t border-slate-800">
                <a
                  href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline shadow-md shadow-cyan-950/40"
                >
                  <I.MapPin /> Get Directions
                </a>
              </div>
            </div>

            {/* Card 4 — Support Notice Card: Customer Support Availability (SECTION 9 & 11) */}
            <div className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 p-6 flex flex-col justify-between hover:border-emerald-400/60 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <I.Clock />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    24×7 Available
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-1">
                  We're Available 24×7
                </h3>
                <div className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                  <span>🟢 Available 24 Hours × 7 Days</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 border-t border-slate-800/80 pt-2.5">
                  <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Get instant support for:
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span> Course Guidance & Enrollment
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span> One-on-One Learning Consultation
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span> Payment & Invoice Issues
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span> Dashboard & Live Classes Help
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="text-emerald-400">✓</span> Technical Queries
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <a
                  href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors no-underline"
                >
                  <I.MessageCircle /> WhatsApp
                </a>
                <a
                  href="tel:+919311073936"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors no-underline"
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
            <div className="lg:col-span-6 bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Poppins'] mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Fill out the form below. An academic counselor will contact you within 2 hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-950/40 rounded-2xl border border-emerald-500/40">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <I.Check />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-300 font-['Poppins'] mb-2">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Thank you, <strong className="text-white">{name}</strong>. We have registered your request for <strong className="text-purple-300">{subject}</strong>. Our student counseling desk (+91 9311073936) will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subject / Course of Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:outline-none text-sm text-white"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Message or Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your learning goals, background, or corporate requirements…"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <I.Send /> Submit Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps Section — SECTION B SPECIFICATION */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                      <I.MapPin />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-['Poppins']">
                        Artha Mart Office Location
                      </h3>
                      <p className="text-xs text-slate-400">Greater Noida West, Uttar Pradesh – 201318</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold no-underline transition"
                  >
                    Open Full Map
                  </a>
                </div>

                {/* Google Maps Embed Section */}
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner h-[280px] bg-slate-950 relative">
                  <iframe
                    title="KR GLOBAL LEARNING PRIVATE LIMITED Corporate Office"
                    src="https://maps.google.com/maps?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between pointer-events-none">
                    <span>📍 Unit No. 615, Artha Mart</span>
                    <span className="text-cyan-400 font-semibold">Tech Zone IV, Greater Noida West</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Fast Metro & Noida Expressway Connectivity</span>
                  <a
                    href="https://maps.google.com/?q=Artha+Mart+Tech+Zone+IV+Greater+Noida+West+Uttar+Pradesh+201318"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 no-underline"
                  >
                    Get Driving Directions <I.ChevronRight />
                  </a>
                </div>
              </div>

              {/* Free Consultation Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900/80 border border-purple-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white font-['Poppins'] mb-1">
                    Book a Free One-on-One Learning Consultation
                  </h4>
                  <p className="text-xs text-slate-300">
                    Interact directly with an industry mentor before enrolling in any technical track.
                  </p>
                </div>
                <a
                  href="/free-demo"
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors no-underline"
                >
                  Book Free Consultation
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>
    </SEO>
  );
}
