import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "cyan" | "subtle" | "emerald";
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, variant = "default" }) => {
  const getBorderColor = () => {
    switch (variant) {
      case "cyan":
        return Colors.cardBorderCyan;
      case "emerald":
        return "rgba(16, 185, 129, 0.35)";
      case "subtle":
        return Colors.cardBorderSubtle;
      default:
        return Colors.cardBorder;
    }
  };

  return (
    <View style={[styles.card, { borderColor: getBorderColor() }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardGlass,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
});
