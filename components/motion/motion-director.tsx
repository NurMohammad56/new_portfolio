"use client";

import { useEffect } from "react";
import { EASE, gsap, isPortfolioReady, ScrollTrigger, SplitText, whenPortfolioReady } from "./gsap";

type Cleanup = () => void;

const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/* ------------------------------------------------------------------ hero -- */

function heroEntrance(cleanups: Cleanup[]) {
  const frame = $("[data-hero-frame]");
  const title = $("[data-hero-title]");
  if (!frame || !title) return;

  // Hydrated after the intro already finished: never hide visible content.
  if (isPortfolioReady()) return;

  const split = SplitText.create(title, {
    type: "lines,chars",
    mask: "lines",
    linesClass: "hero-line",
    charsClass: "hero-char",
    aria: "auto",
  });

  const portraitImage = $("[data-hero-portrait-image]", frame);
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: EASE.reveal, duration: 1.35 },
    onComplete: () => split.revert(),
  });

  tl.from(split.chars, { yPercent: 118, rotate: 7, transformOrigin: "0% 100%", stagger: 0.032 }, 0.12)
    .from($$("[data-hero-rise]", frame), { y: 28, autoAlpha: 0, stagger: 0.09, duration: 1.1 }, 0.42)
    .from($$("[data-hero-chrome]", frame), { autoAlpha: 0, y: 14, stagger: 0.07, duration: 1 }, 0.7)
    .from($("[data-hero-halo]", frame), { scale: 0.72, autoAlpha: 0, duration: 1.8 }, 0.1)
    .fromTo(
      portraitImage,
      { clipPath: "inset(100% 0% 0% 0%)", scale: 1.22 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.7, ease: EASE.sweep },
      0,
    )
    .from($("[data-hero-caption]", frame), { autoAlpha: 0, y: 10, duration: 0.9 }, 1.1);

  cleanups.push(whenPortfolioReady(() => tl.play()));
  cleanups.push(() => {
    tl.kill();
    split.revert();
  });
}

function heroDepth(cleanups: Cleanup[]) {
  const frame = $("[data-hero-frame]");
  if (!frame) return;
  const layers = $$("[data-depth]", frame).map(element => ({
    depth: Number(element.dataset.depth) || 0,
    x: gsap.quickTo(element, "x", { duration: 1.2, ease: EASE.glide }),
    y: gsap.quickTo(element, "y", { duration: 1.2, ease: EASE.glide }),
  }));
  const move = (event: PointerEvent) => {
    const rect = frame.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    for (const layer of layers) {
      layer.x(nx * layer.depth);
      layer.y(ny * layer.depth * 0.7);
    }
  };
  const leave = () => layers.forEach(layer => { layer.x(0); layer.y(0); });
  frame.addEventListener("pointermove", move);
  frame.addEventListener("pointerleave", leave);
  cleanups.push(() => {
    frame.removeEventListener("pointermove", move);
    frame.removeEventListener("pointerleave", leave);
  });
}

/** The hero card lifts away as the page begins: it shrinks, its layers drift apart. */
function heroExit(wide: boolean) {
  const hero = $("#home");
  const frame = $("[data-hero-frame]");
  if (!hero || !frame) return;
  // Explicit start values: the entrance briefly hides these same elements,
  // and a scrubbed tween must never record that hidden state as its start.
  const fade = { immediateRender: false };
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.4 },
  })
    .fromTo(frame, { scale: 1, "--frame-dim": 0 }, { scale: 0.9, transformOrigin: "50% 0%", "--frame-dim": 1, ...fade }, 0)
    .fromTo($("[data-hero-copy]", frame), { yPercent: 0, autoAlpha: 1 }, { yPercent: -34, autoAlpha: 0.05, ...fade }, 0)
    .fromTo($$("[data-hero-chrome]", frame), { autoAlpha: 1 }, { autoAlpha: 0, ...fade }, 0);
  // Below 950px the portrait is centred by its own CSS transform.
  if (wide) tl.fromTo($("[data-hero-portrait]", frame), { yPercent: 0 }, { yPercent: -10, ...fade }, 0);
}

/* -------------------------------------------------------------- headings -- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-";

/** Decodes text left to right through random glyphs, like a terminal resolving. */
function scramble(element: HTMLElement, original: string, duration = 0.9) {
  const state = { progress: 0 };
  const restore = () => { element.textContent = original; };
  return gsap.to(state, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const settled = Math.floor(state.progress * original.length);
      let output = "";
      for (let index = 0; index < original.length; index++) {
        const character = original[index];
        output += index < settled || character === " " ? character : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      element.textContent = output;
    },
    onComplete: restore,
    onInterrupt: restore,
  });
}

