"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, whenPortfolioReady } from "./gsap";

const HEADER_OFFSET = 84;
let activeLenis: Lenis | null = null;

/** Scroll to an absolute page position, smoothly when Lenis is running. */
export function scrollToY(top: number) {
  if (activeLenis) activeLenis.scrollTo(top, { duration: 1.25, force: true });
  else window.scrollTo({ top, behavior: "smooth" });
}

const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

/**
 * Inertial page scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger,
 * Lenis and every scrubbed animation share one frame clock.
 *
 * - Off for reduced-motion visitors and on touch (native momentum is kept).
 * - Pauses automatically whenever something locks the page: the intro,
 *   the mobile menu, or a modal dialog.
 * - Wheel events a component already consumed (the project rail's sideways
 *   scroll) are left alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const syncLock = () => {
      if (!lenis) return;
      const locked = document.body.style.overflow === "hidden" || Boolean(document.querySelector("dialog[open]"));
      if (locked) lenis.stop();
      else lenis.start();
    };

    const create = () => {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        allowNestedScroll: true,
        virtualScroll: ({ event }) => !event.defaultPrevented,
      });
      activeLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      syncLock();
    };

    const destroy = () => {
      if (!lenis) return;
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
      activeLenis = null;
    };

    const onMotionChange = () => {
      if (reduce.matches) destroy();
      else create();
    };

    // In-page links glide instead of jumping. Runs two frames later so a
    // closing menu has released its scroll lock first.
    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#main-content") return;
      const target = hash === "#" ? document.body : document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      const fromKeyboard = event.detail === 0;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        lenis?.scrollTo(hash === "#" || hash === "#home" ? 0 : target, {
          offset: -HEADER_OFFSET,
          duration: 1.6,
          easing: easeInOutQuint,
          force: true,
          onComplete: () => {
            if (!fromKeyboard) return;
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          },
        });
        history.pushState(null, "", hash);
      }));
    };

    create();
    const bodyLock = new MutationObserver(syncLock);
    bodyLock.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    const dialogs = new MutationObserver(syncLock);
    dialogs.observe(document.body, { attributes: true, attributeFilter: ["open"], subtree: true });

    // Layout keeps shifting as images, fonts and sticky scenes settle.
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    const resize = new ResizeObserver(scheduleRefresh);
    resize.observe(document.body);
    const stopReady = whenPortfolioReady(scheduleRefresh);

    document.addEventListener("click", onClick);
    reduce.addEventListener("change", onMotionChange);
    return () => {
      document.removeEventListener("click", onClick);
      reduce.removeEventListener("change", onMotionChange);
      bodyLock.disconnect();
      dialogs.disconnect();
      resize.disconnect();
      stopReady();
      window.clearTimeout(refreshTimer);
      destroy();
    };
  }, []);

  return null;
}
