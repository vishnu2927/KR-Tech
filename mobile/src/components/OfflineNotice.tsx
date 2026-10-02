import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WifiOff } from "lucide-react-native";
import { Colors } from "../theme/colors";

export const OfflineNotice: React.FC<{ isOffline?: boolean }> = ({ isOffline = false }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={14} color="#FFFFFF" />
      <Text style={styles.text}>Offline Mode — Showing downloaded courses & cached notes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.warning,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
