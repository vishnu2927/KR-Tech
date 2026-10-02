import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Calendar,
  Flame,
  Plus,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { GradientButton } from "../../components/GradientButton";

interface Habit {
  id: string;
  name: string;
  done: boolean;
  time: string;
}

export const StudyPlannerScreen: React.FC = () => {
  const [plannerTab, setPlannerTab] = useState<"daily" | "weekly" | "pomodoro">("daily");

  // Pomodoro State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Daily Habits State
  const [habits, setHabits] = useState<Habit[]>([
    { id: "h-1", name: "Review Kafka Event Streaming Notes", done: true, time: "Morning" },
    { id: "h-2", name: "Solve 2 Medium Graph Problems on LeetCode", done: true, time: "Afternoon" },
    { id: "h-3", name: "Watch Module 5: AWS ECS Microservices", done: false, time: "Evening" },
    { id: "h-4", name: "Submit Weekly System Design Assignment", done: false, time: "Night" },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && pomoSeconds > 0) {
      interval = setInterval(() => setPomoSeconds((prev) => prev - 1), 1000);
    } else if (pomoSeconds === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!isBreak) {
        Alert.alert("Pomodoro Complete!", "Great focus session! Time for a 5-minute break.");
        setIsBreak(true);
        setPomoSeconds(5 * 60);
      } else {
        Alert.alert("Break Ended", "Ready to start your next study interval?");
        setIsBreak(false);
        setPomoSeconds(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, pomoSeconds, isBreak]);

  const toggleHabit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <Header title="Study Planner" subtitle="Pomodoro Timer & Habit Tracker" />

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["daily", "weekly", "pomodoro"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setPlannerTab(tab)}
            style={[styles.tabBtn, plannerTab === tab && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, plannerTab === tab && styles.tabTextActive]}>
              {tab === "pomodoro" ? "POMODORO" : `${tab.toUpperCase()} GOALS`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* View 1: Pomodoro Timer */}
        {plannerTab === "pomodoro" ? (
          <GlassCard style={styles.pomoCard}>
            <View style={styles.pomoModeBadge}>
              <Text style={styles.pomoModeText}>{isBreak ? "REST INTERVAL" : "DEEP WORK FOCUS"}</Text>
            </View>

            <Text style={styles.timerDisplay}>{formatTime(pomoSeconds)}</Text>

            <View style={styles.pomoActions}>
              <TouchableOpacity
                style={styles.pomoCircleBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsRunning(!isRunning);
                }}
              >
                {isRunning ? <Pause size={28} color="#FFFFFF" /> : <Play size={28} color="#FFFFFF" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setIsRunning(false);
                  setPomoSeconds(isBreak ? 5 * 60 : 25 * 60);
                }}
              >
                <RotateCcw size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.pomoHint}>25 mins focus • 5 mins interval break</Text>
          </GlassCard>
        ) : (
          <>
            {/* View 2: Daily & Weekly Task Checklist */}
            <GlassCard style={styles.checklistCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Today's Target Tasks</Text>
                <Text style={styles.cardCount}>
                  {habits.filter((h) => h.done).length} / {habits.length} Done
                </Text>
              </View>

              <View style={{ gap: 10 }}>
                {habits.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => toggleHabit(item.id)}
                    style={[styles.habitItem, item.done && styles.habitItemDone]}
                  >
                    <CheckCircle
                      size={20}
                      color={item.done ? Colors.success : "rgba(255, 255, 255, 0.2)"}
                      fill={item.done ? Colors.success : "transparent"}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.habitName,
                          item.done && { textDecorationLine: "line-through", color: Colors.textMuted },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.habitTime}>{item.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            {/* Streak & Consistency Card */}
            <GlassCard variant="cyan" style={styles.consistencyCard}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Flame size={24} color="#FB923C" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.consistencyTitle}>7-Day Study Streak Active</Text>
                  <Text style={styles.consistencySub}>
                    Complete all 4 targets today to earn 50 bonus KR learning points!
                  </Text>
                </View>
              </View>
            </GlassCard>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: { paddingVertical: 12, marginRight: 20 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.secondary },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: Colors.textCyan },
  scroll: { paddingHorizontal: 16, paddingBottom: 110, gap: 14 },
  pomoCard: { alignItems: "center", paddingVertical: 36, paddingHorizontal: 20, gap: 16 },
  pomoModeBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pomoModeText: { color: Colors.textPurple, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  timerDisplay: { color: "#FFFFFF", fontSize: 56, fontWeight: "900", letterSpacing: 2 },
  pomoActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  pomoCircleBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  pomoHint: { color: Colors.textMuted, fontSize: 12, marginTop: 10 },
  checklistCard: { padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  cardCount: { color: Colors.textCyan, fontSize: 12, fontWeight: "700" },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  habitItemDone: { backgroundColor: "rgba(16, 185, 129, 0.08)", borderColor: "rgba(16, 185, 129, 0.25)" },
  habitName: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  habitTime: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  consistencyCard: { padding: 16 },
  consistencyTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  consistencySub: { color: Colors.textSecondary, fontSize: 11, marginTop: 2, lineHeight: 16 },
});
