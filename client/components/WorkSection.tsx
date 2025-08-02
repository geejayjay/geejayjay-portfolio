import { useState } from "react";

type Project = {
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  gradient: string;
  icon: JSX.Element;
  link?: string;
};

let projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL.",
    tags: [
      { label: "React", color: "blue" },
      { label: "Node.js", color: "green" },
      { label: "PostgreSQL", color: "purple" },
    ],
    gradient: "from-blue-500 to-purple-600",
    icon: (
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    link: "#",
  },
  {
    title: "Task Management App",
    description: "A collaborative task management tool with real-time updates and team features.",
    tags: [
      { label: "React", color: "blue" },
      { label: "Socket.io", color: "yellow" },
      { label: "MongoDB", color: "red" },
    ],
    gradient: "from-green-500 to-teal-600",
    icon: (
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    link: "#",
  },
  {
    title: "Analytics Dashboard",
    description: "A comprehensive analytics dashboard with interactive charts and real-time data.",
    tags: [
      { label: "Vue.js", color: "blue" },
      { label: "D3.js", color: "green" },
      { label: "Python", color: "purple" },
    ],
    gradient: "from-orange-500 to-red-600",
    icon: (
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    link: "#",
  },
  // Add more projects here as needed
];

projects = [];

export default function WorkSection() {
  const hasProjects = projects.length > 0;

  return (
    <section id="work" className="px-6 py-16 md:px-12 lg:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ color: "#2C4848" }}>
            My Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A showcase of my latest projects and professional work, demonstrating my skills in modern web development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hasProjects ? (
            projects.map((project, idx) => (
              <div
                key={project.title + idx}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`aspect-video bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                  <div className="text-white text-center">
                    {project.icon}
                    <p className="text-sm">{project.title}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`px-2 py-1 bg-${tag.color}-100 text-${tag.color}-800 text-xs rounded`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                    View Project →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 text-2xl text-gray-400 italic">
              To do: Add projects here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
