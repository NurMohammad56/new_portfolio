"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Apple,
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import projectData from "@/data/projects.json";
import {
  ProjectVisual,
  type ProjectVisualVariant,
} from "@/components/visuals/project-visual";

type ProjectRecord = Omit<(typeof projectData)[number], "visualType"> & {
  visualType: ProjectVisualVariant;
  playStoreUrl?: string | null;
  iosUrl?: string | null;
};

type StaggerStyle = CSSProperties & {
  "--item-index": number;
};

function GooglePlayIcon({
  size = 15,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-.714V2.528c.178-.28.388-.522.61-.714zm11.242 11.245l2.093 2.093-11.45 6.544 9.357-8.637zm0-2.118L5.494 2.304l11.45 6.544-2.093 2.093zm1.488 1.059l3.414 1.951c.905.517.905 1.365 0 1.882l-3.414 1.951-2.222-2.222 2.222-1.562z" />
    </svg>
  );
}

const featuredProjectIds = new Set([
  "prophetic-pathway",
  "evpitch-recruitment-app",
  "inspectors-path",
  "docmobi-healthcare",
  "pjswag-portal",
]);

const projects = (projectData as readonly ProjectRecord[]).filter((project) =>
  featuredProjectIds.has(project.id),
);
const projectObserverOptions = {
  rootMargin: "-36% 0px -52% 0px",
  threshold: 0,
} satisfies IntersectionObserverInit;

