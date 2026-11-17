import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/hooks/ThemeContext";
import { NDA_NOTE, works } from "@/data/works";
import { cn } from "@/lib/utils";
import FeaturedGalleryStage from "./FeaturedGalleryStage";
import { Page, Reveal, SectionHeading } from "./Page";

export default function WorkSection() {
  const { isDark } = useTheme();
  const featured = works.find((w) => w.featured) ?? works[0];
  const others = works.filter((w) => w.slug !== featured.slug).slice(0, 2);
  const tilts = ["lg:-rotate-[1deg]", "lg:rotate-[1deg]"];

  return (
    <Page id="work">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading note="things I've made" comment="// 04 — work" title="My Work">
            A curated look at public platforms, prototypes, and design work I&apos;ve built.
          </SectionHeading>

          <Link to="/works" className="btn btn-ghost shrink-0 self-start md:self-auto">
            {isDark ? "cd ./works" : "Explore all works"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      {/* Featured Case Study */}
      <Reveal delay={0.08} className="mt-10">
        <article
          className={cn(
            "surface surface-hover group relative overflow-hidden",
            !isDark && "p-4 sm:p-6",
          )}
        >
          {isDark ? (
            <div className="flex items-center justify-between border-b border-brand/15 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-[0.72rem] text-soft">
                  ~/work/{featured.slug}
                </span>
              </div>
              <span className="font-mono text-[0.68rem] text-brand2">
                status: &quot;{featured.status}&quot;
              </span>
            </div>
          ) : (
            <span className="tape" aria-hidden="true" />
          )}

          <div
            className={cn(
              "grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]",
              isDark ? "p-5 sm:p-8" : "pt-2",
            )}
          >
            {/* Interactive Hybrid Gallery Stage */}
            <Link
              to={`/works/${featured.slug}`}
              className={cn(
                "block overflow-hidden",
                isDark
                  ? "rounded-lg border border-brand/20"
                  : "rounded-[16px_22px_18px_20px/20px_16px_22px_18px] border border-ink/15",
              )}
            >
              <FeaturedGalleryStage />
            </Link>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    isDark
                      ? "font-mono text-xs text-brand2"
                      : "font-hand text-2xl leading-none text-brand"
                  }
                >
                  {isDark ? `type: "${featured.type}"` : featured.type}
                </span>
                <span className="text-soft">·</span>
                <span className={isDark ? "font-mono text-xs text-soft" : "text-sm text-soft"}>
                  {featured.year}
                </span>
                {featured.organization && (
                  <>
                    <span className="text-soft">·</span>
                    <span className={isDark ? "font-mono text-xs text-soft" : "text-sm text-soft"}>
                      {featured.organization}
                    </span>
                  </>
                )}
              </div>

              <Link to={`/works/${featured.slug}`} className="mt-2 inline-block">
                <h3 className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-brand sm:text-3xl">
                  {featured.title}
                </h3>
              </Link>

              <p className="mt-3 leading-relaxed text-soft">{featured.description}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {featured.tags.slice(0, 7).map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
                {featured.tags.length > 7 && (
                  <span className="chip">+{featured.tags.length - 7} more</span>
                )}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to={`/works/${featured.slug}`} className="btn btn-primary">
                  {isDark ? "open ./project" : "View Project"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {featured.liveUrl && (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    {isDark ? "live_site" : "Live Site"}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      </Reveal>

      {/* Other Works Grid */}
      {others.length > 0 && (
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {others.map((project, idx) => (
            <Reveal key={project.slug} delay={0.14 + idx * 0.08}>
              <Link
                to={`/works/${project.slug}`}
                className={cn(
                  "surface surface-hover group flex h-full flex-col",
                  isDark ? "overflow-hidden" : `p-3 pb-5 ${tilts[idx % tilts.length]}`,
                )}
              >
                {isDark ? (
                  <div className="flex items-center gap-1.5 border-b border-brand/15 px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 truncate font-mono text-[0.7rem] text-soft">
                      ~/work/{project.slug}
                    </span>
                  </div>
                ) : (
                  <span className="tape" aria-hidden="true" />
                )}

                <div
                  className={cn(
                    "relative aspect-[16/10] overflow-hidden bg-white",
                    !isDark &&
                      "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border border-ink/10",
                  )}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className={isDark ? "flex flex-1 flex-col p-5" : "flex flex-1 flex-col px-2 pt-4"}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={
                        isDark
                          ? "font-mono text-[0.7rem] text-brand2"
                          : "font-hand text-xl leading-none text-brand"
                      }
                    >
                      {isDark ? `type: "${project.type}"` : project.type}
                    </p>
                    <span className={isDark ? "font-mono text-[0.7rem] text-soft" : "text-xs text-soft"}>
                      {project.year}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink transition-colors group-hover:text-brand">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {/* Subtle NDA footnote */}
      <p
        className={cn(
          "mt-8 text-xs leading-relaxed text-soft/80",
          isDark && "font-mono",
        )}
      >
        {isDark ? NDA_NOTE.builder : NDA_NOTE.painter}
      </p>
    </Page>
  );
}
