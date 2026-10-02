import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Clock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react-native";
import { RootStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    question: "In Apache Kafka, what provides order preservation for published messages?",
    options: [
      "Random partition allocation",
      "Assigning messages to the same partition key",
      "Configuring consumer auto-commit to false",
      "Using multiple broker clusters",
    ],
    correctIndex: 1,
    explanation: "Kafka strictly guarantees message ordering per partition. Messages with identical keys hash to the same partition.",
  },
  {
    question: "Which Java 21 feature allows lightweight high-concurrency threads managed by JVM runtime?",
    options: [
      "ForkJoinPool only",
      "Virtual Threads (Project Loom)",
      "Traditional OS Threads",
      "CompletableFuture Executors",
    ],
    correctIndex: 1,
    explanation: "Virtual Threads are lightweight threads managed directly by the Java runtime rather than OS kernel threads.",
  },
  {
    question: "In AWS, which service provides distributed multi-region NoSQL with single-digit millisecond latency?",
    options: ["Amazon RDS Aurora", "Amazon DynamoDB", "Amazon Redshift", "Amazon S3 Glacier"],
    correctIndex: 1,
    explanation: "DynamoDB is AWS's serverless key-value NoSQL database offering single-digit millisecond latency at any scale.",
  },
];

export const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNext();
    }
  }, [timeLeft]);

  const currentQ = SAMPLE_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(idx);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === currentQ.correctIndex;
    const newAnswers = [
      ...answers,
      {
        question: currentQ.question,
        selected: selectedOption !== null ? currentQ.options[selectedOption] : "Time Expired",
        correct: currentQ.options[currentQ.correctIndex],
        isCorrect,
        explanation: currentQ.explanation,
      },
    ];

    setAnswers(newAnswers);
    setSelectedOption(null);
    setTimeLeft(60);

    if (currentIdx + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const score = newAnswers.filter((a) => a.isCorrect).length;
      navigation.replace("QuizResult", {
        score,
        total: SAMPLE_QUESTIONS.length,
        passed: score >= 2,
        answers: newAnswers,
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Knowledge Assessment</Text>
        <View style={styles.timerBadge}>
          <Clock size={13} color={timeLeft < 15 ? Colors.error : Colors.textCyan} />
          <Text style={[styles.timerText, timeLeft < 15 && { color: Colors.error }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentIdx + 1) / SAMPLE_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.questionNum}>
          Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Question Card */}
        <GlassCard style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </GlassCard>

        {/* Options */}
        <View style={styles.optionsList}>
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => handleSelect(i)}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              >
                <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                  <Text style={[styles.optionLetter, isSelected && { color: "#FFFFFF" }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit / Next Button */}
        <View style={styles.actions}>
          <GradientButton
            title={currentIdx + 1 === SAMPLE_QUESTIONS.length ? "Finish Quiz" : "Next Question"}
            onPress={handleNext}
            disabled={selectedOption === null}
            size="lg"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  timerText: { color: Colors.textCyan, fontSize: 12, fontWeight: "700" },
  progressContainer: { paddingHorizontal: 16, gap: 6, marginVertical: 6 },
  progressTrack: { height: 6, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 3, overflow: "hidden" },
  progressBar: { height: "100%", backgroundColor: Colors.primary },
  questionNum: { color: Colors.textMuted, fontSize: 11, textAlign: "right" },
  content: { flex: 1, paddingHorizontal: 16, justifyContent: "space-between", paddingBottom: 40 },
  questionCard: { padding: 18, marginTop: 10 },
  questionText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", lineHeight: 24 },
  optionsList: { gap: 10, marginVertical: 14 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.cardGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorderSubtle,
    padding: 14,
  },
  optionCardSelected: {
    borderColor: Colors.secondary,
    backgroundColor: "rgba(6, 182, 212, 0.15)",
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  optionCircleSelected: { backgroundColor: Colors.secondary },
  optionLetter: { color: Colors.textSecondary, fontSize: 12, fontWeight: "800" },
  optionText: { color: Colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 18 },
  optionTextSelected: { color: "#FFFFFF", fontWeight: "700" },
  actions: { marginTop: 10 },
});