function sectionHeadings(cleanups: Cleanup[]) {
  for (const header of $$("[data-heading]")) {
    const h2 = $("h2", header);
    if (!h2) continue;
    gsap.set(header, { "--rule": 0 });
    const kicker = $$("[data-heading-kicker] > *", header);
    const copy = $("p", header);
    const label = kicker[kicker.length - 1];
    const labelText = label?.textContent ?? "";
    // A re-split or teardown mid-scramble must never leave garbled text behind.
    if (label) cleanups.push(() => { label.textContent = labelText; });

    SplitText.create(h2, {
      type: "lines,words",
      mask: "lines",
      linesClass: "heading-line",
      aria: "auto",
      autoSplit: true,
      onSplit(self) {
        return gsap.timeline({
          scrollTrigger: { trigger: header, start: "top 84%", once: true },
          defaults: { ease: EASE.reveal },
          onComplete: () => self.revert(),
        })
          .to(header, { "--rule": 1, duration: 1.6, ease: EASE.sweep }, 0)
          .from(kicker, { autoAlpha: 0, x: -12, stagger: 0.08, duration: 0.9 }, 0.05)
          .add(label ? scramble(label, labelText) : gsap.timeline(), 0.12)
          .from(self.words, { yPercent: 112, duration: 1.15, stagger: 0.045 }, 0.08)
          .from(copy, { autoAlpha: 0, y: 18, duration: 1 }, 0.35);
      },
    });
  }
}

/* --------------------------------------------------------------- reveals -- */

/** Lists rise in as a group, item by item. */
function staggerGroups() {
  for (const group of $$("[data-stagger]")) {
    const items = Array.from(group.children).filter(child => !(child instanceof HTMLParagraphElement && !child.textContent));
    if (!items.length) continue;
    gsap.from(items, {
      y: 46,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.075,
      ease: EASE.reveal,
      scrollTrigger: { trigger: group, start: "top 86%", once: true },
    });
  }
}

/** The project rail opens like a window as it reaches the middle of the screen. */
function windowReveals() {
  for (const element of $$("[data-window-reveal]")) {
    gsap.fromTo(
      element,
      { clipPath: "inset(16% 12% 16% 12% round 36px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 96%", end: "top 30%", scrub: 0.5 },
      },
    );
  }
}

/** Large blocks drift against the scroll for depth. */
function parallaxBlocks() {
  for (const element of $$("[data-parallax]")) {
    const amount = Number(element.dataset.parallax) || 10;
    gsap.fromTo(
      element,
      { yPercent: amount },
      {
        yPercent: -amount,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }
}

/** The closing wordmark rises letter by letter as the page ends. */
function footerWordmark() {
  const mark = $("[data-footer-wordmark]");
  if (!mark) return;
  const split = SplitText.create(mark, { type: "words,chars", charsClass: "wordmark-char" });
  gsap.from(split.chars, {
    yPercent: 100,
    ease: "none",
    stagger: { each: 0.05, from: "center" },
    scrollTrigger: { trigger: mark, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
  });
}

/* -------------------------------------------------------------- magnetic -- */

function magnetic(cleanups: Cleanup[]) {
  for (const element of $$("[data-magnetic]")) {
    const strength = Number(element.dataset.magnetic) || 0.32;
    const x = gsap.quickTo(element, "x", { duration: 0.6, ease: EASE.glide });
    const y = gsap.quickTo(element, "y", { duration: 0.6, ease: EASE.glide });
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      x((event.clientX - rect.left - rect.width / 2) * strength);
      y((event.clientY - rect.top - rect.height / 2) * strength);
    };
    const leave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.38)", overwrite: true });
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    });
  }
}

/* ------------------------------------------------------ spotlight & tilt -- */

/** Feeds the pointer position to the CSS spotlight (see motion.css). */
function spotlights(cleanups: Cleanup[]) {
  for (const element of $$("[data-spotlight], [data-tilt-group] > *")) {
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };
    element.addEventListener("pointermove", move);
    cleanups.push(() => element.removeEventListener("pointermove", move));
  }
}

/** Cards lean toward the pointer in 3D and settle back when it leaves. */
function tilts(cleanups: Cleanup[]) {
  for (const element of $$("[data-tilt-group] > *")) {
    gsap.set(element, { transformPerspective: 900 });
    const rotateX = gsap.quickTo(element, "rotationX", { duration: 0.7, ease: EASE.glide });
    const rotateY = gsap.quickTo(element, "rotationY", { duration: 0.7, ease: EASE.glide });
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 12);
      rotateX(-((event.clientY - rect.top) / rect.height - 0.5) * 12);
    };
    const leave = () => { rotateX(0); rotateY(0); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    });
  }
}

/* -------------------------------------------------------------- director -- */

/**
 * One place for the page's scroll choreography. Every effect is progressive:
 * content is fully visible without JavaScript and for reduced-motion visitors.
 */
export function MotionDirector() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 951px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      context => {
        const { motion, wide, fine } = context.conditions as Record<string, boolean>;
        if (!motion) return;
        const cleanups: Cleanup[] = [];

        heroEntrance(cleanups);
        heroExit(wide);
        sectionHeadings(cleanups);
        staggerGroups();
        windowReveals();
        parallaxBlocks();
        footerWordmark();
        if (wide && fine) heroDepth(cleanups);
        if (fine) {
          magnetic(cleanups);
          spotlights(cleanups);
          tilts(cleanups);
        }

        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cleanups.forEach(cleanup => cleanup());
      },
    );
    return () => mm.revert();
  }, []);

  return <div className="film-grain" aria-hidden="true" />;
}
