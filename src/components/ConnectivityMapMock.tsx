import { useMemo, useState } from "react";
import { Anchor, Compass, MapPin, Plane } from "lucide-react";
import { useTheme } from "@/hooks/ThemeContext";
import { cn } from "@/lib/utils";

type RouteKind = "air" | "sea";

type Hub = {
  id: string;
  name: string;
  country: string;
  x: number; // 0..1000 SVG coordinate
  y: number; // 0..625 SVG coordinate
  attractions: number;
  hotels: number;
  summary: string;
};

type Corridor = {
  id: string;
  from: string;
  to: string;
  kind: RouteKind;
  duration: string;
};

const HUBS: Hub[] = [
  {
    id: "bsb",
    name: "Bandar Seri Begawan",
    country: "Brunei Darussalam",
    x: 345,
    y: 300,
    attractions: 24,
    hotels: 18,
    summary: "Kampong Ayer water village, Omar Ali Saifuddien Mosque & Ulu Temburong.",
  },
  {
    id: "kk",
    name: "Kota Kinabalu",
    country: "Malaysia (Sabah)",
    x: 415,
    y: 235,
    attractions: 42,
    hotels: 36,
    summary: "Gateway to Mount Kinabalu UNESCO Park & Tunku Abdul Rahman Marine Park.",
  },
  {
    id: "pps",
    name: "Puerto Princesa",
    country: "Philippines (Palawan)",
    x: 470,
    y: 120,
    attractions: 31,
    hotels: 29,
    summary: "Subterranean River National Park, El Nido lagoons & Coron reefs.",
  },
  {
    id: "dvo",
    name: "Davao City",
    country: "Philippines (Mindanao)",
    x: 685,
    y: 205,
    attractions: 38,
    hotels: 34,
    summary: "Mt. Apo highlands, Samal Island resorts & Philippine Eagle Sanctuary.",
  },
  {
    id: "mdc",
    name: "Manado",
    country: "Indonesia (North Sulawesi)",
    x: 665,
    y: 375,
    attractions: 29,
    hotels: 22,
    summary: "Bunaken Marine Park diving walls & Minahasa volcanic highlands.",
  },
  {
    id: "bpn",
    name: "Balikpapan",
    country: "Indonesia (East Kalimantan)",
    x: 430,
    y: 445,
    attractions: 21,
    hotels: 25,
    summary: "Borneo orangutan sanctuaries, mangrove corridors & Derawan Islands.",
  },
];

const CORRIDORS: Corridor[] = [
  { id: "kk-bsb", from: "kk", to: "bsb", kind: "air", duration: "40m flight" },
  { id: "kk-pps", from: "kk", to: "pps", kind: "air", duration: "1h 15m flight" },
  { id: "dvo-mdc", from: "dvo", to: "mdc", kind: "air", duration: "1h 40m flight" },
  { id: "dvo-kk", from: "dvo", to: "kk", kind: "air", duration: "2h 05m flight" },
  { id: "bsb-bpn", from: "bsb", to: "bpn", kind: "sea", duration: "Coastal ferry" },
  { id: "kk-mdc", from: "kk", to: "mdc", kind: "sea", duration: "Maritime link" },
  { id: "pps-dvo", from: "pps", to: "dvo", kind: "air", duration: "1h 30m flight" },
];

