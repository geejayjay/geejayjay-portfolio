import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Expand,
  X,
} from "lucide-react";
import InteractiveShowcase from "@/components/InteractiveShowcase";
import Layout from "@/components/Layout";
import { BrushStroke, Reveal } from "@/components/Page";
import { DetailScreenshot, getWorkBySlug, isVideoAsset, works } from "@/data/works";
import { useTheme } from "@/hooks/ThemeContext";
import { cn } from "@/lib/utils";

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();
  const project = slug ? getWorkBySlug(slug) : undefined;

  const [lightbox, setLightbox] = useState<DetailScreenshot | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setLightbox(null);
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (!project) {
    return (
      <Layout>
        <section className="flex min-h-[100svh] items-center justify-center px-6 py-24">
          <div className="surface max-w-md p-8 text-center">
            <h1 className="font-display text-3xl font-semibold text-ink">Work not found</h1>
            <p className="mt-3 text-sm text-soft">
              That project doesn&apos;t exist or may have been moved.
            </p>
            <Link to="/works" className="btn btn-primary mt-6">
              <ArrowLeft className="h-4 w-4" />
              Back to all works
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const currentIdx = works.findIndex((w) => w.slug === project.slug);
  const prevWork = works[(currentIdx - 1 + works.length) % works.length];
  const nextWork = works[(currentIdx + 1) % works.length];

  const views = project.showcaseViews ?? [];

  return (
    <Layout>
      <article className="relative min-h-[100svh] px-6 pb-24 pt-28 sm:px-10 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-6xl">
          {/* Breadcrumb */}
          <Reveal>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/works"
                className={cn(
                  "inline-flex items-center gap-2 text-soft transition-colors hover:text-brand",
                  isDark ? "font-mono text-xs" : "font-hand text-2xl",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                {isDark ? "cd ../works" : "All Works"}
              </Link>

              <span
                className={cn(
                  "px-3 py-1 text-xs font-medium",
                  isDark
                    ? "rounded border border-brand2/30 bg-brand2/10 font-mono text-brand2"
                    : "rounded-full bg-brand2/25 text-ink",
                )}
              >
                {isDark ? `status: "${project.status}"` : project.status}
              </span>
            </div>

            {/* Header */}
            <p className="eyebrow">
              {isDark
                ? `// ${project.year} · ${project.type.toLowerCase()}`
                : `${project.type} — ${project.year}`}
            </p>

            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              <span className="relative inline-block">
                {project.title}
                {isDark ? (
                  <span className="caret">_</span>
                ) : (
                  <BrushStroke className="absolute -bottom-3 left-0 h-4 w-full text-brand" />
                )}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-soft">{project.tagline}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  {isDark ? "open live_site" : "Visit Live Site"}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <Link to="/works" className="btn btn-ghost">
                {isDark ? "ls ./works" : "Browse All Works"}
              </Link>
            </div>

            {/* Metadata strip */}
            <div className="surface mt-10 grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className={isDark ? "font-mono text-xs text-brand2" : "font-hand text-xl text-brand"}>
                  {isDark ? "role:" : "Role"}
                </p>
                <p className="mt-0.5 font-medium text-ink">{project.role}</p>
              </div>
              {project.organization && (
                <div>
                  <p className={isDark ? "font-mono text-xs text-brand2" : "font-hand text-xl text-brand"}>
                    {isDark ? "org:" : "Organization"}
                  </p>
                  <p className="mt-0.5 font-medium text-ink">{project.organization}</p>
                </div>
              )}
              <div>
                <p className={isDark ? "font-mono text-xs text-brand2" : "font-hand text-xl text-brand"}>
                  {isDark ? "year:" : "Year"}
                </p>
                <p className="mt-0.5 font-medium text-ink">{project.year}</p>
              </div>
              <div>
                <p className={isDark ? "font-mono text-xs text-brand2" : "font-hand text-xl text-brand"}>
                  {isDark ? "categories:" : "Focus"}
                </p>
                <p className="mt-0.5 font-medium text-ink">{project.categories.join(" · ")}</p>
              </div>
            </div>
          </Reveal>

          {/* Interactive Device Showcase (Experience East ASEAN) or Single Artwork Frame */}
          <Reveal delay={0.08} className="mt-12">
            {views.length > 0 ? (
              <InteractiveShowcase
                title={project.title}
                views={views}
                liveUrl={project.liveUrl}
              />
            ) : (
              <div className={cn("surface overflow-hidden p-4 sm:p-6", !isDark && "relative")}>
                {!isDark && <span className="tape" aria-hidden="true" />}
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-white">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </Reveal>

          {/* Overview & Highlights */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal className="space-y-8">
              <div className="surface p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {isDark ? "// overview" : "Overview"}
                </h2>
                <p className="mt-4 leading-relaxed text-soft">{project.overview}</p>
              </div>

              {project.challenges && project.challenges.length > 0 && (
                <div className="surface p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {isDark ? "// the_challenge" : "The Challenge"}
                  </h2>
                  <ul className="mt-4 space-y-3 text-soft">
                    {project.challenges.map((c) => (
                      <li key={c} className="flex items-start gap-3 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.solutions && project.solutions.length > 0 && (
                <div className="surface p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {isDark ? "// the_solution" : "The Solution"}
                  </h2>
                  <ul className="mt-4 space-y-3 text-soft">
                    {project.solutions.map((s) => (
                      <li key={s} className="flex items-start gap-3 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand2" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1} className="space-y-8">
              {project.highlights && project.highlights.length > 0 && (
                <div className="surface p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {isDark ? "// highlights" : "Key Highlights"}
                  </h2>
                  <ul className="mt-4 space-y-3.5">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm leading-relaxed text-soft">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="surface p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {isDark ? "// tech_stack" : "Tech & Tools"}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* 3-Tier Architecture (when present) */}
          {project.architecture && project.architecture.length > 0 && (
            <Reveal className="mt-14">
              <h2 className="font-display text-3xl font-semibold text-ink">
                {isDark ? "// system_architecture" : "System Architecture"}
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {project.architecture.map((tier) => (
                  <div key={tier.name} className="surface flex flex-col p-6">
                    <span
                      className={
                        isDark
                          ? "font-mono text-xs text-brand2"
                          : "font-hand text-2xl leading-none text-brand"
                      }
                    >
                      {tier.name}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                      {tier.role}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm text-brand",
                        isDark && "font-mono text-xs",
                      )}
                    >
                      {tier.framework}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-soft">
                      {tier.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-soft" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Feature & Detail Gallery */}
          {project.detailGallery && project.detailGallery.length > 0 && (
            <Reveal className="mt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-3xl font-semibold text-ink">
                  {isDark ? "// feature_screenshots" : "Feature & Detail Views"}
                </h2>
                <span className={isDark ? "font-mono text-xs text-soft" : "text-sm text-soft"}>
                  Click any screenshot to inspect
                </span>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {project.detailGallery.map((shot) => (
                  <button
                    key={shot.name}
                    type="button"
                    onClick={() => setLightbox(shot)}
                    className="surface surface-hover group flex flex-col overflow-hidden text-left"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950/5">
                      {isVideoAsset(shot.file, shot.mediaType) ? (
                        <video
                          ref={(el) => {
                            if (el) {
                              el.muted = true;
                              el.defaultMuted = true;
                              if (el.paused) el.play().catch(() => {});
                            }
                          }}
                          src={shot.file}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={shot.file}
                          alt={shot.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <Expand className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand">
                        {shot.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-soft">{shot.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Prev / Next Project Footer */}
          {works.length > 1 && (
            <Reveal className="mt-16 border-t border-border/60 pt-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  to={`/works/${prevWork.slug}`}
                  className="surface surface-hover group flex items-center gap-4 p-5"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-soft transition-transform group-hover:-translate-x-1 group-hover:text-brand" />
                  <div className="min-w-0">
                    <p className={isDark ? "font-mono text-xs text-soft" : "text-xs text-soft"}>
                      {isDark ? "prev_work" : "Previous"}
                    </p>
                    <p className="truncate font-display text-lg font-semibold text-ink group-hover:text-brand">
                      {prevWork.title}
                    </p>
                  </div>
                </Link>

                <Link
                  to={`/works/${nextWork.slug}`}
                  className="surface surface-hover group flex items-center justify-between gap-4 p-5 text-right sm:justify-end"
                >
                  <div className="min-w-0">
                    <p className={isDark ? "font-mono text-xs text-soft" : "text-xs text-soft"}>
                      {isDark ? "next_work" : "Next"}
                    </p>
                    <p className="truncate font-display text-lg font-semibold text-ink group-hover:text-brand">
                      {nextWork.title}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-soft transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="surface relative max-h-[90vh] w-full max-w-5xl overflow-hidden p-3 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{lightbox.title}</h3>
                <p className="text-xs text-soft">{lightbox.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close preview"
                className="rounded-full p-2 text-soft transition-colors hover:bg-brand/10 hover:text-brand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-lg bg-slate-950/10">
              {isVideoAsset(lightbox.file, lightbox.mediaType) ? (
                <video
                  src={lightbox.file}
                  poster={lightbox.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="mx-auto h-auto max-h-[75vh] w-full object-contain"
                />
              ) : (
                <img
                  src={lightbox.file}
                  alt={lightbox.title}
                  className="mx-auto h-auto w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
