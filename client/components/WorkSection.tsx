import { useState } from "react";

type Project = {
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  image?: string; // new field
  link?: string;
};

const projects: Project[] = [
   {
    title: "AIPI Web Application",
    description: "A web application for the AIPI project, a specialized application to store and manage models and data like OneDrive, do inference, track transaction records, and a lightweight CMS.",
    tags: [
      { label: "Vue.js", color: "green" },
      { label: "Node.js (Fastify)", color: "green" },
      { label: "Typescript", color: "purple" },
      { label: "PostgreSQL", color: "blue" },
      { label: "Redis", color: "orange" },
    ],
    image: "/works/AIPI navigation.jpg",
  },
  {
    title: "3D Render of VEERS IOT",
    description: "A 3D visualization of a device used in the VEERS IOT capstone project.",
    tags: [
      { label: "TinkerCAD", color: "blue" },
    ],
    image: "/works/VEERS-IOT 3D Render.png",
  },
  {
    title: "Logo Design",
    description: "A logo design project for Printing All-Star Enterprise.",
    tags: [
      { label: "Photoshop", color: "blue" },
    ],
    image: "/works/PASE Logo.jpg",
    // link: "#",
  }
 
];


export default function WorkSection() {
  const hasProjects = projects.length > 0;

  return (
    <section id="work" className="px-6 py-16 md:px-12 lg:px-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ color: "#2C4848" }}>
            My Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A showcase of my latest projects and professional work, demonstrating my skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hasProjects ? (
            projects.map((project, idx) => (
              <div
                key={project.title + idx}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
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
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        View Project →
                      </button>
                    </a>
                  )}
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
