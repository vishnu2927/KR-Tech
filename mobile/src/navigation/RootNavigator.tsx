import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

// Navigators
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

// Screens
import CourseDetailScreen from "../screens/courses/CourseDetailScreen";
import VideoPlayerScreen from "../screens/courses/VideoPlayerScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import AssignmentsScreen from "../screens/assignments/AssignmentsScreen";
import LiveClassesScreen from "../screens/live/LiveClassesScreen";
import NotesLibraryScreen from "../screens/notes/NotesLibraryScreen";
import CertificateWalletScreen from "../screens/certificates/CertificateWalletScreen";
import PaymentCenterScreen from "../screens/payments/PaymentCenterScreen";
import DownloadCenterScreen from "../screens/downloads/DownloadCenterScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 16,
        },
        headerBackTitleVisible: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainApp"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={({ route }) => ({
              title: route.params?.title || "Course Curriculum",
              headerBackTitle: "Back",
            })}
          />

          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerScreen}
            options={{
              title: "Lecture Session",
              headerBackTitle: "Course",
            }}
          />

          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              title: "Adaptive Assessment",
              headerBackTitle: "Exit",
            }}
          />

          <Stack.Screen
            name="QuizResult"
            component={QuizResultScreen}
            options={{
              title: "Performance Report",
              headerBackVisible: false,
            }}
          />

          <Stack.Screen
            name="Assignments"
            component={AssignmentsScreen}
            options={{
              title: "Lab & Project Assignments",
            }}
          />

          <Stack.Screen
            name="LiveClasses"
            component={LiveClassesScreen}
            options={{
              title: "Live Interactive Classes",
            }}
          />

          <Stack.Screen
            name="NotesLibrary"
            component={NotesLibraryScreen}
            options={{
              title: "AI Notes & Handouts",
            }}
          />

          <Stack.Screen
            name="CertificateWallet"
            component={CertificateWalletScreen}
            options={{
              title: "Verified Certificate Wallet",
            }}
          />

          <Stack.Screen
            name="PaymentCenter"
            component={PaymentCenterScreen}
            options={{
              title: "Fee Invoices & Payments",
            }}
          />

          <Stack.Screen
            name="DownloadCenter"
            component={DownloadCenterScreen}
            options={{
              title: "Offline Storage & Lessons",
            }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: "Settings & Help",
            }}
          />

          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              title: "Push Notification Feed",
            }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              title: "Edit Student Profile",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
