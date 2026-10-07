"use client";

import { useEffect } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import styles from "./scroll-edge-lines.module.css";

// One continuous wave, kept inside the outer gutters rather than over content.
const wave = Array.from({ length: 161 }, (_, index) => {
  const y = index / 160 * 1000;
  const x = 20 + Math.sin(y / 1000 * Math.PI * 5) * 11;
  return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
}).join(" ");

export function ScrollEdgeLines() {
  const reduced = useReducedMotion();
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      scrollYProgress.set(distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [scrollYProgress]);
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 27, mass: 0.55, restDelta: 0.0001 });
  // Keep the full glowing segment inside the path, including at the footer.
  const offset = useTransform(progress, [0, 1], [0, -845]);
  return (
    <div className={styles.edges} aria-hidden="true" data-scroll-edge-lines>
      {["left", "right"].map(side => <div key={side} className={`${styles.line} ${styles[side]}`}>
        <svg className={styles.wave} viewBox="0 0 40 1000" preserveAspectRatio="none" fill="none">
        <path d={wave} className={styles.track} />
        {!reduced && <>
          <m.path d={wave} className={styles.glow} strokeDasharray="155 1000" style={{ strokeDashoffset: offset }} />
          <m.path d={wave} className={styles.signal} strokeDasharray="155 1000" style={{ strokeDashoffset: offset }} />
        </>}
        </svg>
        {[110, 270, 430, 590, 750, 910].map(y => <i key={y} data-edge-point className={styles.point} style={{ left: `${(20 + Math.sin(y / 1000 * Math.PI * 5) * 11) / 40 * 100}%`, top: `${y / 10}%` }} />)}
      </div>)}
    </div>
  );
}
