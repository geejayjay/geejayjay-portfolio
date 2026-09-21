import { useTheme } from "@/hooks/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isIntro } = useTheme();

  if (isIntro) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative group w-10 h-10 flex items-center justify-center rounded-xl 
                 bg-gray-100 dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700
                 hover:border-coral-400 dark:hover:border-cyan-400
                 transition-all duration-500 hover:scale-110"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {/* Paintbrush icon (light mode) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-500 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100 text-cyan-400"
            : "opacity-0 -rotate-90 scale-50"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
        <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
        <path d="M14.5 17.5 4.5 15" />
      </svg>

      {/* Terminal/code icon (dark mode) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-500 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-xl bg-coral-400/20 dark:bg-cyan-400/20 blur-sm" />
      </div>
    </button>
  );
}
