import { useState } from "react";
import { cn } from "@/lib/utils";

type TabType = "experience" | "education" | "certification";

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
  },
];

// --- Reusable Card Component ---
const InfoCard = ({
  title,
  subtitle,
  period,
  description,
  tags,
  tagColor,
}: {
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  tags: string[];
  tagColor: string;
}) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-orange-600 font-medium">{subtitle}</p>
      </div>
      <span className="text-gray-500 text-sm">{period}</span>
    </div>
    {description && <p className="text-gray-600 mb-4 whitespace-pre-line">{description}</p>}
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className={cn(
            "px-3 py-1 text-sm rounded-full",
            tagColor === "blue" && "bg-blue-100 text-blue-800",
            tagColor === "green" && "bg-green-100 text-green-800",
            tagColor === "purple" && "bg-purple-100 text-purple-800",
            tagColor === "orange" && "bg-orange-100 text-orange-800",
            tagColor === "indigo" && "bg-indigo-100 text-indigo-800"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// --- Main Component ---
export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<TabType>("experience");

  const tabs = [
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "certification", label: "License/Certification" },
  ] as const;

  return (
    <section id="about" className="px-6 py-16 md:px-12 lg:px-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-5xl font-bold text-gray-900 mb-4" style={{ color: "#2C4848" }}>About Me</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'm a passionate tech enthusiast skilled in web/software development, graphic design, electronics engineering, and embedded systems with Raspberry Pi and Arduino. I'm currently diving into Machine Learning and AI to grow my future skill set.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-coral-500 text-coral-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] space-y-8">
          {activeTab === "experience" &&
            experienceData.map((item, idx) => (
              <InfoCard
                key={idx}
                title={item.title}
                subtitle={item.company}
                period={item.period}
                description={item.description}
                tags={item.tags}
                tagColor={item.tagColor}
              />
            ))}
          {activeTab === "education" &&
            educationData.map((item, idx) => (
              <InfoCard
                key={idx}
                title={item.title}
                subtitle={item.school}
                period={item.period}
                description={item.description}
                tags={item.tags}
                tagColor={item.tagColor}
              />
            ))}
          {activeTab === "certification" &&
            certificationData.map((item, idx) => (
              <InfoCard
                key={idx}
                title={item.title}
                subtitle={item.issuer}
                period={item.period}
                tags={item.tags}
                tagColor={item.tagColor}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
