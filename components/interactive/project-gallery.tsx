"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Smartphone, X, ZoomIn, ZoomOut } from "lucide-react";
import { showcaseProjects } from "@/data/project-showcase";
import type { createGalleryRenderer } from "./gallery-renderer";
import styles from "./project-gallery.module.css";

const wrap = (value: number, period: number) => ((value % period) + period) % period;

export function ProjectGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const navigateRef = useRef<(direction: number) => void>(() => { });
  const focusCardRef = useRef<(index: number) => void>(() => { });
  const suppressClick = useRef(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<number | null>(null);
  const project = showcaseProjects[opened ?? 0];

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-gallery-card]"));
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let target = 0;
    let step = 1;
    let width = 0;
    let height = 0;
    let frame = 0;
    let activeIndex = 0;
    let pointer: { id: number; start: number; startY: number; last: number; velocity: number; dragged: boolean; time: number } | null = null;
    let gpu: Awaited<ReturnType<typeof createGalleryRenderer>> | null = null;
    let gpuLoading = false;
    let visible = false;
    let hovered = -1;
    let pointerX = 0;
    let pointerY = 0;
    let previousTime = performance.now();
    let previousScroll = window.scrollY;
    let ignoreScrollUntil = 0;
    const controller = new AbortController();

    const schedule = () => { if (!frame && !controller.signal.aborted) frame = requestAnimationFrame(tick); };
    const tick = (now: number) => {
      frame = 0;
      const previous = current;
      const dt = Math.min(64, now - previousTime);
      previousTime = now;
      current = mediaQuery.matches ? target : current + (target - current) * (1 - Math.pow(0.88, dt / 16.67));
      if (Math.abs(target - current) < 0.1) current = target;
      const velocity = current - previous;
      const period = step * cards.length;
      if (Math.abs(current) > period * 20) {
        const offset = Math.trunc(current / period) * period;
        current -= offset;
        target -= offset;
      }
      const axes = cards.map((card, index) => {
        const axis = wrap(index * step + current + period / 2, period) - period / 2;
        const ratio = Math.max(-1.5, Math.min(1.5, axis / root.clientWidth));
        const lift = mediaQuery.matches ? 0 : Math.abs(ratio) * 22;
        const skew = mediaQuery.matches ? 0 : Math.max(-4, Math.min(4, velocity * 0.1));
        card.style.transform = `translate3d(${root.clientWidth / 2 + axis - width / 2}px, ${(root.clientHeight - height) / 2 + lift}px, 0) skewX(${skew}deg)`;
        return axis;
      });
      const settling = visible && !mediaQuery.matches && gpu?.draw({ axes, width, height, velocity, pointerX, pointerY, hovered });
      const nextActive = wrap(Math.round(-current / step), cards.length);
      if (nextActive !== activeIndex) { activeIndex = nextActive; setActive(nextActive); }
      if (visible && (current !== target || settling)) schedule();
    };
    const measure = () => {
      const previousStep = step;
      width = Math.min(760, root.clientWidth < 650 ? root.clientWidth * 0.82 : root.clientWidth * 0.58);
      height = Math.min(root.clientHeight - 76, width * 0.64);
      step = width + (root.clientWidth < 650 ? 16 : 24);
      if (previousStep !== 1) { current *= step / previousStep; target *= step / previousStep; }
      cards.forEach(card => { card.style.width = `${width}px`; card.style.height = `${height}px`; });
      root.dataset.ready = "true";
      schedule();
    };
    navigateRef.current = direction => { target = (Math.round(target / step) - direction) * step; schedule(); };
    focusCardRef.current = index => {
      const period = step * cards.length;
      target = current + wrap(-index * step - current + period / 2, period) - period / 2;
      schedule();
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      suppressClick.current = false;
      pointer = { id: event.pointerId, start: event.clientX, startY: event.clientY, last: event.clientX, velocity: 0, dragged: false, time: performance.now() };
    };
    const move = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      hovered = cards.findIndex(card => card.contains(event.target as Node));
      schedule();
      if (!pointer || pointer.id !== event.pointerId) return;
      if (!pointer.dragged && Math.abs(event.clientY - pointer.startY) > Math.abs(event.clientX - pointer.start) && Math.abs(event.clientY - pointer.startY) > 8) { pointer = null; return; }
      if (!pointer.dragged && Math.abs(event.clientX - pointer.start) > 8) {
        pointer.dragged = true;
        suppressClick.current = true;
        root.setPointerCapture(event.pointerId);
        root.dataset.dragging = "true";
      }
      if (!pointer.dragged) return;
      const now = performance.now();
      const delta = event.clientX - pointer.last;
      pointer.velocity = delta / Math.max(8, now - pointer.time);
      pointer.last = event.clientX;
      pointer.time = now;
      target += delta * 1.3;
      schedule();
    };
    const finish = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (pointer.dragged && !mediaQuery.matches && performance.now() - pointer.time < 100) target += pointer.velocity * 160;
      pointer = null;
      root.dataset.dragging = "false";
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      schedule();
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || dialogRef.current?.open) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (horizontal) event.preventDefault();
      if (!horizontal && mediaQuery.matches) return;
      // Ordinary page scrolling also moves the rail; vertical scrolling is never trapped.
      const delta = event.shiftKey ? event.deltaY : horizontal ? event.deltaX : event.deltaY;
      const normalized = delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1);
      target -= Math.max(-240, Math.min(240, normalized)) * 0.95;
      ignoreScrollUntil = performance.now() + 180;
      schedule();
    };
    const scroll = () => {
      const delta = window.scrollY - previousScroll;
      previousScroll = window.scrollY;
      if (!visible || mediaQuery.matches || dialogRef.current?.open || performance.now() < ignoreScrollUntil) return;
      target -= Math.max(-240, Math.min(240, delta)) * 0.8;
      schedule();
    };
    const leave = () => { hovered = -1; schedule(); };
    const loadGpu = async () => {
      if (gpu || gpuLoading || mediaQuery.matches || !canvasRef.current) return;
      gpuLoading = true;
      try {
        const { createGalleryRenderer } = await import("./gallery-renderer");
        if (controller.signal.aborted) return;
        gpu = await createGalleryRenderer(root, canvasRef.current, showcaseProjects, controller.signal);
        schedule();
      } catch { root.dataset.webgl = "false"; /* Functional DOM fallback for unavailable GPU/images. */ }
    };
    const motionChange = () => { root.dataset.webgl = "false"; if (!mediaQuery.matches) void loadGpu(); schedule(); };
    const visibility = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { void loadGpu(); schedule(); }
    });
    visibility.observe(root);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", finish);
    root.addEventListener("pointercancel", finish);
    root.addEventListener("wheel", wheel, { passive: false });
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    mediaQuery.addEventListener("change", motionChange);
    measure();
    return () => {
      observer.disconnect();
      visibility.disconnect();
      controller.abort();
      gpu?.dispose();
      cancelAnimationFrame(frame);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", finish);
      root.removeEventListener("pointercancel", finish);
      root.removeEventListener("wheel", wheel);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
      mediaQuery.removeEventListener("change", motionChange);
    };
  }, []);

  useEffect(() => {
    if (opened === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    sheetRef.current?.scrollTo({ top: 0 });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [opened]);

  const close = () => {
    dialogRef.current?.close();
    setOpened(null);
    setZoomedImage(null);
    triggerRef.current?.focus({ preventScroll: true });
  };
  const changeProject = (direction: number) => {
    setZoomedImage(null);
    setOpened(index => wrap((index ?? 0) + direction, showcaseProjects.length));
  };

  return (
    <div className={styles.showcase}>
      <div className={styles.stage} ref={stageRef} role="region" aria-label="Project gallery" onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const cards = Array.from(stageRef.current?.querySelectorAll<HTMLButtonElement>("[data-gallery-card]") ?? []);
          const focused = cards.indexOf(event.target as HTMLButtonElement);
          if (focused >= 0) {
            const next = wrap(focused + direction, cards.length);
            focusCardRef.current(next);
            cards[next].focus({ preventScroll: true });
          } else navigateRef.current(direction);
        }
      }}>
        <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
        {showcaseProjects.map((item, index) => (
          <button key={item.id} type="button" className={styles.card} data-gallery-card aria-label={`Preview ${item.title}, ${item.category}`} onFocus={event => {
            if (event.currentTarget.matches(":focus-visible")) focusCardRef.current(index);
          }} onClick={event => {
            if (event.detail !== 0 && suppressClick.current) { suppressClick.current = false; return; }
            triggerRef.current = event.currentTarget;
            setZoomedImage(null);
            setOpened(index);
          }}>
            <Image src={item.cover} alt="" fill sizes="(max-width: 650px) 82vw, 760px" draggable={false} />
            <span className={styles.caption}>
              <span><small>{item.category}</small><strong>{item.title}</strong></span>
              <span className={styles.cardArrow}><ArrowUpRight size={20} aria-hidden="true" /></span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.controls}>
        <p>Scroll or drag to explore <span>- click a project to open</span></p>
        <div className={styles.pagination}>
          <button type="button" aria-label="Previous gallery project" onClick={() => navigateRef.current(-1)}><ArrowLeft size={18} /></button>
          <div className={styles.dots} aria-label="Choose a project">
            {showcaseProjects.map((item, index) => <button key={item.id} type="button" aria-label={`Go to ${item.title}`} aria-pressed={active === index} onClick={() => focusCardRef.current(index)} />)}
          </div>
          <button type="button" aria-label="Next gallery project" onClick={() => navigateRef.current(1)}><ArrowRight size={18} /></button>
        </div>
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="showcase-project-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          changeProject(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
        <div className={styles.sheet} ref={sheetRef}>
          <button type="button" className={styles.close} onClick={close} aria-label="Close project preview"><X size={21} /></button>
          <div className={styles.copy} key={project.id}>
            <span className={styles.demoLabel}>PROJECT PREVIEW / DEMO</span>
            <h3 id="showcase-project-title">{project.title}</h3>
            <p>{project.description}</p>
            <div className={styles.tags}><span>{project.category}</span>{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
            <div className={styles.projectLinks} aria-label="Project links">
              {([
                { label: "Live website", url: project.links.website, icon: Globe },
                { label: "Google Play", url: project.links.googlePlay, icon: Smartphone },
                { label: "Apple App Store", url: project.links.appStore, icon: Smartphone },
              ] as const).map(link => link.url ? (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer"><link.icon size={16} aria-hidden="true" />{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>
              ) : (
                <span key={link.label} aria-disabled="true"><link.icon size={16} aria-hidden="true" />{link.label}<small>Coming soon</small></span>
              ))}
            </div>
            <p className={styles.placeholderNote}>Placeholder images &amp; content. Actual work coming soon.</p>
          </div>
          <div className={styles.media} key={`${project.id}-images`}>
            {project.images.map((src, index) => (
              <button className={`${styles.imagePreview}${zoomedImage === index ? ` ${styles.zoomed}` : ""}`} type="button" key={`${src}-${index}`} aria-label={`${zoomedImage === index ? "Zoom out of" : "Zoom into"} ${project.title} image ${index + 1}`} aria-pressed={zoomedImage === index} onClick={() => setZoomedImage(zoomedImage === index ? null : index)}>
                <Image src={src} alt={`${project.title} demo interface ${index + 1}`} width={1200} height={800} sizes="(max-width: 760px) 90vw, 60vw" />
                <span>{zoomedImage === index ? <ZoomOut size={17} /> : <ZoomIn size={17} />}</span>
              </button>
            ))}
          </div>
          <div className={styles.sheetNavigation}>
            <button type="button" onClick={() => changeProject(-1)}><ArrowLeft size={17} />{showcaseProjects[wrap((opened ?? 0) - 1, showcaseProjects.length)].title}</button>
            <span>{String((opened ?? 0) + 1).padStart(2, "0")} / {String(showcaseProjects.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => changeProject(1)}>{showcaseProjects[wrap((opened ?? 0) + 1, showcaseProjects.length)].title}<ArrowRight size={17} /></button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
