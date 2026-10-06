export type ProjectDevice = "browser" | "tablet" | "phone" | "poster";
export interface ProjectScreenshot {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly caption: string;
}
export interface ShowcaseProject {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly category: string;
  readonly platform: string;
  readonly device: ProjectDevice;
  readonly description: string;
  readonly contribution: string;
  readonly features: readonly string[];
  readonly backendHighlights: readonly { title: string; description: string }[];
  readonly architectureNote?: string;
  readonly productNote?: string;
  readonly technologies: readonly string[];
  readonly cover: string;
  readonly images: readonly ProjectScreenshot[];
  readonly links: readonly {
    kind: "website" | "googlePlay" | "appStore";
    label: string;
    href: string;
  }[];
}
const screenshot = (
  folder: string,
  time: string,
  width: number,
  height: number,
  caption: string,
): ProjectScreenshot => ({
  src: `/projects/${folder}/Screenshot 2026-10-06 ${time}.png`,
  width,
  height,
  caption,
});
const appBackend = ["Node.js", "Express.js", "REST APIs"] as const;

// Sourced from the supplied notes. Client-side development is not claimed as
// my work. No credentials, invented metrics, missing links, or guessed databases.
export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    id: "gcl-commerce",
    number: "01",
    title: "GCL Commerce",
    category: "Multi-vendor e-commerce",
    platform: "Web platform",
    device: "browser",
    description:
      "A multi-vendor commerce platform built for the Bangladesh market. One customer cart connects independent sellers, local payments, delivery operations, and AI-assisted shopping.",
    contribution:
      "I built the modular backend behind the customer storefront, vendor workflows, and admin operations: from authentication and inventory reservations to split orders, settlements, and AI integrations.",
    features: [
      "One cart, vendor-specific sub-orders",
      "Vendor onboarding, KYC, catalog, and stock management",
      "bKash, SSLCommerz, and cash on delivery",
      "Pathao delivery and in-house rider workflows",
      "Hybrid search, AI listing assistance, and a shopping chatbot",
    ],
    backendHighlights: [
      {
        title: "23 isolated modules",
        description:
          "Controller, service, repository, and validation layers organized as vertical slices, with enforced module boundaries.",
      },
      {
        title: "Transactional commerce",
        description:
          "Inventory reservations, multi-vendor checkout, returns, refunds, commission rules, wallet ledgers, and vendor payouts.",
      },
      {
        title: "Events & background processing",
        description:
          "Redis caching, BullMQ queues and workers, Socket.IO events, scheduled notifications, and signature-verified payment webhooks.",
      },
      {
        title: "Search & AI orchestration",
        description:
          "PostgreSQL full-text and vector retrieval, Claude-assisted listings, OpenAI embeddings, and a tool-calling chatbot with knowledge retrieval.",
      },
    ],
    technologies: [
      "Node.js",
      "TypeScript",
      "Express.js",
      "PostgreSQL",
      "Drizzle ORM",
      "Redis",
      "BullMQ",
      "Socket.IO",
      "Zod",
      "S3-compatible storage",
      "Docker",
    ],
    cover: "/projects/covers/gcl-commerce.webp",
    images: [
      screenshot("Project-1", "085254", 1919, 913, "Customer storefront"),
      screenshot("Project-1", "085754", 1904, 910, "Platform administration"),
      screenshot(
        "Project-1",
        "085318",
        1919,
        916,
        "Multi-vendor product catalog",
      ),
      screenshot("Project-1", "085330", 1919, 912, "Nova shopping assistant"),
    ],
    links: [
      {
        kind: "website",
        label: "Live admin portal",
        href: "https://gcl-admin.vercel.app/",
      },
      {
        kind: "website",
        label: "Live vendor portal",
        href: "https://gcl-vendor.vercel.app/",
      },
    ],
  },
  {
    id: "ilearnready",
    number: "02",
    title: "iLearnReady",
    category: "Offline-first education",
    platform: "iPad app",
    device: "tablet",
    description:
      "An iPad learning platform that keeps educational content, practice activities, and progress within reach-even without an active internet connection.",
    contribution:
      "I developed the Node.js and Express backend for account authentication, learning-content distribution, and synchronization with the offline-first iPad experience.",
    features: [
      "Subject-based educational content",
      "Lessons, practice activities, and exam preparation",
      "Learning progress and score tracking",
      "Offline access with synchronization when connectivity returns",
    ],
    backendHighlights: [
      {
        title: "Content delivery",
        description:
          "REST endpoints support the distribution of structured lessons and educational assets to the tablet client.",
      },
      {
        title: "Cloud authentication",
        description:
          "The backend manages authenticated access to account-based learning resources.",
      },
      {
        title: "Progress synchronization",
        description:
          "Server-side data flows connect locally recorded learning activity with the cloud when the device reconnects.",
      },
    ],
    architectureNote:
      "The product uses Flutter and an on-device SQLite cache. Those are client-side components; my contribution focuses on the backend API and cloud data flows.",
    technologies: appBackend,
    cover: "/projects/covers/ilearnready.webp",
    images: [
      screenshot("project-2", "090208", 374, 498, "Learning subjects"),
      screenshot(
        "project-2",
        "090216",
        372,
        497,
        "Lessons and practice activities",
      ),
      screenshot("project-2", "090223", 373, 497, "Learning progress"),
    ],
    links: [
      {
        kind: "appStore",
        label: "Apple App Store",
        href: "https://apps.apple.com/us/app/ilearnready/id6761988618",
      },
    ],
  },
  {
    id: "beardfriends",
    number: "03",
    title: "Beardfriends",
    category: "Discovery & community",
    platform: "Mobile app",
    device: "poster",
    description:
      "A community for beard enthusiasts and barbershops, bringing local discovery, digital loyalty rewards, and beard contests into one connected product.",
    contribution:
      "I built the backend services behind barbershop discovery, user profiles, digital stamp rewards, and the app's community interactions.",
    features: [
      "Barbershop search by location, services, and ratings",
      "Digital stamps and loyalty rewards",
      "Community contests, voting, and leaderboards",
      "User profiles, reviews, and barbershop information",
    ],
    backendHighlights: [
      {
        title: "Discovery APIs",
        description:
          "Structured barbershop and service data supports search, filtering, and nearby discovery.",
      },
      {
        title: "Loyalty workflows",
        description:
          "Backend records connect customer activity with digital stamps and redeemable rewards.",
      },
      {
        title: "Community features",
        description:
          "Account-based data flows support profiles, contest participation, votes, and customer engagement.",
      },
    ],
    technologies: appBackend,
    cover: "/projects/covers/beardfriends.webp",
    images: [
      screenshot(
        "project-3",
        "091003",
        348,
        757,
        "Barbershop discovery and filters",
      ),
      screenshot(
        "project-3",
        "091009",
        350,
        759,
        "Contests and community voting",
      ),
      screenshot(
        "project-3",
        "091015",
        350,
        760,
        "Personal profile and digital rewards",
      ),
      screenshot(
        "project-3",
        "091023",
        349,
        757,
        "Barbershop business experience",
      ),
    ],
    links: [
      {
        kind: "googlePlay",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.beardfriends.andregenze",
      },
    ],
  },
  {
    id: "speet",
    number: "04",
    title: "SPEET",
    category: "Real-time social discovery",
    platform: "Mobile app",
    device: "phone",
    description:
      "A nearby social discovery app built around shared interests and spontaneous, real-world connection-not endless scrolling or long-distance messaging.",
    contribution:
      "I developed the backend for nearby discovery, interest-based profiles, connection requests, and the time-limited conversation flows that bridge online introductions and in-person contact.",
    features: [
      "Nearby profiles and shared-interest discovery",
      "User-controlled availability and discovery radius",
      "Accepted chat requests and real-time conversations",
      "Time-limited chats, location sharing, and social badges",
    ],
    backendHighlights: [
      {
        title: "Presence & discovery",
        description:
          "Backend workflows connect location, availability, and selected interests to the people shown nearby.",
      },
      {
        title: "Connection lifecycle",
        description:
          "Request, acceptance, and conversation state support deliberate, mutual introductions.",
      },
      {
        title: "Profiles & social feedback",
        description:
          "Account and badge data supports a profile shaped by interests and positive community interactions.",
      },
    ],
    technologies: appBackend,
    cover: "/projects/covers/speet.webp",
    images: [
      screenshot(
        "project-4",
        "091223",
        300,
        648,
        "Availability and nearby people",
      ),
      screenshot("project-4", "091227", 310, 658, "Time-limited conversation"),
      screenshot("project-4", "091230", 312, 651, "Community badges"),
      screenshot("project-4", "091234", 304, 647, "Profile and interests"),
    ],
    links: [
      {
        kind: "appStore",
        label: "Apple App Store",
        href: "https://apps.apple.com/us/app/speet-app/id6756418886",
      },
    ],
  },
  {
    id: "zentrofix",
    number: "05",
    title: "Zentrofix",
    category: "Home-service marketplace",
    platform: "Mobile app",
    device: "phone",
    description:
      "A local marketplace connecting homeowners with tradespeople, from posting a repair job and reviewing applicants to communication, progress updates, and feedback.",
    contribution:
      "I built the backend powering homeowner and service-provider accounts, location-based jobs, applications, job status, messaging, and notification workflows.",
    features: [
      "Job posts with photos, location, category, and budget",
      "Nearby job discovery and provider applications",
      "Homeowner-to-provider conversations",
      "Progress tracking, reviews, and job-update notifications",
    ],
    backendHighlights: [
      {
        title: "Two-sided workflows",
        description:
          "Backend data connects homeowner job posts with provider discovery, applications, and assigned work.",
      },
      {
        title: "Job lifecycle",
        description:
          "Structured job details and status transitions keep both sides informed as work progresses.",
      },
      {
        title: "Communication & trust",
        description:
          "Messaging, notifications, profiles, and review data support ongoing customer-provider relationships.",
      },
    ],
    technologies: appBackend,
    cover: "/projects/covers/zentrofix.webp",
    images: [
      screenshot("project-5", "091638", 351, 761, "Homeowner dashboard"),
      screenshot("project-5", "091649", 348, 759, "Job details and location"),
      screenshot("project-5", "091654", 361, 760, "Active and completed jobs"),
      screenshot("project-5", "091644", 340, 760, "Service job discovery"),
      screenshot(
        "project-5",
        "091701",
        339,
        760,
        "Job and account notifications",
      ),
    ],
    links: [
      {
        kind: "googlePlay",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.zentrofix.app",
      },
    ],
  },
  {
    id: "goinsight",
    number: "06",
    title: "GoInsight",
    category: "Offline-first travel",
    platform: "iOS & Android app",
    device: "phone",
    description:
      "A travel companion that keeps itineraries, destination information, and useful trip resources accessible through unreliable connectivity and offline travel.",
    contribution:
      "I developed the backend gateway for authenticated travel-data delivery and synchronization, connecting the mobile application's cached itinerary experience with cloud updates.",
    features: [
      "Day-by-day itineraries and departure countdowns",
      "Destination guides and practical local information",
      "Travel resources and useful external apps",
      "Offline data access with incremental updates on reconnection",
    ],
    backendHighlights: [
      {
        title: "Travel data gateway",
        description:
          "REST APIs deliver organized itinerary and destination payloads to the mobile client.",
      },
      {
        title: "Authenticated access",
        description:
          "Server-side authentication connects travelers with their account-based travel information.",
      },
      {
        title: "Reconnect & synchronize",
        description:
          "Version-aware update flows support incremental synchronization when the mobile client regains connectivity.",
      },
    ],
    architectureNote:
      "Flutter and the local SQLite cache are part of the mobile client. My work is the Node.js/Express backend and the data-delivery and synchronization layer.",
    technologies: appBackend,
    cover: "/projects/covers/goinsight.webp",
    images: [
      screenshot(
        "project-6",
        "101106",
        300,
        641,
        "Trip itinerary and departure countdown",
      ),
      screenshot("project-6", "101059", 293, 639, "Destination guides"),
      screenshot(
        "project-6",
        "101110",
        301,
        643,
        "Useful travel apps and resources",
      ),
    ],
    links: [
      {
        kind: "googlePlay",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.inside.travel",
      },
      {
        kind: "appStore",
        label: "Apple App Store",
        href: "https://apps.apple.com/gb/app/goinsight/id6796300411",
      },
    ],
  },
  {
    id: "solidsteps",
    number: "07",
    title: "SolidSteps",
    category: "Private activity tracking",
    platform: "Mobile app",
    device: "phone",
    description:
      "A lightweight wellness app for approved users to record daily steps and review their activity in a private, account-based experience.",
    contribution:
      "I built the backend for approved-account access, manual step records, activity data, and the account-based support workflows described in the product brief.",
    features: [
      "Manual daily step entry",
      "Simple daily and weekly activity views",
      "Private account-based access",
      "Pre-registered user setup and verification",
    ],
    backendHighlights: [
      {
        title: "Approved-user access",
        description:
          "Account features are tied to backend/admin registration and verification rather than unrestricted public self-registration.",
      },
      {
        title: "Activity records",
        description:
          "API workflows store manually entered step counts and provide activity information for the signed-in user.",
      },
      {
        title: "Designated-contact notifications",
        description:
          "Where enabled for an approved account, support notifications notify a designated contact for follow-up outside the app.",
      },
    ],
    productNote:
      "SolidSteps is an activity-recording app, not a medical device. It does not provide medical advice or emergency-response services.",
    technologies: appBackend,
    cover: "/projects/covers/solidsteps.webp",
    images: [
      screenshot("project-7", "101353", 356, 765, "Daily activity dashboard"),
      screenshot(
        "project-7",
        "101358",
        356,
        763,
        "Manual step entry and weekly activity",
      ),
      screenshot("project-7", "101347", 349, 761, "Welcome and onboarding"),
      screenshot(
        "project-7",
        "101404",
        357,
        761,
        "Account and privacy settings",
      ),
    ],
    links: [
      {
        kind: "googlePlay",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.solidsteps.app",
      },
    ],
  },
  {
    id: "renbite",
    number: "08",
    title: "Renbite",
    category: "Food discovery & dining",
    platform: "iOS & Android app",
    device: "phone",
    description:
      "A dining platform connecting food lovers with nearby restaurants, dishes, and events while giving restaurant owners tools to manage their presence and menus.",
    contribution:
      "I developed the backend behind restaurant discovery, menus, reviews, favorites, events, and restaurant-management workflows, including the platform's Stripe integration.",
    features: [
      "Restaurant, dish, cuisine, and location search",
      "Guest browsing, interactive maps, and saved favorites",
      "Menus, ratings, reviews, and food events",
      "Restaurant-owner tools and Stripe payment connections",
    ],
    backendHighlights: [
      {
        title: "Discovery & engagement",
        description:
          "APIs connect restaurant and menu data with location-based discovery, saved places, and customer reviews.",
      },
      {
        title: "Restaurant operations",
        description:
          "Owner-focused workflows support profile updates, menu management, event hosting, and business information.",
      },
      {
        title: "Connected product features",
        description:
          "Backend integrations support Stripe-connected payment services and the dining-assistant experience shown in the supplied screenshots.",
      },
    ],
    technologies: [...appBackend, "Stripe"],
    cover: "/projects/covers/renbite.webp",
    images: [
      screenshot(
        "project-8",
        "101531",
        351,
        762,
        "Nearby restaurant discovery",
      ),
      screenshot(
        "project-8",
        "101545",
        350,
        761,
        "Restaurant menus and event management",
      ),
      screenshot("project-8", "101557", 352, 759, "Dining assistant"),
      screenshot("project-8", "101538", 352, 763, "Restaurant reviews"),
      screenshot(
        "project-8",
        "101602",
        351,
        760,
        "Restaurant engagement overview",
      ),
    ],
    links: [
      {
        kind: "googlePlay",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.restafood.kennygee",
      },
      {
        kind: "appStore",
        label: "Apple App Store",
        href: "https://apps.apple.com/us/app/renbite/id6764725322",
      },
    ],
  },
];
