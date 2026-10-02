import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { useNotifications } from "../../context/NotificationContext";
import * as Haptics from "expo-haptics";

export default function NotificationsScreen() {
  const { notifications, markAsRead, clearAllNotifications } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.unreadCount}>
          {notifications.filter((n) => !n.read).length} Unread Updates
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            clearAllNotifications();
          }}
        >
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyDesc}>
              You will receive push reminders for upcoming live classes, study streaks, and grading updates.
            </Text>
          </GlassCard>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              activeOpacity={0.8}
              onPress={() => markAsRead(n.id)}
            >
              <GlassCard style={[styles.notifCard, !n.read && styles.unreadCard]}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={
                      n.type === "live"
                        ? "videocam"
                        : n.type === "assignment"
                        ? "document-text"
                        : n.type === "cert"
                        ? "ribbon"
                        : n.type === "payment"
                        ? "card"
                        : "sparkles"
                    }
                    size={20}
                    color={
                      n.type === "live"
                        ? colors.error
                        : n.type === "cert"
                        ? colors.accentCyan
                        : n.type === "payment"
                        ? colors.success
                        : colors.accentPurple
                    }
                  />
                </View>

                <View style={styles.bodyBox}>
                  <View style={styles.headerRow}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    <Text style={styles.notifTime}>{n.timestamp}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{n.message}</Text>
                </View>

                {!n.read && <View style={styles.unreadDot} />}
              </GlassCard>
            </TouchableOpacity>
          ))
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  unreadCount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  clearText: {
    color: colors.accentCyan,
    fontSize: 13,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  emptyCard: {
    alignItems: "center",
    padding: 36,
    marginTop: 30,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyDesc: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  unreadCard: {
    borderColor: "rgba(0, 245, 255, 0.3)",
    backgroundColor: "rgba(10, 25, 47, 0.55)",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyBox: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  notifTime: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 8,
  },
  notifMessage: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentCyan,
    marginTop: 4,
  },
});
