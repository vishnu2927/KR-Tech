import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { AuthStackParamList } from "../../navigation/types";
import { Colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Splash">;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { user, token, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        if (token && user) {
          // Handled by RootNavigator
        } else {
          navigation.replace("Welcome");
        }
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isLoading, token, user]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#060811", "#0B0F19", "#110D27"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient background glow */}
      <View style={styles.glowOrb} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={["#7C3AED", "#2563EB", "#06B6D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBadge}
          >
            <Sparkles size={38} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.brandTitle}>KR Global Learning</Text>
        <Text style={styles.brandCompany}>KR GLOBAL LEARNING PRIVATE LIMITED</Text>
        <Text style={styles.brandTagline}>Learn. Build. Grow. Globally.</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Mobile Learning Platform v10.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  glowOrb: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    top: "30%",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  brandCompany: {
    color: Colors.textCyan,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 6,
    textTransform: "uppercase",
  },
  brandTagline: {
    color: Colors.textPurple,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  badge: {
    marginTop: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
});
