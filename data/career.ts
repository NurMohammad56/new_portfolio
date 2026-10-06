import type { LucideIconId } from "@/data/portfolio";
import type { CompanyLogoId } from "@/components/ui/company-logo";

export interface CareerStage {
  readonly id: string;
  readonly number: string;
  readonly phase: string;
  readonly organization: string;
  readonly location: string;
  readonly organizationUrl?: string;
  readonly logoId: CompanyLogoId;
  readonly role: string;
  readonly duration: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly icon: LucideIconId;
}

export const careerStages = [
  {
    id: "scaleup-backend-developer",
    number: "01",
    phase: "CURRENT ROLE",
    organization: "Scaleup IT Limited",
    location: "Mohakhali, Dhaka",
    logoId: "scaleup",
    role: "Backend Developer",
    duration: "MAR 2025 - PRESENT",
    summary:
      "Design and deploy scalable RESTful APIs for multiple client-facing products. Optimize MongoDB queries through careful data modeling and implement secure authentication and authorization with JWT and role-based access control.",
    highlights: [
      "RESTful API development",
      "API deployment",
      "MongoDB query optimization",
      "Data modeling",
      "JWT authentication",
      "Role-based access control",
    ],
    icon: "Server",
  },
  {
    id: "arabian-full-stack-developer",
    number: "02",
    phase: "PREVIOUS ROLE",
    organization: "Arabian Services Company",
    location: "Banani, Dhaka",
    logoId: "arabian",
    role: "Full Stack Developer",
    duration: "JUN 2024 - JAN 2025",
    summary:
      "Led full-stack development of the company's primary web platform across core application features. Built authentication and data-synchronization systems with Node.js and implemented real-time notifications to support application workflows.",
    highlights: [
      "Web platform delivery",
      "Full-stack development",
      "Node.js authentication",
      "Data synchronization",
      "Real-time notifications",
    ],
    icon: "Code2",
  },
] as const satisfies readonly CareerStage[];

export const careerDeliveryRecord = [
  { value: "2+", label: "Years backend" },
  { value: "API", label: "Mobile-first systems" },
  { value: "DB", label: "MongoDB + PostgreSQL" },
  { value: "VPS", label: "Production deployment" },
] as const;
