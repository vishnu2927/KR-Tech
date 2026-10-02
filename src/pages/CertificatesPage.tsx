import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { CertificateCard } from "../components/CertificateCard";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Certificate, certificateService, VerifyResponse } from "../services/certificateService";

// Helper component for QR Code graphic
function CertificateQRCode({
  credentialId,
  qrCodeDataUrl,
}: {
  credentialId: string;
  qrCodeDataUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center bg-slate-900 p-3.5 rounded-2xl border border-slate-700 shadow-sm text-center">
      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white flex items-center justify-center p-1 rounded-lg border border-slate-700 overflow-hidden">
        {qrCodeDataUrl ? (
          <img
            src={qrCodeDataUrl}
            alt={`QR Code for ${credentialId}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
            <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
            <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
            <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />
            <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
            <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
            <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />
            <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
            <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
            <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />
            <rect x="36" y="8" width="6" height="6" fill="currentColor" />
            <rect x="46" y="8" width="6" height="6" fill="currentColor" />
            <rect x="56" y="8" width="6" height="6" fill="currentColor" />
            <rect x="36" y="36" width="8" height="8" rx="2" fill="#7C3AED" />
            <rect x="48" y="36" width="6" height="6" fill="currentColor" />
            <rect x="58" y="44" width="6" height="6" fill="currentColor" />
            <rect x="68" y="36" width="6" height="6" fill="currentColor" />
            <rect x="46" y="48" width="8" height="8" rx="2" fill="#06B6D4" />
            <rect x="58" y="56" width="6" height="6" fill="currentColor" />
            <rect x="68" y="68" width="8" height="8" fill="currentColor" />
            <rect x="80" y="68" width="6" height="6" fill="currentColor" />
          </svg>
        )}
      </div>

      <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Scan QR to Verify</span>
      </div>
      <span className="text-[9px] text-cyan-300 font-bold truncate max-w-[130px] block mt-0.5 font-mono">
        {credentialId}
      </span>
    </div>
  );
}

export default function CertificatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ credentialId?: string }>();

  // Active section tab: completed | upcoming | categories | verify
  const [activeSection, setActiveSection] = useState<"completed" | "upcoming" | "categories" | "verify">("completed");

  // State for all certificates from Atlas
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery filters
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Verification Search Console State
  const [verifyInput, setVerifyInput] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);

  // Detailed Modal State
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Email Certificate State
  const [emailModalCert, setEmailModalCert] = useState<Certificate | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  // Generator Modal State
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [genStudentName, setGenStudentName] = useState<string>("");
  const [genCourseTitle, setGenCourseTitle] = useState<string>("Enterprise Java 21 & Spring Boot 3 Microservices");
  const [genCategory, setGenCategory] = useState<string>("Java Backend");
  const [genStudentEmail, setGenStudentEmail] = useState<string>("");
  const [genGrade, setGenGrade] = useState<string>("Grade A+ (Distinction · 98%)");
  const [genSkills, setGenSkills] = useState<string>("Java 21, Spring Boot 3, Kafka, Docker, Kubernetes");
  const [generating, setGenerating] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const sampleIds = [
    "KRT-2026-JAVA-9102",
    "KRT-2026-AWS-7729",
    "KRT-2026-MERN-8841",
    "KRT-2026-SEC-6612",
    "KRT-2026-AZ-6612",
    "KRT-2026-SAP-4391",
  ];

  // Upcoming Certifications Data (Phase 13 Section 4)
  const upcomingCertifications = [
    {
      id: "up-aws",
      title: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      category: "Cloud Computing",
      provider: "Amazon Web Services (AWS)",
      examCode: "SAA-C03",
      batchStarts: "October 15, 2026",
      duration: "8 Weeks Intensive",
      mentor: "Senior Cloud Architect",
      topics: ["Multi-Tier VPCs", "S3 & EBS Storage Tiers", "Auto-Scaling & ELB", "IAM Security", "CloudFormation & Terraform"],
      labAccess: "Hands-on AWS Sandbox included",
      seatsRemaining: "4 Slots Available",
    },
    {
      id: "up-azure",
      title: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
      category: "Cloud Computing",
      provider: "Microsoft Azure",
      examCode: "AZ-104",
      batchStarts: "October 22, 2026",
      duration: "8 Weeks Intensive",
      mentor: "Principal Azure Engineer",
      topics: ["Azure Entra ID", "Virtual Networks & VPN Gateways", "ARM & Bicep Templates", "Azure Monitor & Backup", "Kubernetes AKS"],
      labAccess: "Azure Cloud Sandbox included",
      seatsRemaining: "6 Slots Available",
    },
    {
      id: "up-cka",
      title: "Certified Kubernetes Administrator (CKA)",
      category: "DevOps",
      provider: "Cloud Native Computing Foundation (CNCF)",
      examCode: "CKA",
      batchStarts: "November 5, 2026",
      duration: "6 Weeks Hands-on Lab",
      mentor: "Staff Site Reliability Engineer",
      topics: ["Cluster Architecture", "Workloads & Scheduling", "Services & Networking", "Storage & PVs", "Troubleshooting & Ingress"],
      labAccess: "Live 3-Node EKS Cluster included",
      seatsRemaining: "3 Slots Available",
    },
    {
      id: "up-ceh",
      title: "Certified Ethical Hacker (CEH v12) Practical Prep",
      category: "Cyber Security",
      provider: "EC-Council",
      examCode: "CEH v12",
      batchStarts: "November 12, 2026",
      duration: "8 Weeks SOC Lab",
      mentor: "Lead Security Architect",
      topics: ["Vulnerability Assessment", "Network Scanning & Nmap", "Web Application Attacks", "Malware Analysis", "Snort SIEM Defense"],
      labAccess: "Isolated Virtual Pen-Testing Lab",
      seatsRemaining: "5 Slots Available",
    },
    {
      id: "up-sap",
      title: "SAP Certified Application Associate – SAP S/4HANA (FICO)",
      category: "SAP",
      provider: "SAP SE",
      examCode: "C_TS4FI_2026",
      batchStarts: "November 19, 2026",
      duration: "10 Weeks Enterprise",
      mentor: "Principal SAP Consultant",
      topics: ["General Ledger ACDOCA", "Accounts Payable & Receivable", "Asset Accounting", "Financial Closing", "Corporate Reporting"],
      labAccess: "SAP S/4HANA Server Access",
      seatsRemaining: "4 Slots Available",
    },
    {
      id: "up-cisco",
      title: "Cisco Certified Network Associate (CCNA 200-301)",
      category: "Cisco Networking",
      provider: "Cisco Systems",
      examCode: "200-301 CCNA",
      batchStarts: "December 1, 2026",
      duration: "6 Weeks Network Lab",
      mentor: "Network Architect (CCIE)",
      topics: ["IPv4 & IPv6 Subnetting", "OSPF Routing & STP", "VLANs & Trunking", "Network Security & ACLs", "Automation with Python"],
      labAccess: "Packet Tracer & Cisco GNS3 Labs",
      seatsRemaining: "7 Slots Available",
    },
  ];

  // Certification Categories Data
  const certificationCategories = [
    {
      name: "Cloud Computing",
      icon: "☁️",
      certs: ["AWS Solutions Architect", "Azure Administrator", "Google Cloud Associate", "Terraform Associate"],
      accent: "from-cyan-500 to-blue-500",
    },
    {
      name: "AI & Machine Learning",
      icon: "🤖",
      certs: ["Generative AI Specialist", "LangChain LLM Developer", "PyTorch Deep Learning", "MLOps Engineer"],
      accent: "from-emerald-500 to-teal-500",
    },
    {
      name: "Cyber Security",
      icon: "🛡️",
      certs: ["CEH v12 Ethical Hacker", "CompTIA Security+", "SOC Analyst Level 1", "CISSP Preparation"],
      accent: "from-rose-500 to-red-500",
    },
    {
      name: "Full Stack Development",
      icon: "💻",
      certs: ["Next.js 15 Architect", "MERN Stack Professional", "Enterprise React Specialist", "Node.js Core"],
      accent: "from-purple-500 to-indigo-500",
    },
    {
      name: "DevOps & SRE",
      icon: "🚀",
      certs: ["CKA Kubernetes Administrator", "Docker Certified Associate", "ArgoCD GitOps Engineer", "Prometheus Specialist"],
      accent: "from-amber-500 to-orange-500",
    },
    {
      name: "Data Analytics & BI",
      icon: "📊",
      certs: ["Microsoft Power BI PL-300", "Snowflake Data Architect", "Advanced SQL Mastery", "Tableau Certified"],
      accent: "from-yellow-500 to-amber-500",
    },
    {
      name: "Enterprise ERP & SAP",
      icon: "💼",
      certs: ["SAP S/4HANA FICO", "SAP MM & SD Integration", "SAP ABAP Cloud", "Universal Journal ACDOCA"],
      accent: "from-teal-500 to-cyan-500",
    },
  ];

  // Fetch all certificates from MongoDB Atlas
  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch (err: any) {
      console.error("Failed to load certificates:", err);
      setError("Unable to load certificates from MongoDB Atlas. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Check route params or URL query param for ?verify=ID or /verify/:credentialId
  useEffect(() => {
    const targetId = routeParams.credentialId || searchParams.get("verify") || searchParams.get("id");
    if (targetId) {
      setVerifyInput(targetId);
      handleVerify(targetId);
      setActiveSection("verify");
    }
  }, [routeParams, searchParams]);

  // Execute verification in MongoDB Atlas
  const handleVerify = async (idToVerify?: string) => {
    const targetId = (idToVerify || verifyInput).trim();
    if (!targetId) return;

    setVerifying(true);
    setVerifyResult(null);

    try {
      const result = await certificateService.verifyCertificate(targetId);
      setVerifyResult(result);
      if (result.success && result.certificate) {
        setActiveModalCert(result.certificate);
      }
    } catch (err: any) {
      setVerifyResult({
        success: false,
        verified: false,
        message: err.message || "Failed to verify certificate in MongoDB Atlas.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyVerificationUrl = (credId: string) => {
    const url = `${window.location.origin}/certificates?verify=${encodeURIComponent(credId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast("✓ Copied shareable verification URL!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareAchievement = (cert: Certificate) => {
    const shareText = `Proud to have earned my verified certificate in ${cert.title} from KR Global Learning Private Limited! Credential ID: ${cert.credentialId}`;
    if (navigator.share) {
      navigator.share({
        title: `${cert.title} Certification`,
        text: shareText,
        url: `${window.location.origin}/certificates?verify=${encodeURIComponent(cert.credentialId)}`,
      }).catch(() => {});
    } else {
      handleCopyVerificationUrl(cert.credentialId);
      showToast("✓ Verification link copied! Share your achievement on LinkedIn / Twitter.");
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalCert || !recipientEmail) return;

    setSendingEmail(true);
    try {
      await certificateService.sendCertificateEmail({
        credentialId: emailModalCert.credentialId,
        email: recipientEmail.trim(),
      });
      showToast(`✓ Certificate PDF dispatched to ${recipientEmail}!`);
      setEmailModalCert(null);
      setRecipientEmail("");
    } catch (err: any) {
      showToast(err.message || "Failed to dispatch email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genStudentName.trim() || !genCourseTitle.trim()) {
      showToast("Please provide student name and course title");
      return;
    }

    setGenerating(true);
    try {
      const res = await certificateService.generateCertificate({
        studentName: genStudentName.trim(),
        title: genCourseTitle.trim(),
        category: genCategory,
        studentEmail: genStudentEmail.trim() || undefined,
        grade: genGrade.trim(),
        skills: genSkills.split(",").map((s) => s.trim()).filter(Boolean),
        sendEmail: !!genStudentEmail.trim(),
      });

      if (res.success && res.certificate) {
        showToast(`🎉 Certificate ${res.certificate.credentialId} generated in MongoDB Atlas!`);
        setShowGeneratorModal(false);
        setActiveModalCert(res.certificate);
        setVerifyInput(res.certificate.credentialId);
        setVerifyResult({
          success: true,
          verified: true,
          certificate: res.certificate,
        });
        loadCertificates();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  // Filter gallery items
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchCat =
        selectedCat === "All" ||
        c.category.toLowerCase() === selectedCat.toLowerCase();

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
  }, [certificates, selectedCat, searchQuery]);

  return (
    <SEO
      title="Official Certification Showcase & Verification Center | KR Global Learning"
      description="Explore completed certificates, upcoming certification preparation batches, category tracks, and instant cryptographic verification with QR codes at KR Global Learning."
      canonical="https://krgloballearning.com/certificates"
    >
      <main className="pt-20 min-h-screen bg-[#070913] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
            <I.Award /> CERTIFICATION SHOWCASE & VERIFICATION (PHASE 13)
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-4">
            Official Certification{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">
              Center & Registry
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Every KR Global Learning credential features an official unique Credential ID, verifiable scannable QR code, and permanent registry verification.
          </p>

          <div className="flex justify-center items-center gap-4 flex-wrap text-xs text-slate-300 mb-8">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">✓ Official Registry Verification</span>
            <span className="flex items-center gap-1.5 font-semibold text-cyan-400">✓ Scannable Dynamic QR</span>
            <span className="flex items-center gap-1.5 font-semibold text-purple-300">✓ Vector PDF Downloads</span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-300">✓ Share Achievements</span>
            <button
              type="button"
              onClick={() => setShowGeneratorModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1"
            >
              <span>+</span> Mint Certificate
            </button>
          </div>

          {/* Section 4 Feature Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            {[
              { id: "completed", label: "Completed Certifications", icon: "🎓" },
              { id: "upcoming", label: "Upcoming Certifications", icon: "📅" },
              { id: "categories", label: "Certification Categories", icon: "🗂️" },
              { id: "verify", label: "Digital Verification", icon: "🔍" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeSection === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 4.1: DIGITAL VERIFICATION SEARCH CONSOLE */}
        {activeSection === "verify" && (
          <section className="py-6 px-4 max-w-4xl mx-auto mb-16 animate-fadeIn">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-500/30">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Instant Credential Authenticator
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Search & Verify Certificate ID
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
                  Enter any official KR Global Learning Credential ID below to query the verified database in real-time.
                </p>
              </div>

              {/* Input & Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-slate-950/80 rounded-2xl border border-slate-700 focus-within:border-cyan-500 transition-all">
                  <span className="text-cyan-400"><I.Search /></span>
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Enter Credential ID (e.g. KRT-2026-JAVA-9102)…"
                    className="w-full text-sm outline-none text-white placeholder-slate-500 bg-transparent font-mono uppercase"
                  />
                  {verifyInput && (
                    <button
                      type="button"
                      onClick={() => setVerifyInput("")}
                      className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifying || !verifyInput.trim()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {verifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Verify Certificate</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample IDs */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Try Sample Credential IDs:</span>
                {sampleIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setVerifyInput(id);
                      handleVerify(id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 font-mono text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    {id}
                  </button>
                ))}
              </div>

              {/* Verification Feedback Result Alert */}
              {verifyResult && (
                <div className="mt-6 animate-fadeIn">
                  {verifyResult.verified && verifyResult.certificate ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0">
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                            Status: Authenticated & Cryptographically Verified
                          </span>
                          <h3 className="text-sm font-extrabold text-white">
                            {verifyResult.certificate.title}
                          </h3>
                          <p className="text-xs text-slate-300">
                            Issued to <strong className="text-white">{verifyResult.certificate.studentName}</strong> on{" "}
                            {verifyResult.certificate.completionDate} · {verifyResult.certificate.grade}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => certificateService.downloadPdf(verifyResult.certificate!.credentialId)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                        >
                          <I.Download /> PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalCert(verifyResult.certificate!)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition cursor-pointer"
                        >
                          View Certificate & QR →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                        ✕
                      </div>
                      <div>
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                          Verification Unsuccessful
                        </span>
                        <p className="text-xs text-rose-200 font-medium">
                          {verifyResult.message || "No matching credential record found in verified registry."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 4.2: UPCOMING CERTIFICATIONS */}
        {activeSection === "upcoming" && (
          <section className="py-6 px-4 max-w-7xl mx-auto mb-16 animate-fadeIn">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Official Exam Preparation Cohorts
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Upcoming Certification Preparation Batches
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Structured live mentorship and mock exam drills aligned directly with vendor credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCertifications.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {batch.provider}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-cyan-300">
                        Code: {batch.examCode}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white mb-2">
                      {batch.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-300 mb-4">
                      <div>🗓️ <strong>Batch Starts:</strong> {batch.batchStarts}</div>
                      <div>⏱️ <strong>Duration:</strong> {batch.duration}</div>
                      <div>👨‍🏫 <strong>Lead Mentor:</strong> {batch.mentor}</div>
                      <div>🔬 <strong>Environment:</strong> {batch.labAccess}</div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-[11px] font-bold uppercase text-slate-400">Exam Coverage:</div>
                      {batch.topics.map((t, i) => (
                        <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="text-emerald-400">✓</span> {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-semibold">{batch.seatsRemaining}</span>
                    <Link
                      to="/contact"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition no-underline"
                    >
                      Enroll in Prep →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4.3: CERTIFICATION CATEGORIES */}
        {activeSection === "categories" && (
          <section className="py-6 px-4 max-w-7xl mx-auto mb-16 animate-fadeIn">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                Domain Alignment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Certification Categories & Tracks
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Industry-aligned certification blueprints designed to validate your practical hands-on engineering skills.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certificationCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4">
                      {cat.icon}
                    </div>
                    <h3 className="font-display font-bold text-base text-white mb-3">
                      {cat.name}
                    </h3>
                    <div className="space-y-1.5 mb-4">
                      {cat.certs.map((c, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <span className="text-cyan-400">⚡</span> {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCat(cat.name.includes("Cloud") ? "AWS" : cat.name.includes("Full Stack") ? "MERN Stack" : "All");
                        setActiveSection("completed");
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      View Verified Graduates →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4.4: COMPLETED CERTIFICATIONS GALLERY */}
        {(activeSection === "completed" || activeSection === "verify") && (
          <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-sans font-extrabold text-2xl text-white">
                  Completed & Verified Learner Credentials
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Explore certified graduates across full-stack engineering, cloud architectures, and cyber security tracks.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by student, course, skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-full md:w-64"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCat === cat
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-950/50"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="py-16 text-center">
                <LoadingSpinner size="lg" label="Loading certificates from MongoDB Atlas..." fullScreen={false} />
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-red-950/40 border border-red-500/40 rounded-2xl max-w-lg mx-auto text-red-300 text-xs">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCertificates.map((cert) => (
                  <CertificateCard
                    key={cert._id || cert.credentialId}
                    cert={cert}
                    onPreview={(c) => setActiveModalCert(c)}
                    onVerify={(c) => {
                      setVerifyInput(c.credentialId);
                      handleVerify(c.credentialId);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* MODAL 1: PREVIEW CERTIFICATE WITH DYNAMIC QR & DOWNLOAD & SHARE */}
        {activeModalCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveModalCert(null)}
          >
            <div
              className="w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 animate-scaleIn border border-purple-500/40 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Modal Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Official Authenticated Credential
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <I.Close />
                </button>
              </div>

              {/* Realistic Certificate Mockup Canvas */}
              <div
                className={`p-6 sm:p-10 rounded-2xl bg-gradient-to-br ${activeModalCert.thumbnailGradient || "from-slate-950 via-purple-950 to-indigo-950"} text-white relative border-4 border-amber-400/40 shadow-2xl mb-6`}
              >
                {/* Guilloche border accents */}
                <div className="absolute inset-3 border border-amber-300/25 rounded-xl pointer-events-none" />
                <div className="absolute inset-4 border border-white/10 rounded-lg pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300 font-extrabold mb-1">
                    ★ KR GLOBAL LEARNING PRIVATE LIMITED ★
                  </div>
                  <h3 className="font-serif text-xs uppercase tracking-widest text-purple-200">
                    CERTIFICATE OF PROFESSIONAL MASTERY
                  </h3>
                </div>

                {/* Recipient */}
                <div className="text-center my-6">
                  <p className="text-xs text-purple-200 italic mb-2">This is to certify that</p>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-white tracking-wide mb-3">
                    {activeModalCert.studentName}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl mx-auto leading-relaxed">
                    has successfully completed all production capstones, rigorous code audits, and hands-on laboratory milestones in
                  </p>
                  <h3 className="font-sans font-extrabold text-lg sm:text-2xl text-amber-200 mt-3">
                    {activeModalCert.title}
                  </h3>
                </div>

                {/* Skills Chips on Certificate */}
                <div className="flex flex-wrap justify-center gap-1.5 my-5">
                  {activeModalCert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-purple-100 border border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Certificate Bottom Specs & QR Section */}
                <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Left Specs */}
                  <div className="space-y-1 text-xs text-purple-200 font-mono text-center sm:text-left">
                    <div>CREDENTIAL ID: <strong className="text-white">{activeModalCert.credentialId}</strong></div>
                    <div>ISSUE DATE: <strong className="text-white">{activeModalCert.completionDate}</strong></div>
                    <div>ACADEMIC STANDING: <strong className="text-emerald-300">{activeModalCert.grade}</strong></div>
                    <div>VERIFICATION: <strong className="text-purple-300">KR Global Learning Registry</strong></div>
                  </div>

                  {/* Scannable Dynamic QR Image */}
                  <div className="shrink-0">
                    <CertificateQRCode
                      credentialId={activeModalCert.credentialId}
                      qrCodeDataUrl={activeModalCert.qrCodeDataUrl}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>ID:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">
                    {activeModalCert.credentialId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Share Achievement Action */}
                  <button
                    type="button"
                    onClick={() => handleShareAchievement(activeModalCert)}
                    className="px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🔗</span> Share Achievement
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyVerificationUrl(activeModalCert.credentialId)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedLink ? "✓ Copied" : "Copy Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailModalCert(activeModalCert);
                      if (activeModalCert.studentEmail) setRecipientEmail(activeModalCert.studentEmail);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold transition border border-purple-500/40 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>✉️</span> Email PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => certificateService.downloadPdf(activeModalCert.credentialId)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <I.Download /> Download Certificate PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: EMAIL CERTIFICATE WITH PDF ATTACHMENT */}
        {emailModalCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setEmailModalCert(null)}
          >
            <div
              className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 space-y-5 border border-purple-500/40 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✉️</span>
                  <h3 className="font-bold text-base text-white">Email Certificate PDF</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailModalCert(null)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p>Course: <strong className="text-white">{emailModalCert.title}</strong></p>
                <p>Credential ID: <strong className="font-mono text-cyan-300">{emailModalCert.credentialId}</strong></p>
                <p className="text-slate-400 text-[11px]">
                  The official vector PDF certificate will be attached directly to the email.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEmailModalCert(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition cursor-pointer"
                  >
                    {sendingEmail ? "Dispatching..." : "Send Certificate PDF 🚀"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: CERTIFICATE GENERATOR */}
        {showGeneratorModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setShowGeneratorModal(false)}
          >
            <div
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 space-y-5 border border-purple-500/40 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <div>
                    <h3 className="font-bold text-base text-white">Mint New KR Global Learning Certificate</h3>
                    <p className="text-[11px] text-slate-400">Generates unique ID, QR code, and saves to database</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGeneratorModal(false)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleGenerateCertificate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sen"
                    value={genStudentName}
                    onChange={(e) => setGenStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={genCourseTitle}
                    onChange={(e) => setGenCourseTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={genCategory}
                      onChange={(e) => setGenCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Grade / Standing</label>
                    <input
                      type="text"
                      value={genGrade}
                      onChange={(e) => setGenGrade(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Student Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={genStudentEmail}
                    onChange={(e) => setGenStudentEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={genSkills}
                    onChange={(e) => setGenSkills(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowGeneratorModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    {generating ? "Minting Certificate..." : "Generate Certificate 🏆"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </SEO>
  );
}
