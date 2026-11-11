import { useTheme } from "@/hooks/ThemeContext";
import { Page, Reveal, SectionHeading } from "./Page";

type ProjectType = "Web" | "AI" | "Graphic Design" | "Mobile" | "Embedded Systems" | "3D Modeling";

type Project = {
  title: string;
  description: string;
  type: ProjectType;
  tags: string[];
  image?: string;
  link?: string;
};

const projects: Project[] = [
  {
    title: "AIPI Web Application",
    description:
      "A web application for the AIPI project, a specialized application to store and manage models and data like OneDrive, do inference, track transaction records, and a lightweight CMS.",
    type: "Web",
    tags: ["Vue.js", "Node.js (Fastify)", "Typescript", "PostgreSQL", "Redis"],
    image: "/works/AIPI navigation.png",
  },
  {
    title: "3D Render of VEERS IOT",
    description: "A 3D visualization of a device used in the VEERS IOT capstone project.",
    type: "3D Modeling",
    tags: ["TinkerCAD"],
    image: "/works/VEERS-IOT 3D Render.png",
  },
  {
    title: "Logo Design",
    description: "A logo design project for Printing All-Star Enterprise.",
    type: "Graphic Design",
    tags: ["Photoshop"],
    image: "/works/PASE Logo.jpg",
  },
];

const MAX_DISPLAY = 6;
const tilts = ["lg:-rotate-[1.5deg]", "lg:rotate-1", "lg:-rotate-[0.75deg]"];

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function WorkSection() {
  const { isDark } = useTheme();

  return (
    <Page id="work">
      <Reveal>
        <SectionHeading note="things I've made" comment="// 04 — work" title="My Work">
          A selection of my recent work. Due to NDAs, many ASP.NET/C# projects can't be shared, and
          some only allow limited public UI previews.
        </SectionHeading>
      </Reveal>

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, MAX_DISPLAY).map((project, idx) => (
            <Reveal key={project.title} delay={idx * 0.1}>
              <article
                className={
                  "surface surface-hover group flex h-full flex-col " +
                  (isDark ? "overflow-hidden" : `p-3 pb-5 ${tilts[idx % tilts.length]}`)
                }
              >
                {isDark ? (
                  // window chrome
                  <div className="flex items-center gap-1.5 border-b border-brand/15 px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 truncate font-mono text-[0.7rem] text-soft">
                      ~/work/{slug(project.title)}
                    </span>
                  </div>
                ) : (
                  <span className="tape" aria-hidden="true" />
                )}

                <div
                  className={
                    "relative aspect-[16/10] overflow-hidden bg-white " +
                    (isDark
                      ? ""
                      : "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border border-ink/10")
                  }
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className={isDark ? "flex flex-1 flex-col p-5" : "flex flex-1 flex-col px-2 pt-4"}>
                  <p
                    className={
                      isDark
                        ? "font-mono text-[0.7rem] text-brand2"
                        : "font-hand text-xl leading-none text-brand"
                    }
                  >
                    {isDark ? `type: "${project.type}"` : project.type}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                    >
                      View project ↗
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-soft">Projects coming soon — check back later.</p>
      )}
    </Page>
  );
}
