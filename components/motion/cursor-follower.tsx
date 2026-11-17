"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";
import styles from "./cursor-follower.module.css";

type CursorMode = "idle" | "link" | "view";

/**
 * A soft ring that trails the native pointer (the native cursor stays visible).
 * It swells over links and buttons and becomes a "View" disc over projects.
 * Mouse and trackpad only, and never for reduced-motion visitors.
 */
export function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!element || !query.matches) return;

    const x = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });
    let mode: CursorMode = "idle";
    let shown = false;

    const setMode = (next: CursorMode) => {
      if (next === mode) return;
      mode = next;
      element.dataset.mode = next;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(element, { x: event.clientX, y: event.clientY });
        element.dataset.visible = "true";
      }
      x(event.clientX);
      y(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      if (target.closest("[data-gallery-card]")) setMode("view");
      else if (target.closest("a, button, [role='button'], summary, label, input, select, textarea")) {
        setMode("link");
      } else setMode("idle");
    };
    const hide = () => { shown = false; element.dataset.visible = "false"; };
    const down = () => element.dataset.pressed = "true";
    const up = () => element.dataset.pressed = "false";

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} data-mode="idle" data-visible="false" aria-hidden="true">
      <span className={styles.ring} />
      <span className={styles.label}>View</span>
    </div>
  );
}
