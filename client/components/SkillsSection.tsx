import React from "react";

type SkillType = "programming" | "frontend" | "backend" | "database" | "tools";

interface Skill {
  logo: string;
  label: string;
  type: SkillType;
}

const skills: Skill[] = [
  // Programming Languages
  { logo: "/skills/c-original.svg", label: "C", type: "programming" },
  { logo: "/skills/cplusplus-original.svg", label: "C++", type: "programming" },
  { logo: "/skills/c-sharp.svg", label: "C#", type: "programming" },
  { logo: "/skills/python.svg", label: "Python", type: "programming" },
  { logo: "/skills/typescript.svg", label: "TypeScript", type: "programming" },
  { logo: "/skills/javascript.svg", label: "JavaScript", type: "programming" },
  { logo: "/skills/visualbasic.svg", label: "VB.NET", type: "programming" },

  // Frontend Frameworks
  { logo: "/skills/html5.svg", label: "HTML5", type: "frontend" },
  { logo: "/skills/css3.svg", label: "CSS3", type: "frontend" },
  { logo: "/skills/vuejs.svg", label: "Vue.js", type: "frontend" },
  { logo: "/skills/reactjs.svg", label: "React", type: "frontend" },
  { logo: "/skills/tailwindcss.svg", label: "Tailwind CSS", type: "frontend" },
  { logo: "/skills/bootstrap5.svg", label: "Bootstrap", type: "frontend" },

  // Backend Frameworks
  { logo: "/skills/nodejs.svg", label: "Node.js", type: "backend" },
  { logo: "/skills/fastify-original.svg", label: "Fastify", type: "backend" },
  { logo: "/skills/expressjs-dark.svg", label: "Express", type: "backend" },
  { logo: "/skills/dot-net-original.svg", label: "ASP.NET Core", type: "backend" },
  { logo: "/skills/flask-dark.svg", label: "Flask", type: "backend" },
//   { logo: "/skills/django.svg", label: "Django", type: "backend" },

  // Databases
  { logo: "/skills/postgresql.svg", label: "PostgreSQL", type: "database" },
  { logo: "/skills/microsoft-sql-server-2.svg", label: "SQL Server", type: "database" },
  { logo: "/skills/redis.svg", label: "Redis", type: "database" },
  { logo: "/skills/sqlite-original.svg", label: "SQLite", type: "database" },

  // Tools
  { logo: "/skills/vscode.svg", label: "Visual Studio Code", type: "tools" },
  { logo: "/skills/git.svg", label: "Git", type: "tools" },
  { logo: "/skills/figma.svg", label: "Figma", type: "tools" },
  { logo: "/skills/photoshop.svg", label: "Photoshop", type: "tools" },
  { logo: "/skills/postman.svg", label: "Postman", type: "tools" },
  { logo: "/skills/docker.svg", label: "Docker", type: "tools" },
  { logo: "/skills/cloudflare.svg", label: "Cloudflare", type: "tools" },
  { logo: "/skills/nginx-original.svg", label: "Nginx", type: "tools" },
];


export default function SkillsSection() {
  return (
    <section id="skills" className="px-6 py-12 md:px-12 lg:px-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Skills & Technologies
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Technologies I work with to bring ideas to life
          </p>
        </div>

        <div className="space-y-8">
          {['programming', 'frontend', 'backend', 'database', 'tools'].map((category) => {
            const categorySkills = skills.filter(skill => skill.type === category);
            const categoryTitles: Record<SkillType, string> = {
              'programming': 'Languages',
              'frontend': 'Frontend',
              'backend': 'Backend',
              'database': 'Databases',
              'tools': 'Tools',
            };

            return (
              <div key={category} className="bg-gray-50 rounded-2xl p-6 sketchy-card">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-coral-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-teal-500">
                    {categoryTitles[category]}
                  </h3>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 md:gap-3 justify-items-center">
                  {categorySkills.map((skill, index) => (
                    <div
                      key={index}
                      className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg border border-gray-200 hover:border-coral-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                    >
                      <img
                        src={skill.logo}
                        alt={skill.label}
                        className="w-6 h-6 md:w-7 md:h-7 object-contain transition-transform duration-200 group-hover:scale-110"
                      />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {skill.label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-teal-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills Summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500 flex-wrap justify-center">
            {(['programming', 'frontend', 'backend', 'database', 'tools'] as SkillType[]).map(type => (
              <div key={type} className="flex items-center">
                <div className={`w-2 h-2 ${type === 'programming' ? 'bg-coral-500' :
                  type === 'frontend' ? 'bg-blue-500' :
                  type === 'backend' ? 'bg-indigo-500' :
                  type === 'database' ? 'bg-teal-500' : 'bg-gray-500'} rounded-full mr-2`}></div>
                <span>{skills.filter(s => s.type === type).length} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
