import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Video,
  Calendar,
  Clock,
  User,
  Bell,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { GradientButton } from "../../components/GradientButton";
import { useNotifications } from "../../context/NotificationContext";

interface LiveClass {
  id: string;
  topic: string;
  course: string;
  mentor: string;
  startTime: string;
  date: string;
  meetUrl: string;
  isToday?: boolean;
}

const LIVE_CLASSES: LiveClass[] = [
  {
    id: "live-1",
    topic: "System Design: Scalable Payment Engine & Idempotency",
    course: "MERN Stack Full Stack Architecture",
    mentor: "Rajesh Kumar (Principal Architect)",
    startTime: "08:00 PM IST",
    date: "Today",
    meetUrl: "https://meet.google.com/kr-global-live",
    isToday: true,
  },
  {
    id: "live-2",
    topic: "Kafka Event Partitions & Multi-Tenant Consumer Groups",
    course: "Java Backend Mastery",
    mentor: "Amit Verma (Ex-Meta)",
    startTime: "07:30 PM IST",
    date: "Tomorrow",
    meetUrl: "https://meet.google.com/kr-global-live",
  },
  {
    id: "live-3",
    topic: "AWS ECS Multi-AZ Cloud Deployment & Telemetry",
    course: "AWS DevOps Masterclass",
    mentor: "Pooja Hegde (Cloud Lead)",
    startTime: "09:00 PM IST",
    date: "Saturday",
    meetUrl: "https://meet.google.com/kr-global-live",
  },
];

export const LiveClassesScreen: React.FC = () => {
  const { scheduleLocalAlert } = useNotifications();
  const [reminders, setReminders] = useState<string[]>([]);

  const handleJoin = (url: string, topic: string) => {
    Alert.alert("Join Live Session", `Opening secure video room for: ${topic}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Join Now", onPress: () => Linking.openURL(url).catch(() => {}) },
    ]);
  };

  const handleSetReminder = async (classId: string, topic: string) => {
    setReminders([...reminders, classId]);
    await scheduleLocalAlert(
      "🔴 Live Class Reminder",
      `Your One-on-One session on "${topic}" is scheduled to begin shortly!`,
      { classId },
      5
    );
    Alert.alert("Reminder Set", "Push notification reminder scheduled for this live session.");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <Header title="Live Classes" subtitle="Interactive One-on-One Pair Coding & Lectures" />

      {/* Attendance summary pill */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <CheckCircle2 size={16} color={Colors.success} />
          <Text style={styles.summaryText}>Attendance: 96% (24/25 Sessions)</Text>
        </View>
      </View>

      <FlatList
        data={LIVE_CLASSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const hasReminder = reminders.includes(item.id);

          return (
            <GlassCard variant={item.isToday ? "cyan" : "default"} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.timeBadge, item.isToday && styles.timeBadgeToday]}>
                  <Text style={styles.timeBadgeText}>{item.date} • {item.startTime}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleSetReminder(item.id, item.topic)}
                  style={[styles.reminderBtn, hasReminder && styles.reminderBtnActive]}
                >
                  <Bell size={13} color={hasReminder ? Colors.success : Colors.textMuted} />
                  <Text style={[styles.reminderText, hasReminder && { color: Colors.success }]}>
                    {hasReminder ? "Reminder Set" : "Remind Me"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.courseName}>{item.course}</Text>
              <Text style={styles.topic}>{item.topic}</Text>

              <View style={styles.mentorRow}>
                <User size={13} color={Colors.textPurple} />
                <Text style={styles.mentorText}>{item.mentor}</Text>
              </View>

              <View style={styles.actionRow}>
                <GradientButton
                  title={item.isToday ? "Join Live Class Now" : "Class Link Available Soon"}
                  icon={<Video size={16} color="#FFFFFF" />}
                  onPress={() => handleJoin(item.meetUrl, item.topic)}
                  style={{ flex: 1 }}
                  size="md"
                  colors={item.isToday ? ["#06B6D4", "#7C3AED"] : ["#334155", "#1E293B"]}
                />
              </View>
            </GlassCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  summaryBar: { paddingHorizontal: 16, marginBottom: 12 },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  summaryText: { color: Colors.success, fontSize: 12, fontWeight: "700" },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  card: { padding: 16, gap: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeBadgeToday: { backgroundColor: "rgba(6, 182, 212, 0.15)" },
  timeBadgeText: { color: Colors.textCyan, fontSize: 11, fontWeight: "700" },
  reminderBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  reminderBtnActive: { opacity: 0.9 },
  reminderText: { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
  courseName: { color: Colors.textPurple, fontSize: 11, fontWeight: "700" },
  topic: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", lineHeight: 20 },
  mentorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  mentorText: { color: Colors.textSecondary, fontSize: 12 },
  actionRow: { marginTop: 4 },
});
