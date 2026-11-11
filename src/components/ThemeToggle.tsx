import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/ThemeContext";

/** Light mode (the painter) ⇄ Dark mode (the developer). */
export default function ThemeToggle() {
  const { isDark, toggleTheme, isIntro } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      disabled={isIntro}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid grid-cols-2 items-center p-1 text-sm font-medium backdrop-blur transition-colors",
        isDark
          ? "rounded-md border border-brand/25 bg-paper/70 font-mono text-[0.8rem]"
          : "rounded-full border-[1.5px] border-ink/20 bg-white/70",
      )}
    >
      {/* sliding thumb */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]",
          isDark
            ? "translate-x-full rounded bg-brand shadow-[0_0_18px_-2px_rgb(var(--c-accent)/0.8)]"
            : "rounded-full bg-brand",
        )}
      />
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 transition-colors duration-300",
          isDark ? "text-soft" : "text-white",
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
          <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
          <path d="M14.5 17.5 4.5 15" />
        </svg>
        <span className="hidden sm:inline">Light Mode</span>
      </span>
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 transition-colors duration-300",
          isDark ? "text-paper" : "text-soft",
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        <span className="hidden sm:inline">Dark Mode</span>
      </span>
    </button>
  );
}
