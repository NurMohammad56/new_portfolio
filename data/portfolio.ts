/**
 * Portfolio copy and structured content sourced from the supplied brief.
 *
 * Keep this module serializable: icons are Lucide export names rather than
 * React elements, and unverified project/contact details are intentionally
 * represented as null or empty collections.
 */

export type LucideIconId =
  | "AppWindow"
  | "Apple"
  | "BadgeCheck"
  | "Blocks"
  | "Bot"
  | "Braces"
  | "CloudCog"
  | "CloudUpload"
  | "Code2"
  | "CreditCard"
  | "Database"
  | "FlaskConical"
  | "Gauge"
  | "GitBranch"
  | "Globe2"
  | "Layers3"
  | "LayoutDashboard"
  | "MapPinned"
  | "MessageSquare"
  | "PanelTop"
  | "PenTool"
  | "PlugZap"
  | "Radio"
  | "Rocket"
  | "Search"
  | "Server"
  | "ServerCog"
  | "ShieldCheck"
  | "Smartphone"
  | "Sparkles"
  | "Store"
  | "Wrench";

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "services"
  | "deployment"
  | "contact";

export interface NavigationItem {
  readonly label: string;
  readonly section: SectionId;
  readonly href: `#${SectionId}`;
}

export interface Capability {
  readonly label: string;
  readonly icon: LucideIconId;
}

export type TechGroupId =
  | "frontend"
  | "mobile"
  | "backend"
  | "authentication"
  | "integrations"
  | "devops";

export interface Technology {
  readonly name: string;
  readonly description: string;
}

export interface TechGroup {
  readonly id: TechGroupId;
  readonly label: string;
  readonly icon: LucideIconId;
  readonly technologies: readonly Technology[];
}

export interface Service {
  readonly number: `${number}`;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIconId;
}

export interface ProcessStep {
  readonly number: `${number}`;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIconId;
}

export type DeploymentLaneId =
  | "web"
  | "backend"
  | "database";

export interface DeploymentLane {
  readonly id: DeploymentLaneId;
  readonly label: string;
  readonly icon: LucideIconId;
  readonly destinations: readonly string[];
}

export interface ClientWorkItem {
  readonly label: string;
  readonly icon: LucideIconId;
}

export interface ProofPoint {
  readonly label: string;
  readonly icon: LucideIconId;
}

export interface SocialLink {
  readonly label: "GitHub" | "LinkedIn" | "X" | "Email";
  readonly monogram: "GH" | "in" | "X" | "@";
  readonly description: string;
  readonly href: string | null;
}

export type ProjectCategory =
  | "SaaS"
  | "E-commerce"
  | "Mobile Apps"
  | "Location-based Applications";

export type ProjectEditorialLayout = "media-left" | "media-right" | "immersive";

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface ProjectPlaceholder {
  readonly id: `project-placeholder-${"01" | "02" | "03"}`;
  readonly number: "01" | "02" | "03";
  readonly status: "placeholder";
  readonly isPlaceholder: true;
  readonly placeholderLabel: string;
  readonly editorialLayout: ProjectEditorialLayout;
  readonly name: null;
  readonly category: null;
  readonly description: null;
  readonly technologyStack: readonly string[];
  readonly keyFeatures: readonly string[];
  readonly platform: null;
  readonly links: readonly ProjectLink[];
}

/** Shape to use after a project has been verified and is ready to publish. */
export interface VerifiedProject {
  readonly id: string;
  readonly number: `${number}`;
  readonly status: "published";
  readonly isPlaceholder: false;
  readonly placeholderLabel: null;
  readonly editorialLayout: ProjectEditorialLayout;
  readonly name: string;
  readonly category: ProjectCategory;
  readonly description: string;
  readonly technologyStack: readonly string[];
  readonly keyFeatures: readonly string[];
  readonly platform: string;
  readonly links: readonly ProjectLink[];
}

export type PortfolioProject = ProjectPlaceholder | VerifiedProject;

