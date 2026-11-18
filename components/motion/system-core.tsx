"use client";

import { useEffect, useRef, useState } from "react";
import { NmLettermark } from "@/components/ui/nm-lettermark";
import { ScrollTrigger } from "./gsap";
import type { CorePalette, SystemCoreRenderer } from "./system-core-renderer";
import styles from "./system-core.module.css";

const STAGES = [
  {
    title: "Request",
    text: "A tap in a mobile app or a click on the web arrives as a request. Authenticated before anything else happens.",
    tools: ["REST APIs", "JWT", "Google OAuth"],
  },
  {
    title: "Logic",
    text: "Validated, authorized and routed through clean service layers, with business rules that stay readable.",
    tools: ["Node.js", "Nest.js", "Express.js"],
  },
  {
    title: "Data",
    text: "Modeled for the product's real questions, with relationships, transactions and queries that stay fast as it grows.",
    tools: ["MongoDB", "PostgreSQL", "Mongoose"],
  },
  {
    title: "Real-time",
    text: "Pushed to every connected screen the moment it changes. Heavy work moves to queues and workers.",
    tools: ["Socket.IO", "Queues & workers", "Push notifications"],
  },
  {
    title: "Production",
    text: "Shipped, served and kept healthy on real infrastructure, from a VPS to the cloud.",
    tools: ["AWS EC2", "Nginx", "PM2", "Vercel"],
  },
] as const;

const LAST = STAGES.length - 1;

/** Scroll progress → stage value that rests on each shape before morphing on. */
function stageValue(progress: number) {
  const scaled = Math.min(Math.max(progress, 0), 1) * LAST;
  const base = Math.min(Math.floor(scaled), LAST - 1);
  const local = scaled - base;
  const eased = Math.min(Math.max((local - 0.18) / 0.64, 0), 1);
  return base + eased * eased * (3 - 2 * eased);
}

function readPalette(): CorePalette {
  const style = getComputedStyle(document.documentElement);
  const light = document.documentElement.dataset.theme === "light";
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return light
    ? { primary: read("--signal", "#007b72"), secondary: read("--signal-deep", "#08635d"), highlight: "#0b2f33", additive: false, opacity: 0.7 }
    : { primary: read("--signal", "#17e6d2"), secondary: read("--signal-light", "#95d8d2"), highlight: "#ffffff", additive: true, opacity: 0.85 };
}

/**
 * "System in motion": a pinned 3D scene. Scrolling carries a single request
 * through the backend, and the particle field reshapes itself at each stage.
 */
export function SystemCore() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current, sticky = stickyRef.current, canvas = canvasRef.current;
    if (!track || !sticky || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 760px)");

    let renderer: SystemCoreRenderer | null = null;
    let loading = false, disposed = false, visible = false;
    let raf = 0, last = 0, time = 0;
    let target = 0, current = 0;
    let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0;
    let activeIndex = 0;

    const draw = () => renderer?.render({ time, progress: current, pointerX, pointerY, animate: !reduce.matches });

    const loop = (now: number) => {
      raf = 0;
      if (!renderer || !visible || document.hidden || disposed) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      time += dt;
      current += (target - current) * Math.min(1, dt * 5);
      pointerX += (aimX - pointerX) * Math.min(1, dt * 3);
      pointerY += (aimY - pointerY) * Math.min(1, dt * 3);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || !renderer || !visible || reduce.matches) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const resize = () => {
      renderer?.resize(sticky.clientWidth, sticky.clientHeight);
      draw();
    };

    const load = async () => {
      if (renderer || loading || disposed) return;
      loading = true;
      try {
        const { createSystemCoreRenderer } = await import("./system-core-renderer");
        if (disposed) return;
        renderer = createSystemCoreRenderer(canvas, {
          count: compact.matches ? 7000 : 14000,
          maxPixelRatio: compact.matches ? 1.5 : 1.75,
        });
        renderer.setPalette(readPalette());
        current = target;
        resize();
        sticky.dataset.webgl = "true";
        start();
      } catch {
        sticky.dataset.webgl = "false"; // Captions and the CSS glow carry the section.
      } finally {
        loading = false;
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: self => {
        target = stageValue(self.progress);
        if (meterRef.current) meterRef.current.style.transform = `scaleX(${self.progress})`;
        const next = Math.round(target);
        if (next !== activeIndex) {
          activeIndex = next;
          setActive(next);
        }
        // Reduced motion: switch shapes without the morph, on scroll only.
        if (reduce.matches) {
          current = next;
          draw();
        }
      },
    });

    const near = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) void load();
    }, { rootMargin: "800px 0px" });
    near.observe(track);
    const onScreen = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    });
    onScreen.observe(sticky);

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(sticky);

    const move = (event: PointerEvent) => {
      const rect = sticky.getBoundingClientRect();
      aimX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      aimY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const leave = () => { aimX = 0; aimY = 0; };
    sticky.addEventListener("pointermove", move);
    sticky.addEventListener("pointerleave", leave);

    const themeObserver = new MutationObserver(() => {
      renderer?.setPalette(readPalette());
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onMotionChange = () => { if (reduce.matches) { stop(); current = Math.round(target); draw(); } else start(); };
    reduce.addEventListener("change", onMotionChange);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      renderer?.dispose();
      renderer = null;
      sticky.dataset.webgl = "false";
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      stop();
      trigger.kill();
      near.disconnect();
      onScreen.disconnect();
      sizeObserver.disconnect();
      themeObserver.disconnect();
      sticky.removeEventListener("pointermove", move);
      sticky.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      renderer?.dispose();
      renderer = null;
    };
  }, []);

  return (
    <section className={styles.section} id="system" aria-labelledby="system-title">
      <div ref={trackRef} className={styles.track}>
        <div ref={stickyRef} className={styles.sticky} data-webgl="pending" data-stage={active}>
          <div className={styles.glow} aria-hidden="true"><NmLettermark className={styles.fallbackMark} /></div>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <span className={styles.bigNumber} aria-hidden="true" key={active}>{String(active + 1).padStart(2, "0")}</span>

          <div className={styles.layout}>
            <header className={styles.header}>
              <p className={styles.kicker}><span>∞</span> System in motion</p>
              <h2 id="system-title">Every request,<br />end to end.</h2>
            </header>

            <ol className={styles.stages}>
              {STAGES.map((stage, index) => (
                <li key={stage.title} data-active={index === active} aria-current={index === active ? "step" : undefined}>
                  <span className={styles.stageIndex}>{String(index + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.text}</p>
                  <ul className={styles.tools} aria-label={`${stage.title} tools`}>
                    {stage.tools.map(tool => <li key={tool}>{tool}</li>)}
                  </ul>
                </li>
              ))}
            </ol>

            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railTrack}><span ref={meterRef} className={styles.railFill} /></span>
              {STAGES.map((stage, index) => (
                <span key={stage.title} className={styles.railStep} data-active={index <= active}>{stage.title}</span>
              ))}
            </div>
          </div>

          <p className={styles.hint} aria-hidden="true">Scroll to follow the request</p>
        </div>
      </div>
    </section>
  );
}
