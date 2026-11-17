import { useEffect, useRef, useState } from "react";
import { AV1_TYPE } from "@/data/works";
import { useTheme } from "@/hooks/ThemeContext";
import { cn } from "@/lib/utils";

type ReelScene = {
  label: string;
  url: string;
  type: "scroll" | "video";
  src: string;
  poster?: string;
  pinAdminChrome?: boolean;
  cursorWaypoints?: { x: number; y: number }[];
  /** smaller AV1 version of a video scene (see works.ts ShowcaseView.av1) */
  av1?: string;
  durationMs: number;
};

const SCENES: ReelScene[] = [
  {
    label: "Public Portal · Focus Areas",
    url: "experienceeastasean.com",
    type: "video",
    src: "/works/experience-east-asean/web/web-home-desktop.mp4",
    av1: "/works/experience-east-asean/web/web-home-desktop.av1.mp4",
    poster: "/works/experience-east-asean/web/web-home-desktop-poster.webp",
    durationMs: 13400,
  },
  {
    label: "Connectivity Map",
    url: "experienceeastasean.com/connectivity-map",
    type: "video",
    src: "/works/experience-east-asean/new/connectivity-map.mp4",
    av1: "/works/experience-east-asean/new/connectivity-map.av1.mp4",
    poster: "/works/experience-east-asean/new/connectivity-map-poster.webp",
    durationMs: 14400,
  },
  {
    label: "3D Flipbook Viewer",
    url: "experienceeastasean.com/resources",
    type: "video",
    src: "/works/experience-east-asean/new/flipbook-demo.mp4",
    av1: "/works/experience-east-asean/new/flipbook-demo.av1.mp4",
    poster: "/works/experience-east-asean/new/flipbook-demo-poster.webp",
    durationMs: 10400,
  },
  {
    label: "Admin CMS",
    url: "admin.experienceeastasean.com/dashboard",
    type: "scroll",
    pinAdminChrome: true,
    src: "/works/experience-east-asean/admin/admin-dashboard.webp",
    durationMs: 5500,
  },
];

interface FeaturedGalleryStageProps {
  className?: string;
  compact?: boolean;
}

