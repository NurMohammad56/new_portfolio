import type { LucideIconId } from "@/data/portfolio";

export interface StackFocusGroup {
  readonly id: string;
  readonly level: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIconId;
  readonly signal: string;
  readonly proof: string;
  readonly core: readonly string[];
  readonly supporting: readonly string[];
}

export const primaryStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
] as const;

export const stackFocusGroups = [
  {
    id: "backend-realtime",
    level: "PRIMARY SPECIALIZATION",
    title: "Backend & Real-time",
    description:
      "Mobile-first APIs, data models, authentication, business logic, and real-time product flows built for reliability.",
    icon: "Server",
    signal: "API + DATA + EVENTS",
    proof: "2+ YEARS BACKEND",
    core: ["Node.js", "Nest.js", "Express.js", "MongoDB", "PostgreSQL"],
    supporting: ["Mongoose", "Socket.IO", "REST APIs"],
  },
  {
    id: "interface-engineering",
    level: "AI-ASSISTED FRONTEND",
    title: "AI-Assisted Frontend",
    description:
      "AI-assisted React and Next.js implementation for responsive websites and product interfaces, with careful review of generated code, accessible UI, and dependable API integration.",
    icon: "PanelTop",
    signal: "AI ASSISTANCE + UI + APIs",
    proof: "BACKEND-FIRST DELIVERY",
    core: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
    supporting: ["shadcn/ui", "React Query", "Zustand", "Framer Motion"],
  },
  {
    id: "mobile-products",
    level: "MOBILE APPLICATIONS",
    title: "Mobile Products",
    description:
      "Backend systems that power mobile workflows: accounts, notifications, business rules, payments, and third-party services.",
    icon: "Smartphone",
    signal: "MOBILE APIs + DATA",
    proof: "MOBILE-FIRST SYSTEMS",
    core: ["REST APIs", "Authentication", "MongoDB", "PostgreSQL"],
    supporting: ["Notifications", "Payments", "Webhooks"],
  },
  {
    id: "product-systems",
    level: "PROJECT TOOLKIT",
    title: "Product Systems",
    description:
      "Authentication, subscriptions, media, maps, and AI-connected features integrated into real product journeys.",
    icon: "PlugZap",
    signal: "AUTH + INTEGRATIONS",
    proof: "IDENTITY · MEDIA · MAPS · AI",
    core: ["Clerk", "NextAuth", "JWT", "Google OAuth"],
    supporting: ["Cloudinary", "Mapbox", "AI APIs", "Speech-to-Text"],
  },
  {
    id: "production-release",
    level: "DELIVERY TOOLKIT",
    title: "Production & Release",
    description:
      "Backend services and websites deployed with server processes, domains, HTTPS, and version-controlled releases.",
    icon: "Rocket",
    signal: "DEPLOY + RELEASE",
    proof: "BACKEND · FRONTEND · WEBSITES",
    core: ["Git/GitHub", "CI/CD", "Vercel", "Linux", "Nginx", "PM2"],
    supporting: [
      "GitHub Actions",
      "AWS EC2",
      "SSL/Certbot",
      "DNS configuration",
    ],
  },
] as const satisfies readonly StackFocusGroup[];
