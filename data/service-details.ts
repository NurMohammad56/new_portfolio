import type { services } from "@/data/portfolio";

export interface ServiceDetail {
  readonly overview: string;
  readonly deliverables: readonly string[];
  readonly tools: readonly string[];
  readonly startingPoint: string;
}

// Scope descriptions, not promises of unverified project outcomes.
export const serviceDetails: Readonly<Record<(typeof services)[number]["number"], ServiceDetail>> = {
  "01": {
    overview: "The server-side foundation of your product: clear APIs, dependable business logic, and controlled access to application data. I can build a new service or improve an existing backend.",
    deliverables: [
      "REST endpoints with validation, pagination, and consistent error responses",
      "JWT authentication and role-based authorization",
      "Application business rules and third-party API integrations",
      "API documentation and handover notes for frontend or mobile developers",
    ],
    tools: ["Node.js", "Express.js", "Nest.js", "TypeScript", "Postman"],
    startingPoint: "Share the product flows, API requirements, and any existing code. We can define the endpoints, data model, and a practical implementation scope together.",
  },
  "02": {
    overview: "Practical frontend implementation with AI assistance, grounded in my backend-first approach. I build React and Next.js interfaces and connect them to the APIs your product depends on.",
    deliverables: [
      "Responsive website interfaces built with React or Next.js and AI assistance",
      "Backend API integration with loading, empty, and error states",
      "Forms, authentication flows, and data-driven views",
      "Frontend code review, production build checks, and handover notes",
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "AI-assisted workflow"],
    startingPoint: "Share your designs, screens, or interface requirements along with the API contracts. We will define the frontend scope and the integration points before implementation.",
  },
  "03": {
    overview: "Backend services for the workflows behind a mobile app. My focus is on the APIs and data systems your app connects to, working alongside the mobile development team.",
    deliverables: [
      "Account, profile, and authentication APIs",
      "Mobile product workflows and application data management",
      "Notification, media, and third-party service integrations",
      "API testing and coordination with the mobile frontend team",
    ],
    tools: ["REST APIs", "Node.js", "MongoDB", "PostgreSQL", "JWT"],
    startingPoint: "App screens, a feature list, or an existing API are a good starting point. We will map each mobile journey to the backend contracts it needs.",
  },
  "04": {
    overview: "Data structures that fit the way your product works. I help organize relationships, queries, and access patterns so the backend stays understandable as features evolve.",
    deliverables: [
      "MongoDB schemas or relational PostgreSQL models",
      "Indexes and query improvements for common access patterns",
      "Filtering, pagination, validation, and data consistency rules",
      "A documented model aligned with the product's business logic",
    ],
    tools: ["MongoDB", "Mongoose", "PostgreSQL", "Data modeling"],
    startingPoint: "Bring your entities, expected workflows, and any slow or difficult queries. We will identify the right data model and the improvements worth prioritizing.",
  },
  "05": {
    overview: "Connected product features that respond to events: messaging, notifications, background processing, and integrations with external services.",
    deliverables: [
      "Socket.IO event flows for live product updates",
      "Background jobs for work that should not block API responses",
      "Webhooks with validation and consistent event handling",
      "OAuth, notifications, and third-party API connections",
    ],
    tools: ["Socket.IO", "Node.js", "Webhooks", "OAuth", "Queues & workers"],
    startingPoint: "Describe the events, connected services, and how users should see updates. Provider documentation and sandbox credentials help us define and test the integration.",
  },
  "06": {
    overview: "The practical route from application code to a live backend service or website. I configure deployment, processes, domains, and HTTPS so the application can run in production.",
    deliverables: [
      "Backend and website deployment on Linux VPS or Vercel",
      "Nginx routing, PM2 processes, domain DNS, and HTTPS configuration",
      "Production environment configuration and application health checks",
      "Release verification, log review, and deployment handover notes",
    ],
    tools: ["Linux VPS", "Nginx", "PM2", "Vercel", "DNS & HTTPS"],
    startingPoint: "Share the application repository, build instructions, and hosting setup. We will map the deployment steps, environment variables, and production checks into a clear release scope.",
  },
};
