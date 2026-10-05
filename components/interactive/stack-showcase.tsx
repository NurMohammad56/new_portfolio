"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { ArrowDown } from "lucide-react";
import { DirectionalPanel } from "./directional-panel";
import { useReadingStage } from "./use-reading-stage";
import styles from "./stack-showcase.module.css";
import { Icon } from "@/components/ui/icon";
import type { StackFocusGroup } from "@/data/stack-focus";
import { stackStudies } from "@/data/stack-studies";
import { StackStudy } from "@/components/visuals/stack-study";

type StackShowcaseProps = {
  groups: readonly StackFocusGroup[];
};

export function StackShowcase({ groups }: StackShowcaseProps) {
  const { activeIndex, direction, cardRefs, sectionRef, navigate } = useReadingStage(groups.length);
  const activeGroup = groups[activeIndex] ?? groups[0];
  const study = stackStudies[activeGroup.id] ?? stackStudies["backend-realtime"];
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewVisible = useInView(previewRef);

  return (
    <div className="stack-showcase">
      <div className="stack-story-layout" ref={sectionRef}>
        <aside className="stack-blueprint">
          <div className={styles.sticky}>
            <div className="stack-blueprint-head">
              <span>SYSTEM EXPLORER / {String(groups.length).padStart(2, "0")}</span>
              <span className="system-online"><i /> ACTIVE</span>
            </div>

            <div className={styles.canvas}>
              <nav className={styles.navigation} aria-label="Skill group navigation">
                {groups.map((group, index) => (
                  <button
                    data-active={index === activeIndex}
                    type="button"
                    key={group.id}
                    onClick={() => navigate(index)}
                    aria-label={`Explore ${group.title}`}
                    title={group.title}
                    aria-current={index === activeIndex ? "step" : undefined}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon name={group.icon} size={17} aria-hidden="true" />
                  </button>
                ))}
              </nav>

              <div className={styles.deck} aria-hidden="true" ref={previewRef} data-study-running={previewVisible}>
                <DirectionalPanel panelKey={activeGroup.id} direction={direction} className={styles.viewport}>
                  <div className={styles.card} data-toolkit-preview={activeGroup.id}>
                    <div className={styles.meta}><span>STUDY {String(activeIndex + 1).padStart(2, "0")}</span><span>IN MOTION / BY DESIGN</span></div>
                    <StackStudy groupId={activeGroup.id} />
                    <h3>{study.title}</h3>
                    <p>{study.caption}</p>
                    <ol className={styles.sequence}>{study.sequence.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
                    <div className={styles.proof}><span>ILLUSTRATIVE SYSTEM VIEW</span><span className={styles.legend}><i /> SIGNAL FLOW</span></div>
                  </div>
                </DirectionalPanel>
              </div>

              <span className="stack-blueprint-grid" aria-hidden="true" />
            </div>

            <div className="stack-blueprint-foot">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
              <span>SCROLL TO EXPLORE <ArrowDown size={11} aria-hidden="true" /></span>
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
