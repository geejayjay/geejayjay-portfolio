import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/ThemeContext";

/** One full-viewport "page" of the portfolio. */
export function Page({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-page
      className={cn(
        "relative flex min-h-[100svh] snap-start flex-col justify-center px-6 py-24 sm:px-10 md:pl-16 md:pr-24 lg:pl-24 lg:pr-32",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Fades content up as it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A hand-painted underline that draws itself in. */
export function BrushStroke({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="draw-stroke"
        pathLength={1}
        d="M4 12 C 48 3, 92 17, 150 9 S 248 4, 296 11"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Section title. The Painter gets a handwritten note and a brush underline;
 * the Developer gets a code comment and a blinking caret.
 */
export function SectionHeading({
  note,
  comment,
  title,
  children,
}: {
  /** handwritten eyebrow (Painter) */
  note: string;
  /** code-comment eyebrow (Developer) */
  comment: string;
  title: string;
  children?: ReactNode;
}) {
  const { isDark } = useTheme();
  return (
    <div>
      <p className="eyebrow">{isDark ? comment : note}</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-6xl">
        <span className="relative inline-block">
          {title}
          {isDark ? (
            <span className="caret">_</span>
          ) : (
            <BrushStroke className="absolute -bottom-3 left-0 h-4 w-full text-brand" />
          )}
        </span>
      </h2>
      {children && (
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-soft">{children}</p>
      )}
    </div>
  );
}
