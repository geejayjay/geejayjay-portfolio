import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Home", section: null, className: "text-gray-700" },
  { label: "About", section: "about", className: "text-gray-700" },
  { label: "Work", section: "work", className: "text-gray-700" },
  { label: "Contact Me!", section: "contact", className: "text-coral-500" },
];

const socialLinks = [
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
      </svg>
    ),
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
      </svg>
    ),
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId: string | null) => {
    setMobileOpen(false);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav
        className={cn(
          "flex items-center justify-between px-6 py-4 md:px-12 lg:px-16 sticky top-0 z-50 border-b border-gray-100 transition-colors duration-300",
          scrolled ? "bg-gray-50/95 backdrop-blur" : "bg-transparent border-transparent"
        )}
      >
        {/* Logo with GeeJayJay text very close to the right */}
        <button
          onClick={() => scrollToSection(null)}
          className="flex items-center"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto"
            style={{ maxHeight: "2rem" }}
          />
          <span className="ml-[-0.5rem] mb-3 text-lg font-semibold transition-colors sketchy-text">
            <span style={{ color: "#CF6C58" }}>ee</span>
            <span style={{ color: "#5f9d9dff" }}>jay</span>
            <span style={{ color: "#D3A658" }}>jay</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.section)}
              className={`${link.className} text-base text-left transition-colors sketchy-text ${link.label === "Contact Me!" ? "bg-coral-500 hover:bg-coral-600 text-white font-bold px-5 py-1.5 rounded-lg transition-all transform hover:scale-105 shadow-lg sketchy-button animate-fade-in" : "hover:text-gray-900"}`}
              style={link.label === "Contact Me!" ? { animationDuration: "1.2s", animationIterationCount: "1", animationTimingFunction: "ease-in", opacity: 0.92 } : {}}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop social links */}
        <div className="hidden md:flex items-center space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors text-base"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="text-gray-600"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Side nav overlay for mobile (right side) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          ></div>
          {/* Side nav (right) */}
          <div className="relative w-64 max-w-[80vw] h-full bg-white bg-opacity-95 shadow-xl p-8 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.section)}
                className={`${link.className} text-lg text-left`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <main>{children}</main>
    </div>
  );
}
