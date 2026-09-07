import { useState } from "react";
import { I } from "./Icons";

export interface CertificateItem {
  id: string;
  title: string;
  category:
    | "Java Backend"
    | "MERN Stack"
    | "AWS"
    | "Azure"
    | "Cyber Security"
    | "Power BI"
    | "SAP"
    | "Salesforce";
  studentName: string;
  completionDate: string;
  credentialId: string;
  grade: string;
  skills: string[];
  thumbnailGradient: string;
  accentColor: string;
}

export function CertificateCard({
  cert,
  onPreview,
}: {
  cert: CertificateItem;
  onPreview?: (cert: CertificateItem) => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloaded Official Verified PDF Certificate: ${cert.title} (ID: ${cert.credentialId})`);
    }, 800);
  };

  return (
    <div
      onClick={() => onPreview && onPreview(cert)}
      className="group relative flex flex-col justify-between bg-white rounded-3xl border border-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)] hover:border-purple-300 overflow-hidden cursor-pointer"
    >
      {/* Certificate Mockup Visual Preview */}
      <div className={`relative h-48 w-full p-4 bg-gradient-to-br ${cert.thumbnailGradient} flex flex-col justify-between overflow-hidden`}>
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
              KR Tech Certified
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white backdrop-blur-md">
            Verified
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
          <div className="text-[10px] text-amber-200 font-serif italic mt-1">
            Awarded to {cert.studentName}
          </div>
        </div>

        {/* Bottom ID & Seal */}
        <div className="relative z-10 flex items-center justify-between text-[9px] text-purple-200 font-mono">
          <span>ID: {cert.credentialId}</span>
          <span className="text-emerald-300 font-bold">Grade: {cert.grade}</span>
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
              Completed {cert.completionDate}
            </span>
          </div>

          <h3 className="font-sans font-bold text-sm text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
            {cert.title}
          </h3>

          {/* Skills Covered */}
          <div className="flex flex-wrap gap-1 mb-4">
            {cert.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview && onPreview(cert)}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
          >
            <span>👁️</span> Quick Preview
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
          >
            <I.Download /> {downloading ? "Downloading…" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
