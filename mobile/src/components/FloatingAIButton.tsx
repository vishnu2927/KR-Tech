import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Bot, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Colors } from "../theme/colors";

interface FloatingAIButtonProps {
  onPress: () => void;
}

export const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ onPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.container}
    >
      <LinearGradient
        colors={["#8B5CF6", "#06B6D4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Bot size={22} color="#FFFFFF" />
        <View style={styles.sparkleDot}>
          <Sparkles size={10} color="#FBBF24" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 84,
    right: 18,
    zIndex: 99,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  gradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  sparkleDot: {
    position: "absolute",
    top: 6,
    right: 8,
  },
});
