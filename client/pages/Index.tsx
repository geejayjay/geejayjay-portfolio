import Layout from "@/components/Layout";
import  HeroSection  from "@/components/HeroSection";
import AboutSection  from "@/components/AboutSection";
import WorkSection  from "@/components/WorkSection";
import ContactSection  from "@/components/ContactSection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ContactSection /> 
    </Layout>
  );
}
