import React from "react";
import Hero from "../components/Hero";
import StudentSuccessMetrics from "../components/StudentSuccessMetrics";
import CategoryGrid from "../components/CategoryGrid";
import Courses from "../components/Courses";
import Mentors from "../components/Mentors";
import LearningJourney from "../components/LearningJourney";
import Testimonials from "../components/Testimonials";
import FreeResources from "../components/FreeResources";
import UpcomingLiveSessions from "../components/UpcomingLiveSessions";
import LearningFeatures from "../components/LearningFeatures";
import ProjectShowcase from "../components/ProjectShowcase";
import FreeDemoSection from "../components/FreeDemoSection";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import StickyDemoBanner from "../components/StickyDemoBanner";
import SEO from "../components/common/SEO";
import { SchemaBuilder } from "../utils/seo";

export default function Home({ onOpenDemoModal }: { onOpenDemoModal: (courseOrMentor?: string) => void }) {
  return (
    <SEO
      title="KR GLOBAL LEARNING PRIVATE LIMITED — One-on-One Live Tech Mentorship | AI • Cloud • MERN • DevOps • Vendor Certifications"
      description="KR GLOBAL LEARNING PRIVATE LIMITED is a technology-first education company that provides industry-focused training, certification programs, live One-on-One mentorship, project-based learning, and practical skill development in AI, Cloud Computing, Cyber Security, Full Stack Development, DevOps, SAP, Data Analytics, Microsoft Technologies, Cisco Networking, and other emerging technologies."
      canonical="https://krgloballearning.com/"
      keywords="Technology Training Institute, Certification Learning Platform, AI Learning Platform, Cloud Computing Training, Cyber Security Training, One-on-One Technology Learning, Professional Technology Courses, Practical Learning Platform, AWS Training, Azure Training, SAP Training, DevOps Training, Data Analytics Training"
      structuredData={[
        SchemaBuilder.getOrganizationSchema(),
        SchemaBuilder.getWebSiteSchema(),
      ]}
    >
      <main className="bg-white text-slate-900 min-h-screen">
        {/* 1. Software Learning Pair-Programming Hero */}
        <Hero onOpenDemoModal={() => onOpenDemoModal()} />


        {/* 2. Animated Stats Bar (Courses, Mentorship Ratio, Certifications) */}
        <StudentSuccessMetrics />

        {/* 3. Premium Course Category Grid (8 Specialization Domains) */}
        <CategoryGrid />

        {/* 4. Featured Live Courses (Top 6 Live Synced from MongoDB Atlas) */}
        <Courses limit={6} showFilter={false} />

        {/* 5. Senior Industry Mentors (Enterprise Tech Specialists) */}
        <Mentors onOpenDemo={(mentor) => onOpenDemoModal(mentor)} />

        {/* 6. Apple/Scaler-Style Interactive Learning Roadmap Timeline */}
        <LearningJourney onOpenDemo={() => onOpenDemoModal()} />

        {/* 7. Student Learning & Transformation Stories (Skills, Architecture, Reviews) */}
        <Testimonials />

        {/* 7B. Verified Student Completed Projects Showcase (Phase 13 Section 5) */}
        <ProjectShowcase onOpenDemo={() => onOpenDemoModal()} />

        {/* 8. Developer Free Resources & Architecture Cheat Sheets */}
        <FreeResources />

        {/* 9. Upcoming Live Interactive Evaluation Cohorts */}
        <UpcomingLiveSessions onJoinDemo={(course) => onOpenDemoModal(course)} />

        {/* 10. Platform Pillars & One-on-One Methodology */}
        <LearningFeatures />

        {/* 11. Free Free One-on-One Learning Consultation Booking Spotlight */}
        <FreeDemoSection onOpenModal={() => onOpenDemoModal()} />

        {/* 12. Frequently Asked Questions */}
        <FAQ />

        {/* 13. Newsletter / Community Updates */}
        <Newsletter />

        {/* 14. Sticky Floating Free Demo CTA Dock */}
        <StickyDemoBanner onOpenDemo={() => onOpenDemoModal()} />
      </main>
    </SEO>
  );
}
