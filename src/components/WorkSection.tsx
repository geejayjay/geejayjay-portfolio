import { cn } from "@/lib/utils";

type ProjectType = "Web" | "AI" | "Graphic Design" | "Mobile" | "Embedded Systems" | "3D Modeling" 

type Project = {
  title: string;
  description: string;
  type: ProjectType; 
  tags: { label: string; color: string }[];
  image?: string; 
  link?: string;
};

const projects: Project[] = [
   {
    title: "AIPI Web Application",
    description: "A web application for the AIPI project, a specialized application to store and manage models and data like OneDrive, do inference, track transaction records, and a lightweight CMS.",
    type: "Web",
    tags: [
      { label: "Vue.js", color: "green" },
      { label: "Node.js (Fastify)", color: "green" },
      { label: "Typescript", color: "purple" },
      { label: "PostgreSQL", color: "blue" },
      { label: "Redis", color: "orange" },
    ],
    image: "/works/AIPI navigation.png",
  },
  {
    title: "3D Render of VEERS IOT",
    description: "A 3D visualization of a device used in the VEERS IOT capstone project.",
    type: "3D Modeling",
    tags: [
      { label: "TinkerCAD", color: "blue" },
    ],
    image: "/works/VEERS-IOT 3D Render.png",
  },
  {
    title: "Logo Design",
    description: "A logo design project for Printing All-Star Enterprise.",
    type: "Graphic Design",
    tags: [
      { label: "Photoshop", color: "blue" },
    ],
    image: "/works/PASE Logo.jpg",
    // link: "#",
  }
 
];


const MAX_DISPLAY = 6; // number of projects to show before "See All"

export default function WorkSection() {
  const hasProjects = projects.length > 0;
  const displayedProjects = projects.slice(0, MAX_DISPLAY);

  return (
   <section id="work" className="px-6 py-16 md:px-12 lg:px-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#2C4848" }}>
              My Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A selection of my recent work showcasing my skills. Due to NDAs, many ASP.NET/C# projects can't be shared, and some only allow limited public UI previews.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, MAX_DISPLAY).map((project, idx) => (
                <div
                  key={project.title + idx}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-coral-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sketchy-card"
                >
                  {/* Image Container with automatic square sizing */}
                  <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Project type badge */}
                    <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                      {project.type}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-teal-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm mb-3 opacity-90">{project.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={cn(
                              "px-2 py-1 text-xs rounded-full font-medium",
                              tag.color === "blue" && "bg-blue-100 text-blue-800",
                              tag.color === "emerald" && "bg-emerald-100 text-emerald-800",
                              tag.color === "purple" && "bg-purple-100 text-purple-800",
                              tag.color === "red" && "bg-red-100 text-red-800",
                              tag.color === "yellow" && "bg-yellow-100 text-yellow-800",
                              tag.color === "green" && "bg-green-100 text-green-800"
                            )}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-white font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project info - always visible */}
                  {/* <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-teal-500 group-hover:text-coral-500 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl text-gray-300 mb-4">🚧</div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">Projects Coming Soon</h3>
              <p className="text-gray-500">Check back later for my latest work!</p>
            </div>
          )}

          {projects.length > MAX_DISPLAY && (
            <div className="text-center mt-8">
              <button className="bg-coral-500 hover:bg-coral-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                View All Projects →
              </button>
            </div>
          )}
        </div>
      </section>
  );
}
