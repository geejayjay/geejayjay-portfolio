import Layout from "@/components/Layout";
import HeroSection  from "@/components/HeroSection";
import AboutSection  from "@/components/AboutSection";
import SkillsSection  from "@/components/SkillsSection";
import WorkSection  from "@/components/WorkSection";
import ContactSection  from "@/components/ContactSection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorkSection />
      <ContactSection /> 
    </Layout>
  );
}
