import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../theme/colors";
import { GlassCard } from "../../components/GlassCard";
import { GradientButton } from "../../components/GradientButton";
import { useAuth } from "../../context/AuthContext";
import * as Haptics from "expo-haptics";

export default function EditProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("+91 ");
  const [bio, setBio] = useState("Aspiring AI and Cloud Systems Engineer.");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }

    try {
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simulate API update or call backend endpoint
      await new Promise((r) => setTimeout(r, 700));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Error", "Could not save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Registered Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user?.email || "student@krgloballearning.com"}
            editable={false}
          />
          <Text style={styles.helpText}>Email cannot be changed directly for security reasons.</Text>

          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 Phone Number"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Bio / Learning Goal</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about your learning goals..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
          />

          <GradientButton
            title={saving ? "Saving Changes..." : "Save Profile"}
            onPress={handleSave}
            disabled={saving}
            style={{ marginTop: 20 }}
          />
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    padding: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  helpText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
});
