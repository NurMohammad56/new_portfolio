/** Illustrative system concepts, not live telemetry or measured project metrics. */
export const stackStudies: Record<string, { title: string; caption: string; sequence: readonly string[] }> = {
  "backend-realtime": {
    title: "One request. Many moving parts.",
    caption: "Follow a request through the layers that turn an action into a dependable response.",
    sequence: ["Request", "Validate", "Process", "Respond"],
  },
  "interface-engineering": {
    title: "From idea to interface.",
    caption: "AI helps shape the first draft. Thoughtful review turns it into a usable experience.",
    sequence: ["Prompt", "Build", "Review", "Connect"],
  },
  "mobile-products": {
    title: "A product, in sync.",
    caption: "A tap on the screen becomes a shared state change, wherever the user connects.",
    sequence: ["Tap", "Request", "Sync", "Notify"],
  },
  "product-systems": {
    title: "Everything, connected.",
    caption: "One orchestration layer brings identity, content, and external services together.",
    sequence: ["Identity", "Route", "Integrate", "Return"],
  },
  "production-release": {
    title: "Built. Released. Observed.",
    caption: "A focused change travels from a versioned branch to a running, observable service.",
    sequence: ["Commit", "Build", "Release", "Observe"],
  },
};
