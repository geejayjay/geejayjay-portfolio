import { useState, useEffect } from "react";
import { Download, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/hooks/ThemeContext";
import { Page } from "./Page";

const titles: [string, string][] = [
  ["Software", "Developer"],
  ["Electronics", "Engineer"],
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  // The intro sweep is the hero's entrance, so nothing fades in on first render
  // (a half-faded portrait would get caught in the sweep). Only later title
  // changes animate.
  const [rotated, setRotated] = useState(false);
  const { toast } = useToast();
  const { isDark } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % titles.length);
      setRotated(true);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

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

  const [first, second] = titles[current];

  return (
    <Page id="home">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        {/* ---------- Words ---------- */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="eyebrow">
            {isDark ? (
              <>
                <span className="text-soft">~/jason-jay-gurang</span> $ whoami
              </>
            ) : (
              "hello, I'm Jason Jay Gurang —"
            )}
          </p>

          <h1 className="font-display text-[clamp(2.6rem,7.5vw,6rem)] font-semibold leading-[1.02] tracking-tight text-ink">
            <span key={current} className={rotated ? "rise-in inline-block" : "inline-block"}>
              {first}
              <br />
              {isDark ? (
                <>
                  <span className="text-brand">{second}</span>
                  <span className="caret">_</span>
                </>
              ) : (
                <span className={rotated ? "swash italic" : "swash swash-static italic"}>{second}</span>
              )}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-soft lg:mx-0">
            {isDark ? (
              <>
                This is the <span className="text-ink">builder</span> in me — the one who cares how
                things work. APIs, data and systems that stay fast, clean and predictable.
              </>
            ) : (
              <>
                This is the <span className="text-ink">painter</span> in me — the one who cares how
                things look and feel. Interfaces with a splash of colour and a lot of intention.
              </>
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button onClick={handleDownload} className="btn btn-primary">
              <Download className="h-5 w-5" />
              {isDark ? "resume.pdf" : "Resume"}
            </button>
            <a href="#work" className="btn btn-ghost">
              {isDark ? "ls ./work" : "See my work"}
            </a>
          </div>

          {/* hint about the cursor toy — only meaningful with a mouse */}
          <p
            className={
              isDark
                ? "mt-10 hidden font-mono text-xs text-soft lg:block"
                : "mt-9 hidden -rotate-1 font-hand text-2xl text-brand3 lg:block"
            }
          >
            {isDark
              ? "// move your mouse — the source code follows"
              : "psst… your cursor is a brush. hold click to paint ✦"}
          </p>
        </div>

        {/* ---------- Portrait ---------- */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          {isDark ? <BuilderPortrait /> : <PainterPortrait />}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-soft transition-colors hover:text-brand md:flex"
      >
        <span className={isDark ? "font-mono text-[0.7rem]" : "font-hand text-lg"}>
          {isDark ? "scroll()" : "scroll"}
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </Page>
  );
}

function PainterPortrait() {
  return (
    <div className="relative h-72 w-64 sm:h-96 sm:w-80 lg:h-[30rem] lg:w-[26rem]">
      {/* paint pooled behind the portrait */}
      <div className="blob absolute inset-[6%] bg-brand2/30" />
      <div
        className="blob absolute inset-[14%] translate-x-6 translate-y-4 bg-brand/15"
        style={{ animationDelay: "-6s" }}
      />
      <div className="float-slow absolute -left-2 top-10 h-5 w-5 rounded-full bg-brand" />
      <div
        className="float-slow absolute bottom-16 right-0 h-3.5 w-3.5 rounded-full bg-brand3"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="float-slow absolute right-10 top-2 h-2.5 w-2.5 rounded-full bg-brand2"
        style={{ animationDelay: "-4s" }}
      />
      <img
        src="/profile-light.png"
        alt="Painted portrait of Jason Jay Gurang"
        className="relative z-10 h-full w-full select-none object-contain pointer-events-none"
        draggable={false}
      />
      <span className="absolute -bottom-3 right-4 z-20 -rotate-6 font-hand text-3xl text-ink/70">
        — jay
      </span>
    </div>
  );
}

function BuilderPortrait() {
  const corner = "absolute h-5 w-5 border-brand";
  return (
    <div className="relative h-72 w-64 sm:h-96 sm:w-80 lg:h-[30rem] lg:w-[26rem]">
      <div className="absolute inset-[12%] rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-slate-100/10 blur-2xl" />
      <img
        src="/profile-dark.png"
        alt="Portrait of Jason Jay Gurang"
        className="relative z-10 h-full w-full select-none object-contain pointer-events-none"
        style={{
          filter: "drop-shadow(0 0 18px rgba(0, 212, 255, 0.35))",
          maskImage: "linear-gradient(to bottom, black 78%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 96%)",
        }}
        draggable={false}
      />
      {/* detection box — a nod to the ML rabbit hole */}
      <div className="absolute inset-x-[8%] bottom-[10%] top-[6%] z-20">
        <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <span className="absolute -top-6 left-0 bg-brand px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-paper">
          builder 0.99
        </span>
      </div>
      <span className="float-slow absolute -right-3 top-1/4 z-20 font-mono text-xl font-bold text-brand2/70">
        {"{ }"}
      </span>
      <span
        className="float-slow absolute -left-4 bottom-1/4 z-20 font-mono text-lg font-bold text-brand/70"
        style={{ animationDelay: "-3s" }}
      >
        {"</>"}
      </span>
    </div>
  );
}
