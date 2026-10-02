import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { certificateService, type Certificate } from "../services/certificateService";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function CertificateVerifyPage() {
  const params = useParams<{ credentialId?: string }>();
  const [searchParams] = useSearchParams();
  const queryCredId = searchParams.get("id") || params.credentialId || "";

  const [inputCredentialId, setInputCredentialId] = useState(queryCredId || "KRT-2026-JAVA-9102");
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (queryCredId) {
      handleVerify(queryCredId);
    } else {
      handleVerify("KRT-2026-JAVA-9102");
    }
  }, [queryCredId]);

  const handleVerify = async (idToVerify: string) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) return;

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await certificateService.verifyCertificate(cleanId);
      if (res && res.verified && res.certificate) {
        setVerifiedCert(res.certificate);
        setVerificationError(null);
      } else {
        setVerifiedCert(null);
        setVerificationError(
          res?.message || `Invalid or unverified credential ID "${cleanId}". No matching record found in KR Global Learning official registry.`
        );
      }
    } catch (err: any) {
      setVerifiedCert(null);
      setVerificationError(
        err?.response?.data?.message || `Invalid credential ID "${cleanId}". Verification failed.`
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/verify/${verifiedCert?.credentialId || inputCredentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!verifiedCert) return;
    window.open(`${certificateService.getPdfDownloadUrl(verifiedCert.credentialId)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Official Certificate Verification | KR Global Learning"
        description="Verify cryptographic credentials and authenticity of KR GLOBAL LEARNING PRIVATE LIMITED software engineering certificates via QR code or Credential ID."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>🛡️</span> Cryptographic Ledger Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Official Credential Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            KR Global Learning credentials feature tamper-proof verification. Organizations and academic institutions can confirm certificate authenticity in real time.
          </p>
        </div>

        {/* Credential Search Box */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(inputCredentialId);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCredentialId}
                onChange={(e) => setInputCredentialId(e.target.value)}
                placeholder="Enter Credential ID (e.g. KR-CERT-884920)..."
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:border-emerald-500 focus:outline-none"
                required
              />
              <span className="absolute left-4 top-3.5 text-slate-500">🔑</span>
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              {isVerifying ? "Verifying..." : "Verify Credential ➔"}
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {isVerifying ? (
          <div className="p-16 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : verifiedCert ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Top Verification Proof Ribbon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    100% Authenticated & Verified
                  </h4>
                  <p className="text-xs text-slate-400">
                    Recorded in KR Global Learning Official Enterprise Registry.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Credential ID
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {verifiedCert.credentialId}
                </span>
              </div>
            </div>

            {/* Certificate Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Awarded To:
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {verifiedCert.studentName}
                  </h3>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Course / Competency Track:
                  </span>
                  <h4 className="text-lg font-bold text-purple-300">
                    {verifiedCert.courseTitle}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Grade Achieved:</span>
                    <strong className="text-emerald-400 text-sm font-bold">{verifiedCert.grade || "Distinction (98%)"}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Issue Date:</span>
                    <strong className="text-slate-200 text-sm">{verifiedCert.issueDate}</strong>
                  </div>
                </div>

                {/* Skills */}
                <div className="pt-2">
                  <span className="text-xs text-slate-400 block mb-2 font-medium">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {verifiedCert.skills?.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right QR Code Box */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `${window.location.origin}/verify/${verifiedCert.credentialId}`
                    )}`}
                    alt="QR Verification"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Scan to Authenticate
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyVerificationLink}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {copiedLink ? "Link Copied! ✓" : "Copy Verification URL"}
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>📥</span> Download Official PDF
              </button>
            </div>
          </div>
        ) : verificationError ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-rose-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl font-bold">
              ✕
            </div>
            <h3 className="text-xl font-bold text-white">Credential Verification Failed</h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              {verificationError}
            </p>
            <div className="pt-2 text-xs text-slate-500 font-mono">
              Please double check the ID or contact support at krglobal0713@gmail.com
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
