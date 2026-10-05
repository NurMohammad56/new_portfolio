"use client";

import { AnimatePresence, m, useIsPresent } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";
import styles from "./directional-panel.module.css";

type Props = { panelKey: string; direction: number; children: ReactNode; className?: string };

const subscribeReducedMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const reducedSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverSnapshot = () => false;

function Panel({ direction, children }: Pick<Props, "direction" | "children">) {
  const present = useIsPresent();
  return (
    <m.div
      className={styles.panel}
      custom={direction}
      inert={!present}
      aria-hidden={present ? undefined : true}
      variants={{
        enter: (travel: number) => ({ opacity: 0, y: travel * 48, rotateX: travel * -3, scale: 0.985 }),
        settled: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
        leave: (travel: number) => ({ opacity: 0, y: travel * -32, rotateX: travel * 2, scale: 0.99, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }),
      }}
      initial="enter" animate="settled" exit="leave"
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >{children}</m.div>
  );
}

/** Both faces share a grid cell: the content slides, never the controls or page. */
export function DirectionalPanel({ panelKey, direction, children, className = "" }: Props) {
  const reduced = useSyncExternalStore(subscribeReducedMotion, reducedSnapshot, serverSnapshot);
  return (
    <div className={`${styles.viewport} ${className}`} data-direction={direction}>
      {reduced ? <div className={styles.panel}>{children}</div> : <AnimatePresence initial={false} custom={direction}>
        <Panel key={panelKey} direction={direction}>{children}</Panel>
      </AnimatePresence>}
    </div>
  );
}
