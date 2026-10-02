import React from "react";
import { Link } from "react-router-dom";
import { I } from "./Icons";
import TrustSection from "./TrustSection";

export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Certificates", href: "/certificates" },
    { label: "Achievements", href: "/achievements" },
    { label: "One-on-One Sessions", href: "/courses" },
    { label: "Resources", href: "/resources" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const popularCourses = [
    { label: "MERN Stack", href: "/courses" },
    { label: "Java Full Stack", href: "/courses" },
    { label: "AWS", href: "/courses" },
    { label: "Azure", href: "/courses" },
    { label: "Cyber Security", href: "/courses" },
    { label: "DevOps", href: "/courses" },
    { label: "SAP", href: "/courses" },
    { label: "Power BI", href: "/courses" },
  ];

  // Official company social media channels
  const socialChannels = [
    {
      icon: <I.Youtube />,
      label: "YouTube",
      href: "https://youtube.com/@krgloballeaning?si=ZuFhhdkJl0HR9zQ5",
    },
    {
      icon: <I.Telegram />,
      label: "Telegram",
      href: "https://t.me/krglobal0713",
    },
    {
      icon: <I.Instagram />,
      label: "Instagram",
      href: "https://www.instagram.com/krglobal0713?utm_source=qr&stkn=bzJhYWIzemRnZ212",
    },
    {
      icon: <I.Twitter />,
      label: "X (Twitter)",
      href: "https://x.com/KRGlobal1307",
    },
  ];

  return (
    <>
      {/* SECTION D — Trust Strip above footer */}
      <TrustSection />

      {/* SECTION C — Enterprise Dark Footer */}
      <footer className="footer-bg relative overflow-hidden text-white border-t border-purple-500/20 bg-[#060811]">
        {/* Ambient background glows */}
        <div className="orb" style={{ width: 500, height: 500, top: -120, left: -100, background: "rgba(124,58,237,0.15)" }} />
        <div className="orb" style={{ width: 450, height: 450, bottom: -80, right: -60, background: "rgba(6,182,212,0.12)" }} />

        <div className="container-xl relative z-10" style={{ paddingTop: 64, paddingBottom: 36 }}>
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
            
            {/* Column 1: Brand & Description (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <Link
                  to="/"
                  title="KR GLOBAL LEARNING PRIVATE LIMITED"
                  className="inline-flex items-center gap-3.5 mb-4 no-underline group"
                >
                  <I.Logo />
                  <div>
                    <div className="font-display font-extrabold text-xl text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      KR Global Learning
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase">
                      KR GLOBAL LEARNING PRIVATE LIMITED
                    </div>
                    <div className="text-[11px] font-medium text-purple-300">
                      Learn. Build. Grow. Globally.
                    </div>
                  </div>
                </Link>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  KR GLOBAL LEARNING PRIVATE LIMITED is a trusted technology training and certification platform delivering live One-on-One mentorship, practical projects, AI-powered learning tools, certification preparation, and industry-focused technical education.
                </p>
                <p className="text-cyan-400 text-xs font-semibold mb-6">
                  Trusted Learning Partner for Technology Education.
                </p>

                {/* 24x7 Support Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>24×7 Student Support Available</span>
                </div>
              </div>

              {/* Social Channels: Follow Us / Connect With Us */}
              <div className="mt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Follow Us / Connect With Us
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {socialChannels.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social flex items-center justify-center p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400/70 hover:bg-slate-800 transition-all shadow-md group"
                      aria-label={s.label}
                      title={s.label}
                    >
                      <span className="transition-transform group-hover:scale-110">{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (2.5 cols) */}
            <div className="lg:col-span-2 sm:col-span-1">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Quick Links
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="footer-link text-xs text-slate-400 hover:text-cyan-300 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Popular Courses (2.5 cols) */}
            <div className="lg:col-span-2 sm:col-span-1">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Popular Courses
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {popularCourses.map((p) => (
                  <li key={p.label}>
                    <Link to={p.href} className="footer-link text-xs text-slate-400 hover:text-cyan-300 transition-colors">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Office Address (4 cols) — Polished Section 2 & 8 */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-xl shadow-cyan-950/20 hover:border-cyan-400/50 transition-all duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="flex items-center gap-2 font-display font-bold text-sm text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Contact Information
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    24×7 Support
                  </span>
                </div>

                {/* Contacts List */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Customer Support (24×7 Available)
                    </div>
                    <a
                      href="tel:+919311073936"
                      className="text-white hover:text-cyan-300 font-semibold flex items-center gap-2 mt-1 no-underline transition text-sm"
                    >
                      <span>📞</span> +91 9311073936
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Business Email
                    </div>
                    <a
                      href="mailto:krglobal0713@gmail.com"
                      className="text-slate-200 hover:text-white font-medium flex items-center gap-2 mt-1 no-underline transition break-all"
                    >
                      <span>✉️</span> krglobal0713@gmail.com
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <span>📍</span> Corporate Office
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed m-0 font-sans mt-1">
                      Unit No. 615, Artha Mart,<br />
                      Tech Zone IV, Greater Noida West,<br />
                      Uttar Pradesh – 201318
                    </p>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <a
                  href="https://wa.me/919311073936?text=Hello%20KR%20Global%20Learning,%20I%20would%20like%20to%20learn%20more%20about%20your%20courses%20and%20One-on-One%20mentorship."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 no-underline transition cursor-pointer"
                >
                  <I.MessageCircle /> Chat on WhatsApp (24×7)
                </a>
              </div>
            </div>

          </div>

          {/* Footer Bottom — Section 13 */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p className="m-0 font-medium text-slate-300">
                © 2026 KR GLOBAL LEARNING PRIVATE LIMITED. All Rights Reserved.
              </p>
              <p className="text-[11px] text-slate-400 mt-1 mb-0">
                Empowering India's Next Generation of Technology Professionals Through Personalized Learning.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap text-xs">
              <Link to="/privacy" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Privacy Policy
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/terms" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Terms & Conditions
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/refund" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Refund Policy
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/cookies" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Cookie Policy
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/disclaimer" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Disclaimer
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/sitemap" className="hover:text-cyan-300 transition-colors no-underline text-slate-400">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
