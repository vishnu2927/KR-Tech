import React, { useState } from "react";
import { I } from "./Icons";
import { Certificate, certificateService } from "../services/certificateService";

export type CertificateItem = Certificate;

interface CertificateCardProps {
  cert: Certificate;
  onPreview?: (cert: Certificate) => void;
  onVerify?: (cert: Certificate) => void;
}

export function CertificateCard({
  cert,
  onPreview,
  onVerify,
}: CertificateCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      certificateService.downloadCertificateDoc(cert);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  const handleVerifyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVerify) {
      onVerify(cert);
    } else if (onPreview) {
      onPreview(cert);
    }
  };

  const gradient =
    cert.thumbnailGradient || "from-purple-950 via-indigo-950 to-slate-900";

  return (
    <div
      onClick={() => onPreview && onPreview(cert)}
      className="group relative flex flex-col justify-between bg-white rounded-3xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] hover:border-purple-300 overflow-hidden cursor-pointer"
    >
      {/* Certificate Mockup Visual Preview */}
      <div className={`relative h-52 w-full p-4 bg-gradient-to-br ${gradient} flex flex-col justify-between overflow-hidden`}>
        {/* Certificate Frame Border */}
        <div className="absolute inset-2 border-2 border-amber-300/40 rounded-2xl pointer-events-none" />
        <div className="absolute inset-3 border border-amber-300/20 rounded-xl pointer-events-none" />

        {/* Top Header of Certificate */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
              ★
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
              KR Tech Official
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md flex items-center gap-1">
            <span>✓</span> Verified
          </span>
        </div>

        {/* Center Title & Name on Certificate */}
        <div className="relative z-10 text-center px-3 my-auto">
          <div className="text-[9px] uppercase tracking-wider text-purple-200 font-semibold mb-0.5">
            Certificate of Mastery
          </div>
          <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-tight line-clamp-1">
            {cert.title}
          </h4>
          <div className="text-[11px] text-amber-200 font-serif italic mt-1 font-semibold">
            Awarded to {cert.studentName}
          </div>
        </div>

        {/* Bottom ID & QR Placeholder Seal */}
        <div className="relative z-10 flex items-center justify-between text-[9px] text-purple-200 font-mono pt-1">
          <div className="flex flex-col">
            <span className="text-gray-300 text-[8px]">CREDENTIAL ID</span>
            <span className="text-white font-bold tracking-wider">{cert.credentialId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-300 font-bold">{cert.grade}</span>
            {/* Small QR placeholder badge */}
            <div className="w-7 h-7 bg-white p-0.5 rounded shadow-xs flex items-center justify-center" title="Scannable Verification QR">
              <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm2 4h2v4h-2v-4zm-4 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
              {cert.category}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Issued {cert.completionDate}
            </span>
          </div>

          <h3 className="font-sans font-bold text-sm text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
            {cert.title}
          </h3>

          <div className="text-xs text-gray-600 mb-3 flex items-center gap-1.5">
            <span className="text-gray-400">Student:</span>
            <strong className="text-slate-800 font-medium">{cert.studentName}</strong>
          </div>

          {/* Skills Covered */}
          <div className="flex flex-wrap gap-1 mb-4">
            {cert.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100"
              >
                #{skill}
              </span>
            ))}
            {cert.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-600">
                +{cert.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleVerifyClick}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>🔍</span> Verify ID
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <I.Download /> {downloading ? "Saving…" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateCard;
