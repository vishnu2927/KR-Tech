import React, { useState } from 'react';
import SEO from '../components/common/SEO';

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: {
    role: string;
    company: string;
    location: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    tech: string;
    link: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa: string;
  }[];
  skills: string;
}

const SAMPLE_RESUME: ResumeData = {
  fullName: 'Aditya Sharma',
  email: 'aditya.sharma@krtech.in',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  github: 'github.com/adityasharma',
  linkedin: 'linkedin.com/in/adityasharma',
  summary:
    'Full Stack Software Engineer with deep experience building event-driven microservices with Node.js, Express, React 19, Kafka, and Redis. Solved 250+ LeetCode problems; passionate about distributed systems and cloud infrastructure.',
  experience: [
    {
      role: 'Software Development Engineer Intern',
      company: 'KR Global Learning Labs',
      location: 'Bangalore, India',
      duration: 'May 2025 – Present',
      bullets: [
        'Architected real-time WebSocket chat rooms supporting 15,000+ students with Socket.IO and Redis PubSub.',
        'Engineered Cache-Aside pattern utilizing Redis Cluster, reducing PostgreSQL database query volume by 65%.',
        'Implemented automated JWT token rotation with bcrypt password hashing and rate-limited API gateways.',
      ],
    },
  ],
  projects: [
    {
      name: 'Distributed Code Sandbox Compiler',
      tech: 'Node.js, Docker, Isolated VM, Redis, React 19',
      link: 'github.com/adityasharma/code-sandbox',
      bullets: [
        'Built secure multi-language execution engine running JavaScript, Python, and C++ with 3s timeouts.',
        'Executed 1,000+ concurrent automated unit tests with stdin redirection and sub-30ms response times.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'National Institute of Technology',
      year: '2022 – 2026',
      gpa: '8.8 / 10.0',
    },
  ],
  skills:
    'Languages: JavaScript, TypeScript, C++, Python, SQL | Frameworks: Node.js, Express, React 19, Next.js 15, Tailwind CSS | Databases & Tools: MongoDB, PostgreSQL, Redis, Kafka, Docker, Git',
};

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Interactive ATS Resume Builder | KR Global Learning"
        description="Design and export an ATS-compliant software engineering resume with live side-by-side preview and PDF export."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <span>📄 Single-Column ATS Gold Standard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              WYSIWYG Resume Builder
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Built specifically to pass MAANG Workday, Greenhouse, and Lever ATS scanners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setResume(SAMPLE_RESUME)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/5"
            >
              Reset to Sample
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <span>🖨️</span> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* 2-Column Split: Form (Left) & Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Controls (Left 6 Cols) */}
          <div className="lg:col-span-6 space-y-6 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin">
            {/* Contact Details */}
            <div className="p-6 bg-slate-900/80 border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.location}
                    onChange={(e) => setResume({ ...resume, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-slate-900/80 border border-white/10 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Professional Summary
              </h3>
              <textarea
                rows={3}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-white/10 rounded-lg text-xs text-white leading-relaxed"
              />
            </div>

            {/* Technical Skills */}
            <div className="p-6 bg-slate-900/80 border border-white/10 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Technical Skills
              </h3>
              <textarea
                rows={3}
                value={resume.skills}
                onChange={(e) => setResume({ ...resume, skills: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-white/10 rounded-lg text-xs text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Real-Time ATS Paper Preview (Right 6 Cols) */}
          <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-8 md:p-10 shadow-2xl space-y-6 font-sans text-xs leading-relaxed print:p-0 print:shadow-none print:w-full print:m-0">
            {/* Header */}
            <div className="text-center space-y-1 border-b pb-4 border-slate-300">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
                {resume.fullName}
              </h1>
              <p className="text-[11px] text-slate-600">
                {resume.email} • {resume.phone} • {resume.location}
              </p>
              <p className="text-[10px] text-slate-500">
                {resume.github} • {resume.linkedin}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
                Professional Summary
              </h2>
              <p className="text-[11px] text-slate-700 leading-normal">{resume.summary}</p>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
                Technical Skills
              </h2>
              <p className="text-[11px] text-slate-700">{resume.skills}</p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
                Experience
              </h2>
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span>
                      {exp.role} — {exp.company}
                    </span>
                    <span className="font-normal text-slate-600">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    {exp.bullets.map((b, bidx) => (
                      <li key={bidx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
                Key Technical Projects
              </h2>
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span>{proj.name}</span>
                    <span className="font-normal text-slate-500 text-[10px]">{proj.link}</span>
                  </div>
                  <p className="text-[10px] italic text-slate-600 font-mono">{proj.tech}</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    {proj.bullets.map((b, bidx) => (
                      <li key={bidx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900">
                Education
              </h2>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span>
                    <strong>{edu.degree}</strong>, {edu.institution}
                  </span>
                  <span className="text-slate-600">
                    {edu.year} (GPA: {edu.gpa})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
