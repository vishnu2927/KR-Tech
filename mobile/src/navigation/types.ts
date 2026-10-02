import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: { email: string; mode?: "register" | "forgot" };
  ForgotPassword: undefined;
  ResetPassword: { email: string; otp?: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  AIMentorTab: undefined;
  PlannerTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainApp: NavigatorScreenParams<MainTabParamList>;
  CourseDetail: { courseId: string; title: string };
  VideoPlayer: { lessonId: string; courseId: string; title: string; videoUrl: string };
  Quiz: { quizId?: string; topic?: string };
  QuizResult: { score: number; total: number; passed: boolean; answers: any[] };
  Assignments: undefined;
  LiveClasses: undefined;
  NotesLibrary: undefined;
  CertificateWallet: undefined;
  PaymentCenter: undefined;
  DownloadCenter: undefined;
  Settings: undefined;
  Notifications: undefined;
  EditProfile: undefined;
};
