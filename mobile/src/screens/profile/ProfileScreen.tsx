import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handlePickAvatar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access to update profile photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Profile Photo Updated", "Your new avatar has been synced.");
    }
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Sign Out", "Are you sure you want to sign out of KR Global Learning?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "K"}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraBadge} onPress={handlePickAvatar}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "KR Tech Student"}</Text>
          <Text style={styles.userEmail}>{user?.email || "student@krgloballearning.com"}</Text>

          <View style={styles.roleBadge}>
            <Ionicons name="sparkles" size={12} color={colors.accentCyan} />
            <Text style={styles.roleText}>Pro Global Scholar</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="create-outline" size={15} color={colors.textPrimary} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Learning Statistics */}
        <Text style={styles.sectionHeading}>Learning Statistics</Text>
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statBox}>
            <Ionicons name="time" size={20} color={colors.accentCyan} />
            <Text style={styles.statNumber}>48.5h</Text>
            <Text style={styles.statLabel}>Watch Time</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <Ionicons name="flame" size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>14 Days</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <Ionicons name="checkbox" size={20} color={colors.success} />
            <Text style={styles.statNumber}>18 / 20</Text>
            <Text style={styles.statLabel}>Assignments</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <Ionicons name="ribbon" size={20} color={colors.accentPurple} />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </GlassCard>
        </View>

        {/* Achievements / Badges */}
        <Text style={styles.sectionHeading}>Unlocked Badges</Text>
        <GlassCard style={styles.achievementsCard}>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeIcon, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.badgeName}>7-Day Streak</Text>
          </View>

          <View style={styles.badgeItem}>
            <View style={[styles.badgeIcon, { backgroundColor: "rgba(0, 245, 255, 0.15)" }]}>
              <Ionicons name="code-slash" size={22} color={colors.accentCyan} />
            </View>
            <Text style={styles.badgeName}>Code Master</Text>
          </View>

          <View style={styles.badgeItem}>
            <View style={[styles.badgeIcon, { backgroundColor: "rgba(124, 58, 237, 0.15)" }]}>
              <Ionicons name="school" size={22} color={colors.accentPurple} />
            </View>
            <Text style={styles.badgeName}>Top Scholar</Text>
          </View>

          <View style={styles.badgeItem}>
            <View style={[styles.badgeIcon, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Ionicons name="checkmark-done" size={22} color={colors.success} />
            </View>
            <Text style={styles.badgeName}>Quiz Prodigy</Text>
          </View>
        </GlassCard>

        {/* Quick Menu Options */}
        <Text style={styles.sectionHeading}>Account & Hub</Text>
        <GlassCard style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("CertificateWallet")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="ribbon-outline" size={20} color={colors.accentCyan} />
              <Text style={styles.menuText}>Certificate Wallet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("PaymentCenter")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="card-outline" size={20} color={colors.accentPurple} />
              <Text style={styles.menuText}>Purchases & Invoices</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("DownloadCenter")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="cloud-download-outline" size={20} color={colors.info} />
              <Text style={styles.menuText}>Offline Downloads</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.menuText}>Settings & Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    gap: 16,
  },
  profileCard: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.accentCyan,
  },
  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.accentPurple,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "700",
  },
  userEmail: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 245, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 245, 255, 0.25)",
  },
  roleText: {
    color: colors.accentCyan,
    fontSize: 11,
    fontWeight: "700",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  editBtnText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: -4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: "46%",
    padding: 14,
    alignItems: "center",
  },
  statNumber: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  achievementsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  badgeItem: {
    alignItems: "center",
    flex: 1,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeName: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  menuCard: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "700",
  },
});
