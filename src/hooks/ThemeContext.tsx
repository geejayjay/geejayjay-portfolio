import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { runSweepFx } from "@/lib/sweepFx";

/**
 * Two personas, one person:
 *  - "light" = the Painter (creative side)
 *  - "dark"  = the Builder (logic side)
 */
export type Theme = "light" | "dark";
type SweepDir = "ltr" | "rtl";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  isIntro: boolean;
}

const STORAGE_KEY = "portfolio-theme";

/** Both portraits — the sweep shows the other mode's one before it's ever rendered. */
const PORTRAITS = ["/profile-light.png", "/profile-dark.png"];

function decodeImage(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
}

/**
 * Start the intro as soon as the page can be shown properly: web fonts ready
 * and both portraits decoded (instant when cached), but never wait longer than
 * `cap` ms. Otherwise the sweep can catch fallback fonts or an empty portrait.
 */
function pageReady(cap: number) {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([Promise.all([fonts, ...PORTRAITS.map(decodeImage)]), sleep(cap)]);
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readSavedTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/** A dry-brush edge used as the wipe mask when the Painter arrives. */
function brushMask(raggedSide: "left" | "right") {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const rows = 30;
  // Built with the ragged edge on the left (x 0..10), solid out to x = 110.
  let d = "M110,0 L110,100 L5,100 ";
  for (let i = rows; i > 0; i--) {
    const y0 = ((i - 1) / rows) * 100;
    const mid = ((i - 0.5) / rows) * 100;
    d += `Q${(rnd() * 9).toFixed(2)},${mid.toFixed(2)} ${(4 + rnd() * 5).toFixed(2)},${y0.toFixed(2)} `;
  }
  d += "Z";
  const flip = raggedSide === "right" ? " transform='translate(110 0) scale(-1 1)'" : "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 110 100' preserveAspectRatio='none'><path d='${d}' fill='black'${flip}/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const BRUSH_LEFT = brushMask("left");
const BRUSH_RIGHT = brushMask("right");

/** Configure the wipe: the Painter arrives as a brush stroke, the Builder as a clean scan. */
function setSweepVars(next: Theme, dir: SweepDir, ms: number) {
  const s = document.documentElement.style;
  s.setProperty("--sweep-ms", `${ms}ms`);
  if (next === "light") {
    s.setProperty("--sweep-mask", dir === "ltr" ? BRUSH_RIGHT : BRUSH_LEFT);
    s.setProperty("--sweep-size", "110vw 100%");
    s.setProperty("--sweep-from", dir === "ltr" ? "-110vw" : "100vw");
    s.setProperty("--sweep-to", dir === "ltr" ? "0vw" : "-10vw");
  } else {
    s.setProperty(
      "--sweep-mask",
      `linear-gradient(${dir === "ltr" ? "90deg" : "270deg"}, #000 calc(100% - 5vw), transparent)`,
    );
    s.setProperty("--sweep-size", "105vw 100%");
    s.setProperty("--sweep-from", dir === "ltr" ? "-105vw" : "100vw");
    s.setProperty("--sweep-to", dir === "ltr" ? "0vw" : "-5vw");
  }
}

function canSweep() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  const [isIntro, setIsIntro] = useState(true);
  const busy = useRef(true);
  const fxRef = useRef<HTMLCanvasElement>(null);

  /** Switch theme with a horizontal wipe (falls back to an instant switch). */
  const sweepTo = useCallback(async (next: Theme, dir: SweepDir, ms: number) => {
    const html = document.documentElement;
    const commit = () => {
      flushSync(() => setTheme(next));
      html.classList.toggle("dark", next === "dark");
    };

    if (!canSweep()) {
      commit();
      return;
    }

    setSweepVars(next, dir, ms);
    html.dataset.sweep = dir;
    try {
      const transition = document.startViewTransition(commit);
      // particles fly off the wipe's leading edge once the animation starts
      transition.ready
        .then(() => fxRef.current && runSweepFx(fxRef.current, next, dir, ms))
        .catch(() => {});
      await transition.finished;
    } catch {
      // transition skipped (e.g. tab hidden) — the theme is applied regardless
    } finally {
      delete html.dataset.sweep;
    }
  }, []);

  // Intro: sweep left → right to show the other persona, then sweep back.
  useEffect(() => {
    let cancelled = false;
    const home = readSavedTheme();
    const other: Theme = home === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", home === "dark");

    (async () => {
      if (canSweep()) {
        await pageReady(400);
        if (cancelled) return;
        await sweepTo(other, "ltr", 900);
        await sleep(550);
        if (cancelled) return;
        await sweepTo(home, "rtl", 900);
      }
      if (cancelled) return;
      busy.current = false;
      setIsIntro(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [sweepTo]);

  useEffect(() => {
    if (isIntro) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable — the choice just won't persist
    }
  }, [theme, isIntro]);

  const toggleTheme = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const next: Theme = theme === "light" ? "dark" : "light";
    sweepTo(next, next === "dark" ? "ltr" : "rtl", 700).finally(() => {
      busy.current = false;
    });
  }, [theme, sweepTo]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme, isIntro }}>
      {children}
      <canvas
        ref={fxRef}
        aria-hidden="true"
        className="sweep-fx fixed inset-0 z-[100] h-full w-full pointer-events-none"
      />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
