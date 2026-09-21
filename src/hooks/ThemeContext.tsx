import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isIntro: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage, default to light
    const saved = typeof window !== "undefined" ? localStorage.getItem("portfolio-theme") : null;
    return (saved === "dark" ? "dark" : "light") as Theme;
  });
  const [isIntro, setIsIntro] = useState(true);

  // Intro animation sequence: briefly showcase both themes
  useEffect(() => {
    const html = document.documentElement;

    // Start in light
    html.classList.remove("dark");
    html.classList.add("intro-active");

    // Flash to dark after 400ms
    const t1 = setTimeout(() => {
      html.classList.add("dark");
    }, 400);

    // Flash back to light (or user's saved preference) after 900ms
    const t2 = setTimeout(() => {
      if (theme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }, 900);

    // End intro after 1400ms
    const t3 = setTimeout(() => {
      html.classList.remove("intro-active");
      setIsIntro(false);
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []); // Only run once on mount

  // Sync dark class with theme state (after intro)
  useEffect(() => {
    if (isIntro) return;
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme, isIntro]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isIntro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
