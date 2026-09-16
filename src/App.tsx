import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FreeDemoModal from "./components/FreeDemoModal";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import OfflineBanner from "./components/common/OfflineBanner";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy-loaded routes for code-splitting and performance optimization
const Home = lazy(() => import("./pages/Home"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const MentorsPage = lazy(() => import("./pages/MentorsPage"));
const StudentDashboardPage = lazy(() => import("./pages/StudentDashboardPage"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FreeDemoPage = lazy(() => import("./pages/FreeDemoPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CourseManagementPage = lazy(() => import("./pages/CourseManagementPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFoundPage = lazy(() => import("./components/common/NotFoundPage"));

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

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);

  const handleOpenDemo = (courseOrMentor?: string) => {
    if (courseOrMentor) {
      setSelectedCourse(courseOrMentor);
    }
    setDemoModalOpen(true);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <OfflineBanner />
          <ScrollToTop />
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar onOpenDemoModal={() => handleOpenDemo()} />
            <div style={{ flex: 1, minHeight: "85vh" }}>
              <Suspense fallback={<LoadingSpinner size="lg" label="Loading KR Tech..." fullScreen={false} />}>
                <Routes>
                  <Route path="/" element={<Home onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/courses" element={<CoursesPage onOpenDemoModal={() => handleOpenDemo()} />} />
                  <Route path="/courses/:id" element={<CourseDetailPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/mentors" element={<MentorsPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <StudentDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/certificates" element={<CertificatesPage />} />
                  <Route path="/resources" element={<ResourcesPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/resources/:id" element={<ResourceDetailPage onOpenDemoModal={handleOpenDemo} />} />
                  <Route path="/about" element={<AboutPage onOpenDemoModal={() => handleOpenDemo()} />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/free-demo" element={<FreeDemoPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
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
                    path="/cms"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CourseManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>

            <Footer />

            <FreeDemoModal
              isOpen={demoModalOpen}
              defaultCourse={selectedCourse}
              onClose={() => {
                setDemoModalOpen(false);
                setSelectedCourse(undefined);
              }}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
