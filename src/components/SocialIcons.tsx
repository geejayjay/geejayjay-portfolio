import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/ThemeContext";
import { socialLinks } from "./socialLinks";

/**
 * Social links, styled per persona:
 *  - Light (painter): each icon sits on a soft paint dab in its own pigment; on hover the dab
 *    floods with colour and tilts a touch, like a fresh brush mark.
 *  - Dark (builder): clean square keys with a hairline border; on hover, corner brackets snap
 *    in (the same motif as the hero's detection box) and the icon glows cyan.
 */

// one pigment per network, from the light-mode palette
const PIGMENT: Record<string, string> = {
  LinkedIn: "#4A7BB5", // ultramarine
  Instagram: "#E07A5F", // coral
  Facebook: "#E3B04B", // ochre
};

// slightly different dab shapes so the three don't look stamped
const DAB = [
  "rounded-[58%_42%_55%_45%/50%_58%_42%_50%]",
  "rounded-[45%_55%_42%_58%/58%_44%_56%_42%]",
  "rounded-[52%_48%_60%_40%/44%_52%_48%_56%]",
];

export default function SocialIcons({ size = "md", className }: { size?: "md" | "lg"; className?: string }) {
  const { isDark } = useTheme();
  const box = size === "lg" ? "h-11 w-11" : "h-9 w-9";

  return (
    <div className={cn("flex items-center", size === "lg" ? "gap-4" : "gap-2.5", className)}>
      {socialLinks.map((link, i) =>
        isDark ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className={cn(
              "group relative grid place-items-center rounded-[5px] border border-brand/20 bg-paper/60 text-soft",
              "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand",
              "hover:shadow-[0_0_18px_-4px_rgb(var(--c-accent)/0.7)] focus-visible:text-brand",
              box,
            )}
          >
            {/* corner brackets */}
            {[
              "-left-1 -top-1 border-l border-t",
              "-right-1 -top-1 border-r border-t",
              "-bottom-1 -left-1 border-b border-l",
              "-bottom-1 -right-1 border-b border-r",
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute h-2 w-2 border-brand opacity-0 transition-all duration-200",
                  "scale-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                  pos,
                )}
              />
            ))}
            <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{link.icon}</span>
          </a>
        ) : (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            style={{ ["--pig" as string]: PIGMENT[link.label] ?? "#CF6C58" }}
            className={cn("group relative grid place-items-center text-ink transition-colors duration-300", box)}
          >
            {/* the paint dab */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-[var(--pig)] opacity-20 transition-all duration-300 ease-out",
                "group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-100",
                "group-focus-visible:-rotate-6 group-focus-visible:scale-110 group-focus-visible:opacity-100",
                DAB[i % DAB.length],
              )}
            />
            {/* a tiny fleck thrown off the dab */}
            <span
              aria-hidden="true"
              className="absolute -right-0.5 top-0 h-1.5 w-1.5 rounded-[45%_55%_50%_50%] bg-[var(--pig)] opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-90"
            />
            <span className="relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white [&>svg]:h-[17px] [&>svg]:w-[17px]">
              {link.icon}
            </span>
          </a>
        ),
      )}
    </div>
  );
}
