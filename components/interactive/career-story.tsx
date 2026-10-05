"use client";

import type { CSSProperties } from "react";
import { DirectionalPanel } from "./directional-panel";
import { useReadingStage } from "./use-reading-stage";
import { ArrowUpRight } from "lucide-react";
import { CompanyLogo } from "@/components/ui/company-logo";
import type { CareerStage } from "@/data/career";

type CareerStoryProps = {
  stages: readonly CareerStage[];
};

export function CareerStory({ stages }: CareerStoryProps) {
  const { activeIndex, direction, cardRefs: stageRefs, sectionRef, select, navigate } = useReadingStage(stages.length);
  const activeStage = stages[activeIndex] ?? stages[0];

  return (
    <div className="career-story-layout" ref={sectionRef}>
      <aside className="career-story-readout" aria-label="Career stage navigator">
        <div className="career-story-readout-sticky">
          <div className="career-story-readout-head">
            <span>CAREER SIGNAL / {String(stages.length).padStart(2, "0")} ROLES</span>
            <span className="system-online"><i /> VERIFIED PATH</span>
          </div>

          <div className="career-story-readout-body">
            <div className="career-story-route">
              <span aria-hidden="true"><i style={{ height: `${((activeIndex + 1) / stages.length) * 100}%` }} /></span>
              {stages.map((stage, index) => (
                <button
                  type="button"
                  key={stage.id}
                  className={index === activeIndex ? "is-active" : undefined}
                  aria-label={`Show ${stage.role} at ${stage.organization}`}
                  onClick={() => navigate(index)}
                  aria-current={index === activeIndex ? "step" : undefined}
                >
                  <span>{stage.number}</span>
                  <i aria-hidden="true" />
                  <strong>{stage.phase}</strong>
                </button>
              ))}
            </div>

            <DirectionalPanel panelKey={activeStage.id} direction={direction} className="career-preview-deck">
            <div className="career-story-active">
              <span>{activeStage.phase}</span>
              <div className="career-active-logo-box">
                <CompanyLogo id={activeStage.logoId} size={30} />
              </div>
              <strong>{activeStage.role}</strong>
              {activeStage.organizationUrl ? (
                <p>
                  <a
                    href={activeStage.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="career-org-link"
                  >
                    <CompanyLogo id={activeStage.logoId} size={15} />
                    <span>{activeStage.organization}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </p>
              ) : (
                <p>{activeStage.organization}</p>
              )}
              <small>{activeStage.duration}</small>
              <small>{activeStage.location}</small>
            </div>
            </DirectionalPanel>

            <span className="career-story-grid" />
          </div>

          <div className="career-story-readout-foot">
            <span>{activeStage.number} / {String(stages.length).padStart(2, "0")}</span>
            <span>BACKEND DEVELOPMENT · WEB PLATFORM DELIVERY</span>
          </div>
        </div>
      </aside>

      <ol className="career-story-stages">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            id={`career-stage-${stage.id}`}
            data-active={index === activeIndex}
            data-career-index={index}
            ref={(node) => { stageRefs.current[index] = node; }}
            onFocusCapture={() => select(index)}
          >
            <article>
              <header>
                <span>{stage.number}</span>
                <div className="career-stage-header-logo">
                  <CompanyLogo id={stage.logoId} size={22} />
                </div>
                <span>{stage.phase}</span>
                <strong>{stage.duration}</strong>
              </header>

              <div className="career-stage-copy">
                {stage.organizationUrl ? (
                  <p>
                    <a
                      href={stage.organizationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="career-org-link"
                    >
                      <CompanyLogo id={stage.logoId} size={17} />
                      <span>{stage.organization}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </p>
                ) : (
                  <p>{stage.organization}</p>
                )}
                <h3>{stage.role}</h3>
                <p>{stage.location}</p>
                <span>{stage.summary}</span>
              </div>

              <ul aria-label={`${stage.role} focus areas`}>
                {stage.highlights.map((highlight, highlightIndex) => (
                  <li
                    key={highlight}
                    style={{ "--highlight-index": highlightIndex } as CSSProperties}
                  >
                    {highlight}
                  </li>
                ))}
              </ul>

            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
