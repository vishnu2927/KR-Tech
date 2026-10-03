import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import OfflineBanner from "./components/common/OfflineBanner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import FloatingContactButtons from "./components/FloatingContactButtons";

const FreeDemoModal = lazy(() => import("./components/FreeDemoModal"));

// Lazy-loaded routes for code-splitting and performance optimization
const Home = lazy(() => import("./pages/Home"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const MentorsPage = lazy(() => import("./pages/MentorsPage"));
const StudentDashboardPage = lazy(() => import("./pages/StudentDashboardPage"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FreeDemoPage = lazy(() => import("./pages/FreeDemoPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const StudentsManagementPage = lazy(() => import("./pages/StudentsManagementPage"));
const LeadsManagementPage = lazy(() => import("./pages/LeadsManagementPage"));
const CourseManagementPage = lazy(() => import("./pages/CourseManagementPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("./pages/PaymentFailedPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentHistoryPage = lazy(() => import("./pages/PaymentHistoryPage"));
const AdminPaymentsPage = lazy(() => import("./pages/AdminPaymentsPage"));
const CouponsAdminPage = lazy(() => import("./pages/CouponsAdminPage"));
const InvoiceViewerPage = lazy(() => import("./pages/InvoiceViewerPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MyCoursesPage = lazy(() => import("./pages/MyCoursesPage"));
const CoursePlayerPage = lazy(() => import("./pages/CoursePlayerPage"));
const LiveClassesPage = lazy(() => import("./pages/LiveClassesPage"));
const SessionDetailsPage = lazy(() => import("./pages/SessionDetailsPage"));
const RecordingLibraryPage = lazy(() => import("./pages/RecordingLibraryPage"));
const AdminSchedulerPage = lazy(() => import("./pages/AdminSchedulerPage"));
const AIMentorPage = lazy(() => import("./pages/AIMentorPage"));
const InterviewBotPage = lazy(() => import("./pages/InterviewBotPage"));
const ResumeAnalyzerPage = lazy(() => import("./pages/ResumeAnalyzerPage"));
const QuizGeneratorPage = lazy(() => import("./pages/QuizGeneratorPage"));
const StudyAssistantPage = lazy(() => import("./pages/StudyAssistantPage"));
const CertificateVerifyPage = lazy(() => import("./pages/CertificateVerifyPage"));
const PortfolioBuilderPage = lazy(() => import("./pages/PortfolioBuilderPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const StudentCRMPage = lazy(() => import("./pages/StudentCRMPage"));
const MentorCRMPage = lazy(() => import("./pages/MentorCRMPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const SupportCenterPage = lazy(() => import("./pages/SupportCenterPage"));
const MarketingDashboardPage = lazy(() => import("./pages/MarketingDashboardPage"));
const NotificationCenterPage = lazy(() => import("./pages/NotificationCenterPage"));
const DownloadsPage = lazy(() => import("./pages/DownloadsPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const NotificationSettingsPage = lazy(() => import("./pages/NotificationSettingsPage"));
const CommunityFeedPage = lazy(() => import("./pages/CommunityFeedPage"));
const GroupChatPage = lazy(() => import("./pages/GroupChatPage"));
const DSARoomPage = lazy(() => import("./pages/DSARoomPage"));
const MentorQAPage = lazy(() => import("./pages/MentorQAPage"));
const BadgesPage = lazy(() => import("./pages/BadgesPage"));
const AIMockInterviewPage = lazy(() => import("./pages/AIMockInterviewPage"));
const ResumeBuilderPage = lazy(() => import("./pages/ResumeBuilderPage"));
const CodingPlaygroundPage = lazy(() => import("./pages/CodingPlaygroundPage"));
const DSAProblemsPage = lazy(() => import("./pages/DSAProblemsPage"));
const InterviewAnalyticsPage = lazy(() => import("./pages/InterviewAnalyticsPage"));
const SystemDesignPage = lazy(() => import("./pages/SystemDesignPage"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage"));
const AINotesPage = lazy(() => import("./pages/AINotesPage"));
const AIQuizPage = lazy(() => import("./pages/AIQuizPage"));
const StudyPlannerPage = lazy(() => import("./pages/StudyPlannerPage"));
const SmartNotesPage = lazy(() => import("./pages/SmartNotesPage"));
const AssignmentsPage = lazy(() => import("./pages/AssignmentsPage"));
const PdfSummaryPage = lazy(() => import("./pages/PdfSummaryPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const CodeLabPage = lazy(() => import("./pages/CodeLabPage"));
const DoubtCenterPage = lazy(() => import("./pages/DoubtCenterPage"));
const GamificationPage = lazy(() => import("./pages/GamificationPage"));
const LearningAnalyticsPage = lazy(() => import("./pages/LearningAnalyticsPage"));
const AdminLmsPage = lazy(() => import("./pages/AdminLmsPage"));
const SuperAdminPage = lazy(() => import("./pages/SuperAdminPage"));
const AdminMonitoringPage = lazy(() => import("./pages/AdminMonitoringPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const NotFoundPage = lazy(() => import("./components/common/NotFoundPage"));
const PWAInstallBanner = lazy(() => import("./components/pwa/PWAInstallBanner"));

// Scroll to top automatically on route changes or hash scroll
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/super-admin");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);

  const handleOpenDemo = (courseOrMentor?: string) => {
    if (courseOrMentor) {
      setSelectedCourse(courseOrMentor);
    }
    setDemoModalOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!isSuperAdmin && <Navbar onOpenDemoModal={() => handleOpenDemo()} />}
      <div style={{ flex: 1, minHeight: isSuperAdmin ? "100vh" : "85vh" }}>
        <Suspense fallback={<LoadingSpinner size="lg" label="Loading KR Global Learning..." fullScreen={false} />}>
          <Routes>
            {/* Phase 11 Super Admin ERP Routes */}
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="/super-admin/:section" element={<SuperAdminPage />} />
            <Route path="/" element={<Home onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/courses" element={<CoursesPage onOpenDemoModal={() => handleOpenDemo()} />} />
                  <Route path="/courses/:id" element={<CourseDetailPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/course/:id" element={<CourseDetailPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/mentors" element={<MentorsPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/:tab"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-courses"
                    element={
                      <ProtectedRoute>
                        <MyCoursesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn/:courseId"
                    element={
                      <ProtectedRoute>
                        <CoursePlayerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn"
                    element={
                      <ProtectedRoute>
                        <CoursePlayerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute>
                        <StudentDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/security"
                    element={
                      <ProtectedRoute>
                        <SecurityPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/checkout/:courseSlug" element={<CheckoutPage />} />
                  <Route path="/checkout/:courseId" element={<CheckoutPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment/history" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
                  <Route path="/dashboard/payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/failed" element={<PaymentFailedPage />} />
                  <Route path="/invoice/:id" element={<InvoiceViewerPage />} />
                  <Route path="/invoices/:id" element={<InvoiceViewerPage />} />
                  <Route path="/invoice/preview/:id" element={<InvoiceViewerPage />} />
                  <Route path="/orders" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
                  <Route path="/certificates" element={<CertificatesPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/verify-certificate/:credentialId" element={<CertificateVerifyPage />} />
                  <Route path="/verify/:credentialId" element={<CertificateVerifyPage />} />
                  <Route path="/verify-certificate" element={<CertificateVerifyPage />} />
                  <Route path="/resources" element={<ResourcesPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/resources/:id" element={<ResourceDetailPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/blogs" element={<BlogPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/about" element={<AboutPage onOpenDemoModal={() => handleOpenDemo()} />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/free-demo" element={<FreeDemoPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
                  <Route path="/terms" element={<LegalPage initialTab="terms" />} />
                  <Route path="/refund" element={<LegalPage initialTab="refund" />} />
                  <Route path="/cookies" element={<LegalPage initialTab="cookies" />} />
                  <Route path="/disclaimer" element={<LegalPage initialTab="disclaimer" />} />
                  <Route path="/sitemap" element={<SitemapPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/monitoring"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminMonitoringPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/courses"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CourseManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/students"
                    element={
                      <ProtectedRoute requireAdmin>
                        <StudentCRMPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/crm/students"
                    element={
                      <ProtectedRoute requireAdmin>
                        <StudentCRMPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/mentors"
                    element={
                      <ProtectedRoute requireAdmin>
                        <MentorCRMPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/crm/mentors"
                    element={
                      <ProtectedRoute requireAdmin>
                        <MentorCRMPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/payments"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPaymentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/coupons"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CouponsAdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/finance"
                    element={
                      <ProtectedRoute requireAdmin>
                        <FinancePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/support"
                    element={
                      <ProtectedRoute requireAdmin>
                        <SupportCenterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/support"
                    element={<SupportCenterPage />}
                  />
                  <Route
                    path="/admin/marketing"
                    element={
                      <ProtectedRoute requireAdmin>
                        <MarketingDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notifications"
                    element={
                      <ProtectedRoute requireAdmin>
                        <NotificationCenterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/leads"
                    element={
                      <ProtectedRoute requireAdmin>
                        <LeadsManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Phase 7 Enterprise Admin CRM Routes */}
                  <Route
                    path="/admin/batches"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/assignments"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/certificates"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/payments"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/certificates"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/emails"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/:tab"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cms"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CourseManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Phase 7 Sprint 7.1 Live Class Routes */}
                  <Route
                    path="/live"
                    element={
                      <ProtectedRoute>
                        <LiveClassesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/live/session/:id"
                    element={
                      <ProtectedRoute>
                        <SessionDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/live/recordings"
                    element={
                      <ProtectedRoute>
                        <RecordingLibraryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/live"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminSchedulerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/scheduler"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminSchedulerPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Phase 8 Sprint 8.1 AI Suite Routes */}
                  <Route
                    path="/ai/mentor"
                    element={
                      <ProtectedRoute>
                        <AIMentorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai/interview"
                    element={
                      <ProtectedRoute>
                        <InterviewBotPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai/resume"
                    element={
                      <ProtectedRoute>
                        <ResumeAnalyzerPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Phase 9 AI Learning Platform & Smart LMS Routes */}
                  <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
                  <Route path="/ai/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
                  <Route path="/ai-notes" element={<ProtectedRoute><AINotesPage /></ProtectedRoute>} />
                  <Route path="/notes/ai" element={<ProtectedRoute><AINotesPage /></ProtectedRoute>} />
                  <Route path="/ai-quiz" element={<ProtectedRoute><AIQuizPage /></ProtectedRoute>} />
                  <Route path="/ai/quiz" element={<ProtectedRoute><AIQuizPage /></ProtectedRoute>} />
                  <Route path="/study-planner" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
                  <Route path="/planner" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
                  <Route path="/ai/study-plan" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
                  <Route path="/notes-library" element={<ProtectedRoute><SmartNotesPage /></ProtectedRoute>} />
                  <Route path="/notes" element={<ProtectedRoute><SmartNotesPage /></ProtectedRoute>} />
                  <Route path="/course-player" element={<ProtectedRoute><CoursePlayerPage /></ProtectedRoute>} />
                  <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
                  <Route path="/live-classes" element={<ProtectedRoute><LiveClassesPage /></ProtectedRoute>} />
                  <Route path="/pdf-summary" element={<ProtectedRoute><PdfSummaryPage /></ProtectedRoute>} />
                  <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
                  <Route path="/code-lab" element={<ProtectedRoute><CodeLabPage /></ProtectedRoute>} />
                  <Route path="/doubt-center" element={<ProtectedRoute><DoubtCenterPage /></ProtectedRoute>} />
                  <Route path="/gamification" element={<ProtectedRoute><GamificationPage /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><LearningAnalyticsPage /></ProtectedRoute>} />
                  <Route path="/admin/lms" element={<ProtectedRoute requireAdmin><AdminLmsPage /></ProtectedRoute>} />
                  {/* Learning Hub & Resource Routes (Rule 1 & Rule 13) */}
                  <Route path="/learning-center" element={<Navigate to="/resources" replace />} />
                  <Route
                    path="/portfolio/builder"
                    element={
                      <ProtectedRoute>
                        <PortfolioBuilderPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  {/* Phase 11 Mobile PWA + Offline Learning Routes */}
                  <Route path="/downloads" element={<ProtectedRoute><DownloadsPage /></ProtectedRoute>} />
                  <Route path="/student/downloads" element={<ProtectedRoute><DownloadsPage /></ProtectedRoute>} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/schedule" element={<CalendarPage />} />
                  <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
                  <Route path="/student/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
                  <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>} />
                  <Route path="/notifications/settings" element={<ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>} />
                  {/* Phase 12 Community Platform Routes */}
                  <Route path="/community" element={<CommunityFeedPage />} />
                  <Route path="/community/feed" element={<CommunityFeedPage />} />
                  <Route path="/community/chat" element={<GroupChatPage />} />
                  <Route path="/community/rooms" element={<GroupChatPage />} />
                  <Route path="/community/dsa" element={<DSARoomPage />} />
                  <Route path="/community/mentor-qa" element={<MentorQAPage />} />
                  <Route path="/community/badges" element={<BadgesPage />} />
                  <Route path="/badges" element={<BadgesPage />} />
                  {/* AI & Coding Platform Routes */}
                  <Route path="/interview/mock" element={<AIMockInterviewPage />} />
                  <Route path="/interview/prep" element={<AIMockInterviewPage />} />
                  <Route path="/resume/analyzer" element={<ResumeAnalyzerPage />} />
                  <Route path="/resume/builder" element={<ResumeBuilderPage />} />
                  <Route path="/compiler" element={<CodingPlaygroundPage />} />
                  <Route path="/playground" element={<CodingPlaygroundPage />} />
                  <Route path="/dsa/problems" element={<DSAProblemsPage />} />
                  <Route path="/dsa/practice" element={<DSAProblemsPage />} />
                  <Route path="/interview/analytics" element={<InterviewAnalyticsPage />} />
                  <Route path="/readiness" element={<InterviewAnalyticsPage />} />
                  <Route path="/system-design" element={<SystemDesignPage />} />
                  {/* Sprint 12.9 Legal Compliance Routes */}
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
                  <Route path="/terms" element={<LegalPage initialTab="terms" />} />
                  <Route path="/refund" element={<LegalPage initialTab="refund" />} />
                  <Route path="/cancellation" element={<LegalPage initialTab="cancellation" />} />
                  <Route path="/cookies" element={<LegalPage initialTab="cookies" />} />
                  <Route path="/community-guidelines" element={<LegalPage initialTab="community" />} />
                  <Route path="/disclaimer" element={<LegalPage initialTab="disclaimer" />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>

            {!isSuperAdmin && <Footer />}

            {!isSuperAdmin && (
              <Suspense fallback={null}>
                <PWAInstallBanner />
              </Suspense>
            )}

            {demoModalOpen && (
              <Suspense fallback={null}>
                <FreeDemoModal
                  isOpen={demoModalOpen}
                  defaultCourse={selectedCourse}
                  onClose={() => {
                    setDemoModalOpen(false);
                    setSelectedCourse(undefined);
                  }}
                />
              </Suspense>
            )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <OfflineBanner />
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
