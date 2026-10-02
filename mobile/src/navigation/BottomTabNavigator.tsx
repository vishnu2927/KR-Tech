import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MainTabParamList } from "./types";
import { colors } from "../theme/colors";

// Screen Imports
import HomeScreen from "../screens/dashboard/HomeScreen";
import CoursesScreen from "../screens/courses/CoursesScreen";
import AIMentorScreen from "../screens/ai/AIMentorScreen";
import StudyPlannerScreen from "../screens/planner/StudyPlannerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accentCyan,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="CoursesTab"
        component={CoursesScreen}
        options={{
          tabBarLabel: "Courses",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? "school" : "school-outline"} size={22} color={color} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AIMentorTab"
        component={AIMentorScreen}
        options={{
          tabBarLabel: "AI Mentor",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.aiIconWrapper, focused && styles.aiIconFocused]}>
              <Ionicons name="sparkles" size={20} color="#fff" />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="PlannerTab"
        component={StudyPlannerScreen}
        options={{
          tabBarLabel: "Planner",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(6, 8, 17, 0.95)",
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeGlow: {
    position: "absolute",
    bottom: -4,
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accentCyan,
  },
  aiIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -8,
    borderWidth: 2,
    borderColor: colors.accentPurple,
    elevation: 4,
    shadowColor: colors.accentPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  aiIconFocused: {
    borderColor: colors.accentCyan,
    backgroundColor: colors.accentPurple,
  },
});
