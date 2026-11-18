"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { markPortfolioReady } from "@/components/motion/gsap";
import { NmLettermark } from "@/components/ui/nm-lettermark";
import styles from "./portfolio-intro.module.css";

// Must match the CSS timeline in portfolio-intro.module.css.
const INTRO_DURATION = 2300;
const EXIT_DURATION = 950;
const NAME = "Nur Mohammad";
const BOOT_STEPS = ["booting runtime", "connecting database", "syncing real-time channels", "deploying portfolio"];

export function PortfolioIntro({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const screen = screenRef.current, content = contentRef.current;
    if (!screen || !content) return;

    // Follow the CSS timeline, which starts before hydration. Slow hydration
    // must not add another wait or leave the portfolio blocked.
    const animation = screen.getAnimations()[0];
    const timing = animation?.effect?.getTiming();
    const duration = typeof timing?.duration === "number" ? timing.duration : EXIT_DURATION;
    const elapsed = typeof animation?.currentTime === "number" ? animation.currentTime : 0;
    const remaining = Math.max(0, (timing?.delay ?? INTRO_DURATION) + duration - elapsed);
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const previousInert = content.inert;
    const previousAriaHidden = content.getAttribute("aria-hidden");
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    let released = false;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    content.inert = true;
    content.setAttribute("aria-hidden", "true");

    const release = () => {
      if (released) return;
      released = true;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      content.inert = previousInert;
      if (previousAriaHidden === null) content.removeAttribute("aria-hidden");
      else content.setAttribute("aria-hidden", previousAriaHidden);
    };
    // The curtain lifts from the bottom; the hero title (upper half) is
    // uncovered around the midpoint, which is when its letters begin to rise.
    const readyTimer = window.setTimeout(markPortfolioReady, Math.max(0, remaining - duration * 0.5));
    const timer = window.setTimeout(() => {
      release();
      setComplete(true);
    }, remaining);
    return () => { window.clearTimeout(readyTimer); window.clearTimeout(timer); release(); };
  }, []);

  return (
    <>
      {!complete && (
        <div ref={screenRef} className={styles.screen} data-portfolio-intro
          role="status" aria-live="polite" aria-label="Loading Nur Mohammad's portfolio">
          <div className={styles.inner}>
            <div className={styles.header} aria-hidden="true">
              <span>NUR MOHAMMAD / PORTFOLIO</span>
              <span>BACKEND / AI-ASSISTED FRONTEND</span>
            </div>

            <div className={styles.center} aria-hidden="true">
              <div className={styles.gyro}>
                <div className={styles.core} />
                <div className={styles.rings}>
                  <span className={styles.orbit} style={{ "--tilt": "rotateX(72deg)", "--size": "100%", "--spin": "2.6s" } as CSSProperties}><i /></span>
                  <span className={styles.orbit} style={{ "--tilt": "rotateY(68deg) rotateX(18deg)", "--size": "80%", "--spin": "2.1s", "--dir": "reverse" } as CSSProperties}><i /></span>
                  <span className={styles.orbit} style={{ "--tilt": "rotateX(-48deg) rotateY(-34deg)", "--size": "62%", "--spin": "1.7s" } as CSSProperties}><i /></span>
                </div>
                <NmLettermark className={styles.mark} />
              </div>
              <h2 className={styles.name}>
                {NAME.split("").map((character, index) => (
                  <span key={index} style={{ "--i": index } as CSSProperties}>{character === " " ? " " : character}</span>
                ))}
              </h2>
              <p className={styles.tagline}>Backend-first. Thoughtfully built.</p>
            </div>

            <div className={styles.readout} aria-hidden="true">
              <div className={styles.terminal}>
                <span className={styles.prompt}>&gt;</span>
                <span className={styles.lines}>
                  <span className={styles.roll}>
                    {BOOT_STEPS.map(step => <span key={step}>{step}</span>)}
                  </span>
                </span>
              </div>
              <div className={styles.count}><small>%</small></div>
            </div>

            <div className={styles.progress} aria-hidden="true"><span /></div>
            <div className={styles.footer} aria-hidden="true">
              <span>DHAKA, BANGLADESH</span>
              <span>BUILT TO LAST</span>
            </div>
          </div>
        </div>
      )}
      <div ref={contentRef} className={styles.content} data-portfolio-content data-ready={complete}>
        {children}
      </div>
    </>
  );
}
