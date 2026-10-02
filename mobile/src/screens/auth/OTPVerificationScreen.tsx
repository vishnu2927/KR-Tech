import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { KeyRound, ArrowLeft } from "lucide-react-native";
import { AuthStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

export const OTPVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { email, mode = "register" } = route.params;
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid Code", "Please enter the 6-digit verification code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "forgot") {
        navigation.navigate("ResetPassword", { email, otp });
      } else {
        await verifyOtp(email, otp);
      }
    } catch (e: any) {
      Alert.alert("Verification Failed", e.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#060811", "#0B0F19", "#0E1528"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Enter 6-Digit Code</Text>
          <Text style={styles.subtitle}>
            We've dispatched an encrypted verification OTP to:{"\n"}
            <Text style={{ color: Colors.textCyan, fontWeight: "700" }}>{email}</Text>
          </Text>
        </View>

        <GlassCard style={styles.formCard}>
          <View style={styles.inputBox}>
            <KeyRound size={20} color={Colors.textPurple} />
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.otpInput}
            />
          </View>

          <GradientButton
            title="Verify & Proceed"
            onPress={handleVerify}
            loading={loading}
            size="lg"
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive code? </Text>
            {countdown > 0 ? (
              <Text style={styles.timerText}>Resend in {countdown}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setCountdown(30)}>
                <Text style={styles.resendBtn}>Resend Now</Text>
              </TouchableOpacity>
            )}
          </View>
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
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 20 },
  formCard: { padding: 20, gap: 16 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  otpInput: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 6,
    textAlign: "center",
  },
  resendRow: { flexDirection: "row", justifyContent: "center", marginTop: 4 },
  resendLabel: { color: Colors.textSecondary, fontSize: 12 },
  timerText: { color: Colors.textMuted, fontSize: 12, fontWeight: "600" },
  resendBtn: { color: Colors.textPurple, fontSize: 12, fontWeight: "700" },
});
