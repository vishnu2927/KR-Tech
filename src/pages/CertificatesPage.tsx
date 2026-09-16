import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CertificateCard } from "../components/CertificateCard";
import { I } from "../components/Icons";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Certificate, certificateService, VerifyResponse } from "../services/certificateService";

// Helper component for QR Code Placeholder graphic
function CertificateQRCode({ credentialId }: { credentialId: string }) {
  const verifyUrl = `https://krtech.in/certificates?verify=${encodeURIComponent(credentialId)}`;

  return (
    <div className="flex flex-col items-center bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm text-center">
      {/* High-contrast crisp SVG QR representation */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white flex items-center justify-center p-1.5 rounded-lg border border-slate-200">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
          {/* Outer QR Corner Anchors */}
          {/* Top-Left */}
          <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
          <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
          <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />

          {/* Top-Right */}
          <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
          <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
          <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />

          {/* Bottom-Left */}
          <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
          <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
          <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />

          {/* Data Pattern Matrix Blocks */}
          <rect x="36" y="8" width="6" height="6" fill="currentColor" />
          <rect x="46" y="8" width="6" height="6" fill="currentColor" />
          <rect x="56" y="8" width="6" height="6" fill="currentColor" />

          <rect x="36" y="18" width="6" height="6" fill="currentColor" />
          <rect x="46" y="24" width="6" height="6" fill="currentColor" />
          <rect x="56" y="18" width="6" height="6" fill="currentColor" />

          <rect x="8" y="36" width="6" height="6" fill="currentColor" />
          <rect x="18" y="46" width="6" height="6" fill="currentColor" />
          <rect x="26" y="36" width="6" height="6" fill="currentColor" />

          <rect x="36" y="36" width="8" height="8" rx="2" fill="#7C3AED" />
          <rect x="48" y="36" width="6" height="6" fill="currentColor" />
          <rect x="58" y="44" width="6" height="6" fill="currentColor" />
          <rect x="68" y="36" width="6" height="6" fill="currentColor" />
          <rect x="78" y="44" width="6" height="6" fill="currentColor" />
          <rect x="88" y="36" width="6" height="6" fill="currentColor" />

          <rect x="36" y="48" width="6" height="6" fill="currentColor" />
          <rect x="46" y="48" width="8" height="8" rx="2" fill="#06B6D4" />
          <rect x="58" y="56" width="6" height="6" fill="currentColor" />

          <rect x="8" y="56" width="6" height="6" fill="currentColor" />
          <rect x="18" y="56" width="6" height="6" fill="currentColor" />
          <rect x="26" y="48" width="6" height="6" fill="currentColor" />

          <rect x="36" y="68" width="6" height="6" fill="currentColor" />
          <rect x="46" y="76" width="6" height="6" fill="currentColor" />
          <rect x="56" y="68" width="6" height="6" fill="currentColor" />

          <rect x="68" y="68" width="8" height="8" fill="currentColor" />
          <rect x="80" y="68" width="6" height="6" fill="currentColor" />
          <rect x="88" y="76" width="6" height="6" fill="currentColor" />
          <rect x="74" y="80" width="8" height="8" fill="currentColor" />
          <rect x="86" y="88" width="8" height="8" fill="currentColor" />
          <rect x="68" y="88" width="6" height="6" fill="currentColor" />
          <rect x="46" y="88" width="6" height="6" fill="currentColor" />
          <rect x="36" y="80" width="6" height="6" fill="currentColor" />
        </svg>
      </div>

      <div className="mt-2 text-[10px] text-gray-500 font-mono flex items-center gap-1 justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Scan to Verify</span>
      </div>
      <span className="text-[9px] text-purple-700 font-bold truncate max-w-[130px] block mt-0.5">
        {credentialId}
      </span>
    </div>
  );
}

export default function CertificatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

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
    "KRT-2026-MERN-8401",
    "KRT-2026-AWS-7729",
    "KRT-2026-AZ-6612",
    "KRT-2026-SEC-5503",
    "KRT-2026-PBI-4491",
    "KRT-2026-SAP-4391",
    "KRT-2026-SF-2210",
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
      setError("Unable to load certificates from MongoDB Atlas. Please ensure the backend is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Check URL query param for ?verify=ID
  useEffect(() => {
    const queryVerify = searchParams.get("verify");
    if (queryVerify) {
      setVerifyInput(queryVerify);
      handleVerify(queryVerify);
    }
  }, [searchParams]);

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
    setTimeout(() => setCopiedLink(false), 2000);
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
      title="Official Certificate Verification Portal | KR Tech"
      description="Verify authentic KR Tech learner credentials with instant cryptographic lookup in MongoDB Atlas. Check student name, course, completion date, and scannable QR verification."
      canonical="https://krtech.in/certificates"
    >
      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 via-white to-purple-50/20">
        {/* ─────────────────────────────────────────────────────────────────────────────
            1. Hero Section
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="relative py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white overflow-hidden text-center">
          <div className="container-xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md mb-4">
              <span>🏆</span> MongoDB Atlas Verified Registry
            </span>

            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
              KR Tech Official{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">
                Certificate Verification
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Every KR Tech credential features a unique cryptographic verification ID, employer validation hash, and tamper-proof storage in our official MongoDB Atlas registry.
            </p>

            <div className="flex justify-center gap-6 flex-wrap text-xs text-purple-200">
              <span className="flex items-center gap-1.5 font-medium">✓ Cryptographically Signed</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Scannable Dynamic QR</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Live MongoDB Atlas Lookup</span>
              <span className="flex items-center gap-1.5 font-medium">✓ Global Industry Accepted</span>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            2. Dedicated Live Verification Search Console
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-12 -mt-10 relative z-20">
          <div className="container-xl max-w-4xl">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-100">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                  Instant Credential Authenticator
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Search & Verify Certificate ID
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-1">
                  Enter any official KR Tech Credential ID below to query the MongoDB Atlas database and verify authenticity in real-time.
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
                <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-600 transition-all">
                  <span className="text-purple-600"><I.Search /></span>
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. KRT-2026-JAVA-9102)…"
                    className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent font-mono uppercase"
                  />
                  {verifyInput && (
                    <button
                      type="button"
                      onClick={() => setVerifyInput("")}
                      className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifying || !verifyInput.trim()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {verifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Checking Atlas…</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Verify Certificate</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample IDs Quick Clickable Badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium">Try Sample IDs from Atlas:</span>
                {sampleIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setVerifyInput(id);
                      handleVerify(id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-mono text-[11px] font-semibold border border-purple-100 transition-colors cursor-pointer"
                  >
                    {id}
                  </button>
                ))}
              </div>

              {/* Verification Feedback Result Alert */}
              {verifyResult && (
                <div className="mt-6 animate-fadeIn">
                  {verifyResult.verified && verifyResult.certificate ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                            Status: Authenticated in MongoDB Atlas
                          </span>
                          <h3 className="text-sm font-extrabold text-emerald-950">
                            {verifyResult.certificate.title}
                          </h3>
                          <p className="text-xs text-emerald-800">
                            Issued to <strong>{verifyResult.certificate.studentName}</strong> on{" "}
                            {verifyResult.certificate.completionDate} · {verifyResult.certificate.grade}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveModalCert(verifyResult.certificate!)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        View Full Certificate & QR →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                        ✕
                      </div>
                      <div>
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                          Verification Unsuccessful
                        </span>
                        <p className="text-xs text-rose-800 font-medium">
                          {verifyResult.message || "No matching credential record found in MongoDB Atlas registry."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. All Atlas Certificates Gallery
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="py-8">
          <div className="container-xl">
            {/* Gallery Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Verified Graduate Credentials
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Browse authenticated graduation certificates issued to KR Tech learners across disciplines.
                </p>
              </div>

              {/* Gallery Search Box */}
              <div className="w-full md:w-80">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-xs focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                  <span className="text-gray-400"><I.Search /></span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student or skill…"
                    className="w-full text-xs outline-none text-gray-800 placeholder-gray-400 bg-transparent font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
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

            {/* Live Count and Atlas Tag */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <div>
                Showing <strong className="text-gray-900">{filteredCertificates.length}</strong> Verified Credentials
                {selectedCat !== "All" && (
                  <span> in <strong className="text-purple-700">{selectedCat}</strong></span>
                )}
              </div>
              <span className="text-xs text-purple-600 font-mono font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Live Atlas Collection
              </span>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="lg" label="Connecting to MongoDB Atlas certificates collection…" />
              </div>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="p-8 my-6 rounded-2xl bg-red-50 border border-red-200 text-center max-w-xl mx-auto">
                <p className="text-red-700 font-semibold mb-3">{error}</p>
                <button
                  type="button"
                  onClick={loadCertificates}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Retry Connecting
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredCertificates.length === 0 && (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  🔍
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">No matching certificates found</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Try adjusting your query or switching categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCat("All");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Certificate Cards Grid */}
            {!loading && !error && filteredCertificates.length > 0 && (
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
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. High-Res Modal Preview with QR Code Placeholder & Verification Info
        ───────────────────────────────────────────────────────────────────────────── */}
        {activeModalCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveModalCert(null)}
          >
            <div
              className="w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-scaleIn border border-purple-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Modal Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Official Authenticated Credential
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalCert(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                    ★ KR TECH ACADEMY GLOBAL ACCREDITATION ★
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
                    has successfully defended all production capstones, rigorous code audits, and hands-on laboratory milestones in
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
                    <div>REGISTRY: <strong className="text-purple-300">MongoDB Atlas (Live Cluster)</strong></div>
                  </div>

                  {/* Scannable Dynamic QR Placeholder */}
                  <div className="shrink-0">
                    <CertificateQRCode credentialId={activeModalCert.credentialId} />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                  <span>Cryptographic Hash:</span>
                  <span className="font-bold text-gray-700 truncate max-w-[180px]">
                    SHA256-{activeModalCert.credentialId}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleCopyVerificationUrl(activeModalCert.credentialId)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedLink ? "✓ Copied Link" : "Copy Verification URL"}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Print
                  </button>

                  <button
                    type="button"
                    onClick={() => certificateService.downloadCertificateDoc(activeModalCert)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <I.Download /> Download Official Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </SEO>
  );
}
