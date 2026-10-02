import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Code, Brain, Award, ShieldCheck } from "lucide-react-native";
import { AuthStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const highlights = [
    { icon: <Brain size={20} color={Colors.secondary} />, title: "AI Study Assistant", desc: "Interactive 24/7 coding tutor" },
    { icon: <Code size={20} color={Colors.textPurple} />, title: "One-on-One Live Training", desc: "Direct MNC architect mentorship" },
    { icon: <Award size={20} color="#FBBF24" />, title: "Global Certifications", desc: "AWS, Azure, Java & SAP verified credentials" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#060811", "#0B0F19", "#0E1528"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Badge */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Sparkles size={14} color={Colors.secondary} />
            <Text style={styles.badgeText}>KR GLOBAL LEARNING PRIVATE LIMITED</Text>
          </View>

          <Text style={styles.heroTitle}>
            Master Modern Tech with{" "}
            <Text style={{ color: Colors.textPurple }}>Personalized</Text> Mentorship
          </Text>

          <Text style={styles.heroSubtitle}>
            Full Stack, AI, Cloud Computing, Cyber Security, DevOps, SAP & Data Analytics.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {highlights.map((h, i) => (
            <GlassCard key={i} style={styles.featureCard} variant={i === 0 ? "cyan" : "default"}>
              <View style={styles.iconCircle}>{h.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{h.title}</Text>
                <Text style={styles.featureDesc}>{h.desc}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <GradientButton
            title="Sign In to Student Account"
            onPress={() => navigation.navigate("Login")}
            size="lg"
          />

          <View style={{ marginTop: 12 }}>
            <GradientButton
              title="Create New Account"
              onPress={() => navigation.navigate("Register")}
              colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"]}
              size="lg"
            />
          </View>

          <View style={styles.trustStrip}>
            <ShieldCheck size={14} color={Colors.success} />
            <Text style={styles.trustText}>Official 24×7 Student Support (+91 9311073936)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(124, 58, 237, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.35)",
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.textCyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 36,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  cardsContainer: {
    gap: 12,
    marginVertical: 10,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  featureDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    marginTop: 24,
  },
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
  },
  trustText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
});
