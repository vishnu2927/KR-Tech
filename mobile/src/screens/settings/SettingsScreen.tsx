import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const { biometricSupported, biometricEnabled, setBiometricEnabled } = useAuth();
  const { sendInstantNotification } = useNotifications();

  // Settings states
  const [liveClassAlerts, setLiveClassAlerts] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");

  // Modals
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [legalModalVisible, setLegalModalVisible] = useState(false);

  const toggleBiometrics = async (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setBiometricEnabled(val);
  };

  const handleTestNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await sendInstantNotification(
      "KR Global Notification Center",
      "Notifications are active and configured with 100% deliverability."
    );
    Alert.alert("Push Notification Sent", "Check your device status notification bar.");
  };

  const handleContactSupport = () => {
    Haptics.selectionAsync();
    Alert.alert(
      "KR Global Learning 24×7 Support",
      "Official Student Support:\n\n📞 Phone: +91 9311073936\n✉️ Email: krglobal0713@gmail.com\n\nOperational 24×7 for all academic and fee queries.",
      [
        { text: "Call Now", onPress: () => Linking.openURL("tel:+919311073936") },
        { text: "Send Email", onPress: () => Linking.openURL("mailto:krglobal0713@gmail.com") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const openLegalModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setLegalModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Security & Access */}
        <Text style={styles.sectionTitle}>Security & Biometrics</Text>
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingDesc}>
                {biometricSupported
                  ? "Unlock faster with Fingerprint or Face ID"
                  : "Biometrics not supported on this device"}
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometrics}
              disabled={!biometricSupported}
              trackColor={{ false: "rgba(255, 255, 255, 0.1)", true: colors.accentCyan }}
              thumbColor={biometricEnabled ? "#fff" : "#999"}
            />
          </View>
        </GlassCard>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Live Class Alerts</Text>
              <Text style={styles.settingDesc}>Notify 15 mins before scheduled live sessions</Text>
            </View>
            <Switch
              value={liveClassAlerts}
              onValueChange={setLiveClassAlerts}
              trackColor={{ false: "rgba(255, 255, 255, 0.1)", true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Assignment Due Dates</Text>
              <Text style={styles.settingDesc}>Deadline warnings and mentor feedback alerts</Text>
            </View>
            <Switch
              value={assignmentAlerts}
              onValueChange={setAssignmentAlerts}
              trackColor={{ false: "rgba(255, 255, 255, 0.1)", true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Habit Reminders</Text>
              <Text style={styles.settingDesc}>Keep your streak going with daily study goals</Text>
            </View>
            <Switch
              value={studyReminders}
              onValueChange={setStudyReminders}
              trackColor={{ false: "rgba(255, 255, 255, 0.1)", true: colors.primary }}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.testBtn} onPress={handleTestNotification}>
            <Ionicons name="notifications-outline" size={16} color={colors.accentCyan} />
            <Text style={styles.testBtnText}>Send Test Push Notification</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Downloads & Data */}
        <Text style={styles.sectionTitle}>Offline Downloads & Data</Text>
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Download Over Wi-Fi Only</Text>
              <Text style={styles.settingDesc}>Conserve mobile data when downloading video lessons</Text>
            </View>
            <Switch
              value={downloadWifiOnly}
              onValueChange={setDownloadWifiOnly}
              trackColor={{ false: "rgba(255, 255, 255, 0.1)", true: colors.primary }}
            />
          </View>
        </GlassCard>

        {/* Language & Display */}
        <Text style={styles.sectionTitle}>Language & Display</Text>
        <GlassCard style={styles.card}>
          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() => {
              Alert.alert("Select Language", "Choose app interface language:", [
                { text: "English (US)", onPress: () => setSelectedLanguage("English (US)") },
                { text: "Hindi (हिंदी)", onPress: () => setSelectedLanguage("Hindi (हिंदी)") },
                { text: "Cancel", style: "cancel" },
              ]);
            }}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Language</Text>
              <Text style={styles.settingDesc}>{selectedLanguage}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDesc}>Dark Glassmorphism (Default)</Text>
            </View>
            <View style={styles.themeBadge}>
              <Ionicons name="moon" size={14} color={colors.accentCyan} />
              <Text style={styles.themeBadgeText}>Active</Text>
            </View>
          </View>
        </GlassCard>

        {/* Help & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <GlassCard style={styles.card}>
          <TouchableOpacity style={styles.clickableRow} onPress={handleContactSupport}>
            <View style={styles.clickableLeft}>
              <Ionicons name="headset-outline" size={18} color={colors.accentCyan} />
              <Text style={styles.clickableText}>24×7 Help & Support Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() =>
              openLegalModal(
                "Privacy Policy",
                "KR GLOBAL LEARNING PRIVATE LIMITED takes your privacy seriously.\n\n" +
                  "1. Data Collection: We collect only your essential profile, course progress, and quiz responses.\n" +
                  "2. Security: Biometric tokens and passwords are never transmitted in raw form and are stored in iOS Keychain / Android Keystore.\n" +
                  "3. Third Parties: Payment info is handled directly by PCI-DSS compliant Razorpay."
              )
            }
          >
            <View style={styles.clickableLeft}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.accentPurple} />
              <Text style={styles.clickableText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.clickableRow}
            onPress={() =>
              openLegalModal(
                "Terms of Service",
                "Terms & Conditions of KR GLOBAL LEARNING PRIVATE LIMITED:\n\n" +
                  "• All course materials, video lectures, and notes are copyrighted intellectual property.\n" +
                  "• Certificates are issued solely upon meeting academic passing requirements.\n" +
                  "• 24×7 Helpline: +91 9311073936 | krglobal0713@gmail.com"
              )
            }
          >
            <View style={styles.clickableLeft}>
              <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.clickableText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        {/* About App */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutBrand}>KR GLOBAL LEARNING PRIVATE LIMITED</Text>
          <Text style={styles.aboutTagline}>Learn. Build. Grow. Globally.</Text>
          <Text style={styles.aboutVersion}>v10.0.0 (Founder Edition) • Build 1001</Text>
        </View>
      </ScrollView>

      {/* Legal Info Modal */}
      <Modal visible={legalModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.legalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setLegalModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBody}>{modalContent}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setLegalModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: -4,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  settingDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  testBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
  },
  testBtnText: {
    color: colors.accentCyan,
    fontSize: 12,
    fontWeight: "600",
  },
  clickableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  clickableLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clickableText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  themeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 245, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  themeBadgeText: {
    color: colors.accentCyan,
    fontSize: 11,
    fontWeight: "600",
  },
  aboutBox: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
  },
  aboutBrand: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  aboutTagline: {
    color: colors.accentCyan,
    fontSize: 12,
    marginTop: 2,
    fontStyle: "italic",
  },
  aboutVersion: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  legalCard: {
    width: "100%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  modalCloseBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  modalCloseText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
});
