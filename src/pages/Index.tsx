import Layout from "@/components/Layout";
import HeroSection  from "@/components/HeroSection";
import AboutSection  from "@/components/AboutSection";
import SkillsSection  from "@/components/SkillsSection";
import WorkSection  from "@/components/WorkSection";
import ContactSection  from "@/components/ContactSection";
import { ThemeProvider } from "@/hooks/ThemeContext";

export default function Index() {
  return (
    <ThemeProvider>
      <Layout>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection /> 
      </Layout>
    </ThemeProvider>
  );
}

