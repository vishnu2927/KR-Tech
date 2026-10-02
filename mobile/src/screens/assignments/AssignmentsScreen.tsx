import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  FileCode,
  UploadCloud,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
} from "lucide-react-native";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { Header } from "../../components/Header";
import { GradientButton } from "../../components/GradientButton";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  feedback?: string;
}

const STATIC_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    title: "Implement Idempotent Event Producer with Kafka",
    course: "MERN Stack Architecture",
    dueDate: "Tomorrow, 11:59 PM",
    status: "pending",
  },
  {
    id: "assign-2",
    title: "Build Distributed Microservice with Spring Boot & Docker",
    course: "Java Full Stack",
    dueDate: "3 Days ago",
    status: "graded",
    grade: "98 / 100",
    feedback: "Exceptional error handling and clean hexagonal architecture implementation by mentor Rajesh.",
  },
  {
    id: "assign-3",
    title: "AWS ECS Multi-AZ Infrastructure as Code (Terraform)",
    course: "AWS DevOps Masterclass",
    dueDate: "Completed",
    status: "submitted",
  },
];

export const AssignmentsScreen: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(STATIC_ASSIGNMENTS);

  const handleUploadSolution = async (assignmentId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === assignmentId ? { ...a, status: "submitted" } : a
          )
        );
        Alert.alert("Assignment Submitted", "Your solution document was uploaded successfully for mentor evaluation.");
      }
    } catch {
      Alert.alert("Upload Error", "Could not complete document upload.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <Header title="Project Assignments" subtitle="Practical Code Challenges & Mentor Evaluations" />

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          return (
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <FileCode size={20} color={Colors.textCyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTag}>{item.course}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                </View>

                {item.status === "graded" && (
                  <View style={styles.gradeBadge}>
                    <Award size={12} color="#FBBF24" />
                    <Text style={styles.gradeText}>{item.grade}</Text>
                  </View>
                )}
              </View>

              <View style={styles.statusRow}>
                <View style={styles.dueItem}>
                  <Clock size={13} color={Colors.textMuted} />
                  <Text style={styles.dueText}>Due: {item.dueDate}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    item.status === "graded" && styles.statusGraded,
                    item.status === "submitted" && styles.statusSubmitted,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              {item.feedback && (
                <View style={styles.feedbackBox}>
                  <MessageSquare size={13} color={Colors.secondary} />
                  <Text style={styles.feedbackText}>{item.feedback}</Text>
                </View>
              )}

              {item.status === "pending" && (
                <View style={{ marginTop: 6 }}>
                  <GradientButton
                    title="Upload Solution (PDF / Code)"
                    icon={<UploadCloud size={16} color="#FFFFFF" />}
                    onPress={() => handleUploadSolution(item.id)}
                    size="sm"
                  />
                </View>
              )}
            </GlassCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  card: { padding: 16, gap: 10 },
  cardHeader: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  courseTag: { color: Colors.textPurple, fontSize: 10, fontWeight: "700" },
  title: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", marginTop: 2, lineHeight: 18 },
  gradeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.35)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: { color: "#FBBF24", fontSize: 11, fontWeight: "800" },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dueItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dueText: { color: Colors.textMuted, fontSize: 11 },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  statusSubmitted: { backgroundColor: "rgba(6, 182, 212, 0.15)" },
  statusGraded: { backgroundColor: Colors.successLight },
  statusText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  feedbackBox: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  feedbackText: { color: Colors.textSecondary, fontSize: 11, lineHeight: 16, flex: 1 },
});
