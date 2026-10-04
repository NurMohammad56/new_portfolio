export interface ShowcaseProject {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly cover: string;
  readonly images: readonly string[];
  readonly links: {
    readonly website: string | null;
    readonly googlePlay: string | null;
    readonly appStore: string | null;
  };
}

// Demo content only. Replace these records and local images with verified work.
// Populate these fields with the real HTTPS URLs to enable the detail links.
const pendingLinks = { website: null, googlePlay: null, appStore: null } as const;
export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    id: "atlas",
    links: pendingLinks,
    title: "Atlas",
    category: "Mobile app backend",
    description: "A demo mobile platform exploring account management, API workflows, and organized application data. Actual project details will be added here.",
    technologies: ["Node.js", "Nest.js", "PostgreSQL"],
    cover: "/projects/demo-mobile.svg",
    images: ["/projects/demo-mobile.svg", "/projects/demo-dashboard.svg"],
  },
  {
    id: "relay",
    links: pendingLinks,
    title: "Relay",
    category: "Real-time systems",
    description: "A placeholder for a real-time product, with space for messaging, notifications, and background processing. This is a visual preview, not a published case study.",
    technologies: ["Node.js", "Socket.IO", "MongoDB"],
    cover: "/projects/demo-realtime.svg",
    images: ["/projects/demo-realtime.svg", "/projects/demo-dashboard.svg"],
  },
  {
    id: "ledger",
    links: pendingLinks,
    title: "Ledger",
    category: "Payments & integrations",
    description: "A demo operations dashboard for a future payments and integrations case study. Screenshots, implementation details, and outcomes will be replaced with real project content.",
    technologies: ["Express.js", "PostgreSQL", "Webhooks"],
    cover: "/projects/demo-dashboard.svg",
    images: ["/projects/demo-dashboard.svg", "/projects/demo-realtime.svg"],
  },
  {
    id: "nexus",
    links: pendingLinks,
    title: "Nexus",
    category: "Web platform backend",
    description: "A placeholder web platform showing how a backend project can be presented: structured APIs, authentication, and application workflows. Verified content is coming later.",
    technologies: ["Nest.js", "MongoDB", "JWT"],
    cover: "/projects/demo-realtime.svg",
    images: ["/projects/demo-realtime.svg", "/projects/demo-mobile.svg"],
  },
  {
    id: "studio",
    links: pendingLinks,
    title: "Studio",
    category: "AI-assisted frontend",
    description: "A demo interface preview for future AI-assisted frontend work, connected to backend APIs. The final project description and images will be supplied later.",
    technologies: ["React", "Next.js", "API integration"],
    cover: "/projects/demo-dashboard.svg",
    images: ["/projects/demo-dashboard.svg", "/projects/demo-mobile.svg"],
  },
];
