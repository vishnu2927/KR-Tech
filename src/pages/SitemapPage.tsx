import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";

export default function SitemapPage() {
  const sections = [
    {
      title: "Core Platforms",
      links: [
        { label: "Home", to: "/" },
        { label: "Course Catalog", to: "/courses" },
        { label: "One-on-One Industry Mentors", to: "/mentors" },
        { label: "Free Live Demo Booking", to: "/free-demo" },
        { label: "Certifications & Learning Stats", to: "/certificates" },
        { label: "Free Learning Resources & PDFs", to: "/resources" },
      ],
    },
    {
      title: "Student Portal & AI Tools",
      links: [
        { label: "Student Dashboard", to: "/student/dashboard" },
        { label: "My Enrolled Courses", to: "/my-courses" },
        { label: "Course Video Player", to: "/learn" },
        { label: "AI Code Mentor", to: "/ai/mentor" },
        { label: "AI Mock Interviews", to: "/ai/mock-interview" },
        { label: "Resume Analyzer", to: "/ai/resume-analyzer" },
        { label: "DSA Practice Room", to: "/dsa-room" },
      ],
    },
    {
      title: "Credentials & Verification",
      links: [
        { label: "Certificate Directory", to: "/certificates" },
        { label: "Public Credential Verification", to: "/verify-certificate" },
        { label: "Student Badges & Achievements", to: "/badges" },
      ],
    },
    {
      title: "Company & Helpdesk",
      links: [
        { label: "About KR Global Learning", to: "/about" },
        { label: "Contact Us (24×7 Support)", to: "/contact" },
        { label: "Frequently Asked Questions (FAQ)", to: "/faq" },
        { label: "Student Community Feed", to: "/community" },
        { label: "Engineering Blog", to: "/blogs" },
      ],
    },
    {
      title: "Legal & Compliance",
      links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms & Conditions", to: "/terms" },
        { label: "Refund Policy", to: "/refund" },
        { label: "Cookie Policy", to: "/cookies" },
        { label: "Legal Disclaimer", to: "/disclaimer" },
      ],
    },
  ];

  return (
    <SEO
      title="Sitemap — KR GLOBAL LEARNING PRIVATE LIMITED"
      description="HTML Sitemap of all platform pages, courses, portals, and verified credentials at KR GLOBAL LEARNING PRIVATE LIMITED."
      canonical="https://krtech.in/sitemap"
    >
      <main className="min-h-screen bg-[#070913] text-slate-100 pt-[90px] relative overflow-hidden">
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-md">
            Complete Architecture Index
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Poppins'] tracking-tight mb-3">
            Platform <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Sitemap</span>
          </h1>
          <p className="text-sm text-slate-400">
            Quick navigation to all public portals, learning hubs, and support centers of KR GLOBAL LEARNING PRIVATE LIMITED.
          </p>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-xl"
              >
                <h2 className="text-base font-bold text-white font-['Poppins'] pb-3 mb-4 border-b border-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {sec.title}
                </h2>
                <ul className="space-y-2.5 list-none p-0 m-0 text-xs">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        to={link.to}
                        className="text-slate-300 hover:text-cyan-300 transition-colors no-underline block py-1"
                      >
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </SEO>
  );
}
