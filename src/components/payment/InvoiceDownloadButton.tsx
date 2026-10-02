import React, { useState } from "react";
import { paymentService } from "../../services/paymentService";

interface InvoiceDownloadButtonProps {
  paymentId: string;
  orderId?: string;
  courseTitle?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "compact";
}

export default function InvoiceDownloadButton({
  paymentId,
  orderId,
  courseTitle,
  className = "",
  variant = "secondary",
}: InvoiceDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!paymentId) return;

    setDownloading(true);
    setError(null);

    try {
      const filename = `KRTech_TaxInvoice_${paymentId}.pdf`;
      await paymentService.downloadInvoicePdf(paymentId, filename);
    } catch (err: any) {
      console.error("Invoice download error:", err);
      // Fallback: direct window open
      const fallbackUrl = paymentService.getInvoiceDownloadUrl(paymentId);
      window.open(fallbackUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-xl cursor-pointer select-none";

  let variantStyles = "";
  if (variant === "primary") {
    variantStyles =
      "px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs shadow-lg shadow-cyan-500/20";
  } else if (variant === "outline") {
    variantStyles =
      "px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs";
  } else if (variant === "compact") {
    variantStyles =
      "px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px]";
  } else {
    variantStyles =
      "px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs shadow-sm";
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      title="Download Official GST Tax Invoice (PDF)"
      className={`${baseStyles} ${variantStyles} ${downloading ? "opacity-75 cursor-wait" : ""} ${className}`}
    >
      {downloading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Tax Invoice PDF</span>
        </>
      )}
    </button>
  );
}
