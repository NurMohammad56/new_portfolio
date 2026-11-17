"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.config({ nullTargetWarn: false });
}

/** Shared easing language: long, confident deceleration. */
export const EASE = {
  reveal: "expo.out",
  glide: "power3.out",
  sweep: "expo.inOut",
} as const;

const READY_EVENT = "portfolio:ready";

/** Fired by the intro overlay as it begins to leave the screen. */
export function markPortfolioReady() {
  document.documentElement.dataset.portfolioReady = "true";
  window.dispatchEvent(new Event(READY_EVENT));
}

export function isPortfolioReady() {
  return document.documentElement.dataset.portfolioReady === "true";
}

export function whenPortfolioReady(callback: () => void) {
  if (isPortfolioReady()) {
    callback();
    return () => {};
  }
  window.addEventListener(READY_EVENT, callback, { once: true });
  return () => window.removeEventListener(READY_EVENT, callback);
}

export { gsap, ScrollTrigger, SplitText };
