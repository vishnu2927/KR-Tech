import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { useOffline } from "../../context/OfflineContext";
import { downloadService, DownloadItem } from "../../services/downloadService";
import * as Haptics from "expo-haptics";

export default function DownloadCenterScreen() {
  const { downloads, storageUsed, refreshDownloads, deleteDownload } = useOffline();
  const [filterType, setFilterType] = useState<"all" | "video" | "pdf">("all");
  const [clearing, setClearing] = useState(false);

  const handleDeleteItem = (id: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Offline File", `Delete "${name}" from offline storage?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDownload(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Clear All Offline Content",
      "Are you sure you want to remove all downloaded videos, notes, and certificates? This will free up storage immediately.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            setClearing(true);
            await downloadService.clearAllDownloads();
            await refreshDownloads();
            setClearing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Cleaned Up", "All offline downloads cleared.");
          },
        },
      ]
    );
  };

  const filteredItems = downloads.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <View style={styles.container}>
      {/* Storage Dashboard Widget */}
      <View style={styles.topSection}>
        <GlassCard style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View>
              <Text style={styles.storageLabel}>OFFLINE STORAGE USED</Text>
              <Text style={styles.storageValue}>{storageUsed}</Text>
            </View>
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={handleClearAll}
              disabled={clearing || downloads.length === 0}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Storage Bar Indicator */}
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.min(100, Math.max(10, downloads.length * 20))}%` },
              ]}
            />
          </View>
          <Text style={styles.storageInfo}>
            {downloads.length} file(s) available for offline study without internet
          </Text>
        </GlassCard>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, filterType === "all" && styles.tabActive]}
          onPress={() => setFilterType("all")}
        >
          <Text style={[styles.tabText, filterType === "all" && styles.tabTextActive]}>
            All ({downloads.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterType === "video" && styles.tabActive]}
          onPress={() => setFilterType("video")}
        >
          <Text style={[styles.tabText, filterType === "video" && styles.tabTextActive]}>
            Videos ({downloads.filter((d) => d.type === "video").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterType === "pdf" && styles.tabActive]}
          onPress={() => setFilterType("pdf")}
        >
          <Text style={[styles.tabText, filterType === "pdf" && styles.tabTextActive]}>
            PDF Notes ({downloads.filter((d) => d.type === "pdf" || d.type === "certificate").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Downloaded Items List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {clearing ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : filteredItems.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="cloud-offline-outline" size={54} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Downloads Available</Text>
            <Text style={styles.emptyDesc}>
              Tap the download button on any video or lecture note to study without active data connection.
            </Text>
          </GlassCard>
        ) : (
          filteredItems.map((item) => (
            <GlassCard key={item.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.typeIcon,
                    {
                      backgroundColor:
                        item.type === "video"
                          ? "rgba(124, 58, 237, 0.2)"
                          : "rgba(0, 245, 255, 0.2)",
                    },
                  ]}
                >
                  <Ionicons
                    name={item.type === "video" ? "play" : "document-text"}
                    size={20}
                    color={item.type === "video" ? colors.accentPurple : colors.accentCyan}
                  />
                </View>

                <View style={styles.itemMeta}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.fileDetails}>
                    {(item.sizeBytes / (1024 * 1024)).toFixed(2)} MB • {item.type.toUpperCase()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteItem(item.id, item.title)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  storageCard: {
    padding: 18,
  },
  storageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  storageLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  storageValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  clearAllText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: "600",
  },
  barTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.accentCyan,
    borderRadius: 3,
  },
  storageInfo: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginVertical: 10,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  emptyCard: {
    alignItems: "center",
    padding: 36,
    marginTop: 30,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyDesc: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemMeta: {
    flex: 1,
  },
  fileName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  fileDetails: {
    color: colors.textMuted,
    fontSize: 11,
  },
  deleteBtn: {
    padding: 8,
  },
});
