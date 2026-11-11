import { useTheme } from "@/hooks/ThemeContext";
import { Page, Reveal, SectionHeading } from "./Page";

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
  { logo: "/skills/nuxt.svg", label: "Nuxt", type: "frontend" },
  { logo: "/skills/nextjs-dark.svg", label: "Next.js", type: "frontend" },
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
  { logo: "/skills/mysql.svg", label: "MySQL", type: "database" },
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
  { logo: "/skills/aws-dark.svg", label: "AWS", type: "tools" },
  { logo: "/skills/cloudflare.svg", label: "Cloudflare", type: "tools" },
  { logo: "/skills/nginx-original.svg", label: "Nginx", type: "tools" },
];

const categories: { type: SkillType; title: string; file: string }[] = [
  { type: "programming", title: "Languages", file: "languages" },
  { type: "frontend", title: "Frontend", file: "frontend" },
  { type: "backend", title: "Backend", file: "backend" },
  { type: "database", title: "Databases", file: "databases" },
  { type: "tools", title: "Tools", file: "tools" },
];

export default function SkillsSection() {
  const { isDark } = useTheme();

  return (
    <Page id="skills">
      <Reveal>
        <SectionHeading note="my palette" comment="// 03 — stack" title="Skills & Tools">
          {isDark
            ? "The stack I reach for to turn requirements into running software."
            : "The colours I mix to bring ideas to life."}
        </SectionHeading>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {categories.map((cat, i) => {
          const items = skills.filter((s) => s.type === cat.type);
          return (
            <Reveal
              key={cat.type}
              delay={i * 0.07}
              className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}
            >
              <div className="surface h-full p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3
                    className={
                      isDark
                        ? "font-mono text-sm text-brand"
                        : "font-display text-xl font-semibold text-ink"
                    }
                  >
                    {isDark ? `./${cat.file}` : cat.title}
                  </h3>
                  <span
                    className={
                      isDark ? "font-mono text-xs text-soft" : "font-hand text-xl text-brand"
                    }
                  >
                    {isDark ? `[${items.length}]` : `×${items.length}`}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {items.map((skill) => (
                    <SkillItem key={skill.label} skill={skill} isDark={isDark} />
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Page>
  );
}

function SkillItem({ skill, isDark }: { skill: Skill; isDark: boolean }) {
  // monochrome logos ship in two variants: "-dark" (black ink) and "-light" (white ink)
  const logo = isDark ? skill.logo.replace("-dark.svg", "-light.svg") : skill.logo;
  return (
    <li
      className={
        "flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 " +
        (isDark
          ? "rounded border border-brand/15 bg-paper/60 font-mono text-xs text-soft hover:border-brand/60 hover:text-ink"
          : "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border-[1.5px] border-ink/10 bg-white/80 text-sm text-ink hover:-rotate-2 hover:border-brand/60")
      }
    >
      <img src={logo} alt="" className="h-5 w-5 object-contain" loading="lazy" />
      {skill.label}
    </li>
  );
}
