import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"; // adjust path if needed

export default function HeroSection() {
  const titles = ["Software\nDeveloper", "Electronics\nEngineer"];
  const [currentTitle, setCurrentTitle] = useState(0);
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your resume is being downloaded.",
    });

    const link = document.createElement("a");
    link.href = "/gurang_resume.pdf"; // From public folder
    link.download = "Gurang_Resume.pdf"; // You can rename it here if needed
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
              <p className="text-gray-600 text-lg mb-2">
                Hello, I'm{" "}
                <span className="text-coral-500 text-md font-medium">Jason Jay Gurang</span>,
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                <span
                  key={currentTitle}
                  className="inline-block animate-fade-in whitespace-pre-line"
                  style={{
                    animation: "fadeInUp 0.8s ease-out",
                    color: "#2C4848", // Set the color for the switching text
                  }}
                >
                  {titles[currentTitle]}
                </span>
              </h1>
            </div>

            <p className="text-gray-600 text-lg">based in Davao City.</p>

            <div className="pt-4">
              <button
                onClick={handleDownload}
                className="relative group transition-all duration-300 outline-none"
                style={{ boxShadow: "none" }}
              >
                {/* Out-of-position background (bottom right, 2px y, 2px x) */}
                <span
                  className="absolute top-[2px] left-[2px] w-full h-full bg-yellow-200 rounded-lg transition-all duration-300 group-hover:top-0 group-hover:left-0"
                  aria-hidden="true"
                ></span>
                {/* Out-of-position border (top left, 2px y, 2px x, in front) */}
                <span
                  className="absolute -top-[2px] -left-[2px] w-full h-full border border-coral-400 rounded-lg transition-all duration-300 group-hover:top-0 group-hover:left-0 z-10"
                  aria-hidden="true"
                ></span>
                {/* Resume text */}
                <span className="relative z-20 block text-coral-500 text-lg px-10 py-2.5 font-medium rounded-lg transition-all duration-300">
                  Resume
                </span>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-6 text-coral-500 animate-pulse">
                {/* Diagonal Three Lines */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="20" x2="10" y2="4" />
                  <line x1="9" y1="20" x2="15" y2="4" />
                  <line x1="14" y1="20" x2="20" y2="4" />
                </svg>
              </div>

              <div className="absolute top-12 right-10 text-golden-400 animate-bounce">
                {/* Chevron Arrow - moved down */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 8 12 16 20 8" />
                </svg>
              </div>

              <div className="absolute -bottom-6 -left-6 text-coral-500 animate-pulse">
                {/* Three Slashes */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="20" x2="10" y2="4" />
                  <line x1="12" y1="20" x2="16" y2="4" />
                  <line x1="18" y1="20" x2="22" y2="4" />
                </svg>
              </div>

              {/* Paint splashes */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-coral-200 rounded-full opacity-25 animate-[ping_2s_ease-in-out_infinite]"></div>
              <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-golden-200 rounded-full opacity-30 animate-[pulse_3s_ease-in-out_infinite]"></div>

              {/* Profile Image */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center animate-fade-in" style={{ animationDuration: "1.2s" }}>
                {/* SVG Oblong Border */}
                <svg
                  viewBox="0 0 320 300"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="0.7"
                  style={{ zIndex: 1 }}
                >
                  <ellipse
                    cx="160"
                    cy="150"
                    rx="135"
                    ry="120"
                    style={{ transform: "rotate(-18deg)", transformOrigin: "170px 150px" }}
                  />
                </svg>
                <img
                  src="/profile.png"
                  alt="Jason Jay Gurang"
                  className="relative w-full h-full object-contain z-10"
                  style={{
                    borderRadius: "48% 52% 50% 50% / 55% 45% 55% 45%",
                    boxShadow: "0 0 0 0 transparent",
                  }}
                />
              </div>

              {/* Signature Lines */}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
