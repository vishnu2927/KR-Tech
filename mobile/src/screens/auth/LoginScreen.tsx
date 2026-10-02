import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Fingerprint, Sparkles, ArrowLeft } from "lucide-react-native";
import { AuthStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loginWithBiometrics, isBiometricSupported } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Required", "Please enter your registered email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert("Login Failed", e.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometrics = async () => {
    try {
      await loginWithBiometrics();
    } catch (e: any) {
      Alert.alert("Biometrics", e.message || "Could not authenticate with biometrics.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#060811", "#0B0F19", "#0E1528"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Sparkles size={20} color={Colors.secondary} />
            <Text style={styles.brandTitle}>KR Global Learning</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your courses, live classes and AI tutor.</Text>
        </View>

        {/* Login Form */}
        <GlassCard style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail size={18} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="student@krtech.in"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
              <Lock size={18} color={Colors.textMuted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <GradientButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />
          </View>

          {/* Biometric Login */}
          {isBiometricSupported && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBiometrics}
              style={styles.biometricBtn}
            >
              <Fingerprint size={20} color={Colors.textCyan} />
              <Text style={styles.biometricText}>Login with Biometrics / Face ID</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        {/* Demo Credentials Hint */}
        <View style={styles.demoHint}>
          <Text style={styles.demoText}>Quick Demo: student@krtech.in / Student@123</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Sign Up Free</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: "space-between",
  },
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
  header: {
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  brandTitle: {
    color: Colors.textCyan,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  formCard: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  forgotText: {
    color: Colors.textPurple,
    fontSize: 12,
    fontWeight: "600",
  },
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
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.35)",
    backgroundColor: "rgba(6, 182, 212, 0.08)",
    marginTop: 4,
  },
  biometricText: {
    color: Colors.textCyan,
    fontSize: 13,
    fontWeight: "700",
  },
  demoHint: {
    alignItems: "center",
    marginVertical: 12,
  },
  demoText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  registerLink: {
    color: Colors.textCyan,
    fontSize: 13,
    fontWeight: "700",
  },
});
