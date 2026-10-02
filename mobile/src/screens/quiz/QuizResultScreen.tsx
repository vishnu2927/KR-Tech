import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Award, CheckCircle2, XCircle, RotateCcw, Home } from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";

type Props = NativeStackScreenProps<RootStackParamList, "QuizResult">;

export const QuizResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { score, total, passed, answers } = route.params;
  const percentage = Math.round((score / total) * 100);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Score Header Card */}
        <GlassCard variant={passed ? "emerald" : "default"} style={styles.scoreCard}>
          <View style={[styles.badgeCircle, { backgroundColor: passed ? Colors.successLight : "rgba(239, 68, 68, 0.15)" }]}>
            <Award size={36} color={passed ? Colors.success : Colors.error} />
          </View>

          <Text style={styles.resultTitle}>{passed ? "Assessment Passed!" : "Needs Review"}</Text>
          <Text style={styles.scoreNumber}>{score} / {total}</Text>
          <Text style={styles.percentText}>{percentage}% Score Achievement</Text>

          <Text style={styles.scoreMessage}>
            {passed
              ? "Outstanding performance! You've verified foundational mastery in this technical topic."
              : "Review the answer explanations below to strengthen your understanding before retrying."}
          </Text>
        </GlassCard>

        {/* Detailed Answer Review */}
        <Text style={styles.sectionHeading}>Review Questions ({answers.length})</Text>

        <View style={{ gap: 12 }}>
          {answers.map((a, i) => (
            <GlassCard key={i} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.qIndex}>Question {i + 1}</Text>
                {a.isCorrect ? (
                  <View style={styles.correctPill}>
                    <CheckCircle2 size={12} color={Colors.success} />
                    <Text style={styles.correctPillText}>Correct</Text>
                  </View>
                ) : (
                  <View style={styles.wrongPill}>
                    <XCircle size={12} color={Colors.error} />
                    <Text style={styles.wrongPillText}>Incorrect</Text>
                  </View>
                )}
              </View>

              <Text style={styles.questionText}>{a.question}</Text>
              <Text style={styles.userAnswer}>Your Answer: <Text style={{ color: a.isCorrect ? Colors.success : Colors.error }}>{a.selected}</Text></Text>
              {!a.isCorrect && (
                <Text style={styles.correctAnswer}>Correct: <Text style={{ color: Colors.success }}>{a.correct}</Text></Text>
              )}
              <Text style={styles.explanationText}>💡 {a.explanation}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <GradientButton
            title="Retake Quiz"
            icon={<RotateCcw size={16} color="#FFFFFF" />}
            onPress={() => navigation.replace("Quiz", {})}
            size="lg"
          />

          <View style={{ marginTop: 10 }}>
            <GradientButton
              title="Back to Dashboard"
              icon={<Home size={16} color="#FFFFFF" />}
              onPress={() => navigation.navigate("MainApp", { screen: "HomeTab" } as any)}
              colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"]}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 40, gap: 16 },
  scoreCard: { alignItems: "center", padding: 24, gap: 8 },
  badgeCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  resultTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  scoreNumber: { color: "#FFFFFF", fontSize: 36, fontWeight: "900" },
  percentText: { color: Colors.textCyan, fontSize: 13, fontWeight: "700" },
  scoreMessage: { color: Colors.textSecondary, fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 4 },
  sectionHeading: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 8 },
  answerCard: { padding: 14, gap: 6 },
  answerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  qIndex: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  correctPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.successLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  correctPillText: { color: Colors.success, fontSize: 10, fontWeight: "800" },
  wrongPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.errorLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  wrongPillText: { color: Colors.error, fontSize: 10, fontWeight: "800" },
  questionText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  userAnswer: { color: Colors.textSecondary, fontSize: 12 },
  correctAnswer: { color: Colors.textSecondary, fontSize: 12 },
  explanationText: { color: Colors.textMuted, fontSize: 11, fontStyle: "italic", marginTop: 2 },
  actions: { marginTop: 10 },
});
