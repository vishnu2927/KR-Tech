import React, { useState } from "react";

interface ResumeUploaderProps {
  onAnalyze: (payload: { resumeText: string; targetRole: string; targetCompany: string }) => void;
  isAnalyzing: boolean;
}

const SAMPLE_RESUMES = [
  {
    role: "Senior Java Backend Engineer",
    company: "Tier-1 Fintech & Product",
    text: `ADITYA SHARMA
Senior Software Engineer | aditya.sharma@krtech.edu | Bengaluru, India | linkedin.com/in/aditya-sharma-dev

PROFESSIONAL SUMMARY
Results-oriented Senior Backend Engineer with 5+ years of experience architecting high-throughput distributed systems in Java 21, Spring Boot 3, and Apache Kafka. Scaled payment ingestion microservices processing 15,000+ RPS with p99 latency under 45ms.

TECHNICAL SKILLS
Languages: Java 21, SQL, Go, Python, TypeScript
Frameworks: Spring Boot 3.x, Spring Cloud, Hibernate/JPA, Quarkus
Databases & Cache: PostgreSQL, MongoDB Atlas, Redis Cluster, Elasticsearch
Cloud & DevOps: AWS (ECS, Lambda, SQS, S3), Docker, Kubernetes, Terraform, CI/CD GitHub Actions
Architecture: Microservices, Event-Driven Architecture, CQRS, Saga Pattern, REST, gRPC

WORK EXPERIENCE
Senior Software Engineer — PayStream Technologies (2022 – Present)
- Architected and deployed an event-driven payment reconciliation engine using Apache Kafka and Spring Boot, reducing end-of-day settlement duration by 68%.
- Optimized database indexing and connection pooling (HikariCP) in PostgreSQL, eliminating transaction deadlocks under 20,000 concurrent user loads.
- Mentored a team of 6 engineers on domain-driven design, code review rigor, and zero-trust security.

Software Engineer — CloudScale Systems (2020 – 2022)
- Built 14 RESTful microservices for customer identity verification with automated OAuth2 / JWT authentication.
- Containerized legacy services with multi-stage Docker builds and orchestrated deployments on Kubernetes clusters.

EDUCATION & CERTIFICATIONS
- B.Tech in Computer Science & Engineering — 8.8 CGPA (2020)
- AWS Certified Solutions Architect – Associate (SAA-C03)`,
  },
  {
    role: "Full Stack MERN Lead",
    company: "High-Growth Unicorn",
    text: `KAVYA PATEL
Full Stack Lead Engineer | kavya.patel@gmail.com | Mumbai, India | github.com/kavyapatel

PROFESSIONAL SUMMARY
Full Stack Engineer with 4+ years of hands-on experience building enterprise web applications in React 19, TypeScript, Node.js, and MongoDB. Passionate about web performance optimization, design systems, and cloud-native architecture.

CORE COMPETENCIES
- Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS, Redux Toolkit, WebSockets
- Backend: Node.js, Express.js, NestJS, REST APIs, GraphQL
- Storage: MongoDB, Redis, PostgreSQL
- Tools: Docker, Jest, Cypress, Git, AWS S3, CI/CD

EXPERIENCE
Lead Frontend Engineer — DevHub EdTech (2022 – Present)
- Led frontend redesign across 4 core portals, improving Google Core Web Vitals (LCP improved from 3.2s to 1.1s).
- Implemented real-time interactive classroom dashboard with WebSockets and Canvas rendering.
- Reduced webpack bundle footprint by 45% through dynamic code-splitting and asset tree-shaking.`,
  },
];

export default function ResumeUploader({ onAnalyze, isAnalyzing }: ResumeUploaderProps) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Senior Java Backend Engineer");
  const [targetCompany, setTargetCompany] = useState("Tier-1 Tech Product Companies");
  const [dragActive, setDragActive] = useState(false);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 50) return;
    onAnalyze({ resumeText, targetRole, targetCompany });
  };

  const handleLoadSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.text);
    setTargetRole(sample.role);
    setTargetCompany(sample.company);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-base">
              📄
            </span>
            Resume ATS Input & Auditor
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Paste your resume text or load an industry benchmark sample for instant ATS scoring.
          </p>
        </div>

        {/* Sample Loaders */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Benchmarks:
          </span>
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/80 text-slate-300 transition-all font-medium cursor-pointer"
            >
              {idx === 0 ? "☕ Java Backend" : "⚛️ MERN Stack"}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              🎯 Target Engineering Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, DevOps Lead"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              🏢 Target Company / Tier
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Google, Amazon, Tier-1 Product Unicorns"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {/* Text Area / Drag Drop */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`relative rounded-2xl border transition-all ${
            dragActive
              ? "border-cyan-500 bg-cyan-950/20"
              : "border-slate-800/90 bg-slate-950/90"
          }`}
        >
          <textarea
            rows={10}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your plain-text resume content here (Summary, Work Experience, Technical Skills, Projects, Education)..."
            className="w-full p-4 bg-transparent text-slate-200 text-xs font-mono placeholder:text-slate-500 focus:outline-none resize-y"
            required
          />

          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 rounded-b-2xl text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>Words: <strong className="text-white">{wordCount}</strong></span>
              <span>Characters: <strong className="text-white">{resumeText.length}</strong></span>
            </div>
            <div className="text-[10px] text-slate-500">
              Drag & drop .txt or .md files supported
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {resumeText && (
            <button
              type="button"
              onClick={() => setResumeText("")}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 cursor-pointer"
            >
              Clear
            </button>
          )}

          <button
            type="submit"
            disabled={isAnalyzing || resumeText.length < 50}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing ATS Compatibility...
              </>
            ) : (
              <>🚀 Run AI ATS Audit</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
