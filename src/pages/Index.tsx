import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";

const AboutSection = lazy(() => import("@/components/AboutSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const WorkSection = lazy(() => import("@/components/WorkSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <Suspense fallback={null}>
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </Suspense>
    </Layout>
  );
}

