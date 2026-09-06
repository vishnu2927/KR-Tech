import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import UpcomingBatches from "../components/UpcomingBatches";
import Services from "../components/Services";
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

export default function Home({ onOpenDemoModal }: { onOpenDemoModal: (courseOrMentor?: string) => void }) {
  return (
    <main>
      <Hero onOpenDemoModal={() => onOpenDemoModal()} />
      <StatsBar />
      <UpcomingBatches onOpenDemo={(course) => onOpenDemoModal(course)} />
      <Services />
      <Courses limit={4} showFilter={false} />
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
  );
}
