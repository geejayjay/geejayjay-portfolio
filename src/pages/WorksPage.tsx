import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import FeaturedGalleryStage from "@/components/FeaturedGalleryStage";
import Layout from "@/components/Layout";
import { Reveal, SectionHeading } from "@/components/Page";
import { NDA_NOTE, works, WorkCategory } from "@/data/works";
import { useTheme } from "@/hooks/ThemeContext";
import { cn } from "@/lib/utils";

const ALL_CATEGORY = "All";

export default function WorksPage() {
  const { isDark } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORY);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(works.map((w) => w.type))) as WorkCategory[];
    return [ALL_CATEGORY, ...unique];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      const matchesCategory = category === ALL_CATEGORY || w.type === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        w.title,
        w.tagline,
        w.description,
        w.type,
        w.organization ?? "",
        w.year,
        ...w.categories,
        ...w.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  const tilts = ["lg:-rotate-[1deg]", "lg:rotate-[0.75deg]", "lg:-rotate-[0.6deg]"];

  return (
    <Layout>
      <section className="relative min-h-[100svh] px-6 pb-24 pt-28 sm:px-10 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back link */}
          <Reveal>
            <Link
              to="/"
              className={cn(
                "mb-8 inline-flex items-center gap-2 text-soft transition-colors hover:text-brand",
                isDark ? "font-mono text-xs" : "font-hand text-2xl",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              {isDark ? "cd .." : "Back to portfolio"}
            </Link>

            <SectionHeading note="the full archive" comment="// ls ./works" title="All Works">
              Selected public platforms, hardware prototypes, and design work — searchable by
              discipline, stack, or keyword.
            </SectionHeading>
          </Reveal>

          {/* Search & Filter Bar */}
          <Reveal delay={0.08} className="mt-10">
            <div className="surface p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search input */}
                <div className="relative flex-1 lg:max-w-md">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      isDark ? "grep -i 'nuxt, mapbox, 3d...'" : "Search works, tech stack, or tags…"
                    }
                    aria-label="Search works"
                    className="field pl-10 pr-9"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-soft hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => {
                    const active = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-3.5 py-1.5 text-sm font-medium transition-all",
                          isDark
                            ? cn(
                                "rounded border font-mono text-xs",
                                active
                                  ? "border-brand bg-brand/15 text-brand"
                                  : "border-brand/15 text-soft hover:border-brand/40 hover:text-ink",
                              )
                            : cn(
                                "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border-[1.5px]",
                                active
                                  ? "border-brand bg-brand text-white shadow-[2px_3px_0_rgb(var(--c-ink)/0.8)]"
                                  : "border-ink/15 bg-white/75 text-soft hover:border-brand/50 hover:text-ink",
                              ),
                        )}
                      >
                        {isDark && cat === ALL_CATEGORY ? "*" : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className={cn(
                  "mt-3 flex items-center justify-between text-xs text-soft",
                  isDark && "font-mono",
                )}
              >
                <span>
                  {isDark
                    ? `// showing ${filtered.length} of ${works.length} entries`
                    : `Showing ${filtered.length} of ${works.length} works`}
                </span>
                {(query || category !== ALL_CATEGORY) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory(ALL_CATEGORY);
                    }}
                    className="text-brand hover:underline"
                  >
                    {isDark ? "reset_filters()" : "Reset filters"}
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Results Grid */}
          {filtered.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, idx) => (
                <Reveal key={project.slug} delay={Math.min(idx * 0.06, 0.24)}>
                  <article
                    className={cn(
                      "surface surface-hover group flex h-full flex-col",
                      isDark ? "overflow-hidden" : `p-3 pb-5 ${tilts[idx % tilts.length]}`,
                    )}
                  >
                    {isDark ? (
                      <div className="flex items-center justify-between border-b border-brand/15 px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                          <span className="ml-2 truncate font-mono text-[0.7rem] text-soft">
                            ~/work/{project.slug}
                          </span>
                        </div>
                        <span className="font-mono text-[0.65rem] text-soft">{project.year}</span>
                      </div>
                    ) : (
                      <span className="tape" aria-hidden="true" />
                    )}

                    <Link
                      to={`/works/${project.slug}`}
                      className={cn(
                        "relative block overflow-hidden",
                        project.featured ? "" : "aspect-[16/10] bg-white",
                        !isDark &&
                          "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border border-ink/10",
                      )}
                    >
                      {project.featured ? (
                        <FeaturedGalleryStage compact />
                      ) : (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </Link>

                    <div
                      className={
                        isDark ? "flex flex-1 flex-col p-5" : "flex flex-1 flex-col px-2 pt-4"
                      }
                    >
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
                        {!isDark && <span className="text-xs text-soft">{project.year}</span>}
                      </div>

                      <Link to={`/works/${project.slug}`} className="mt-1 inline-block">
                        <h2 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-brand">
                          {project.title}
                        </h2>
                      </Link>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">
                        {project.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 5 && (
                          <span className="chip">+{project.tags.length - 5}</span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                        <Link
                          to={`/works/${project.slug}`}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline",
                            isDark && "font-mono text-xs",
                          )}
                        >
                          {isDark ? "inspect()" : "View details"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1 text-sm text-soft transition-colors hover:text-brand",
                              isDark && "font-mono text-xs",
                            )}
                          >
                            Live
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="surface mt-10 p-12 text-center">
              <p className="font-display text-xl font-semibold text-ink">No matching works found</p>
              <p className="mt-2 text-sm text-soft">
                Try clearing your search query or switching to a different discipline.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(ALL_CATEGORY);
                }}
                className="btn btn-primary mt-6"
              >
                {isDark ? "clear_filters()" : "Show all works"}
              </button>
            </div>
          )}

          {/* Subtle NDA footnote */}
          <p
            className={cn(
              "mt-10 text-xs leading-relaxed text-soft/80",
              isDark && "font-mono",
            )}
          >
            {isDark ? NDA_NOTE.builder : NDA_NOTE.painter}
          </p>
        </div>
      </section>
    </Layout>
  );
}
