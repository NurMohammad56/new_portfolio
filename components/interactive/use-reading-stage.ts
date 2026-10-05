"use client";

import { useEffect, useRef, useState } from "react";

/** One reading line for all cards, with a small dead zone to prevent boundary flicker. */
export function useReadingStage(count: number) {
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const current = useRef(0);

  const select = (index: number) => {
    if (index === current.current || index < 0 || index >= count) return;
    const direction = index > current.current ? 1 : -1;
    current.current = index;
    setSelection({ index, direction });
  };

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    let visible = true;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const navBottom = document.querySelector(".site-navigation")?.getBoundingClientRect().bottom ?? 76;
      const readingLine = Math.min(window.innerHeight - 40, Math.max(navBottom + 64, window.innerHeight * 0.42));
      const rects = cardRefs.current.map(card => card?.getBoundingClientRect());
      const active = rects[current.current];
      // Retain a card for a few pixels beyond its edge, without delaying a direct jump.
      if (active && active.top - 12 <= readingLine && active.bottom + 12 >= readingLine) return;
      let nearest = current.current;
      let distance = Infinity;
      rects.forEach((rect, index) => {
        if (!rect) return;
        const next = Math.max(rect.top - readingLine, readingLine - rect.bottom, 0);
        if (next < distance) { nearest = index; distance = next; }
      });
      if (nearest !== current.current) {
        const direction = nearest > current.current ? 1 : -1;
        current.current = nearest;
        setSelection({ index: nearest, direction });
      }
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    cardRefs.current.forEach(card => { if (card) resize.observe(card); });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); });
    if (sectionRef.current) intersection.observe(sectionRef.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      resize.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    };
  }, [count]);

  const navigate = (index: number) => {
    // The scroll observer owns selection while traveling past intermediate cards.
    cardRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  };
  return { activeIndex: selection.index, direction: selection.direction, cardRefs, sectionRef, select, navigate };
}
