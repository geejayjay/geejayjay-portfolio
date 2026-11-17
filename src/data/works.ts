export type WorkCategory =
  | "Full-Stack Web"
  | "3D Modeling"
  | "Graphic Design"
  | "Embedded Systems";

export type ShowcaseView = {
  id: string;
  label: string;
  device: "desktop" | "mobile";
  asset: string;
  mediaType?: "image" | "video";
  poster?: string;
  animatedScroll?: boolean;
  hasAreasHover?: boolean;
  pinWebNavbar?: boolean;
  pinAdminChrome?: boolean;
  isMapMock?: boolean;
  cursorWaypoints?: { x: number; y: number }[];
  jumps?: { label: string; pct: number }[];
  caption: string;
};

export type DetailScreenshot = {
  name: string;
  title: string;
  file: string;
  mediaType?: "image" | "video";
  poster?: string;
  caption: string;
};

export const isVideoAsset = (src: string, mediaType?: "image" | "video") =>
  mediaType === "video" || /\.(webm|mp4)(\?|$)/i.test(src);

export type ArchitectureTier = {
  name: string;
  role: string;
  framework: string;
  highlights: string[];
};

export type WorkItem = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  type: WorkCategory;
  categories: string[];
  role: string;
  organization?: string;
  year: string;
  status: string;
  featured?: boolean;
  liveUrl?: string;
  thumbnail: string;
  tags: string[];
  challenges?: string[];
  solutions?: string[];
  highlights?: string[];
  architecture?: ArchitectureTier[];
  showcaseViews?: ShowcaseView[];
  detailGallery?: DetailScreenshot[];
};

/**
 * Concise NDA note shown across the works section and dedicated works archive.
 */
export const NDA_NOTE = {
  painter:
    "Note: Most enterprise C# / ASP.NET projects from my first two roles are under NDA and not shown here.",
  builder:
    "// note: enterprise ASP.NET / C# work from my first two roles is under NDA.",
};