export const siteIdentity = {
  initials: "NM",
  name: "Nur Mohammad",
  role: "Backend Developer · AI-Assisted Frontend",
  experience: "2+ years building backend systems",
  availabilityLabel: "AVAILABLE FOR SELECTED PROJECTS",
  heroHeadline: "Backend systems for mobile & web that stay reliable.",
  heroDescription:
    "I build reliable APIs, data systems, real-time features, and production infrastructure for mobile and web applications—with AI-assisted frontend support when needed.",
  primaryCta: {
    label: "View Live Projects",
    href: "#projects",
  },
  secondaryCta: {
    label: "Let's Talk",
    href: "#contact",
  },
} as const;

export const navigation = [
  { label: "Home", section: "home", href: "#home" },
  {
    label: "Experience",
    section: "experience",
    href: "#experience",
  },
  { label: "Projects", section: "projects", href: "#projects" },
  { label: "Skills", section: "skills", href: "#skills" },
  { label: "Services", section: "services", href: "#services" },
  { label: "Deployment", section: "deployment", href: "#deployment" },
  { label: "Contact", section: "contact", href: "#contact" },
] as const satisfies readonly NavigationItem[];

export const navigationCta = {
  label: "Let's Work Together",
  href: "#contact",
} as const;

export const capabilities = [
  { label: "Mobile app backends", icon: "Smartphone" },
  { label: "REST APIs", icon: "Braces" },
  { label: "Database architecture", icon: "Database" },
  { label: "Business logic", icon: "Layers3" },
  { label: "Authentication", icon: "ShieldCheck" },
  { label: "Real-time systems", icon: "Radio" },
  { label: "Queues & background jobs", icon: "ServerCog" },
  { label: "Payments & webhooks", icon: "CreditCard" },
  { label: "Third-party integrations", icon: "PlugZap" },
  { label: "VPS deployment", icon: "CloudUpload" },
  { label: "AI-assisted frontend", icon: "Sparkles" },
] as const satisfies readonly Capability[];

export const capabilitySummary = {
  headline: "Building the systems behind the screen.",
  introduction:
    "I am Nur Mohammad, a backend-focused developer with 2+ years of experience building APIs and backend systems for mobile applications, web platforms, real-time products, and enterprise workflows.",
  experienceValue: "2+",
  experienceLabel: "Years in Backend Development",
  deliveryScope: ["APIs", "Data", "Mobile", "Production"],
  capabilities,
} as const;

