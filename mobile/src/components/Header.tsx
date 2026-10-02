import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Bell, Flame, Sparkles } from "lucide-react-native";
import { Colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onPressNotifications?: () => void;
  onPressProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onPressNotifications,
  onPressProfile,
}) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {title ? (
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        ) : (
          <View>
            <View style={styles.brandRow}>
              <Sparkles size={16} color={Colors.secondary} />
              <Text style={styles.brandTitle}>KR Global Learning</Text>
            </View>
            <Text style={styles.brandTagline}>Learn. Build. Grow. Globally.</Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {/* Streak Badge */}
        <View style={styles.streakBadge}>
          <Flame size={15} color="#FB923C" />
          <Text style={styles.streakText}>{user?.streakDays || 7}d</Text>
        </View>

        {/* Notifications Icon with Badge */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNotifications}
          style={styles.iconButton}
        >
          <Bell size={18} color={Colors.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity activeOpacity={0.7} onPress={onPressProfile}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  left: {
    flex: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  brandTagline: {
    color: Colors.textPurple,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(251, 146, 60, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 146, 60, 0.35)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  streakText: {
    color: "#FB923C",
    fontSize: 11,
    fontWeight: "700",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