function ProjectPreview({ project }: { project: ProjectRecord }) {
  return (
    <div className="project-preview">
      <div className="project-preview-art" aria-hidden="true">
        <ProjectVisual label={project.name} variant={project.visualType} />
      </div>

      <div className="project-preview-intel">
        <div className="project-preview-identity">
          <div>
            <span>PRODUCT AT A GLANCE</span>
            <h3>{project.name}</h3>
          </div>
          <p>{project.preview.tagline}</p>
        </div>

        <div className="project-preview-audience">
          <span>BUILT FOR</span>
          <p>{project.preview.audience.join(" / ")}</p>
        </div>

        <ol
          className="project-preview-workflow"
          aria-label={`${project.name} core workflow`}
        >
          {project.preview.workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ProjectStory({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const projectRefs = useRef<Array<HTMLElement | null>>([]);
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects;

  const visibleIndex = filteredProjects[activeIndex] ? activeIndex : 0;
  const activeProject = filteredProjects[visibleIndex] ?? filteredProjects[0];
  const progress =
    filteredProjects.length > 0
      ? (visibleIndex + 1) / filteredProjects.length
      : 0;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      const index = Number(
        (visibleEntry.target as HTMLElement).dataset.projectIndex,
      );
      if (Number.isInteger(index)) setActiveIndex(index);
    }, projectObserverOptions);

    projectRefs.current.forEach((project) => {
      if (project) observer.observe(project);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion, selectedCategory, filteredProjects]);

  return (
    <div className="project-story">
      <aside
        className="project-story-stage"
        aria-label="Project preview navigator"
      >
        <div className="project-story-frame" aria-hidden="true">
          <div className="project-story-frame-head">
            <span>WORK / {activeProject.number}</span>
            <span>
              {activeProject.category} / {activeProject.status}
            </span>
          </div>

          <div className="project-story-panels">
            {filteredProjects.map((project, index) => (
              <div
                className="project-story-panel"
                data-active={visibleIndex === index}
                key={project.id}
              >
                <ProjectPreview project={project} />
              </div>
            ))}
          </div>

          <div className="project-story-frame-foot">
            <span>MY ROLE / {activeProject.role}</span>
            <span>{activeProject.technologies.slice(0, 2).join(" + ")}</span>
          </div>
        </div>

        <div className="project-story-navigation">
          <div className="project-story-progress" aria-hidden="true">
            <span>{String(visibleIndex + 1).padStart(2, "0")}</span>
            <i>
              <b style={{ transform: `scaleY(${progress})` }} />
            </i>
            <span>{String(filteredProjects.length).padStart(2, "0")}</span>
          </div>

          <nav aria-label="Jump to a selected project">
            {filteredProjects.map((project, index) => (
              <a
                aria-current={visibleIndex === index ? "step" : undefined}
                aria-label={`View project ${index + 1}: ${project.name}`}
                href={`#project-${project.id}`}
                key={project.id}
                onClick={() => setActiveIndex(index)}
              >
                <span>{project.number}</span>
                <i />
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="project-story-steps">
        {filteredProjects.map((project, index) => {
          const liveUrl = project.liveUrl;
          const playUrl =
            project.playStoreUrl ||
            (liveUrl?.includes("play.google.com") ? liveUrl : null);
          const iosUrl =
            project.iosUrl ||
            (liveUrl?.includes("apps.apple.com") ? liveUrl : null);
          const isWebLive =
            Boolean(liveUrl) &&
            !liveUrl.includes("play.google.com") &&
            !liveUrl.includes("apps.apple.com");

          return (
            <article
              className="project-story-step"
              data-active={visibleIndex === index}
              data-project-index={index}
              id={`project-${project.id}`}
              key={project.id}
              onFocusCapture={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              ref={(node) => {
                projectRefs.current[index] = node;
              }}
            >
              <div className="project-story-mobile-media" aria-hidden="true">
                <div className="project-story-mobile-head">
                  <span>LIVE PRODUCT / {project.number}</span>
                  <span>{project.category}</span>
                </div>
                <div className="project-story-mobile-preview">
                  <ProjectPreview project={project} />
                </div>
              </div>

              <div className="project-story-step-top">
                <div className="project-story-step-head">
                  <span>{project.number}</span>
                  <span>{project.category}</span>
                </div>

                <p className="project-story-status">
                  <i aria-hidden="true" />
                  {project.status} product
                </p>

                <h3>{project.name}</h3>
                <p className="project-story-description">{project.preview.tagline}</p>

                <dl className="project-story-meta">
                  <div>
                    <dt>ROLE</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>PLATFORM</dt>
                    <dd>{project.platform}</dd>
                  </div>
                </dl>
              </div>

              <div className="project-story-step-body">
                <div className="project-story-detail project-story-contribution">
                  <span>MY CONTRIBUTION</span>
                  <ul className="project-story-features">
                    {project.preview.contributions.slice(0, 2).map(
                      (contribution, contributionIndex) => (
                        <li key={contribution}>
                          <span>
                            {String(contributionIndex + 1).padStart(2, "0")}
                          </span>
                          {contribution}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="project-story-detail">
                  <span>BUILT WITH</span>
                  <ul
                    className="project-story-tech"
                    aria-label={`${project.name} technology stack`}
                  >
                    {project.technologies.slice(0, 6).map((technology, technologyIndex) => (
                      <li
                        key={technology}
                        style={{ "--item-index": technologyIndex } as StaggerStyle}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="project-story-step-bottom">
                <div className="project-story-outcome">
                  <CheckCircle2 aria-hidden="true" size={16} />
                  <div>
                    <span>OUTCOME / PROOF</span>
                    <strong>{project.preview.outcome}</strong>
                  </div>
                </div>

                <div className="project-story-actions">
                  {/* Primary web live link if project is web-based */}
                  {isWebLive && (
                    <a
                      aria-label={`Visit ${project.name} live project (opens in a new tab)`}
                      className="project-story-live-link"
                      href={liveUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Visit live project</span>
                      <ArrowUpRight aria-hidden="true" size={20} />
                    </a>
                  )}

                  {/* App Store and/or Google Play Store links for mobile-first projects */}
                  {!isWebLive && (
                    <>
                      {playUrl && iosUrl ? (
                        <div className="project-story-store-group project-story-store-group--primary">
                          <a
                            aria-label={`Download ${project.name} on the App Store (opens in a new tab)`}
                            className="project-story-store-link project-story-store-link--apple"
                            href={iosUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Apple aria-hidden="true" size={16} />
                            <span>App Store</span>
                            <ArrowUpRight aria-hidden="true" size={15} />
                          </a>
                          <a
                            aria-label={`View ${project.name} on Google Play (opens in a new tab)`}
                            className="project-story-store-link project-story-store-link--play"
                            href={playUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <GooglePlayIcon size={15} />
                            <span>Google Play</span>
                            <ArrowUpRight aria-hidden="true" size={15} />
                          </a>
                        </div>
                      ) : playUrl ? (
                        <a
                          aria-label={`View ${project.name} on Google Play (opens in a new tab)`}
                          className="project-story-live-link"
                          href={playUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="project-story-btn-content">
                            <GooglePlayIcon size={18} />
                            <span>View on Google Play</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" size={20} />
                        </a>
                      ) : iosUrl ? (
                        <a
                          aria-label={`Download ${project.name} on the App Store (opens in a new tab)`}
                          className="project-story-live-link"
                          href={iosUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="project-story-btn-content">
                            <Apple aria-hidden="true" size={18} />
                            <span>Available on App Store</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" size={20} />
                        </a>
                      ) : null}
                    </>
                  )}

                  {/* Secondary store group when web live project is already primary */}
                  {isWebLive && (iosUrl || playUrl) && (
                    <div className="project-story-store-group">
                      {iosUrl && (
                        <a
                          aria-label={`Download ${project.name} on the App Store (opens in a new tab)`}
                          className="project-story-store-link project-story-store-link--apple"
                          href={iosUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Apple aria-hidden="true" size={16} />
                          <span>App Store</span>
                          <ArrowUpRight aria-hidden="true" size={15} />
                        </a>
                      )}

                      {playUrl && (
                        <a
                          aria-label={`View ${project.name} on Google Play (opens in a new tab)`}
                          className="project-story-store-link project-story-store-link--play"
                          href={playUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <GooglePlayIcon size={15} />
                          <span>Google Play</span>
                          <ArrowUpRight aria-hidden="true" size={15} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Repository Source / Private status */}
                  {project.githubUrl ? (
                    <a
                      aria-label={`View ${project.name} source code (opens in a new tab)`}
                      className="project-story-source-link"
                      href={project.githubUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View source
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : (
                    <span className="project-story-private">
                      <LockKeyhole aria-hidden="true" size={14} />
                      Private repository
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
