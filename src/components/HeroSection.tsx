import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react"; 
import { useTheme } from "@/hooks/ThemeContext";

export default function HeroSection() {
  const titles = ["Software\nDeveloper", "Electronics\nEngineer"];
  const [currentTitle, setCurrentTitle] = useState(0);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleDownload = () => {
    toast({
      variant: "default",
      title: "Download started",
      description: "Resume is being downloaded...",
    });

    const link = document.createElement("a");
    link.href = "/gurang_resume.pdf";
    link.download = "Gurang_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";

  return (
    <section
      id="home"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-8 md:px-16 lg:px-32 flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                Hello, I'm{" "}
                <span className="text-coral-500 dark:text-cyan-400 text-md font-medium">Jason Jay Gurang</span>,
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span
                  key={currentTitle}
                  className="inline-block animate-fade-in whitespace-pre-line"
                  style={{
                    animation: "fadeInUp 0.8s ease-out",
                    color: isDark ? "#00D4FF" : "#2C4848",
                  }}
                >
                  {titles[currentTitle]}
                </span>
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg">based in Davao City.</p>

           <div className="pt-4">
            <button
              onClick={handleDownload}
              className="relative group transition-all duration-300 outline-none"
              style={{ boxShadow: "none" }}
            >
              {/* Out-of-position background */}
              <span
                className={`absolute top-[2px] left-[2px] w-full h-full rounded-lg transition-all duration-300 group-hover:top-0 group-hover:left-0 ${
                  isDark ? "bg-cyan-900/50" : "bg-yellow-200"
                }`}
                aria-hidden="true"
              ></span>
              {/* Out-of-position border */}
              <span
                className={`absolute -top-[2px] -left-[2px] w-full h-full border rounded-lg transition-all duration-300 group-hover:top-0 group-hover:left-0 z-10 ${
                  isDark ? "border-cyan-500/60" : "border-coral-400"
                }`}
                aria-hidden="true"
              ></span>
              {/* Resume text + icon */}
              <span className={`relative z-20 flex items-center gap-2 text-lg px-10 py-2.5 font-medium rounded-lg transition-all duration-300 ${
                isDark ? "text-cyan-400" : "text-coral-500"
              }`}>
                <Download className="w-5 h-5" />
                Resume
              </span>
            </button>
          </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative Elements */}
              {isDark ? (
                <>
                  {/* Dark mode: Code brackets and circuit traces */}
                  <div className="absolute -top-4 -right-6 text-cyan-400 animate-pulse font-mono text-2xl font-bold opacity-60">
                    {"{ }"}
                  </div>
                  <div className="absolute top-12 right-10 text-emerald-400 animate-bounce font-mono text-lg opacity-50">
                    {"< />"}
                  </div>
                  <div className="absolute -bottom-6 -left-6 text-cyan-500 animate-pulse font-mono text-xl opacity-50">
                    {"/>"}
                  </div>
                  {/* Circuit trace glows */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-cyan-500 rounded-full opacity-10 animate-[ping_3s_ease-in-out_infinite]"></div>
                  <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-emerald-500 rounded-full opacity-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
                </>
              ) : (
                <>
                  {/* Light mode: Original paint/artist decorations */}
                  <div className="absolute -top-4 -right-6 text-coral-500 animate-pulse">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="20" x2="10" y2="4" />
                      <line x1="9" y1="20" x2="15" y2="4" />
                      <line x1="14" y1="20" x2="20" y2="4" />
                    </svg>
                  </div>
                  <div className="absolute top-12 right-10 text-golden-400 animate-bounce">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="4 8 12 16 20 8" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-6 -left-6 text-coral-500 animate-pulse">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="20" x2="10" y2="4" />
                      <line x1="12" y1="20" x2="16" y2="4" />
                      <line x1="18" y1="20" x2="22" y2="4" />
                    </svg>
                  </div>
                  {/* Paint splashes */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-coral-200 rounded-full opacity-25 animate-[ping_2s_ease-in-out_infinite]"></div>
                  <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-golden-200 rounded-full opacity-30 animate-[pulse_3s_ease-in-out_infinite]"></div>
                </>
              )}

              {/* Profile Image with crossfade */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center animate-fade-in" style={{ animationDuration: "1.2s" }}>
                {/* Dirty white ambient glow behind dark profile for contrast */}
                {isDark && (
                  <div
                    className="absolute inset-6 rounded-full bg-slate-100/15 blur-2xl pointer-events-none z-0 transition-opacity duration-700"
                  />
                )}

                {/* In Dark Mode: Inner glow / white overlay inside the ellipse behind the profile (z-[2]) */}
                {isDark && (
                  <svg
                    viewBox="0 0 320 300"
                    className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
                  >
                    <defs>
                      <radialGradient id="darkProfileInnerGlow" cx="50%" cy="48%" r="50%">
                        <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.32" />
                        <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.20" />
                        <stop offset="80%" stopColor="#CBD5E1" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <ellipse
                      cx="160"
                      cy="150"
                      rx="135"
                      ry="120"
                      fill="url(#darkProfileInnerGlow)"
                      style={{ transform: "rotate(-18deg)", transformOrigin: "170px 150px" }}
                    />
                  </svg>
                )}

                {/* In Light Mode: Circle is BEHIND the image (zIndex: 1) */}
                {!isDark && (
                  <svg
                    viewBox="0 0 320 300"
                    className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="0.7"
                    style={{ transition: "stroke 0.6s ease" }}
                  >
                    <ellipse
                      cx="160"
                      cy="150"
                      rx="135"
                      ry="120"
                      style={{ transform: "rotate(-18deg)", transformOrigin: "170px 150px" }}
                    />
                  </svg>
                )}

                {/* Light profile image (Artist / Painted Sketch Blob, z-10 above light circle) */}
                <img
                  src="/profile-light.png"
                  alt="Jason Jay Gurang"
                  className="absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-700 pointer-events-none select-none"
                  style={{
                    borderRadius: "48% 52% 50% 50% / 55% 45% 55% 45%",
                    boxShadow: "0 0 0 0 transparent",
                    opacity: isDark ? 0 : 1,
                  }}
                />

                {/* Dark profile image (Dirty white inner glow/overlay so dark silhouette is clearly visible against dark bg) */}
                <img
                  src="/profile-dark.png"
                  alt="Jason Jay Gurang"
                  className="absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-700 pointer-events-none select-none"
                  style={{
                    opacity: isDark ? 1 : 0,
                    filter: "drop-shadow(0 0 14px rgba(241, 245, 249, 0.45)) drop-shadow(0 0 24px rgba(226, 232, 240, 0.2))",
                    maskImage: "linear-gradient(to bottom, black 82%, transparent 97%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 97%)",
                  }}
                />

                {/* In Dark Mode: Circle is ABOVE / IN FRONT of image (z-20) to hide/frame the bottom cut */}
                {isDark && (
                  <svg
                    viewBox="0 0 320 300"
                    className="absolute inset-0 w-full h-full pointer-events-none z-20"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="1"
                    style={{ transition: "stroke 0.6s ease" }}
                  >
                    <ellipse
                      cx="160"
                      cy="150"
                      rx="135"
                      ry="120"
                      style={{ transform: "rotate(-18deg)", transformOrigin: "170px 150px" }}
                    />
                  </svg>
                )}
              </div>

              {/* Signature Lines / Circuit traces */}
              {isDark ? (
                <>
                  <div className="absolute bottom-0 right-8 text-cyan-400 opacity-40">
                    <svg className="w-20 h-10" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10,20 L30,20 L35,10 L40,30 L45,10 L50,30 L55,20 L90,20" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="absolute top-12 left-4 text-emerald-400 opacity-30">
                    <svg className="w-12 h-6" viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5,10 L15,10 L20,5 L25,15 L30,5 L35,15 L40,10 L55,10" strokeLinecap="round" />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute bottom-0 right-8 text-orange-400 animate-pulse">
                    <svg className="w-20 h-10" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M10,30 Q30,10 50,30 T90,30" strokeLinecap="round" className="sketchy-line" />
                    </svg>
                  </div>
                  <div className="absolute top-12 left-4 text-yellow-400 opacity-60">
                    <svg className="w-12 h-6" viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5,15 Q20,5 35,15 T55,15" strokeLinecap="round" className="sketchy-line" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
