import React from "react";
import Hero from "../components/Hero";
import StudentSuccessMetrics from "../components/StudentSuccessMetrics";
import UpcomingLiveSessions from "../components/UpcomingLiveSessions";
import LearningFeatures from "../components/LearningFeatures";
import Courses from "../components/Courses";
import ProfessionalCertifications from "../components/ProfessionalCertifications";
import LearningJourney from "../components/LearningJourney";
import ProjectShowcase from "../components/ProjectShowcase";
import FreeResources from "../components/FreeResources";
import FreeDemoSection from "../components/FreeDemoSection";
import Mentors from "../components/Mentors";
import DashboardPreview from "../components/Dashboard";
import Testimonials from "../components/Testimonials";
import CommunitySection from "../components/CommunitySection";
import AIMentor from "../components/AIMentor";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import SEO from "../components/common/SEO";
import { SchemaBuilder } from "../utils/seo";

export default function Home({ onOpenDemoModal }: { onOpenDemoModal: (courseOrMentor?: string) => void }) {
  return (
    <SEO
      title="KR Tech — One-on-One Live Training & Project Support"
      description="India's leading coding academy with personalized 1:1 live training from expert architects. Java, MERN, AI, AWS, Cyber Security, SAP, and Salesforce with job support."
      canonical="https://krtech.in/"
      keywords="1:1 coding classes, personalized tech training, java backend, spring boot, mern stack, react 19, aws certification, devops, cyber security, data analytics, sap fico, live tech mentorship"
      structuredData={[
        SchemaBuilder.getOrganizationSchema(),
        SchemaBuilder.getWebSiteSchema(),
      ]}
    >
      <main>
        <Hero onOpenDemoModal={() => onOpenDemoModal()} />
        <StudentSuccessMetrics />
        <UpcomingLiveSessions onJoinDemo={(course) => onOpenDemoModal(course)} />
        <LearningFeatures />
        <Courses limit={6} showFilter={false} />
        <ProfessionalCertifications />
        <LearningJourney onOpenDemo={() => onOpenDemoModal()} />
        <ProjectShowcase onOpenDemo={() => onOpenDemoModal()} />
        <FreeResources />
        <FreeDemoSection onOpenModal={() => onOpenDemoModal()} />
        <Mentors onOpenDemo={(mentor) => onOpenDemoModal(mentor)} />
        <DashboardPreview onOpenDemo={() => onOpenDemoModal()} />
        <Testimonials />
        <CommunitySection />
        <AIMentor />
        <FAQ />
        <Newsletter />
      </main>
    </SEO>
  );
}
