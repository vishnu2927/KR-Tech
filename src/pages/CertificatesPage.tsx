import { useState } from "react";
import { Link } from "react-router-dom";
import { CertificateCard, CertificateItem } from "../components/CertificateCard";
import { I } from "../components/Icons";
import SectionHeading from "../components/SectionHeading";

const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: "cert-java",
    title: "Java Backend & Spring Boot Microservices Architecture",
    category: "Java Backend",
    studentName: "Aditya Sharma",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-JAVA-9102",
    grade: "Grade A+ (96%)",
    skills: ["Java 21", "Spring Boot 3.x", "Microservices", "Kafka", "Docker"],
    thumbnailGradient: "from-purple-900 via-indigo-900 to-slate-950",
    accentColor: "#7C3AED",
  },
  {
    id: "cert-mern",
    title: "MERN Full Stack & Next.js 15 SaaS Engineering",
    category: "MERN Stack",
    studentName: "Kavya Patel",
    completionDate: "Jul 2026",
    credentialId: "KRT-2026-MERN-8401",
    grade: "Grade A (94%)",
    skills: ["React 19", "Node.js", "Express", "MongoDB", "Next.js"],
    thumbnailGradient: "from-indigo-950 via-cyan-950 to-slate-900",
    accentColor: "#06B6D4",
  },
  {
    id: "cert-aws",
    title: "AWS Certified Solutions Architect Associate Track",
    category: "AWS",
    studentName: "Siddharth Verma",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-AWS-7729",
    grade: "Grade A+ (98%)",
    skills: ["AWS VPC", "EC2 & S3", "IAM", "ECS Fargate", "CloudFormation"],
    thumbnailGradient: "from-amber-950 via-orange-950 to-slate-900",
    accentColor: "#F59E0B",
  },
  {
    id: "cert-azure",
    title: "Microsoft Azure Administrator (AZ-104) & Hybrid Cloud",
    category: "Azure",
    studentName: "Meenakshi Iyer",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-AZ-6612",
    grade: "Grade A (92%)",
    skills: ["Azure Entra ID", "Virtual Networks", "ARM Templates", "Azure Backup"],
    thumbnailGradient: "from-blue-950 via-sky-950 to-slate-900",
    accentColor: "#0284C7",
  },
  {
    id: "cert-sec",
    title: "Certified Ethical Hacker (CEH) & SOC Threat Hunting",
    category: "Cyber Security",
    studentName: "Rohan Deshmukh",
    completionDate: "Jul 2026",
    credentialId: "KRT-2026-SEC-5503",
    grade: "Grade A+ (97%)",
    skills: ["Ethical Hacking", "Wireshark", "Burp Suite", "SIEM Splunk", "Firewalls"],
    thumbnailGradient: "from-red-950 via-rose-950 to-slate-900",
    accentColor: "#E11D48",
  },
  {
    id: "cert-bi",
    title: "Microsoft Power BI Data Analyst (PL-300) & Analytics",
    category: "Power BI",
    studentName: "Ananya Roy",
    completionDate: "Jun 2026",
    credentialId: "KRT-2026-PBI-4491",
    grade: "Grade A (95%)",
    skills: ["Power BI", "DAX Modeling", "Advanced SQL", "Tableau", "ETL"],
    thumbnailGradient: "from-amber-950 via-yellow-950 to-slate-900",
    accentColor: "#D97706",
  },
  {
    id: "cert-sap",
    title: "SAP S/4HANA FICO Financial Accounting Consultant",
    category: "SAP",
    studentName: "Vikram Malhotra",
    completionDate: "Jul 2026",
    credentialId: "KRT-2026-SAP-3382",
    grade: "Grade A+ (99%)",
    skills: ["SAP FICO", "General Ledger", "Accounts Payable", "Asset Accounting", "S/4HANA"],
    thumbnailGradient: "from-teal-950 via-emerald-950 to-slate-900",
    accentColor: "#0D9488",
  },
  {
    id: "cert-sfdc",
    title: "Salesforce Administrator & Platform Developer (PD1)",
    category: "Salesforce",
    studentName: "Pooja Hegde",
    completionDate: "Aug 2026",
    credentialId: "KRT-2026-SF-2210",
    grade: "Grade A (93%)",
    skills: ["Salesforce Admin", "Apex Programming", "Lightning LWC", "Flows", "SOQL"],
    thumbnailGradient: "from-blue-950 via-indigo-950 to-slate-900",
    accentColor: "#4F46E5",
  },
];

export default function CertificatesPage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

  const categories = [
    "All",
    "Java Backend",
    "MERN Stack",
    "AWS",
    "Azure",
    "Cyber Security",
    "Power BI",
    "SAP",
    "Salesforce",
  ];

  const filtered = CERTIFICATES_DATA.filter((c) => {
    const matchCat = selectedCat === "All" || c.category === selectedCat;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.credentialId.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));

    return matchCat && matchQuery;
  });

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 via-white to-purple-50/20">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. Hero Section
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white overflow-hidden text-center">
        <div className="container-xl relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
            <span>🏆</span> Verified Industry Credentials
          </span>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
            KR Tech Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">Certificate Gallery</span>
          </h1>

          <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Every KR Tech credential features a unique cryptographic verification ID, mentor endorsement, and hands-on capstone project defense.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all no-underline shadow-md"
            >
              Access My Certificates in Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. Search & Category Filters
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="container-xl">
          {/* Verification / Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white rounded-2xl border border-purple-200 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
              <span className="text-purple-600"><I.Search /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Verify by Certificate ID (e.g., KRT-2026-JAVA-9102), course name, or student…"
                className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200 border border-purple-600"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Certificate Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((cert) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                onPreview={(c) => setActiveModalCert(c)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. High-Res Modal Preview
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 animate-scaleIn border border-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Big Mockup */}
            <div className={`p-8 rounded-2xl bg-gradient-to-br ${activeModalCert.thumbnailGradient} text-white relative border-4 border-amber-400/40 shadow-xl mb-6 text-center`}>
              <div className="text-xs uppercase tracking-widest text-amber-300 font-extrabold mb-1">
                ★ KR TECH OFFICIAL CERTIFICATE OF EXCELLENCE ★
              </div>
              <p className="text-xs text-purple-200 mb-4">This certifies that</p>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
                {activeModalCert.studentName}
              </h2>
              <p className="text-xs text-purple-200 max-w-md mx-auto mb-4">
                has successfully completed all live 1:1 sessions, hands-on lab milestones, and the production capstone in
              </p>
              <h3 className="font-sans font-extrabold text-lg sm:text-xl text-amber-200 mb-4">
                {activeModalCert.title}
              </h3>
              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-purple-200 font-mono">
                <span>Issued: {activeModalCert.completionDate}</span>
                <span className="text-emerald-300 font-bold">{activeModalCert.grade}</span>
                <span>ID: {activeModalCert.credentialId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Status: <strong className="text-emerald-600">✓ Cryptographically Verified</strong>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloaded Official PDF Certificate for ${activeModalCert.studentName}`);
                    setActiveModalCert(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 shadow-md transition-all flex items-center gap-1.5"
                >
                  <I.Download /> Download Official PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
