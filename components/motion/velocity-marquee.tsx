"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import styles from "./velocity-marquee.module.css";

type MarqueeRow = {
  items: readonly string[];
  /** Outlined type reads as the quieter counter-line. */
  outline?: boolean;
  /** 1 = drifts left, -1 = drifts right. */
  direction?: 1 | -1;
};

type VelocityMarqueeProps = {
  rows: readonly MarqueeRow[];
  label: string;
  size?: "band" | "statement";
};

const BASE_SPEED = 0.045; // percent of a track per frame

/**
 * Kinetic type band. Each row drifts on its own; scrolling throws it faster,
 * flips its direction with the scroll, and leans the letters into the motion.
 */
export function VelocityMarquee({ rows, label, size = "band" }: VelocityMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const tracks = Array.from(root.querySelectorAll<HTMLElement>("[data-track]"));
    const state = tracks.map(track => ({
      track,
      direction: Number(track.dataset.direction) || 1,
      position: 0,
      // Both go through GSAP so translation and lean compose into one transform.
      shift: gsap.quickSetter(track, "xPercent") as (value: number) => void,
      skew: gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" }),
    }));
    let velocity = 0, scrollSign = 1, visible = false;

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: self => { visible = self.isActive; },
      onUpdate: self => {
        velocity = self.getVelocity();
        if (Math.abs(velocity) > 40) scrollSign = velocity > 0 ? 1 : -1;
      },
    });

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      const frames = Math.min(deltaTime / 16.67, 3);
      velocity *= 0.92; // decay so the band settles when scrolling stops
      const boost = 1 + Math.min(Math.abs(velocity) / 220, 9);
      const lean = gsap.utils.clamp(-9, 9, velocity / -180);
      for (const row of state) {
        row.position -= BASE_SPEED * boost * row.direction * scrollSign * frames;
        // Tracks hold two identical halves: wrap inside one half for a seamless loop.
        row.position = gsap.utils.wrap(-50, 0, row.position);
        row.shift(row.position);
        row.skew(lean * row.direction);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.marquee} data-size={size} role="img" aria-label={label}>
      {rows.map((row, rowIndex) => (
        <div className={styles.row} key={rowIndex} data-outline={row.outline || undefined}>
          <div className={styles.track} data-track data-direction={row.direction ?? 1} aria-hidden="true">
            {[0, 1].map(half => (
              <div className={styles.half} key={half}>
                {[...row.items, ...row.items].map((item, index) => (
                  <span className={styles.item} key={`${half}-${index}`}>
                    <span className={styles.word}>{item}</span>
                    <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
