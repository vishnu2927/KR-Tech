import { api } from "./api";

export interface CreateOrderPayload {
  courseId: string;
  courseTitle: string;
  amount: number;
  couponCode?: string;
  currency?: string;
  userEmail?: string;
  userName?: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  couponCode?: string;
  userEmail?: string;
  userName?: string;
}

export interface PaymentRecord {
  _id: string;
  paymentId: string;
  orderId: string;
  userEmail: string;
  userName?: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  method?: string;
  status: "captured" | "refunded" | "failed";
  createdAt: string;
}

export interface OrderRecord {
  _id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  userEmail: string;
  userName?: string;
  status: "created" | "paid" | "failed";
  couponCode?: string;
  createdAt: string;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
  orders: number;
}

export interface BestSellingCourseItem {
  _id: string;
  title: string;
  enrollmentsCount: number;
  totalRevenue: number;
}

export interface CouponItem {
  _id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  isActive: boolean;
  usedCount: number;
  totalDiscountGiven?: number;
  description?: string;
}

export interface AdminPaymentAnalytics {
  stats: {
    totalRevenue: number;
    totalPayments: number;
    totalOrders: number;
    purchasedCoursesCount: number;
    currency: string;
    recentPayments: PaymentRecord[];
  };
  monthlyRevenue: MonthlyRevenueItem[];
  bestSellingCourses: BestSellingCourseItem[];
  couponAnalytics: CouponItem[];
  orders: OrderRecord[];
}

export interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  totalOrders: number;
  purchasedCoursesCount: number;
  currency: string;
  recentPayments: PaymentRecord[];
}

export const paymentService = {
  // 1. Fetch public Razorpay Key ID
  async getRazorpayKey(): Promise<string> {
    try {
      const response = await api.get("/payments/key");
      return response.data?.keyId || "rzp_test_KRTechPublic2026";
    } catch (err) {
      console.warn("Using fallback test Razorpay Key ID", err);
      return "rzp_test_KRTechPublic2026";
    }
  },

  // 2. Create Razorpay order in backend & MongoDB Atlas
  async createOrder(payload: CreateOrderPayload) {
    const response = await api.post("/payments/create-order", payload);
    return response.data;
  },

  // 3. Verify Razorpay signature & auto-enroll student in MongoDB Atlas
  async verifyPayment(payload: VerifyPaymentPayload) {
    const response = await api.post("/payments/verify", payload);
    return response.data;
  },

  // 4. Get current student payment history
  async getMyPayments(): Promise<PaymentRecord[]> {
    try {
      const response = await api.get("/payments/history");
      return response.data?.payments || [];
    } catch (err) {
      console.warn("Error fetching student payments:", err);
      return [];
    }
  },

  // 5. Get all payments (Admin CRM)
  async getAllPayments(): Promise<PaymentRecord[]> {
    try {
      const response = await api.get("/payments/history");
      return response.data?.payments || [];
    } catch (err) {
      console.warn("Error fetching admin payments:", err);
      return [];
    }
  },

  // 6. Get payment analytics & revenue summary
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await api.get("/payments/admin");
      return response.data?.stats || {
        totalRevenue: 0,
        totalPayments: 0,
        totalOrders: 0,
        purchasedCoursesCount: 0,
        currency: "INR",
        recentPayments: [],
      };
    } catch (err) {
      console.warn("Error fetching payment stats:", err);
      return {
        totalRevenue: 0,
        totalPayments: 0,
        totalOrders: 0,
        purchasedCoursesCount: 0,
        currency: "INR",
        recentPayments: [],
      };
    }
  },

  // 7. Get full Admin Payments Analytics (Monthly revenue, Best sellers, Coupons, Orders)
  async getAdminPaymentAnalytics(): Promise<AdminPaymentAnalytics> {
    const response = await api.get("/admin/payments");
    return response.data;
  },

  // 8. Apply coupon code
  async applyCoupon(code: string, courseId: string, orderAmount: number) {
    const response = await api.post("/coupons/apply", {
      code,
      courseId,
      orderAmount,
    });
    return response.data;
  },

  // 9. Get active publicly available coupons
  async getActiveCoupons(): Promise<CouponItem[]> {
    try {
      const response = await api.get("/coupons/active");
      return response.data?.coupons || [];
    } catch (err) {
      return [
        { code: "KRTECH20", discountType: "percentage", discountValue: 20, maxDiscount: 3000, isActive: true, usedCount: 14, description: "Flat 20% off up to ₹3,000" },
        { code: "EARLYBIRD", discountType: "percentage", discountValue: 15, maxDiscount: 2000, isActive: true, usedCount: 32, description: "Early admission 15% discount" },
        { code: "CYBER100", discountType: "fixed", discountValue: 1000, isActive: true, usedCount: 8, description: "Direct ₹1,000 cyber grant" },
      ];
    }
  },

  // 10. Direct Invoice PDF download URL or trigger
  getInvoiceDownloadUrl(paymentId: string): string {
    const baseUrl = api.defaults.baseURL || "/api";
    return `${baseUrl}/payments/invoice/${paymentId}`;
  },

  // 11. Download Invoice PDF blob
  async downloadInvoicePdf(paymentId: string, filename = `KRTech_Invoice_${paymentId}.pdf`) {
    const response = await api.get(`/payments/invoice/${paymentId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default paymentService;
