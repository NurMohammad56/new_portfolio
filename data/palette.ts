// Midnight blue, deep petrol, and luminous cyan inspired by the hero reference.
export const portfolioPalette = {
  ink: "#030b10",
  inkElevated: "#07181e",
  inkSoft: "#0d3034",
  heroSurface: "#030d13",
  paper: "#edf7f5",
  paperDeep: "#d9e8e4",
  text: "#edf7f5",
  muted: "#97afae",
  mutedLight: "#577c7a",
  signal: "#17e6d2",
  signalDeep: "#087e79",
  signalLight: "#95d8d2",
} as const;

const rgb = (hex: string) => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(", ");

export const portfolioTheme = {
  "--ink": portfolioPalette.ink,
  "--ink-elevated": portfolioPalette.inkElevated,
  "--ink-soft": portfolioPalette.inkSoft,
  "--hero-surface": portfolioPalette.heroSurface,
  "--paper": portfolioPalette.paper,
  "--paper-deep": portfolioPalette.paperDeep,
  "--text": portfolioPalette.text,
  "--muted": portfolioPalette.muted,
  "--muted-light": portfolioPalette.mutedLight,
  "--signal": portfolioPalette.signal,
  "--signal-deep": portfolioPalette.signalDeep,
  "--signal-light": portfolioPalette.signalLight,
  "--ink-rgb": rgb(portfolioPalette.ink),
  "--panel-rgb": rgb(portfolioPalette.inkElevated),
  "--text-rgb": rgb(portfolioPalette.text),
  "--signal-rgb": rgb(portfolioPalette.signal),
  "--signal-deep-rgb": rgb(portfolioPalette.signalDeep),
  "--signal-light-rgb": rgb(portfolioPalette.signalLight),
  "--signal-soft": `rgba(${rgb(portfolioPalette.signal)}, 0.08)`,
  "--line": `rgba(${rgb(portfolioPalette.paper)}, 0.12)`,
  "--line-strong": `rgba(${rgb(portfolioPalette.paper)}, 0.24)`,
  "--line-dark": `rgba(${rgb(portfolioPalette.ink)}, 0.18)`,
} as const;