export const techGroups = [
  {
    id: "frontend",
    label: "Frontend (AI-assisted)",
    icon: "PanelTop",
    technologies: [
      { name: "React", description: "Frontend integration and UI delivery." },
      { name: "Next.js", description: "AI-assisted web application development." },
      { name: "TypeScript", description: "Type-safe application development." },
      { name: "JavaScript", description: "Frontend logic and API integration." },
      {
        name: "Tailwind CSS",
        description: "Responsive utility-first styling.",
      },
      {
        name: "shadcn/ui",
        description: "Accessible composable UI primitives.",
      },
      {
        name: "AI coding tools",
        description: "Faster UI implementation and iteration.",
      },
      { name: "API integration", description: "Connecting interfaces to backend systems." },
    ],
  },
  {
    id: "mobile",
    label: "Mobile app backends",
    icon: "Smartphone",
    technologies: [
      {
        name: "Mobile REST APIs",
        description: "Backend interfaces for mobile applications.",
      },
      { name: "Push notifications", description: "Backend notification workflows." },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "Server",
    technologies: [
      { name: "Node.js", description: "JavaScript server runtimes." },
      { name: "Nest.js", description: "Structured and maintainable backend architecture." },
      { name: "Express.js", description: "Web services and API routing." },
      { name: "MongoDB", description: "Document-based application data." },
      { name: "PostgreSQL", description: "Relational data and transactions." },
      { name: "Mongoose", description: "MongoDB models and validation." },
      { name: "REST APIs", description: "Structured application interfaces." },
      {
        name: "Socket.IO",
        description: "Real-time bidirectional communication.",
      },
      { name: "Queues & workers", description: "Reliable asynchronous processing." },
    ],
  },
  {
    id: "authentication",
    label: "Authentication",
    icon: "ShieldCheck",
    technologies: [
      { name: "Clerk", description: "Managed identity and authentication." },
      {
        name: "NextAuth",
        description: "Authentication for Next.js applications.",
      },
      { name: "JWT", description: "Token-based authorization flows." },
      { name: "Google OAuth", description: "Google account sign-in flows." },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "PlugZap",
    technologies: [
      {
        name: "RevenueCat",
        description: "Mobile subscription infrastructure.",
      },
      {
        name: "Apple In-App Purchases",
        description: "Native iOS purchase flows.",
      },
      {
        name: "Cloudinary",
        description: "Cloud media delivery and transforms.",
      },
      { name: "Mapbox", description: "Maps and location-based experiences." },
      { name: "AI APIs", description: "AI-powered product capabilities." },
      {
        name: "Speech-to-Text",
        description: "Spoken audio transcription flows.",
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: "CloudCog",
    technologies: [
      { name: "Vercel", description: "Frontend and full-stack deployment." },
      { name: "Hostinger VPS", description: "Virtual private server hosting." },
      { name: "AWS EC2", description: "Cloud compute deployment." },
      { name: "Render", description: "Managed application hosting." },
      { name: "Nginx", description: "Web serving and reverse proxying." },
      { name: "PM2", description: "Node.js process management." },
      { name: "Linux", description: "Production server environments." },
      { name: "Git/GitHub", description: "Version control and collaboration." },
      { name: "DNS", description: "Production domain configuration." },
      { name: "SSL/Certbot", description: "HTTPS certificate provisioning." },
    ],
  },
] as const satisfies readonly TechGroup[];

export const services = [
  {
    number: "01",
    title: "Backend & API Development",
    description:
      "Maintainable Node.js services, REST APIs, validation, error handling, and business logic.",
    icon: "Braces",
  },
  {
    number: "02",
    title: "AI-Assisted Frontend",
    description: "React and Next.js interfaces built with AI assistance, connected thoughtfully to backend APIs.",
    icon: "PanelTop",
  },
  {
    number: "03",
    title: "Mobile App Backends",
    description: "The APIs, authentication, data, notifications, and integrations mobile products depend on.",
    icon: "Smartphone",
  },
  {
    number: "04",
    title: "Data & System Design",
    description: "MongoDB and PostgreSQL modeling, relationships, transactions, pagination, and query optimization.",
    icon: "Database",
  },
  {
    number: "05",
    title: "Real-time & Integrations",
    description: "WebSockets, queues, workers, payments, webhooks, OAuth, notifications, and third-party APIs.",
    icon: "PlugZap",
  },
  {
    number: "06",
    title: "Deployment & Production Setup",
    description: "Backend services, frontend applications, and websites deployed on Linux VPS or Vercel with practical production configuration.",
    icon: "ServerCog",
  },
] as const satisfies readonly Service[];

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand requirements and goals.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Design",
    description: "Translate ideas into a clean product experience.",
    icon: "PenTool",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop frontend, backend, APIs, and integrations.",
    icon: "Code2",
  },
  {
    number: "04",
    title: "Test",
    description: "QA, responsive testing, performance, and bug fixing.",
    icon: "FlaskConical",
  },
  {
    number: "05",
    title: "Deploy",
    description: "Deploy backend services, web interfaces, and databases.",
    icon: "CloudUpload",
  },
  {
    number: "06",
    title: "Launch",
    description:
      "Verify the website, API endpoints, domain routing, and HTTPS setup.",
    icon: "Rocket",
  },
] as const satisfies readonly ProcessStep[];

export const deploymentLanes = [
  { id: "web", label: "FRONTEND & WEBSITES", icon: "Globe2", destinations: ["React / Next.js", "Vercel", "Production builds"] },
  { id: "backend", label: "BACKEND SERVICES", icon: "Server", destinations: ["Node.js / Express", "Linux VPS", "PM2"] },
  { id: "database", label: "DATA & INFRASTRUCTURE", icon: "Database", destinations: ["MongoDB / PostgreSQL", "Nginx", "DNS & HTTPS"] },
] as const satisfies readonly DeploymentLane[];

export const productionPipeline = [
  "IDEA",
  "DEVELOPMENT",
  "API",
  "TESTING",
  "DEPLOYMENT",
  "LIVE PRODUCT",
] as const;

export interface CicdStage {
  readonly id: string;
  readonly phase: "CI" | "CD";
  readonly stepNumber: string;
  readonly name: string;
  readonly subtitle: string;
  readonly description: string;
  readonly iconName: LucideIconId;
  readonly tools: readonly string[];
  readonly terminalCommand: string;
  readonly highlight?: string;
}

export const cicdStages: readonly CicdStage[] = [
  {
    id: "plan", phase: "CI", stepNumber: "01", name: "Plan & Branch",
    subtitle: "Requirements & version control",
    description: "Define the API or website change, review its dependencies, and work in a focused Git branch.",
    iconName: "GitBranch", tools: ["Git", "GitHub", "Pull requests"],
    terminalCommand: "git switch -c feature/api-update",
  },
  {
    id: "code", phase: "CI", stepNumber: "02", name: "Code & Types",
    subtitle: "Backend logic & frontend integration",
    description: "Implement validated backend endpoints and connect React or Next.js interfaces to the API.",
    iconName: "Code2", tools: ["Node.js", "Express", "TypeScript", "React / Next.js"],
    terminalCommand: "npx tsc --noEmit",
  },
  {
    id: "build", phase: "CI", stepNumber: "03", name: "Production Build",
    subtitle: "Release-ready application",
    description: "Create production builds and check environment configuration before publishing a release.",
    iconName: "Blocks", tools: ["npm", "Next.js build", "Environment variables"],
    terminalCommand: "npm ci && npm run build",
  },
  {
    id: "test", phase: "CI", stepNumber: "04", name: "Test & Review",
    subtitle: "API checks & application quality",
    description: "Check authentication, validation, API responses, and critical website flows before deployment.",
    iconName: "FlaskConical", tools: ["Postman", "ESLint", "GitHub Actions"],
    terminalCommand: "npm run lint",
  },
  {
    id: "release", phase: "CD", stepNumber: "05", name: "Prepare Release",
    subtitle: "Versioning & configuration",
    description: "Review the release changes, keep secrets outside source control, and retain the previous version for rollback.",
    iconName: "Rocket", tools: ["Git tags", "Release notes", "Environment config"],
    terminalCommand: "git tag v1.0.0",
  },
  {
    id: "deploy", phase: "CD", stepNumber: "06", name: "Deploy",
    subtitle: "Websites & backend services",
    description: "Publish the frontend to Vercel or a web server, and run backend services on a configured Linux VPS.",
    iconName: "CloudUpload", tools: ["Vercel", "Linux VPS", "PM2"],
    terminalCommand: "pm2 reload ecosystem.config.js --update-env",
  },
  {
    id: "operate", phase: "CD", stepNumber: "07", name: "Configure Server",
    subtitle: "Domains, reverse proxy & HTTPS",
    description: "Configure Nginx routing, domain DNS, SSL certificates, and application process management.",
    iconName: "ServerCog", tools: ["Nginx", "PM2", "DNS", "SSL / Certbot"],
    terminalCommand: "sudo nginx -t",
  },
  {
    id: "monitor", phase: "CD", stepNumber: "08", name: "Monitor & Maintain",
    subtitle: "Logs & health checks",
    description: "Review application logs, verify live endpoints, and diagnose process or server issues after each release.",
    iconName: "Gauge", tools: ["PM2 logs", "Health checks", "Nginx logs"],
    terminalCommand: "pm2 status",
  },
] as const;


export const experience = {
  metric: "2+",
  title: "Years in Professional Development",
  areas: [
    "Backend Developer — Scaleup IT Limited · Mar 2025–Present",
    "Full Stack Developer — Arabian Services Company · Jun 2024–Jan 2025",
    "Scalable RESTful APIs and deployment",
    "MongoDB data modeling and query optimization",
    "JWT authentication and role-based access control",
    "Web platform delivery, data synchronization, and real-time notifications",
  ],
} as const;

export const clientWork = {
  eyebrow: "Backend / Product Delivery",
  title: "Systems that support real products",
  description:
    "Backend-focused delivery across mobile applications, web platforms, real-time features, and production infrastructure.",
  items: [
    { label: "Mobile app backends", icon: "Smartphone" },
    { label: "REST API development", icon: "Braces" },
    { label: "Authentication & authorization", icon: "ShieldCheck" },
    { label: "Database design", icon: "Database" },
    { label: "Real-time communication", icon: "Radio" },
    { label: "Payments & webhooks", icon: "CreditCard" },
    { label: "Third-party API integration", icon: "PlugZap" },
    { label: "Production deployment", icon: "CloudUpload" },
  ] satisfies readonly ClientWorkItem[],
} as const;

export const proofPoints = {
  headline: "Reliable foundations for product teams.",
  items: [
    { label: "Full-stack capability", icon: "Layers3" },
    { label: "Web + Mobile", icon: "AppWindow" },
    { label: "Backend expertise", icon: "Server" },
    { label: "Production deployment", icon: "Rocket" },
    { label: "App Store / Play Store experience", icon: "Store" },
    { label: "Third-party integrations", icon: "PlugZap" },
    { label: "Clean architecture", icon: "Blocks" },
    { label: "Responsive design", icon: "Smartphone" },
    { label: "Client communication", icon: "MessageSquare" },
    { label: "Long-term support", icon: "BadgeCheck" },
  ] satisfies readonly ProofPoint[],
} as const;

/**
 * Add only verified personal URLs here. Null values intentionally render as
 * clearly marked pending profiles instead of linking to an invented account.
 */
export const socialLinks: readonly SocialLink[] = [
  {
    label: "GitHub",
    monogram: "GH",
    description: "Code, repositories, and engineering work",
    href: "https://github.com/NurMohammad56",
  },
  {
    label: "LinkedIn",
    monogram: "in",
    description: "Professional profile and experience",
    href: "https://www.linkedin.com/in/nurmohammad56/",
  },
  {
    label: "Email",
    monogram: "@",
    description: "Direct project enquiries",
    href: "mailto:nurmohammad0605@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20Let's%20Work%20Together",
  },
];

export const projectCategoryOptions = [
  "SaaS",
  "E-commerce",
  "Mobile Apps",
  "Location-based Applications",
] as const satisfies readonly ProjectCategory[];

const projectPlaceholderLabel =
  "PROJECT PLACEHOLDER — VERIFIED PROJECT DETAILS REQUIRED";

/**
 * These are presentation slots, not portfolio claims. Replace null/empty fields
 * only with verified project information before publishing a case study.
 */
export const projectPlaceholders = [
  {
    id: "project-placeholder-01",
    number: "01",
    status: "placeholder",
    isPlaceholder: true,
    placeholderLabel: projectPlaceholderLabel,
    editorialLayout: "media-left",
    name: null,
    category: null,
    description: null,
    technologyStack: [],
    keyFeatures: [],
    platform: null,
    links: [],
  },
  {
    id: "project-placeholder-02",
    number: "02",
    status: "placeholder",
    isPlaceholder: true,
    placeholderLabel: projectPlaceholderLabel,
    editorialLayout: "media-right",
    name: null,
    category: null,
    description: null,
    technologyStack: [],
    keyFeatures: [],
    platform: null,
    links: [],
  },
  {
    id: "project-placeholder-03",
    number: "03",
    status: "placeholder",
    isPlaceholder: true,
    placeholderLabel: projectPlaceholderLabel,
    editorialLayout: "immersive",
    name: null,
    category: null,
    description: null,
    technologyStack: [],
    keyFeatures: [],
    platform: null,
    links: [],
  },
] as const satisfies readonly ProjectPlaceholder[];

export const portfolioData = {
  identity: siteIdentity,
  navigation,
  navigationCta,
  capabilitySummary,
  techGroups,
  services,
  processSteps,
  deploymentLanes,
  productionPipeline,
  cicdStages,
  experience,
  clientWork,
  proofPoints,
  socialLinks,
  projectCategoryOptions,
  projects: projectPlaceholders,
} as const;

export type PortfolioData = typeof portfolioData;
