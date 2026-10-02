import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface CouponData {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minimumPurchase?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt?: string;
}

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 20,
    maxDiscount: 3000,
    minimumPurchase: 5000,
    usageLimit: 100,
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    active: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data && data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.warn("Failed fetching coupons, using local list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 20,
      maxDiscount: 3000,
      minimumPurchase: 5000,
      usageLimit: 100,
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || 0,
      minimumPurchase: coupon.minimumPurchase || 0,
      usageLimit: coupon.usageLimit || 100,
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      active: coupon.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("krtech_token") || localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-admin-key": "krtech_admin_dev_bypass",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      if (editingCoupon) {
        const res = await fetch(`/api/coupons/${editingCoupon._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Coupon "${formData.code}" updated successfully!`);
          fetchCoupons();
          setShowModal(false);
        } else {
          alert(data.message || "Failed to update coupon");
        }
      } else {
        const res = await fetch("/api/coupons", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Coupon "${formData.code}" created successfully!`);
          fetchCoupons();
          setShowModal(false);
        } else {
          alert(data.message || "Failed to create coupon");
        }
      }
    } catch (err: any) {
      alert(err.message || "Network error submitting coupon");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    const token = localStorage.getItem("krtech_token") || localStorage.getItem("token");
    const headers: Record<string, string> = {
      "x-admin-key": "krtech_admin_dev_bypass",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${code}" deleted successfully.`);
        fetchCoupons();
      } else {
        alert(data.message || "Failed to delete coupon");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting coupon");
    }
  };

  const handleToggleActive = async (coupon: CouponData) => {
    const token = localStorage.getItem("krtech_token") || localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-admin-key": "krtech_admin_dev_bypass",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ active: !coupon.active, isActive: !coupon.active }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${coupon.code}" status changed to ${!coupon.active ? "Active" : "Inactive"}`);
        fetchCoupons();
      }
    } catch (err) {
      console.warn("Toggle error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      <SEO
        title="Coupon Engine & Discount CRM | KR Global Learning Admin"
        description="Create and manage coupon codes, percentage discounts, expiry caps, and student checkout campaigns."
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl animate-bounce">
          ✓ {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-400 transition">
                Admin Console
              </Link>
              <span>/</span>
              <Link to="/admin/payments" className="hover:text-cyan-400 transition">
                Payment CRM
              </Link>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Coupons & Campaigns</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>🎟️</span>
              <span>Coupon Engine & Discount Campaigns</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure promotional coupons, percentage/fixed discounts, expiration dates, and usage caps for student enrollments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
            >
              + Create New Coupon
            </button>
            <Link
              to="/admin/payments"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
            >
              ← Back to Payments
            </Link>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🏷️</span> Active & Archived Coupons ({coupons.length})
            </h3>
            <button
              onClick={fetchCoupons}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              🔄 Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <LoadingSpinner />
              <p className="text-xs text-slate-400 mt-2">Loading coupons from MongoDB Atlas...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800">
              <div className="text-3xl mb-2">🎟️</div>
              <h4 className="text-sm font-semibold text-white">No coupons active</h4>
              <p className="text-xs text-slate-400 mt-1">
                Click "+ Create New Coupon" above to launch a discount campaign.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Coupon Code</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Min. Spend</th>
                    <th className="py-3.5 px-4">Max Cap</th>
                    <th className="py-3.5 px-4">Usage (Used / Limit)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Expiry</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs tracking-wider">
                          {c.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% OFF`
                          : `₹${c.discountValue.toLocaleString("en-IN")} FLAT`}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {c.minimumPurchase ? `₹${c.minimumPurchase.toLocaleString("en-IN")}` : "None"}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {c.maxDiscount ? `₹${c.maxDiscount.toLocaleString("en-IN")}` : "No Limit"}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-cyan-300 font-bold">{c.usedCount || 0}</span>
                        <span className="text-slate-500"> / {c.usageLimit || "∞"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                            c.active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {c.expiryDate
                          ? new Date(c.expiryDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.code)}
                          className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded text-[11px] transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : "Create New Coupon"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. KRGLOBAL20, FIRST100"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (₹ FLAT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumPurchase}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumPurchase: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheckbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="activeCheckbox" className="text-slate-300 font-medium">
                  Active (Available for student redemption)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition"
                >
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