export default function ConnectivityMapMock() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<"all" | RouteKind>("all");
  const [selectedId, setSelectedId] = useState<string>("dvo");

  const selectedHub = HUBS.find((h) => h.id === selectedId) ?? HUBS[0];

  const visibleCorridors = useMemo(
    () => (filter === "all" ? CORRIDORS : CORRIDORS.filter((c) => c.kind === filter)),
    [filter],
  );

  const hubLinks = useMemo(
    () =>
      visibleCorridors.filter((c) => c.from === selectedHub.id || c.to === selectedHub.id),
    [visibleCorridors, selectedHub.id],
  );

  const curvePath = (a: Hub, b: Hub) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 34;
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden select-none",
        isDark
          ? "bg-[#07111e] text-slate-100"
          : "bg-[#eaf4f6] text-slate-800",
      )}
    >
      {/* Subtle coordinate grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle at 1px 1px, rgba(56,189,248,0.22) 1px, transparent 0)"
            : "radial-gradient(circle at 1px 1px, rgba(15,118,110,0.18) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Overlay Toolbar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md",
            isDark
              ? "border border-cyan-500/25 bg-slate-900/80 text-cyan-300 font-mono"
              : "border border-teal-700/15 bg-white/85 text-teal-900 shadow-sm",
          )}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>BIMP-EAGA Connectivity</span>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full p-1 backdrop-blur-md",
            isDark
              ? "border border-slate-700/70 bg-slate-900/80"
              : "border border-teal-800/10 bg-white/85 shadow-sm",
          )}
        >
          {(
            [
              { id: "all", label: "All" },
              { id: "air", label: "Air" },
              { id: "sea", label: "Sea" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                filter === tab.id
                  ? isDark
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-teal-700 text-white"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stylized Regional Vector Map */}
      <svg
        viewBox="0 0 1000 625"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* Stylized landmass silhouettes (Borneo, Palawan, Mindanao, Sulawesi) */}
        <g
          fill={isDark ? "#0f2238" : "#d3e8e4"}
          stroke={isDark ? "#1e3a5f" : "#99c4be"}
          strokeWidth="1.5"
        >
          {/* Borneo */}
          <path d="M 210 380 Q 250 280 340 245 Q 410 195 465 235 Q 495 290 475 375 Q 460 465 390 495 Q 290 505 225 450 Z" />
          {/* Palawan */}
          <path d="M 435 160 Q 470 105 515 78 Q 528 86 495 135 Q 460 175 435 160 Z" />
          {/* Mindanao */}
          <path d="M 605 170 Q 665 135 725 165 Q 750 215 710 265 Q 645 275 595 235 Q 585 195 605 170 Z" />
          {/* Sulawesi */}
          <path d="M 615 360 Q 670 335 705 375 Q 685 435 715 490 Q 665 520 620 485 Q 590 420 615 360 Z" />
        </g>

        {/* Connectivity Curves */}
        {visibleCorridors.map((c) => {
          const from = HUBS.find((h) => h.id === c.from)!;
          const to = HUBS.find((h) => h.id === c.to)!;
          const active = c.from === selectedHub.id || c.to === selectedHub.id;
          const stroke =
            c.kind === "air"
              ? isDark
                ? "#38bdf8"
                : "#0f766e"
              : isDark
                ? "#34d399"
                : "#d97706";
          return (
            <path
              key={c.id}
              d={curvePath(from, to)}
              fill="none"
              stroke={stroke}
              strokeWidth={active ? 2.6 : 1.5}
              strokeDasharray={c.kind === "air" ? "6 5" : "2 5"}
              opacity={active ? 0.95 : 0.38}
            />
          );
        })}

        {/* Interactive Hub Pins */}
        {HUBS.map((hub) => {
          const active = hub.id === selectedHub.id;
          return (
            <g
              key={hub.id}
              transform={`translate(${hub.x}, ${hub.y})`}
              onClick={() => setSelectedId(hub.id)}
              className="cursor-pointer"
            >
              {active && (
                <circle
                  r={18}
                  fill={isDark ? "rgba(56,189,248,0.18)" : "rgba(15,118,110,0.16)"}
                />
              )}
              <circle
                r={active ? 8 : 5.5}
                fill={
                  active
                    ? isDark
                      ? "#38bdf8"
                      : "#0f766e"
                    : isDark
                      ? "#94a3b8"
                      : "#475569"
                }
                stroke={isDark ? "#07111e" : "#ffffff"}
                strokeWidth="2"
              />
              <text
                x={12}
                y={4}
                fontSize="12"
                fontWeight={active ? "700" : "500"}
                fill={
                  active
                    ? isDark
                      ? "#f8fafc"
                      : "#0f172a"
                    : isDark
                      ? "#94a3b8"
                      : "#475569"
                }
              >
                {hub.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom Floating Hub Detail Card */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col gap-2 sm:inset-x-4 sm:bottom-4 sm:flex-row sm:items-end sm:justify-between">
        <div
          className={cn(
            "pointer-events-auto max-w-sm rounded-xl p-3.5 backdrop-blur-md",
            isDark
              ? "border border-cyan-500/25 bg-slate-900/90"
              : "border border-teal-800/15 bg-white/92 shadow-lg",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
              <MapPin className="h-3.5 w-3.5" />
              <span>{selectedHub.country}</span>
            </div>
            <span className="text-[11px] text-soft">
              {hubLinks.length} {hubLinks.length === 1 ? "route" : "routes"}
            </span>
          </div>

          <h4 className="mt-1 font-display text-base font-semibold text-ink">
            {selectedHub.name}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-soft">{selectedHub.summary}</p>

          <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-0.5",
                isDark ? "bg-cyan-500/10 text-cyan-300" : "bg-teal-50 text-teal-800",
              )}
            >
              <Plane className="h-3 w-3" />
              {selectedHub.attractions} Attractions
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-0.5",
                isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-50 text-amber-800",
              )}
            >
              <Anchor className="h-3 w-3" />
              {selectedHub.hotels} Hotels
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
