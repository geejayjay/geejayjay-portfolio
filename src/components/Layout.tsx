import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import PaintCanvas from "./PaintCanvas";
import CodeBackdrop from "./CodeBackdrop";
import { socialLinks } from "./socialLinks";
import { useTheme } from "@/hooks/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const pages = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Layout({ children }: LayoutProps) {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark } = useTheme();

  // Track which page the reader is on: the last section whose top has passed
  // the middle of the viewport. Measured on scroll so it can never lag behind.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const middle = window.innerHeight / 2;
      let current = 0;
      pages.forEach((p, i) => {
        const el = document.getElementById(p.id);
        if (el && el.getBoundingClientRect().top <= middle) current = i;
      });
      // at the very bottom the last page counts, even if it is a short one
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? pages.length - 1 : current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* ---------- Backdrop (fixed, behind everything) ---------- */}
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="dev-grid absolute inset-0" />
            <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand/10 blur-[120px]" />
            <div className="absolute -bottom-52 -right-40 h-[38rem] w-[38rem] rounded-full bg-brand3/10 blur-[130px]" />
          </>
        ) : (
          <>
            <div className="wash -left-32 -top-24 h-[34rem] w-[34rem] bg-brand/20" />
            <div
              className="wash -right-40 top-1/3 h-[38rem] w-[38rem] bg-brand2/25"
              style={{ animationDelay: "-8s" }}
            />
            <div
              className="wash -bottom-40 left-1/4 h-[30rem] w-[30rem] bg-brand3/20"
              style={{ animationDelay: "-14s" }}
            />
            <div className="paper-grain absolute inset-0" />
          </>
        )}
      </div>
      {isDark ? <CodeBackdrop /> : <PaintCanvas />}

      {/* ---------- Top bar ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8 md:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-paper via-paper/70 to-transparent pointer-events-none"
        />
        <button onClick={() => goTo("home")} className="flex items-center" aria-label="Back to top">
          <img src={isDark ? "/logo-dark.png" : "/logo-light.png"} alt="" className="h-9 w-auto" />
          <span
            className={cn(
              "-ml-2 mb-2 text-lg font-semibold",
              isDark ? "font-mono text-base" : "font-display",
            )}
          >
            <span className="text-brand">ee</span>
            <span className="text-brand3">jay</span>
            <span className="text-brand2">jay</span>
          </span>
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-4 lg:flex">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-soft transition-colors hover:text-brand"
              >
                {link.icon}
              </a>
            ))}
          </div>
          <ThemeToggle />
          <button
            className="text-ink md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </header>

      {/* ---------- Page rail (desktop) ---------- */}
      <nav
        aria-label="Sections"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 md:flex lg:right-8"
      >
        {pages.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.id}
              onClick={() => goTo(p.id)}
              aria-current={on ? "true" : undefined}
              className="group flex items-center gap-3"
            >
              <span
                className={cn(
                  "transition-all duration-300",
                  isDark ? "font-mono text-xs" : "font-hand text-xl leading-none",
                  on
                    ? "translate-x-0 text-brand opacity-100"
                    : "translate-x-2 text-soft opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                )}
              >
                {isDark ? `${pad(i + 1)}.${p.label.toLowerCase()}` : p.label}
              </span>
              <span
                className={cn(
                  "block transition-all duration-300",
                  isDark
                    ? cn(
                        "h-[3px]",
                        on
                          ? "w-8 bg-brand shadow-[0_0_10px_rgb(var(--c-accent))]"
                          : "w-4 bg-soft/50 group-hover:bg-brand",
                      )
                    : cn(
                        "rounded-[50%_45%_55%_48%]",
                        on ? "h-4 w-4 bg-brand" : "h-2.5 w-2.5 bg-ink/25 group-hover:bg-brand",
                      ),
                )}
              />
            </button>
          );
        })}
      </nav>

      {/* ---------- Page counter ---------- */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed bottom-5 left-10 z-40 hidden text-soft md:block",
          isDark ? "font-mono text-xs" : "font-hand text-xl",
        )}
      >
        {isDark ? (
          <>
            [<span className="text-brand">{pad(active + 1)}</span>/{pad(pages.length)}]
          </>
        ) : (
          <>
            page <span className="text-brand">{active + 1}</span> of {pages.length}
          </>
        )}
      </div>

      {/* ---------- Full-screen menu (mobile) ---------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-center bg-paper/95 px-8 backdrop-blur-md md:hidden">
          <ul className="space-y-5">
            {pages.map((p, i) => (
              <li key={p.id} className="rise-in" style={{ animationDelay: `${i * 60}ms` }}>
                <button
                  onClick={() => goTo(p.id)}
                  className={cn(
                    "flex items-baseline gap-4 font-display text-4xl font-semibold",
                    i === active ? "text-brand" : "text-ink",
                  )}
                >
                  <span className={cn("text-soft", isDark ? "font-mono text-base" : "font-hand text-xl")}>
                    {pad(i + 1)}
                  </span>
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-soft hover:text-brand"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      )}

      <main className="relative z-10">{children}</main>
    </div>
  );
}
