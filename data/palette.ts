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

// Edit either palette here to change the whole site's colors.
export const lightPortfolioPalette = {
  ink: "#f4f8f7",
  inkElevated: "#ffffff",
  inkSoft: "#e3eeeb",
  heroSurface: "#eef5f3",
  paper: "#102b30",
  paperDeep: "#26494e",
  text: "#102b30",
  muted: "#526c70",
  mutedLight: "#526c70",
  signal: "#007b72",
  signalDeep: "#08635d",
  signalLight: "#176b65",
} as const;

type Palette = { [Key in keyof typeof portfolioPalette]: string };
export type PortfolioTheme = "dark" | "light";
export const THEME_STORAGE_KEY = "nur-portfolio-theme";
export const THEME_EVENT = "portfolio-theme-change";

const rgb = (hex: string) => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(", ");

const createTheme = (palette: Palette) => ({
  "--ink": palette.ink,
  "--ink-elevated": palette.inkElevated,
  "--ink-soft": palette.inkSoft,
  "--hero-surface": palette.heroSurface,
  "--paper": palette.paper,
  "--paper-deep": palette.paperDeep,
  "--text": palette.text,
  "--muted": palette.muted,
  "--muted-light": palette.mutedLight,
  "--signal": palette.signal,
  "--signal-deep": palette.signalDeep,
  "--signal-light": palette.signalLight,
  "--ink-rgb": rgb(palette.ink),
  "--panel-rgb": rgb(palette.inkElevated),
  "--text-rgb": rgb(palette.text),
  "--signal-rgb": rgb(palette.signal),
  "--signal-deep-rgb": rgb(palette.signalDeep),
  "--signal-light-rgb": rgb(palette.signalLight),
  "--signal-soft": `rgba(${rgb(palette.signal)}, 0.08)`,
  "--line": `rgba(${rgb(palette.text)}, 0.12)`,
  "--line-strong": `rgba(${rgb(palette.text)}, 0.24)`,
  "--line-dark": `rgba(${rgb(palette.ink)}, 0.18)`,
  // Screenshot covers remain on a dark photographic scrim in either theme.
  "--media-ink": portfolioPalette.ink,
  "--media-ink-rgb": rgb(portfolioPalette.ink),
  "--media-text": portfolioPalette.text,
  "--media-signal": portfolioPalette.signal,
});

export const portfolioThemes = {
  dark: createTheme(portfolioPalette),
  light: createTheme(lightPortfolioPalette),
};
export const portfolioTheme = portfolioThemes.dark;

// A small parser-executed head script applies saved colors before the body paints.
// Storage may be unavailable in private/embedded browsing; the dark default is safe.
export const themeInitializationScript = `(()=>{
  let theme="dark";
  try { if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="light") theme="light"; } catch {}
  const themes=${JSON.stringify(portfolioThemes)};
  const root=document.documentElement;
  Object.entries(themes[theme]).forEach(([key,value])=>root.style.setProperty(key,value));
  root.dataset.theme=theme;
  root.style.colorScheme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",themes[theme]["--ink"]);
})()`;
