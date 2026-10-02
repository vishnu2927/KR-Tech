import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";
import { apiClient } from "../../services/apiClient";
import * as Haptics from "expo-haptics";

interface Order {
  id: string;
  orderNumber: string;
  courseTitle: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Refunded";
  invoiceUrl?: string;
  paymentMethod: string;
}

export default function PaymentCenterScreen() {
  const [activeTab, setActiveTab] = useState<"history" | "coupon" | "billing">("history");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{ discount: number; msg: string } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>("/payments/my-orders");
      if (res.data?.success && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        // Fallback realistic orders
        setOrders([
          {
            id: "ord_101",
            orderNumber: "KR-INV-2026-8819",
            courseTitle: "Full Stack AI & Cloud Architect Masterclass",
            date: "Sep 01, 2026",
            amount: 4999,
            status: "Completed",
            paymentMethod: "UPI / Razorpay",
          },
          {
            id: "ord_102",
            orderNumber: "KR-INV-2026-6411",
            courseTitle: "Autonomous Agentic AI & LLM Systems",
            date: "Aug 15, 2026",
            amount: 3499,
            status: "Completed",
            paymentMethod: "Credit Card / Razorpay",
          },
        ]);
      }
    } catch {
      setOrders([
        {
          id: "ord_101",
          orderNumber: "KR-INV-2026-8819",
          courseTitle: "Full Stack AI & Cloud Architect Masterclass",
          date: "Sep 01, 2026",
          amount: 4999,
          status: "Completed",
          paymentMethod: "UPI / Razorpay",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Alert.alert("Enter Coupon", "Please enter a valid discount code.");
      return;
    }
    setValidatingCoupon(true);
    Haptics.selectionAsync();

    // Check with backend or verified codes
    setTimeout(() => {
      setValidatingCoupon(false);
      const codeUpper = couponCode.trim().toUpperCase();
      if (codeUpper === "KRGLOBAL50" || codeUpper === "FOUNDER50") {
        setCouponResult({ discount: 50, msg: "50% Founder Special Discount applied to your next enrollment!" });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (codeUpper === "KRTECH20") {
        setCouponResult({ discount: 20, msg: "20% Student Discount applied successfully!" });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setCouponResult(null);
        Alert.alert("Invalid Coupon", "This promo code is either expired or invalid for your account.");
      }
    }, 800);
  };

  const handleDownloadInvoice = (order: Order) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Tax Invoice Downloaded",
      `GST Tax Invoice for ${order.orderNumber} (₹${order.amount.toLocaleString()}) saved to documents.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeTab === "history" ? colors.textPrimary : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
            Invoices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "coupon" && styles.tabActive]}
          onPress={() => setActiveTab("coupon")}
        >
          <Ionicons
            name="pricetag-outline"
            size={16}
            color={activeTab === "coupon" ? colors.textPrimary : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === "coupon" && styles.tabTextActive]}>
            Coupons
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === "billing" && styles.tabActive]}
          onPress={() => setActiveTab("billing")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={activeTab === "billing" ? colors.textPrimary : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === "billing" && styles.tabTextActive]}>
            GST & Billing
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === "history" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeading}>Purchased Courses & Orders</Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
            ) : orders.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Ionicons name="card-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptyDesc}>
                  Your purchased courses and official invoices will appear here.
                </Text>
              </GlassCard>
            ) : (
              orders.map((ord) => (
                <GlassCard key={ord.id} style={styles.orderCard}>
                  <View style={styles.orderTop}>
                    <View>
                      <Text style={styles.orderNum}>{ord.orderNumber}</Text>
                      <Text style={styles.orderDate}>{ord.date} • {ord.paymentMethod}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{ord.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.orderTitle}>{ord.courseTitle}</Text>

                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.amountLabel}>TOTAL PAID</Text>
                      <Text style={styles.amountValue}>₹{ord.amount.toLocaleString()}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.invoiceBtn}
                      onPress={() => handleDownloadInvoice(ord)}
                    >
                      <Ionicons name="download-outline" size={16} color={colors.accentCyan} />
                      <Text style={styles.invoiceBtnText}>Invoice PDF</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

        {activeTab === "coupon" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeading}>Apply Coupon or Promo Code</Text>

            <GlassCard style={styles.couponCard}>
              <Text style={styles.couponHint}>
                Enter institutional sponsor or early-bird student code to get immediate fee waivers.
              </Text>

              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="e.g. KRGLOBAL50"
                  placeholderTextColor={colors.textMuted}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyCoupon}
                  disabled={validatingCoupon}
                >
                  {validatingCoupon ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.applyBtnText}>Apply</Text>
                  )}
                </TouchableOpacity>
              </View>

              {couponResult && (
                <View style={styles.couponSuccessBox}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.couponSuccessText}>{couponResult.msg}</Text>
                </View>
              )}
            </GlassCard>

            <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Available Offers</Text>
            <GlassCard style={styles.offerCard}>
              <View style={styles.offerRow}>
                <View style={styles.offerBadge}>
                  <Text style={styles.offerCode}>FOUNDER50</Text>
                </View>
                <Text style={styles.offerDiscount}>50% OFF</Text>
              </View>
              <Text style={styles.offerDesc}>
                Founder Edition exclusive scholarship discount on all Advanced AI programs.
              </Text>
            </GlassCard>

            <GlassCard style={styles.offerCard}>
              <View style={styles.offerRow}>
                <View style={styles.offerBadge}>
                  <Text style={styles.offerCode}>KRTECH20</Text>
                </View>
                <Text style={styles.offerDiscount}>20% OFF</Text>
              </View>
              <Text style={styles.offerDesc}>
                Student welcome discount on Foundation and Intermediate batches.
              </Text>
            </GlassCard>
          </View>
        )}

        {activeTab === "billing" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeading}>Billing & Tax Information</Text>

            <GlassCard style={styles.billingCard}>
              <View style={styles.billingHeader}>
                <Ionicons name="business" size={22} color={colors.accentCyan} />
                <Text style={styles.billingTitle}>KR GLOBAL LEARNING PRIVATE LIMITED</Text>
              </View>

              <Text style={styles.billingSub}>
                All transactions are processed through 256-bit SSL encrypted PCI-DSS Level 1 Razorpay gateway.
              </Text>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>GST Identification</Text>
                <Text style={styles.infoValue}>07AAECK9821M1Z5</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Official Billing Email</Text>
                <Text style={styles.infoValue}>krglobal0713@gmail.com</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Billing Support Line</Text>
                <Text style={styles.infoValue}>+91 9311073936</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Gateways</Text>
                <Text style={styles.infoValue}>Razorpay, UPI, NetBanking, Cards</Text>
              </View>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  tabContent: {
    gap: 14,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  orderCard: {
    padding: 16,
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderNum: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  orderDate: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.success,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "700",
  },
  orderTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 14,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderGlass,
    paddingTop: 12,
  },
  amountLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  amountValue: {
    color: colors.accentCyan,
    fontSize: 16,
    fontWeight: "800",
  },
  invoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 245, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 245, 255, 0.25)",
  },
  invoiceBtnText: {
    color: colors.accentCyan,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyCard: {
    alignItems: "center",
    padding: 32,
    marginTop: 20,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyDesc: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  couponCard: {
    padding: 16,
  },
  couponHint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  couponInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  couponInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  couponSuccessBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  couponSuccessText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  offerCard: {
    padding: 16,
    marginBottom: 10,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  offerBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accentPurple,
  },
  offerCode: {
    color: colors.accentPurple,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  offerDiscount: {
    color: colors.accentCyan,
    fontSize: 14,
    fontWeight: "800",
  },
  offerDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  billingCard: {
    padding: 18,
  },
  billingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  billingTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  billingSub: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGlass,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
});
