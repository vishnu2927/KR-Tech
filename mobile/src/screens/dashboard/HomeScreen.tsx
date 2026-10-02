import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  Play,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Bot,
  BrainCircuit,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { GradientButton } from "../../components/GradientButton";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../services/apiClient";
import { FloatingAIButton } from "../../components/FloatingAIButton";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get("/student-dashboard/overview").catch(() => null);
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch {
      // Use fallback data
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  const streakDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activeStreak = [true, true, true, true, true, true, true];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#060811", "#0B0F19", "#0F1426"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Header
        onPressNotifications={() => navigation.navigate("Notifications")}
        onPressProfile={() => navigation.navigate("MainApp", { screen: "ProfileTab" } as any)}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.secondary}
          />
        }
      >
        {/* 1. Continue Learning Widget (Sprint 10.2) */}
        <GlassCard variant="cyan" style={styles.continueCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.tagCyan}>
              <Play size={10} color={Colors.textCyan} />
              <Text style={styles.tagCyanText}>CONTINUE LEARNING</Text>
            </View>
            <Text style={styles.timestampText}>Module 4 of 12</Text>
          </View>

          <Text style={styles.courseTitle}>MERN Stack: Distributed Event Architecture</Text>
          <Text style={styles.lessonTitle}>Lesson 14: Kafka Streams & Redis Multi-Tier Caching</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={["#06B6D4", "#7C3AED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: "68%" }]}
              />
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.progressPercent}>68% Complete</Text>
              <Text style={styles.progressTime}>18 mins left</Text>
            </View>
          </View>

          <GradientButton
            title="Resume Video Lecture"
            icon={<Play size={15} color="#FFFFFF" />}
            onPress={() =>
              navigation.navigate("VideoPlayer", {
                lessonId: "les-kafka-1",
                courseId: "mern-stack",
                title: "Kafka Streams & Multi-Tier Caching",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              })
            }
            colors={["#06B6D4", "#2563EB"]}
            size="md"
          />
        </GlassCard>

        {/* 2. Today's Study Goal & Streak (Sprint 10.2) */}
        <View style={styles.twoColumnRow}>
          {/* Study Goal */}
          <GlassCard style={[styles.miniCard, { flex: 1 }]}>
            <View style={styles.miniIconBadge}>
              <Clock size={16} color={Colors.textPurple} />
            </View>
            <Text style={styles.miniValue}>1h 45m</Text>
            <Text style={styles.miniLabel}>Daily Goal: 2h</Text>
            <View style={styles.miniTrack}>
              <View style={[styles.miniBar, { width: "85%", backgroundColor: Colors.primary }]} />
            </View>
          </GlassCard>

          {/* Streak Counter */}
          <GlassCard style={[styles.miniCard, { flex: 1 }]}>
            <View style={[styles.miniIconBadge, { backgroundColor: "rgba(251, 146, 60, 0.15)" }]}>
              <Flame size={16} color="#FB923C" />
            </View>
            <Text style={[styles.miniValue, { color: "#FB923C" }]}>7 Days</Text>
            <Text style={styles.miniLabel}>Flame Active 🔥</Text>
            <View style={styles.streakDotsRow}>
              {streakDays.map((d, i) => (
                <View
                  key={d}
                  style={[
                    styles.streakDot,
                    activeStreak[i] && styles.streakDotActive,
                  ]}
                />
              ))}
            </View>
          </GlassCard>
        </View>

        {/* 3. Upcoming Live Class Widget (Sprint 10.2 & 10.9) */}
        <GlassCard style={styles.liveClassCard}>
          <View style={styles.liveBadgeRow}>
            <View style={styles.livePill}>
              <View style={styles.livePulse} />
              <Text style={styles.livePillText}>TODAY • 8:00 PM IST</Text>
            </View>
            <Text style={styles.badgeOneToOne}>One-on-One Mentorship</Text>
          </View>

          <Text style={styles.liveTitle}>System Design Drill: High-Throughput Payment Engine</Text>
          <Text style={styles.mentorName}>Mentor: Rajesh Kumar (Principal Architect)</Text>

          <View style={styles.liveActionRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.joinMeetingBtn}
              onPress={() => navigation.navigate("LiveClasses")}
            >
              <Calendar size={14} color="#FFFFFF" />
              <Text style={styles.joinText}>Join Meeting Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("LiveClasses")}
              style={styles.viewScheduleBtn}
            >
              <Text style={styles.viewScheduleText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* 4. AI Recommended Lesson & Quick Quiz (Sprint 10.2 & 10.7) */}
        <View style={styles.twoColumnRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("Quiz", { topic: "Kafka & Microservices" })}
          >
            <GlassCard variant="emerald" style={styles.actionCard}>
              <BrainCircuit size={22} color={Colors.success} />
              <Text style={styles.actionCardTitle}>Quick Quiz</Text>
              <Text style={styles.actionCardSub}>Test your retention in 3 mins</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: Colors.success }]}>Start Now</Text>
                <ChevronRight size={13} color={Colors.success} />
              </View>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("NotesLibrary")}
          >
            <GlassCard variant="default" style={styles.actionCard}>
              <BookOpen size={22} color={Colors.secondary} />
              <Text style={styles.actionCardTitle}>Recent Notes</Text>
              <Text style={styles.actionCardSub}>Spring Boot 3.x Cheatsheet</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: Colors.secondary }]}>Read PDF</Text>
                <ChevronRight size={13} color={Colors.secondary} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* 5. Certificate Progress Tracker (Sprint 10.2 & 10.11) */}
        <GlassCard style={styles.certCard}>
          <View style={styles.certRow}>
            <View style={styles.certIconBadge}>
              <Award size={26} color="#FBBF24" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.certTitle}>MERN Cloud Architecture Certificate</Text>
              <Text style={styles.certSubtitle}>7 of 9 modules finished • Capstone remaining</Text>
              <View style={styles.miniTrack}>
                <LinearGradient
                  colors={["#F59E0B", "#10B981"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.miniBar, { width: "78%" }]}
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("CertificateWallet")}>
              <ChevronRight size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* 6. AI Study Assistant Shortcut Banner (Sprint 10.5) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("MainApp", { screen: "AIMentorTab" } as any)}
        >
          <LinearGradient
            colors={["#7C3AED", "#2563EB", "#06B6D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiBanner}
          >
            <View style={styles.aiIcon}>
              <Bot size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.aiBannerTitle}>AI Study Assistant 24×7</Text>
                <Sparkles size={14} color="#FDE047" />
              </View>
              <Text style={styles.aiBannerSub}>
                Ask doubts, generate study notes, debug code & explain complex algorithms.
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating AI Button (Sprint 10.17) */}
      <FloatingAIButton
        onPress={() => navigation.navigate("MainApp", { screen: "AIMentorTab" } as any)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 16,
  },
  continueCard: {
    padding: 18,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagCyan: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagCyanText: {
    color: Colors.textCyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timestampText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  courseTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  lessonTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  progressContainer: {
    gap: 6,
    marginVertical: 4,
  },
  progressTrack: {
    height: 7,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPercent: {
    color: Colors.textCyan,
    fontSize: 11,
    fontWeight: "700",
  },
  progressTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
  },
  miniCard: {
    padding: 14,
    gap: 6,
  },
  miniIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  miniValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  miniLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  miniTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  miniBar: {
    height: "100%",
    borderRadius: 2,
  },
  streakDotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  streakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  streakDotActive: {
    backgroundColor: "#FB923C",
  },
  liveClassCard: {
    padding: 16,
    gap: 10,
  },
  liveBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  livePillText: {
    color: "#FCA5A5",
    fontSize: 10,
    fontWeight: "800",
  },
  badgeOneToOne: {
    color: Colors.textPurple,
    fontSize: 11,
    fontWeight: "700",
  },
  liveTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  mentorName: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  liveActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  joinMeetingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  viewScheduleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  viewScheduleText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  actionCard: {
    padding: 14,
    gap: 6,
  },
  actionCardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  actionCardSub: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  actionLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  actionLinkText: {
    fontSize: 11,
    fontWeight: "700",
  },
  certCard: {
    padding: 14,
  },
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  certIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  certTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  certSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  aiBanner: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiBannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  aiBannerSub: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});
