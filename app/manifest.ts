import type { MetadataRoute } from "next";
import { portfolioPalette } from "@/data/palette";

const description =
  "Nur Mohammad is a backend developer focused on mobile application backends, APIs, databases, real-time systems, integrations, and production deployment.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Nur Mohammad — Developer Portfolio",
    short_name: "Nur Portfolio",
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: portfolioPalette.ink,
    theme_color: portfolioPalette.ink,
    lang: "en-US",
    dir: "ltr",
    categories: ["portfolio", "business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
