"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { NmLettermark } from "@/components/ui/nm-lettermark";
import styles from "./portfolio-intro.module.css";

const INTRO_DURATION = 2000;
const EXIT_DURATION = 350;

export function PortfolioIntro({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const screen = screenRef.current, content = contentRef.current;
    if (!screen || !content) return;

    // Follow the CSS timeline, which starts before hydration. Slow hydration
    // must not add another two-second wait or leave the portfolio blocked.
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
    const timer = window.setTimeout(() => {
      release();
      setComplete(true);
    }, remaining);
    return () => { window.clearTimeout(timer); release(); };
  }, []);

  return (
    <>
      {!complete && (
        <div ref={screenRef} className={styles.screen} data-portfolio-intro
          role="status" aria-live="polite" aria-label="Loading Nur Mohammad's portfolio">
          <div className={styles.header} aria-hidden="true">
            <span>NUR MOHAMMAD / PORTFOLIO</span>
            <span>BACKEND / AI-ASSISTED FRONTEND</span>
          </div>
          <div className={styles.center} aria-hidden="true">
            <div className={styles.sculpture}>
              <div className={styles.halo} />
              <div className={styles.scene}>
                <div className={styles.volume}>
                  <i className={styles.front} />
                  <i className={styles.back} />
                  <i className={styles.left} />
                  <i className={styles.right} />
                  <i className={styles.top} />
                  <i className={styles.bottom} />
                  <i className={styles.layerOne} />
                  <i className={styles.layerTwo} />
                  <i className={styles.layerThree} />
                </div>
              </div>
              <NmLettermark className={styles.mark} />
            </div>
            <h2>Nur Mohammad</h2>
            <p>Backend-first. Thoughtfully built.</p>
            <div className={styles.progress}><span /></div>
            <span className={styles.caption}>OPENING PORTFOLIO</span>
          </div>
          <div className={styles.footer} aria-hidden="true">
            <span>DHAKA, BANGLADESH</span>
            <span>BUILT TO LAST</span>
          </div>
        </div>
      )}
      <div ref={contentRef} className={styles.content} data-portfolio-content data-ready={complete}>
        {children}
      </div>
    </>
  );
}