export const works: WorkItem[] = [
  {
    slug: "experience-east-asean",
    title: "Experience East ASEAN",
    tagline: "Multilingual tourism portal, connectivity map, and headless CMS for BIMP-EAGA.",
    description:
      "3-tier regional tourism platform for Brunei, Indonesia, Malaysia, and the Philippines — 6-language Nuxt 4 SSR portal, interactive map, 3D flipbook, and Vue 3 CMS.",
    overview:
      "Experience East ASEAN is a regional tourism portal and content ecosystem built for the Brunei Darussalam–Indonesia–Malaysia–Philippines East ASEAN Growth Area (BIMP-EAGA). It unifies destinations, cultural attractions, accredited hotels, local cuisines, travel services, events, travel stories, and interactive digital guides into a fast, multilingual web platform backed by a custom headless CMS.",
    type: "Full-Stack Web",
    categories: ["Full-Stack Web", "Tourism & Mapping", "Headless CMS", "Multilingual SSR"],
    role: "Full-Stack Developer",
    organization: "MinDA / BIMP-EAGA",
    year: "2025",
    status: "Production",
    featured: true,
    liveUrl: "https://experienceeastasean.com",
    thumbnail: "/works/experience-east-asean/web-home-desktop.webp",
    tags: [
      "Nuxt 4",
      "Vue 3",
      "TypeScript",
      "Tailwind CSS",
      "Fastify 5",
      "PostgreSQL",
      "Drizzle ORM",
      "Redis (Optional)",
      "Mapbox GL",
      "TipTap v3",
      "Sharp",
      "AWS S3 Compatible",
    ],
    challenges: [
      "Showcase tourism across 10+ cross-border focus areas in 4 countries while supporting 6 languages (English, Filipino, Bahasa Melayu, Bahasa Indonesia, Chinese, and Japanese).",
      "Combine rich spatial discovery (routes, air/sea connectivity, and nearby POIs) with editorial storytelling and interactive PDF travel brochures.",
      "Empower non-technical regional editors to publish localized content, optimize media, and monitor analytics from one unified admin portal.",
    ],
    solutions: [
      "Built a hybrid SSR + SWR Nuxt 4 public portal with @nuxtjs/i18n, TanStack Vue Query hydration, Mapbox GL connectivity mapping, and an in-browser 3D flipbook viewer (pdfjs-dist + page-flip).",
      "Engineered a custom Vue 3 + Radix Vue Admin CMS featuring TipTap v3 rich-text editing, MapLibre geocoding, Better Auth RBAC, and embedded Google Analytics charts.",
      "Architected a Fastify 5 + Drizzle ORM (PostgreSQL) REST API with optional Redis caching and an automated Sharp + AWS S3-compatible image pipeline converting uploads into responsive WebP assets.",
    ],
    highlights: [
      "6-language internationalization (en, tl, ms, id, zh, ja) with SSR and locale-aware SEO (dynamic sitemap.xml, JSON-LD TouristDestination & BreadcrumbList)",
      "Interactive Mapbox GL connectivity & regional discovery map linking focus areas, attractions, hotels, restaurants, and travel services",
      "Custom 3D digital publication Flipbook viewer (pdfjs-dist + page-flip) for regional travel guides and brochures",
      "Custom Vue 3 Admin CMS with TipTap v3 rich-text authoring, MapLibre geocoding, Better Auth RBAC, and Google Analytics Data API charts",
      "High-performance Fastify 5 API with Drizzle ORM (PostgreSQL), optional Redis caching, Sharp WebP optimization, and AWS S3-compatible storage",
    ],
    architecture: [
      {
        name: "bimp-eaga-web",
        role: "Public SSR Web Portal",
        framework: "Nuxt 4 (Vue 3, SSR + SWR)",
        highlights: [
          "Tailwind CSS, Pinia & TanStack Vue Query",
          "@nuxtjs/i18n across 6 regional & global languages",
          "Mapbox GL interactive spatial discovery",
          "pdfjs-dist + page-flip 3D brochure viewer",
        ],
      },
      {
        name: "bimp-eaga-admin",
        role: "Custom Headless CMS",
        framework: "Vite + Vue 3 + TypeScript",
        highlights: [
          "Radix Vue accessible primitives & TanStack Vue Table",
          "TipTap v3 rich-text editorial workflow",
          "MapLibre GL + Mapbox Geocoder pin placement",
          "Better Auth RBAC & Chart.js analytics dashboard",
        ],
      },
      {
        name: "bimp-eaga-api",
        role: "REST API & Media Pipeline",
        framework: "Fastify 5 + TypeScript",
        highlights: [
          "PostgreSQL + Drizzle ORM + optional Redis (ioredis) caching",
          "Sharp responsive WebP pipeline + AWS S3 Compatible",
          "@fastify/helmet & @fastify/rate-limit hardening",
          "Google Analytics Data API integration",
        ],
      },
    ],
    showcaseViews: [
      {
        id: "web-desktop",
        label: "Public Portal",
        device: "desktop",
        asset: "/works/experience-east-asean/web-home-desktop.webp",
        animatedScroll: true,
        hasAreasHover: true,
        pinWebNavbar: true,
        jumps: [
          { label: "Top", pct: 0 },
          { label: "Areas Map", pct: 22 },
          { label: "Attractions", pct: 50 },
          { label: "Stories", pct: 75 },
          { label: "Footer", pct: 100 },
        ],
        caption: "Full-page Nuxt 4 SSR landing experience with regional highlights and curated discovery.",
      },
      {
        id: "web-mobile",
        label: "Mobile View",
        device: "mobile",
        asset: "/works/experience-east-asean/web-home-mobile.webp",
        animatedScroll: true,
        pinWebNavbar: true,
        caption: "Responsive mobile layout built for travelers browsing across Southeast Asia.",
      },
      {
        id: "connectivity-map",
        label: "Connectivity Map",
        device: "desktop",
        asset: "/works/experience-east-asean/loops/connectivity-map.webm",
        mediaType: "video",
        poster: "/works/experience-east-asean/web-connectivity-map.webp",
        caption: "6.4s Mapbox GL fly-to zoom & regional connectivity corridor micro-loop.",
      },
      {
        id: "flipbook-demo",
        label: "3D Flipbook",
        device: "desktop",
        asset: "/works/experience-east-asean/loops/flipbook-demo.webm",
        mediaType: "video",
        poster: "/works/experience-east-asean/details/feature-flipbook-viewer.webp",
        caption: "5s interactive 3D PDF flipbook page-turning micro-loop (pdfjs-dist + page-flip).",
      },
      {
        id: "web-explore",
        label: "Explore Directory",
        device: "desktop",
        asset: "/works/experience-east-asean/web-explore-desktop.webp",
        animatedScroll: true,
        pinWebNavbar: true,
        cursorWaypoints: [
          { x: 28, y: 34 },
          { x: 54, y: 42 },
          { x: 74, y: 55 },
          { x: 36, y: 66 },
        ],
        caption: "Multi-category filtering across focus areas, attractions, accommodations, and dining.",
      },
      {
        id: "travel-stories",
        label: "Travel Stories",
        device: "desktop",
        asset: "/works/experience-east-asean/web-travel-stories.webp",
        animatedScroll: true,
        pinWebNavbar: true,
        cursorWaypoints: [
          { x: 48, y: 45 },
          { x: 24, y: 58 },
          { x: 76, y: 58 },
          { x: 52, y: 68 },
        ],
        caption: "Editorial travel stories authored in TipTap v3 and rendered with sanitized HTML.",
      },
      {
        id: "admin-dashboard",
        label: "Admin Dashboard",
        device: "desktop",
        asset: "/works/experience-east-asean/admin/admin-dashboard.webp",
        animatedScroll: true,
        pinAdminChrome: true,
        cursorWaypoints: [
          { x: 28, y: 26 },
          { x: 48, y: 26 },
          { x: 56, y: 52 },
          { x: 72, y: 68 },
        ],
        caption: "Custom Vue 3 Admin CMS dashboard with RBAC, publishing workflows, and GA4 metrics.",
      },
      {
        id: "admin-editor",
        label: "Admin CMS Editor",
        device: "desktop",
        asset: "/works/experience-east-asean/admin/admin-editor.webp",
        animatedScroll: true,
        pinAdminChrome: true,
        cursorWaypoints: [
          { x: 38, y: 30 },
          { x: 82, y: 46 },
          { x: 44, y: 58 },
          { x: 58, y: 70 },
        ],
        caption: "TipTap v3 rich-text editorial workflow with MapLibre geocoding and media uploads.",
      },
      {
        id: "admin-tables",
        label: "Admin Tables",
        device: "desktop",
        asset: "/works/experience-east-asean/admin/admin-partners.webp",
        animatedScroll: false,
        pinAdminChrome: true,
        cursorWaypoints: [
          { x: 32, y: 22 },
          { x: 42, y: 38 },
          { x: 86, y: 38 },
          { x: 42, y: 56 },
        ],
        caption: "TanStack Vue Table data views for managing destinations, partners, and listings.",
      },
    ],
    detailGallery: [
      {
        name: "detail-destination",
        title: "Destination Detail",
        file: "/works/experience-east-asean/details/detail-destination.webp",
        caption: "Rich destination profile with nearby attractions, accommodations, and structured JSON-LD.",
      },
      {
        name: "detail-travel-story",
        title: "Travel Story",
        file: "/works/experience-east-asean/details/detail-travel-story.webp",
        caption: "Long-form editorial layout backed by TipTap v3 rich-text blocks.",
      },
      {
        name: "feature-events-calendar",
        title: "Events Calendar",
        file: "/works/experience-east-asean/details/feature-events-calendar.webp",
        caption: "Cross-border cultural festivals and tourism events schedule.",
      },
      {
        name: "feature-resources",
        title: "Digital Publications",
        file: "/works/experience-east-asean/details/feature-resources.webp",
        caption: "Downloadable and interactive regional tourism guides.",
      },
      {
        name: "feature-flipbook-viewer",
        title: "3D Flipbook Viewer",
        file: "/works/experience-east-asean/loops/flipbook-demo.webm",
        mediaType: "video",
        poster: "/works/experience-east-asean/details/feature-flipbook-viewer.webp",
        caption: "In-browser 3D page-turning brochure reader built with pdfjs-dist and page-flip.",
      },
      {
        name: "area-sabah",
        title: "Sabah Focus Area",
        file: "/works/experience-east-asean/areas/area-sabah.webp",
        caption: "Interactive regional focus area highlight (Sabah, Palawan, Mindanao, Brunei).",
      },
    ],
  },
  {
    slug: "veers-iot-3d-render",
    title: "3D Render of VEERS IoT",
    tagline: "3D enclosure visualization for an IoT environmental sensor node.",
    description:
      "3D hardware visualization of the weatherproof enclosure for the VEERS IoT capstone project.",
    overview:
      "Designed as part of my Electronics Engineering capstone, this 3D render visualizes the physical enclosure, sensor mounting layout, and weatherproof housing for the VEERS IoT field node prior to fabrication.",
    type: "3D Modeling",
    categories: ["3D Modeling", "Embedded Systems", "Hardware"],
    role: "Hardware & 3D Designer",
    organization: "University of Southeastern Philippines",
    year: "2020",
    status: "Completed",
    thumbnail: "/works/VEERS-IOT 3D Render.png",
    tags: ["TinkerCAD", "IoT", "Hardware Enclosure", "Prototyping"],
    highlights: [
      "Modeled sensor housing geometry and ventilation clearances for field deployment",
      "Aligned PCB mounting posts and external probe ports for rapid prototyping",
    ],
  },
  {
    slug: "pase-logo-design",
    title: "Printing All-Star Enterprise Logo",
    tagline: "Print-ready brand identity emblem for a local printing business.",
    description:
      "Logo and brand mark for Printing All-Star Enterprise, built for signage and print.",
    overview:
      "Created a distinctive visual identity mark for Printing All-Star Enterprise, tailored to reproduce cleanly across signage, apparel, business stationery, and digital storefronts.",
    type: "Graphic Design",
    categories: ["Graphic Design", "Branding"],
    role: "Graphic Designer",
    organization: "Printing All-Star Enterprise",
    year: "2021",
    status: "Completed",
    thumbnail: "/works/PASE Logo.jpg",
    tags: ["Photoshop", "Brand Identity", "Logo Design", "Print"],
    highlights: [
      "Designed for high legibility across both physical print merchandise and digital media",
      "Balanced bold star motif with crisp typographic hierarchy",
    ],
  },
];

export const getWorkBySlug = (slug: string) => works.find((w) => w.slug === slug);
