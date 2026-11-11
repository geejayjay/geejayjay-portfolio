import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/hooks/ThemeContext";
import { Page, Reveal, SectionHeading } from "./Page";

type TabType = "experience" | "education" | "certification";

type InfoCardProps = {
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  tags: string[];
  url?: string;
};

// --- Data Arrays ---
const experienceData = [
  {
    title: "Project Technical Assistant VI",
    company: "DOST-ASTI | ALAM-LSI Project",
    period: "June 2024 - June 2025",
    description: `Built a scalable web app using Vue.js and Node.js (Fastify) for managing inference files and images. Improved UX with responsive design and real-time updates via SSE. Added SSO, email notifications, and a simple CMS. 
Optimized backend with Redis caching, DB indexing, batch processing, and secure session-based auth. Collaborated with researchers for feature planning and documentation.`,
    tags: [
      "Typescript",
      "Vue.js",
      "Node.js",
      "Fastify",
      "Redis",
      "PostgreSQL",
      "PM2",
    ],
    tagColor: "blue",
  },
  {
    title: "Software Developer",
    company: "Lane Systems, Inc.",
    period: "Aug 2022 - June 2024",
    description: `Developed a C# ASP.NET Core asset management system with advanced reporting using Telerik. Maintained and improved systems across multiple industries. Enhanced SQL Server performance and contributed to sprint planning.`,
    tags: [
      "C#",
      "VB",
      "ASP.NET",
      "Telerik Reports",
      "SQL Server",
    ],
    tagColor: "green",
  },
];


const educationData = [
  {
    title: "Bachelor of Science in Electronics Engineering",
    school: "University of Southeastern Philippines",
    period: "2015 - 2020",
    description:
      "Studied electronics engineering with a focus on core engineering principles, electronics, and communications. Participated in academic projects and activities.",
    tags: [],
    tagColor: "purple",
  },
];

const certificationData = [
  {
    title: "Electronics Engineer (Board Exam Passer)",
    issuer: "Professional Regulation Commission",
    period: "May 2022",
    tags: ["Board Exam", "Licensure"],
    tagColor: "orange",
  },
  {
    title: "Electronics Technician (Board Exam Passer)",
    issuer: "Professional Regulation Commission",
    period: "May 2022",
    tags: ["Board Exam", "Licensure"],
    tagColor: "orange",
  },
  {
    title: "Professional Certificate in Computer Science for Web Programming",
    issuer: "HarvardX",
    period: "July 2023",
    tags: ["Django", "SQLite", "Python", "Javascript", "C"],
    tagColor: "blue",
    url: "https://credentials.edx.org/credentials/aed040010add44679bb3371bbee2a2cb",
  },
  {
    title: "An Introduction to Programming the Internet of Things",
    issuer: "Coursera",
    period: "July 2022",
    tags: ["Arduino", "Raspberry Pi", "C", "Embedded Systems", "IoT"],
    tagColor: "blue",
    url: "https://coursera.org/share/9ac15aff4d6af23da2e99dd68bba3a27",
  },
];

// --- Reusable Card Component ---
const InfoCard = ({ title, subtitle, period, description, tags, url }: InfoCardProps) => (
  <article className="surface p-6">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div>
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="font-medium text-brand">{subtitle}</p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
        <span className="whitespace-nowrap text-sm text-soft">{period}</span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand3 hover:underline"
          >
            Show credential
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </div>

    {description && (
      <p className="mt-4 whitespace-pre-line leading-relaxed text-soft">{description}</p>
    )}

    {tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
    )}
  </article>
);

const tabs: { id: TabType; label: string; file: string }[] = [
  { id: "experience", label: "Experience", file: "experience.ts" },
  { id: "education", label: "Education", file: "education.md" },
  { id: "certification", label: "Licenses & Certs", file: "licenses.json" },
];

// --- Main Component ---
export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<TabType>("experience");
  const { isDark } = useTheme();

  const cards: InfoCardProps[] =
    activeTab === "experience"
      ? experienceData.map((d) => ({ ...d, subtitle: d.company }))
      : activeTab === "education"
        ? educationData.map((d) => ({ ...d, subtitle: d.school }))
        : certificationData.map((d) => ({ ...d, subtitle: d.issuer }));

  return (
    <Page id="about">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading note="a little about me" comment="// 02 — about" title="About Me">
            I'm a passionate tech enthusiast skilled in web/software development, graphic design,
            electronics engineering, and embedded systems with Raspberry Pi and Arduino. I'm
            currently diving into Machine Learning and AI to grow my future skill set.
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.12}>
          {/* Tabs */}
          <div
            role="tablist"
            className={cn(
              "mb-6 flex flex-wrap",
              isDark ? "gap-1 border-b border-brand/20" : "gap-x-7 gap-y-2",
            )}
          >
            {tabs.map((tab) => {
              const on = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative transition-colors",
                    isDark
                      ? cn(
                          "rounded-t-md border border-b-0 px-4 py-2 font-mono text-xs",
                          on
                            ? "border-brand/30 bg-brand/10 text-brand"
                            : "border-transparent text-soft hover:text-ink",
                        )
                      : cn(
                          "pb-2 font-hand text-2xl",
                          on ? "text-brand" : "text-soft hover:text-ink",
                        ),
                  )}
                >
                  {isDark ? tab.file : tab.label}
                  {!isDark && on && (
                    <span className="absolute inset-x-0 bottom-0 h-[5px] -rotate-1 rounded-full bg-brand2/70" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div key={activeTab} role="tabpanel" className="rise-in space-y-5 lg:min-h-[26rem]">
            {cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </Reveal>
      </div>
    </Page>
  );
}
