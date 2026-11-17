import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Pause, Play, Smartphone } from "lucide-react";
import { isVideoAsset, ShowcaseView } from "@/data/works";
import { useTheme } from "@/hooks/ThemeContext";
import { cn } from "@/lib/utils";

interface InteractiveShowcaseProps {
  title: string;
  views: ShowcaseView[];
  liveUrl?: string;
}

const SPEEDS = [1, 1.75, 2.5];

const AREA_STATES = [
  { src: "/works/experience-east-asean/areas/area-sabah.webp", x: 29.9, y: 37.8, label: "Sabah" },
  { src: "/works/experience-east-asean/areas/area-palawan.webp", x: 32.0, y: 21.1, label: "Palawan" },
  { src: "/works/experience-east-asean/areas/area-mindanao.webp", x: 43.0, y: 30.3, label: "Mindanao" },
  { src: "/works/experience-east-asean/areas/area-brunei.webp", x: 24.9, y: 41.1, label: "Brunei" },
];

export default function InteractiveShowcase({
  title,
  views,
  liveUrl,
}: InteractiveShowcaseProps) {
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState(views[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1
  const [areasVisible, setAreasVisible] = useState(false);
  const [areaIdx, setAreaIdx] = useState(0);
  const [tourIdx, setTourIdx] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const progressRef = useRef(0);
  const directionRef = useRef(1);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const areaTimerRef = useRef(0);

  const activeView = views.find((v) => v.id === activeId) ?? views[0];
  const isVideo = Boolean(
    activeView && isVideoAsset(activeView.asset, activeView.mediaType),
  );
  const isScrollable = Boolean(activeView?.animatedScroll) && !isVideo;
  const hasPlaybackControls = isScrollable || isVideo;
  const isMobile = activeView?.device === "mobile";

  const getMaxScroll = useCallback(() => {
    const vp = viewportRef.current;
    const img = imgRef.current;
    if (!vp || !img) return 0;
    return Math.max(0, img.offsetHeight - vp.clientHeight);
  }, []);

  const applyProgress = useCallback(
    (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      progressRef.current = clamped;
      setProgress(clamped);

      if (isVideo && videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = clamped * videoRef.current.duration;
        return;
      }

      const max = getMaxScroll();
      if (scrollStageRef.current) {
        scrollStageRef.current.style.transform = `translate3d(0, ${-Math.round(clamped * max)}px, 0)`;
      }
      if (activeView?.hasAreasHover) {
        setAreasVisible(clamped >= 0.14 && clamped <= 0.34);
      }
    },
    [getMaxScroll, isVideo, activeView?.hasAreasHover],
  );

  // Reset playback state when switching views
  useEffect(() => {
    directionRef.current = 1;
    progressRef.current = 0;
    areaTimerRef.current = 0;
    setProgress(0);
    setAreasVisible(false);
    setAreaIdx(0);
    setTourIdx(0);
    setIsPlaying(true);
    if (scrollStageRef.current) {
      scrollStageRef.current.style.transform = "translate3d(0, 0px, 0)";
    }
  }, [activeId]);

  // Choreographed cursor waypoints timer (runs on scrolling & static views; video views sync via onTimeUpdate)
  useEffect(() => {
    const pts = activeView?.cursorWaypoints;
    if (!pts || pts.length === 0 || isVideo) return;
    const id = window.setInterval(() => {
      if (isPlaying && !draggingRef.current) {
        setTourIdx((prev) => (prev + 1) % pts.length);
      }
    }, 1600);
    return () => window.clearInterval(id);
  }, [activeView?.id, activeView?.cursorWaypoints, isVideo, isPlaying]);

  // Sync video play/pause & playbackRate (force muted in DOM so browsers allow autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!isVideo || !video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playbackRate = SPEEDS[speedIdx];
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVideo, isPlaying, speedIdx, activeId]);

  // Native non-passive wheel listener so scrolling inside the showcase does not scroll the page
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !isScrollable) return;

    const onWheel = (e: WheelEvent) => {
      const max = getMaxScroll();
      if (max <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      applyProgress(progressRef.current + e.deltaY / max);
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [isScrollable, getMaxScroll, applyProgress]);

  // Smooth GPU-accelerated rAF scroll loop + Areas hover state animation
  useEffect(() => {
    if (!isScrollable) return;
    let raf = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      const p = progressRef.current;
      const inAreasBand = Boolean(activeView?.hasAreasHover) && p >= 0.12 && p <= 0.23;
      if (inAreasBand) {
        areaTimerRef.current += dt;
        const nextAreaIdx = Math.floor(areaTimerRef.current / 1.1) % AREA_STATES.length;
        setAreaIdx(nextAreaIdx);
        setAreasVisible(true);
      } else if (activeView?.hasAreasHover) {
        setAreasVisible(false);
      }

      if (isPlaying && !draggingRef.current) {
        const max = getMaxScroll();
        if (max > 0) {
          // Keep scrolling speed consistent with only a very subtle ease over the Areas band
          const inSlowZone = Boolean(activeView?.hasAreasHover) && p >= 0.14 && p <= 0.21;
          const speedFactor = inSlowZone ? 0.85 : 1;
          const pxPerSec = 58 * SPEEDS[speedIdx] * speedFactor;
          const delta = (pxPerSec * dt) / max;
          let next = p + delta * directionRef.current;
          if (next >= 1) {
            next = 1;
            directionRef.current = -1;
          } else if (next <= 0) {
            next = 0;
            directionRef.current = 1;
          }
          applyProgress(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isScrollable, isPlaying, speedIdx, activeView?.hasAreasHover, getMaxScroll, applyProgress]);

  if (!activeView) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrollable) return;
    draggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartProgressRef.current = progressRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const max = getMaxScroll();
    if (max <= 0) return;
    const dy = dragStartYRef.current - e.clientY;
    applyProgress(dragStartProgressRef.current + dy / max);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const currentArea = AREA_STATES[areaIdx] ?? AREA_STATES[0];

  const renderMedia = () => {
    const tourCursorEl =
      activeView.cursorWaypoints && activeView.cursorWaypoints.length > 0 ? (
        <div
          aria-hidden="true"
          style={{
            left: `${activeView.cursorWaypoints[tourIdx % activeView.cursorWaypoints.length].x}%`,
            top: `${activeView.cursorWaypoints[tourIdx % activeView.cursorWaypoints.length].y}%`,
            transition:
              "left 0.75s cubic-bezier(0.22, 1, 0.36, 1), top 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="pointer-events-none absolute z-30 -translate-x-0.5 -translate-y-0.5"
        >
          <span className="absolute -left-2 -top-2 h-6 w-6 animate-ping rounded-full bg-brand/45" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-5 w-5 drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
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
      ) : null;

    if (isVideo) {
      return (
        <>
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.muted = true;
                el.defaultMuted = true;
                el.playbackRate = SPEEDS[speedIdx];
                if (isPlaying && el.paused) {
                  el.play().catch(() => {});
                }
              }
            }}
            key={activeView.id}
            src={activeView.asset}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              const v = e.currentTarget;
              v.muted = true;
              v.defaultMuted = true;
              v.playbackRate = SPEEDS[speedIdx];
              if (isPlaying && v.paused) v.play().catch(() => {});
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) {
                const p = v.currentTime / v.duration;
                progressRef.current = p;
                setProgress(p);
                const pts = activeView.cursorWaypoints;
                if (pts && pts.length > 0) {
                  setTourIdx(Math.min(pts.length - 1, Math.floor(p * pts.length)));
                }
              }
            }}
            className="block h-full w-full object-cover object-center"
          />
          {tourCursorEl}
        </>
      );
    }

    return (
      <>
        <div ref={scrollStageRef} className="relative w-full will-change-transform">
          <img
            ref={imgRef}
            key={activeView.id}
            src={activeView.asset}
            alt={`${title} — ${activeView.label}`}
            onLoad={() => applyProgress(0)}
            className={cn(
              "pointer-events-none block w-full",
              activeView.animatedScroll ? "h-auto" : "h-full object-cover object-top",
            )}
          />

          {/* Interactive Focus Areas Hover Overlay + Animated Cursor */}
          {activeView.hasAreasHover && (
            <div
              className={cn(
                "pointer-events-none absolute left-[11.25%] top-[17.196%] h-[8.495%] w-[77.613%] transition-opacity duration-300",
                areasVisible ? "opacity-100" : "opacity-0",
              )}
            >
              <img
                src={currentArea.src}
                alt={`Focus Area: ${currentArea.label}`}
                className="block h-full w-full rounded object-cover shadow-lg"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  left: `${currentArea.x}%`,
                  top: `${currentArea.y}%`,
                  transition:
                    "left 0.45s cubic-bezier(0.22, 1, 0.36, 1), top 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className="absolute h-5 w-5 -translate-x-0.5 -translate-y-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
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
        </div>

        {/* Pinned public header: like the live site, the solid header (with the logo)
            fades in once the page scrolls, as a translucent blurred bar over the content. */}
        {activeView.pinWebNavbar && activeView.navbarAsset && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-10 w-full transition-opacity duration-300",
              progress > 0.004 ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="absolute inset-0 bg-[#134e4a]/80 shadow-lg backdrop-blur-lg" />
            <img src={activeView.navbarAsset} alt="" className="relative block h-auto w-full" />
          </div>
        )}

        {/* Pinned Admin CMS Header & Sidebar */}
        {activeView.pinAdminChrome && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-10 h-0 w-full overflow-hidden pb-[3.55%] shadow-sm"
            >
              <img src={activeView.asset} alt="" className="block h-auto w-full" />
            </div>
<div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-[16.5625%] overflow-hidden border-r border-[#0d1826] bg-[#111727] shadow-[4px_0_14px_rgba(0,0,0,0.25)]"
            >
              <img src={activeView.adminSidebar ?? "/works/experience-east-asean/admin/sidebar-dashboard.webp"} alt="" className="block h-auto w-full" />
              {/* account card stays pinned to the bottom, as in the real CMS */}
              <img
                src="/works/experience-east-asean/admin/sidebar-footer.webp"
                alt=""
                className="absolute bottom-0 left-0 block h-auto w-full"
              />
            </div>
          </>
        )}

        {/* Choreographed Tour Cursor & Pulse Ring */}
        {tourCursorEl}
      </>
    );
  };

  return (
    <div className={cn("surface p-4 sm:p-5", isDark && "border-brand/25")}>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_225px]">
        {/* Left: Compact Laptop (16:10) or Phone Frame + Controls */}
        <div className="min-w-0">
          {isMobile ? (
            <div className="mx-auto max-w-[235px]">
              <div
                className={cn(
                  "overflow-hidden rounded-[2rem] border-[5px] shadow-2xl",
                  isDark ? "border-slate-800 bg-slate-950" : "border-ink/85 bg-white",
                )}
              >
                <div className="flex justify-center py-1.5">
                  <span className="h-1 w-12 rounded-full bg-soft/30" />
                </div>
                <div
                  ref={viewportRef}
                  onMouseEnter={() => {
                    hoveringRef.current = true;
                  }}
                  onMouseLeave={() => {
                    hoveringRef.current = false;
                    draggingRef.current = false;
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={cn(
                    "relative aspect-[9/16] w-full overflow-hidden bg-slate-950/5 select-none",
                    isScrollable && "cursor-grab active:cursor-grabbing",
                  )}
                >
                  {renderMedia()}
                  {isScrollable && (
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-2.5 right-2.5 z-30 rounded-full px-2 py-0.5 text-[10px] backdrop-blur-md",
                        isDark
                          ? "border border-brand/25 bg-paper/80 font-mono text-ink"
                          : "border border-ink/10 bg-white/85 text-ink shadow-sm",
                      )}
                    >
                      Hover to pause
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              {/* Laptop Screen Lid */}
              <div
                className={cn(
                  "overflow-hidden rounded-t-xl border-[5px] border-b-[3px] shadow-xl",
                  isDark
                    ? "border-slate-800 bg-slate-950"
                    : "border-stone-800 bg-stone-900",
                )}
              >
                {/* Camera dot */}
                <div className="flex items-center justify-center py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                </div>

                {/* Browser Chrome */}
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 border-b px-3 py-1.5",
                    isDark
                      ? "border-brand/15 bg-paper/95"
                      : "border-ink/10 bg-stone-100",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                    <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                    <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                  </div>
                  <div
                    className={cn(
                      "flex-1 truncate rounded-full px-3 py-0.5 text-center text-[11px] text-soft",
                      isDark ? "bg-slate-900/80 font-mono" : "bg-white",
                    )}
                  >
                    {liveUrl
                      ? `${liveUrl.replace(/^https?:\/\//, "")} — ${activeView.label}`
                      : activeView.label}
                  </div>
                  <span className="hidden text-[10px] font-medium text-brand sm:inline">
                    {isVideo ? "Live Loop" : "16:10"}
                  </span>
                </div>

                {/* 16:10 Laptop / Web Viewport */}
                <div
                  ref={viewportRef}
                  onMouseEnter={() => {
                    hoveringRef.current = true;
                  }}
                  onMouseLeave={() => {
                    hoveringRef.current = false;
                    draggingRef.current = false;
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={cn(
                    "relative aspect-[16/10] w-full overflow-hidden bg-slate-950/5 select-none",
                    isScrollable && "cursor-grab active:cursor-grabbing",
                  )}
                >
                  {renderMedia()}

                  {isScrollable && (
                    <span
                      className={cn(
                        "pointer-events-none absolute bottom-2.5 right-2.5 z-30 rounded-full px-2.5 py-1 text-[10px] backdrop-blur-md",
                        isDark
                          ? "border border-brand/25 bg-paper/80 font-mono text-ink"
                          : "border border-ink/10 bg-white/85 text-ink shadow-sm",
                      )}
                    >
                      Hover to pause · Drag or scroll
                    </span>
                  )}
                </div>
              </div>

              {/* Laptop Base Chin */}
              <div
                aria-hidden="true"
                className={cn(
                  "mx-auto h-2.5 w-[103%] -ml-[1.5%] rounded-b-lg shadow-md",
                  isDark
                    ? "border-t border-slate-700/70 bg-gradient-to-b from-slate-700 to-slate-800"
                    : "border-t border-stone-300 bg-gradient-to-b from-stone-300 to-stone-400",
                )}
              >
                <div className="mx-auto h-1 w-14 rounded-b bg-black/20" />
              </div>
            </div>
          )}

          {/* Video-style Playback & Scrubber Bar */}
          {hasPlaybackControls && (
            <div
              className={cn(
                "mx-auto mt-3.5 flex max-w-3xl flex-wrap items-center gap-2.5 px-3 py-2",
                isDark
                  ? "rounded-lg border border-brand/20 bg-paper/70 font-mono text-xs"
                  : "rounded-[14px_18px_14px_20px/18px_14px_20px_14px] border border-ink/10 bg-white/75 text-xs",
              )}
            >
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-ink transition-colors hover:text-brand",
                  isDark ? "rounded border border-brand/20" : "rounded-full border border-ink/15",
                )}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
                className={cn(
                  "px-2.5 py-1 font-medium text-soft transition-colors hover:text-brand",
                  isDark ? "rounded border border-brand/20" : "rounded-full border border-ink/15",
                )}
              >
                {SPEEDS[speedIdx]}x
              </button>

              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={Number((progress * 100).toFixed(1))}
                onChange={(e) => applyProgress(Number(e.target.value) / 100)}
                aria-label="Showcase playback position"
                className="h-1.5 flex-1 cursor-pointer accent-brand"
              />

              <span className="w-9 text-right tabular-nums text-soft">
                {Math.round(progress * 100)}%
              </span>

              {activeView.jumps && activeView.jumps.length > 0 && (
                <div className="flex w-full flex-wrap items-center gap-1.5 border-t border-border/50 pt-2">
                  <span className="mr-1 text-[11px] text-soft">Jump:</span>
                  {activeView.jumps.map((j) => (
                    <button
                      key={j.label}
                      type="button"
                      onClick={() => applyProgress(j.pct / 100)}
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-medium text-soft transition-colors hover:text-brand",
                        isDark
                          ? "rounded border border-brand/15 hover:border-brand/50"
                          : "rounded-full border border-ink/10 bg-white/80 hover:border-brand/50",
                      )}
                    >
                      {j.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className={cn("mt-3 text-center text-xs text-soft", isDark && "font-mono")}>
            {activeView.caption}
          </p>
        </div>

        {/* Right: View Switcher ("What to see") */}
        <aside className="flex flex-col gap-2">
          <p
            className={cn(
              "px-1 text-xs font-medium text-soft",
              isDark ? "font-mono" : "font-hand text-xl text-brand",
            )}
          >
            {isDark ? "// views" : "What to see"}
          </p>
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
            role="tablist"
            aria-label="Showcase views"
          >
            {views.map((view) => {
              const active = view.id === activeView.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(view.id)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium transition-all",
                    isDark
                      ? cn(
                          "rounded border font-mono",
                          active
                            ? "border-brand bg-brand/15 text-brand"
                            : "border-brand/15 text-soft hover:border-brand/40 hover:text-ink",
                        )
                      : cn(
                          "rounded-[12px_16px_12px_16px/16px_12px_16px_12px] border-[1.5px]",
                          active
                            ? "border-brand bg-brand text-white shadow-[2px_3px_0_rgb(var(--c-ink)/0.8)]"
                            : "border-ink/15 bg-white/80 text-soft hover:border-brand/50 hover:text-ink",
                        ),
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {view.device === "mobile" ? (
                      <Smartphone className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{view.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
