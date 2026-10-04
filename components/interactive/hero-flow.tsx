"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import type { createHeroFlowRenderer } from "./hero-flow-renderer";
import styles from "./hero-flow.module.css";

export function HeroFlow({ fallback }: { fallback: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const syncRef = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current, frame = root?.parentElement;
    if (!root || !canvas || !frame) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: ReturnType<typeof createHeroFlowRenderer> | null = null;
    let disposed = false, loading = false, visible = false, contextLost = false;
    let raf = 0, previousTime = 0, time = 0;
    let mouseX = 0, mouseY = 0, scroll = 0, pointerActive = 0;
    const tick = (now: number) => {
      raf = 0;
      if (!renderer || disposed || !visible || document.hidden || pausedRef.current || media.matches) return;
      const dt = previousTime ? Math.min(.05, (now - previousTime) / 1000) : 1 / 60;
      previousTime = now; time += dt;
      renderer.draw(time, mouseX, mouseY, scroll, dt, pointerActive);
      raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      renderer?.resize(root.clientWidth, root.clientHeight);
      renderer?.draw(time, mouseX, mouseY, scroll, 1, pointerActive);
    };
    const load = async () => {
      if (renderer || loading || disposed || contextLost || media.matches) return;
      loading = true;
      try {
        const { createHeroFlowRenderer } = await import("./hero-flow-renderer");
        if (disposed || media.matches) return;
        renderer = createHeroFlowRenderer(canvas);
        resize(); root.dataset.mode = "webgl";
      } catch {
        root.dataset.mode = "fallback";
        contextLost = true;
      } finally {
        loading = false;
        if (!disposed) sync();
      }
    };
    const sync = () => {
      cancelAnimationFrame(raf); raf = 0; previousTime = 0;
      if (disposed) return;
      if (media.matches) {
        root.dataset.mode = "reduced";
        root.dataset.motion = "stopped";
        renderer?.dispose(); renderer = null;
        return;
      }
      if (renderer) root.dataset.mode = "webgl";
      const running = visible && !document.hidden && !pausedRef.current && !contextLost;
      root.dataset.motion = running ? "running" : "stopped";
      if (running && renderer) raf = requestAnimationFrame(tick);
      else if (running) void load();
    };
    syncRef.current = sync;
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || pausedRef.current || media.matches) return;
      const rect = frame.getBoundingClientRect();
      mouseX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      mouseY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      pointerActive = 1;
      root.dataset.input = "pointer";
    };
    const leave = () => { pointerActive = 0; };
    const onScroll = () => {
      scroll = Math.max(0, Math.min(1.2, -frame.getBoundingClientRect().top / frame.clientHeight));
      if (visible && !media.matches && !pausedRef.current) root.dataset.input = "scroll";
    };
    const loss = (event: Event) => {
      event.preventDefault(); contextLost = true;
      cancelAnimationFrame(raf); raf = 0;
      renderer?.dispose(); renderer = null;
      root.dataset.mode = "fallback"; root.dataset.motion = "stopped";
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(frame); resizeObserver.observe(root);
    frame.addEventListener("pointermove", pointer);
    frame.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    canvas.addEventListener("webglcontextlost", loss);
    onScroll(); sync();
    return () => {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resizeObserver.disconnect();
      frame.removeEventListener("pointermove", pointer); frame.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync); canvas.removeEventListener("webglcontextlost", loss);
      renderer?.dispose(); syncRef.current = () => {};
    };
  }, []);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncRef.current();
  };
  return (
    <div className={styles.root} ref={rootRef} data-hero-flow data-mode="fallback">
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.fallback}>{fallback}</div>
        <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
      </div>
      <button className={styles.control} type="button" onClick={toggle} aria-label={paused ? "Resume background animation" : "Pause background animation"} aria-pressed={paused}>
        {paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}
        {paused ? "RESUME MOTION" : "PAUSE MOTION"}
      </button>
    </div>
  );
}
