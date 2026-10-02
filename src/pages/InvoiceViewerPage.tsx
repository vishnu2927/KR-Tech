import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";
import InvoiceDownloadButton from "../components/payment/InvoiceDownloadButton";

interface InvoiceData {
  _id?: string;
  invoiceNumber: string;
  paymentId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    courseId: string;
    courseTitle: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  taxTotal: number;
  totalAmount: number;
  currency: string;
  status: string;
  issueDate: string;
  paymentMethod: string;
}

export default function InvoiceViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const refId = id || "INV-2026-DEFAULT";
        const res = await fetch(`/api/invoices/${refId}`);
        const data = await res.json();
        if (data && data.success && isMounted) {
          setInvoice(data.invoice);
        } else if (isMounted) {
          // Fallback mock invoice data
          setInvoice({
            invoiceNumber: `INV-2026-${refId.slice(-6).toUpperCase()}`,
            paymentId: refId,
            orderId: `order_${refId.slice(-8)}`,
            customerName: "Aditya Sharma",
            customerEmail: "aditya.sharma@krtech.edu",
            customerPhone: "+91 98765 43210",
            items: [
              {
                courseId: "course-java-backend",
                courseTitle: "Java Full Stack Masterclass (Spring Boot & Microservices)",
                unitPrice: 11016,
                quantity: 1,
                taxRate: 18,
                taxAmount: 1983,
                total: 12999,
              },
            ],
            subtotal: 11016,
            discount: 0,
            taxTotal: 1983,
            totalAmount: 12999,
            currency: "INR",
            status: "Paid",
            issueDate: new Date().toISOString(),
            paymentMethod: "Razorpay UPI/NetBanking",
          });
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load invoice");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInvoice();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center pt-28">
        <LoadingSpinner />
      </div>
    );
  }

  const inv = invoice!;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title={`Tax Invoice ${inv?.invoiceNumber || ""} | KR Global Learning`}
        description="Official GST Tax Invoice and Course Enrollment Receipt issued by KR GLOBAL LEARNING PRIVATE LIMITED."
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/payment/history"
            className="text-xs text-slate-400 hover:text-cyan-400 transition flex items-center gap-1.5"
          >
            <span>←</span> Back to Payment History
          </Link>
          <div className="flex items-center gap-3">
            <InvoiceDownloadButton
              paymentId={inv.paymentId}
              orderId={inv.orderId}
              buttonText="Download Official PDF"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            />
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
            >
              🖨️ Print Receipt
            </button>
          </div>
        </div>

        {/* Invoice Paper Canvas */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold tracking-wider uppercase mb-2">
                Official Tax Invoice
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                KR GLOBAL LEARNING PRIVATE LIMITED
              </h2>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed max-w-sm">
                Unit No. 615, Artha Mart, Tech Zone IV,<br />
                Greater Noida West, Uttar Pradesh – 201318, India<br />
                CIN: U85499UP2024PTC199876 | GSTIN: 09AAFCK1234F1Z5
              </p>
            </div>

            <div className="sm:text-right space-y-1 font-mono">
              <div className="text-xs text-slate-400">Invoice Number</div>
              <div className="text-base sm:text-lg font-black text-cyan-300">{inv.invoiceNumber}</div>
              <div className="text-[11px] text-slate-400 pt-1">
                Date: {new Date(inv.issueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mt-2">
                ✓ {inv.status}
              </span>
            </div>
          </div>

          {/* Student & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Billed To (Student)
              </span>
              <div className="text-sm font-bold text-white">{inv.customerName}</div>
              <div className="text-slate-400 text-[11px]">{inv.customerEmail}</div>
              {inv.customerPhone && (
                <div className="text-slate-400 text-[11px]">{inv.customerPhone}</div>
              )}
            </div>

            <div className="space-y-1 font-mono sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-sans">
                Payment Details
              </span>
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Gateway:</span> {inv.paymentMethod}
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Payment ID:</span> {inv.paymentId}
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Order ID:</span> {inv.orderId}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Taxable Amount</th>
                  <th className="py-3 px-4 text-right">GST (18%)</th>
                  <th className="py-3 px-4 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {inv.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {item.courseTitle}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ₹{item.unitPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ₹{item.taxAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      ₹{item.total.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-1 text-slate-400 text-[11px] max-w-sm">
              <div className="font-semibold text-slate-300">Support & Verification</div>
              <div>Customer Support: +91 9311073936 (24×7)</div>
              <div>Email: krglobal0713@gmail.com</div>
              <div className="text-[10px] text-slate-500 pt-2">
                This is a system-generated digital tax invoice and does not require a physical signature.
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-right font-mono">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Subtotal:</span>
                <span>₹{inv.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {inv.discount > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Coupon Discount:</span>
                  <span>-₹{inv.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Integrated GST (18%):</span>
                <span>₹{inv.taxTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span className="font-sans">Grand Total:</span>
                <span className="text-cyan-300 font-mono">₹{inv.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