export default function FeaturedGalleryStage({
  className,
  compact = false,
}: FeaturedGalleryStageProps) {
  const { isDark } = useTheme();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [videoCursorIdx, setVideoCursorIdx] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dScreenRef = useRef<HTMLDivElement>(null);
  const dScrollStageRef = useRef<HTMLDivElement>(null);
  const dImgRef = useRef<HTMLImageElement>(null);
  const dVideoRef = useRef<HTMLVideoElement>(null);
  const mScreenRef = useRef<HTMLDivElement>(null);
  const reelBarRef = useRef<HTMLDivElement>(null);

  const idxRef = useRef(0);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);

  const scene = SCENES[sceneIdx] ?? SCENES[0];

  // Defer loading media & running rAF until the stage is near/in the viewport
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setHasEntered(true);
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "350px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const s = SCENES[sceneIdx];
    if (!s) return;
    if (s.type === "video" && dVideoRef.current) {
      dVideoRef.current.muted = true;
      dVideoRef.current.defaultMuted = true;
      dVideoRef.current.currentTime = 0;
      if (!pausedRef.current) {
        dVideoRef.current.play().catch(() => {});
      }
    } else if (dScrollStageRef.current) {
      dScrollStageRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, [sceneIdx, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      dVideoRef.current?.pause();
      return;
    }
    let raf = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(50, ts - lastTs);
      lastTs = ts;

      if (!pausedRef.current) {
        const idx = idxRef.current;
        const s = SCENES[idx];
        elapsedRef.current += dt;
        const t = Math.min(1, elapsedRef.current / s.durationMs);

        if (s.type === "scroll" && dImgRef.current && dScreenRef.current && dScrollStageRef.current) {
          const scrollT = t;
          const dMax = Math.max(0, dImgRef.current.offsetHeight - dScreenRef.current.clientHeight);
          const dY = -Math.round(scrollT * dMax);
          dScrollStageRef.current.style.transform = `translate3d(0, ${dY}px, 0)`;
        } else {
          if (s.cursorWaypoints && s.cursorWaypoints.length > 0) {
            setVideoCursorIdx(
              Math.min(s.cursorWaypoints.length - 1, Math.floor(t * s.cursorWaypoints.length)),
            );
          }
        }

        // Synced continuous mobile scroll
        const globalT = (idx + t) / SCENES.length;

        if (reelBarRef.current) {
          reelBarRef.current.style.width = `${(globalT * 100).toFixed(1)}%`;
        }

        if (elapsedRef.current >= s.durationMs) {
          const nextIdx = (idx + 1) % SCENES.length;
          idxRef.current = nextIdx;
          elapsedRef.current = 0;
          setSceneIdx(nextIdx);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative overflow-hidden select-none",
        compact ? "h-[240px] px-4 pt-4" : "h-[310px] sm:h-[340px] px-5 pt-5",
        isDark
          ? "bg-[#080d18]"
          : "bg-gradient-to-br from-stone-100 via-amber-50/40 to-teal-50/50",
        className,
      )}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at 20% 10%, rgba(0, 212, 255, 0.16), transparent 55%), radial-gradient(circle at 85% 20%, rgba(61, 245, 160, 0.12), transparent 50%)"
            : "radial-gradient(circle at 20% 10%, rgba(207, 108, 88, 0.16), transparent 55%), radial-gradient(circle at 85% 20%, rgba(95, 157, 157, 0.18), transparent 50%)",
        }}
      />

      {/* Live Scene Pill */}
      <div
        className={cn(
          "absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md",
          isDark
            ? "border border-white/15 bg-slate-950/80 font-mono text-slate-200"
            : "border border-ink/10 bg-white/90 text-ink shadow-sm",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgb(var(--c-accent))]" />
        <span>{scene.label}</span>
      </div>

      {/* Desktop Browser Frame */}
      <div
        className={cn(
          "relative z-10 flex h-full w-[86%] flex-col overflow-hidden rounded-t-xl border border-b-0 shadow-2xl",
          isDark
            ? "border-white/15 bg-[#0b1120]"
            : "border-ink/15 bg-white",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 border-b px-3 py-2",
            isDark
              ? "border-white/10 bg-[#131c2e]"
              : "border-ink/10 bg-stone-100",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span
            className={cn(
              "ml-2 truncate rounded-full px-2.5 py-0.5 text-[10px] text-soft",
              isDark ? "bg-slate-950/70 font-mono" : "bg-white/90",
            )}
          >
            {scene.url}
          </span>
        </div>

        <div ref={dScreenRef} className="relative flex-1 overflow-hidden bg-slate-950/5">
          {hasEntered && (
            <>
              {scene.type === "video" ? (
                <>
                  <video
                    ref={(el) => {
                      dVideoRef.current = el;
                      if (el) {
                        el.muted = true;
                        el.defaultMuted = true;
                        if (el.paused) el.play().catch(() => {});
                      }
                    }}
                    key={scene.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onCanPlay={(e) => {
                      const v = e.currentTarget;
                      v.muted = true;
                      v.defaultMuted = true;
                      if (v.paused) v.play().catch(() => {});
                    }}
                    className="block h-full w-full object-cover object-center"
                  >
                    {scene.av1 && <source src={scene.av1} type={AV1_TYPE} />}
                    <source src={scene.src} type="video/mp4" />
                  </video>
                  {scene.cursorWaypoints && scene.cursorWaypoints.length > 0 && (
                    <div
                      aria-hidden="true"
                      style={{
                        left: `${scene.cursorWaypoints[videoCursorIdx % scene.cursorWaypoints.length].x}%`,
                        top: `${scene.cursorWaypoints[videoCursorIdx % scene.cursorWaypoints.length].y}%`,
                        transition:
                          "left 0.65s cubic-bezier(0.22, 1, 0.36, 1), top 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                      className="pointer-events-none absolute z-20 -translate-x-0.5 -translate-y-0.5"
                    >
                      <span className="absolute -left-1.5 -top-1.5 h-5 w-5 animate-ping rounded-full bg-brand/45" />
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="relative h-4 w-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      >
                        <path
                          d="M4 2L20 12.5L12.5 14.5L9 21.5L4 2Z"
                          fill="#ffffff"
                          stroke="#0f172a"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div ref={dScrollStageRef} className="relative w-full will-change-transform">
                  <img
                    ref={dImgRef}
                    src={scene.src}
                    alt={scene.label}
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
              )}


              {/* Pinned Admin Header & Sidebar */}
              {scene.pinAdminChrome && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 z-10 h-0 w-full overflow-hidden pb-[3.55%]"
                  >
                    <img src={scene.src} alt="" decoding="async" className="block h-auto w-full" />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-[16.5625%] overflow-hidden border-r border-[#0d1826] bg-[#111727]"
                  >
                    <img src="/works/experience-east-asean/admin/sidebar-dashboard.webp" alt="" decoding="async" className="block h-auto w-full" />
                    <img
                      src="/works/experience-east-asean/admin/sidebar-footer.webp"
                      alt=""
                      decoding="async"
                      className="absolute bottom-0 left-0 block h-auto w-full"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Phone Frame */}
      <div
        className={cn(
          "absolute -bottom-2 right-3 z-20 overflow-hidden rounded-[20px] border-[4px] shadow-2xl transition-transform duration-300 group-hover:-translate-y-1.5",
          compact ? "h-[175px] w-[92px]" : "h-[235px] w-[120px]",
          isDark
            ? "border-slate-800 bg-slate-950"
            : "border-stone-800 bg-white",
        )}
      >
        <div className="absolute left-1/2 top-1.5 z-10 h-2 w-9 -translate-x-1/2 rounded-full bg-slate-950" />
        <div ref={mScreenRef} className="relative h-full w-full overflow-hidden">
          {hasEntered && (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/works/experience-east-asean/web/web-home-mobile-poster.webp"
                ref={(el) => {
                  if (el) {
                    el.muted = true;
                    el.defaultMuted = true;
                    if (el.paused) el.play().catch(() => {});
                  }
                }}
                className="block h-full w-full object-cover object-top"
              >
                <source src="/works/experience-east-asean/web/web-home-mobile.av1.mp4" type={AV1_TYPE} />
                <source src="/works/experience-east-asean/web/web-home-mobile.mp4" type="video/mp4" />
              </video>
            </>
          )}
        </div>
      </div>

      {/* Bottom Reel Progress Bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[3px] bg-black/15">
        <div
          ref={reelBarRef}
          className="h-full w-0 bg-gradient-to-r from-brand to-brand2 transition-[width] duration-100 ease-linear"
        />
      </div>
    </div>
  );
}
