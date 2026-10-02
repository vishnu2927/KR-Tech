import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, ArrowLeft } from "lucide-react-native";
import { AuthStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your registered email address.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      Alert.alert("Code Dispatched", "A password reset OTP has been sent to your email address.");
      navigation.navigate("OTPVerification", { email: email.trim(), mode: "forgot" });
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#060811", "#0B0F19", "#0E1528"]} style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your student email and we'll send you an encrypted OTP to reset your account password.
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail size={18} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="student@example.com"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
          </View>

          <GradientButton title="Send Password Reset Code" onPress={handleSend} loading={loading} size="lg" />
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingTop: 50 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  header: { marginBottom: 24 },
  title: { color: "#FFFFFF", fontSize: 26, fontWeight: "800" },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 18 },
  card: { padding: 20, gap: 16 },
  inputGroup: { gap: 6 },
  label: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, color: "#FFFFFF", fontSize: 14 },
});
