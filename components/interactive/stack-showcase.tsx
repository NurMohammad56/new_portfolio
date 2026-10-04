"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import type { StackFocusGroup } from "@/data/stack-focus";

type StackShowcaseProps = {
  groups: readonly StackFocusGroup[];
};

export function StackShowcase({ groups }: StackShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const activeGroup = groups[activeIndex] ?? groups[0];

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    // Read every card, not just the entries that changed intersection thresholds.
    // A card containing the reading line wins; gaps use the nearest card edge.
    const update = () => {
      frame = 0;
      const navBottom = document.querySelector(".site-navigation")?.getBoundingClientRect().bottom ?? 76;
      const readingLine = Math.min(window.innerHeight - 40, Math.max(navBottom + 64, window.innerHeight * 0.42));
      let nearest = 0;
      let nearestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const distance = Math.max(rect.top - readingLine, readingLine - rect.bottom, 0);
        if (distance < nearestDistance) { nearest = index; nearestDistance = distance; }
      });
      setActiveIndex(current => current === nearest ? current : nearest);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    cardRefs.current.forEach(card => { if (card) observer.observe(card); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [groups]);

  const selectGroup = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="stack-showcase">
      <div className="stack-story-layout">
        <aside className="stack-blueprint">
          <div className="stack-blueprint-sticky">
            <div className="stack-blueprint-head">
              <span>PRODUCT LAYERS / {String(groups.length).padStart(2, "0")}</span>
              <span className="system-online"><i /> ACTIVE</span>
            </div>

            <div className="stack-blueprint-canvas">
              <nav className="stack-blueprint-track" aria-label="Skill group navigation">
                <span className="stack-blueprint-line" aria-hidden="true">
                  <i style={{ height: `${(activeIndex / Math.max(groups.length - 1, 1)) * 100}%` }} />
                </span>
                {groups.map((group, index) => (
                  <button
                    className={index === activeIndex ? "is-active" : undefined}
                    type="button"
                    key={group.id}
                    onClick={() => selectGroup(index)}
                    aria-current={index === activeIndex ? "step" : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i aria-hidden="true" />
                    <strong>{group.title}</strong>
                  </button>
                ))}
              </nav>

              <div className="stack-blueprint-readout" key={activeGroup.id} aria-hidden="true">
                <span>{activeGroup.level}</span>
                <div><Icon name={activeGroup.icon} size={27} strokeWidth={1.35} /></div>
                <strong>{activeGroup.title}</strong>
                <p>{activeGroup.signal}</p>
                <small>{activeGroup.proof}</small>
              </div>

              <span className="stack-blueprint-grid" aria-hidden="true" />
            </div>

            <div className="stack-blueprint-foot">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
              <span>INTERFACE → PRODUCT → RELEASE</span>
            </div>
          </div>
        </aside>

        <div className="stack-focus-list">
          {groups.map((group, index) => (
            <article
              className="stack-focus-card"
              data-active={index === activeIndex}
              data-stack-index={index}
              id={`stack-layer-${group.id}`}
              key={group.id}
              ref={(node) => { cardRefs.current[index] = node; }}
            >
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><Icon name={group.icon} aria-hidden="true" size={20} strokeWidth={1.5} /></div>
                <p>{group.level}</p>
                <span>{group.proof}</span>
              </header>

              <div className="stack-focus-copy">
                <span>{group.signal}</span>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>

              <div className="stack-tool-groups">
                <div className="stack-core-tools">
                  <span>CORE TOOLS</span>
                  <ul>
                    {group.core.map((technology, toolIndex) => (
                      <li
                        key={technology}
                        style={{ "--tool-index": toolIndex } as CSSProperties}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>

                {group.supporting.length > 0 ? (
                  <div className="stack-supporting-tools">
                    <span>SUPPORTING TOOLKIT</span>
                    <ul>
                      {group.supporting.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>

            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
