"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { portfolioThemes, THEME_EVENT, THEME_STORAGE_KEY, type PortfolioTheme } from "@/data/palette";
import styles from "./theme-toggle.module.css";

function applyTheme(theme: PortfolioTheme, persist = true) {
  const root = document.documentElement;
  Object.entries(portfolioThemes[theme]).forEach(([key, value]) => root.style.setProperty(key, value));
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", portfolioThemes[theme]["--ink"]);
  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* Switching still works without storage. */ }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

const subscribe = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) applyTheme(event.newValue === "light" ? "light" : "dark", false);
  };
  window.addEventListener(THEME_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
};
const getSnapshot = (): PortfolioTheme => document.documentElement.dataset.theme === "light" ? "light" : "dark";
const getServerSnapshot = (): PortfolioTheme => "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
  return (
    <button className={styles.toggle} type="button" data-theme-toggle aria-label={label} title={label}
      aria-pressed={theme === "light"} onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className={styles.sun} size={18} strokeWidth={1.6} aria-hidden="true" />
      <Moon className={styles.moon} size={18} strokeWidth={1.6} aria-hidden="true" />
    </button>
  );
}
