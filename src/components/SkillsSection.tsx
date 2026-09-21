import React from "react";
import { useTheme } from "@/hooks/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="skills" className="px-6 py-12 md:px-12 lg:px-16 bg-white dark:bg-[hsl(220,18%,8%)] transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: isDark ? "#00D4FF" : "#2C4848" }}
          >
            Skills & Technologies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Technologies I work with to bring ideas to life
          </p>
        </div>

        {/* Categories in 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {(['programming', 'database', 'frontend', 'backend', 'tools'] as SkillType[]).map((category) => {
            const categorySkills = skills.filter(skill => skill.type === category);
            const categoryTitles: Record<SkillType, string> = {
              'programming': 'Languages',
              'frontend': 'Frontend',
              'backend': 'Backend',
              'database': 'Databases',
              'tools': 'Tools',
            };

            return (
              <div key={category} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 sketchy-card flex flex-col transition-colors duration-500">
                <div className="flex items-center mb-4">
                  <div className={`w-1 h-6 rounded-full mr-3 ${isDark ? "bg-cyan-400" : "bg-coral-500"}`}></div>
                  <h3 className="text-lg font-semibold text-teal-500 dark:text-cyan-400">
                    {categoryTitles[category]}
                  </h3>
                </div>

                <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-6 gap-2 md:gap-3 justify-items-center">
                  {categorySkills.map((skill, index) => (
                    <SkillItem key={index} skill={skill} isDark={isDark} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills Summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 flex-wrap justify-center">
            {(['programming', 'frontend', 'backend', 'database', 'tools'] as SkillType[]).map(type => (
              <div key={type} className="flex items-center">
                <div className={`w-2 h-2 ${
                  isDark
                    ? (type === 'programming' ? 'bg-cyan-400' :
                       type === 'frontend' ? 'bg-blue-400' :
                       type === 'backend' ? 'bg-purple-400' :
                       type === 'database' ? 'bg-emerald-400' : 'bg-gray-400')
                    : (type === 'programming' ? 'bg-coral-500' :
                       type === 'frontend' ? 'bg-blue-500' :
                       type === 'backend' ? 'bg-indigo-500' :
                       type === 'database' ? 'bg-teal-500' : 'bg-gray-500')
                } rounded-full mr-2`}></div>
                <span>{skills.filter(s => s.type === type).length} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Skill Item reused */
function SkillItem({ skill, isDark }: { skill: Skill; isDark: boolean }) {
  return (
    <div
      className={`group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:border-cyan-400 hover:shadow-cyan-500/20"
          : "bg-white border-gray-200 hover:border-coral-400"
      }`}
    >
      <img
        src={skill.logo}
        alt={skill.label}
        className="w-6 h-6 md:w-7 md:h-7 object-contain transition-transform duration-200 group-hover:scale-110"
      />
      <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg ${
        isDark ? "bg-cyan-600 text-white" : "bg-teal-500 text-white"
      }`}>
        {skill.label}
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent ${
          isDark ? "border-t-cyan-600" : "border-t-teal-500"
        }`}></div>
      </div>
    </div>
  );
}
