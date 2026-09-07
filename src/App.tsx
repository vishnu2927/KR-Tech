import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FreeDemoModal from "./components/FreeDemoModal";
import Home from "./pages/Home";
import CoursesPage from "./pages/CoursesPage";
import MentorsPage from "./pages/MentorsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import CertificatesPage from "./pages/CertificatesPage";
import ResourcesPage from "./pages/ResourcesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FreeDemoPage from "./pages/FreeDemoPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar onOpenDemoModal={() => handleOpenDemo()} />

          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home onOpenDemoModal={handleOpenDemo} />} />
              <Route path="/courses" element={<CoursesPage onOpenDemoModal={() => handleOpenDemo()} />} />
              <Route path="/mentors" element={<MentorsPage onOpenDemoModal={handleOpenDemo} />} />
              <Route path="/dashboard" element={<StudentDashboardPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/about" element={<AboutPage onOpenDemoModal={() => handleOpenDemo()} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/free-demo" element={<FreeDemoPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Home onOpenDemoModal={handleOpenDemo} />} />
            </Routes>
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
  );
}
