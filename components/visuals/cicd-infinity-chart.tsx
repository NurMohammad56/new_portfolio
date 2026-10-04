"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cicdStages } from "@/data/portfolio";

const stageNodes = [
  { id: "plan", x: 255, y: 95, labelX: 255, labelY: 60, label: "PLAN" },
  { id: "code", x: 120, y: 220, labelX: 56, labelY: 225, label: "CODE" },
  { id: "build", x: 255, y: 345, labelX: 255, labelY: 390, label: "BUILD" },
  { id: "test", x: 375, y: 275, labelX: 375, labelY: 318, label: "TEST" },
  { id: "release", x: 705, y: 95, labelX: 705, labelY: 60, label: "RELEASE" },
  { id: "deploy", x: 840, y: 220, labelX: 906, labelY: 225, label: "DEPLOY" },
  { id: "operate", x: 705, y: 345, labelX: 705, labelY: 390, label: "OPERATE" },
  { id: "monitor", x: 585, y: 275, labelX: 585, labelY: 318, label: "MONITOR" },
] as const;

export function CicdInfinityChart() {
  const [activeStageId, setActiveStageId] = useState<string>("plan");

  const currentStage =
    cicdStages.find((s) => s.id === activeStageId) || cicdStages[0];

  return (
    <div className="cicd-infinity-container">
      {/* Top Controller & Badges */}
      <div className="cicd-chart-header">
        <div className="cicd-title-group">
          <div className="cicd-live-pill">
            <span className="live-dot" />
            <span>CONTINUOUS INTEGRATION & CONTINUOUS DEPLOYMENT</span>
          </div>
          <p className="cicd-subtitle">
            Select a stage to explore the workflow for backend services and websites.
          </p>
        </div>

        <div className="cicd-legend">
          <span className="legend-item ci">
            <span className="legend-indicator ci" />
            <span>CI Loop (Build & Test)</span>
          </span>
          <span className="legend-item cd">
            <span className="legend-indicator cd" />
            <span>CD Loop (Deploy & Operate)</span>
          </span>
        </div>
      </div>

      {/* Infinity Vector Diagram */}
      <div className="cicd-svg-wrapper">
        <svg
          viewBox="-24 -8 1008 456"
          className="cicd-svg-canvas"
          role="group"
          aria-label="DevOps Infinity Loop illustrating CI and CD pipeline stages"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="ciGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--signal-light)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--signal-deep)" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="cdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--signal)" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="crossingRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--signal-deep)" />
              <stop offset="50%" stopColor="var(--signal)" />
              <stop offset="100%" stopColor="var(--signal-light)" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Pattern */}
          <g className="svg-grid-lines" opacity="0.12">
            {Array.from({ length: 19 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50 + 30}
                y1="20"
                x2={i * 50 + 30}
                y2="420"
                stroke="var(--line-strong)"
                strokeDasharray="2 4"
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="30"
                y1={i * 50 + 40}
                x2="930"
                y2={i * 50 + 40}
                stroke="var(--line-strong)"
                strokeDasharray="2 4"
              />
            ))}
          </g>

          {/* Infinity Track Background */}
          {/* Left loop: (260, 220) radius ~ 150. Right loop: (700, 220) radius ~ 150. Crossing at (480, 220) */}
          <path
            d="M 480 220 C 370 70, 120 70, 120 220 C 120 370, 370 370, 480 220 C 590 70, 840 70, 840 220 C 840 370, 590 370, 480 220 Z"
            fill="none"
            stroke="rgba(var(--text-rgb), 0.08)"
            strokeWidth="36"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Animated Inner Track Glow */}
          <path
            d="M 480 220 C 370 70, 120 70, 120 220 C 120 370, 370 370, 480 220 C 590 70, 840 70, 840 220 C 840 370, 590 370, 480 220 Z"
            fill="none"
            stroke="url(#crossingRibbon)"
            strokeWidth="3"
            strokeDasharray="14 12"
            className="animated-infinity-path"
          />

          {/* Central Loop Labels */}
          <g className="loop-center-labels">
            {/* Left CI Center */}
            <circle cx="255" cy="220" r="44" fill="var(--ink-elevated)" stroke="rgba(var(--signal-light-rgb), 0.3)" strokeWidth="1.5" />
            <text x="255" y="215" textAnchor="middle" className="svg-loop-text-bold" fill="var(--signal-light)">
              CI
            </text>
            <text x="255" y="233" textAnchor="middle" className="svg-loop-text-sub" fill="var(--muted)">
              INTEGRATION
            </text>

            {/* Right CD Center */}
            <circle cx="705" cy="220" r="44" fill="var(--ink-elevated)" stroke="rgba(var(--signal-rgb), 0.3)" strokeWidth="1.5" />
            <text x="705" y="215" textAnchor="middle" className="svg-loop-text-bold" fill="var(--signal)">
              CD
            </text>
            <text x="705" y="233" textAnchor="middle" className="svg-loop-text-sub" fill="var(--muted)">
              DEPLOYMENT
            </text>

            {/* Center Crossing Quality Gate */}
            <rect
              x="425"
              y="195"
              width="110"
              height="50"
              rx="6"
              fill="var(--ink-elevated)"
              stroke="var(--signal)"
              strokeWidth="1.2"
              filter="url(#glowEffect)"
            />
            <text x="480" y="215" textAnchor="middle" fill="var(--signal)" className="svg-gate-title">
              GITHUB ACTIONS
            </text>
            <text x="480" y="231" textAnchor="middle" fill="var(--muted)" className="svg-gate-sub">
              QUALITY GATE
            </text>
          </g>

          {/* Fixed hit areas include each node and its label, without hover scaling. */}
          {stageNodes.map((node, index) => {
            const stage = cicdStages[index];
            const selected = activeStageId === node.id;
            const labelWidth = node.label.length * 8 + 16;
            const left = Math.min(node.x - 35, node.labelX - labelWidth / 2);
            const top = Math.min(node.y - 35, node.labelY - 18);
            const right = Math.max(node.x + 35, node.labelX + labelWidth / 2);
            const bottom = Math.max(node.y + 35, node.labelY + 9);
            return (
              <g
                key={node.id}
                className={`svg-node-group${selected ? " is-active" : ""}`}
                data-stage={node.id}
                role="button"
                tabIndex={0}
                aria-label={`Stage ${stage.stepNumber}: ${stage.name}`}
                aria-pressed={selected}
                aria-controls="pipeline-stage-title"
                onClick={() => setActiveStageId(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveStageId(node.id);
                  }
                }}
              >
                <rect className="node-hit-area" x={left} y={top} width={right - left} height={bottom - top} />
                <circle cx={node.x} cy={node.y} r="24" className={`node-base ${stage.phase === "CI" ? "ci" : "cd"}`} />
                <text x={node.x} y={node.y + 4} textAnchor="middle" className="node-num">{stage.stepNumber}</text>
                <text x={node.labelX} y={node.labelY} textAnchor="middle" className="node-label">{node.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage Selector Pills */}
      <div className="stage-selector-bar">
        {cicdStages.map((stage) => {
          const isSelected = stage.id === activeStageId;
          const isCI = stage.phase === "CI";
          return (
            <button
              key={stage.id}
              type="button"
              className={`stage-pill-btn ${isCI ? "ci-stage" : "cd-stage"} ${isSelected ? "is-active" : ""}`}
              onClick={() => setActiveStageId(stage.id)}
              aria-pressed={isSelected}
            >
              <span className="stage-badge">{stage.stepNumber}</span>
              <span className="stage-name">{stage.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail & Command Inspector */}
      <div className="cicd-inspector-card" role="region" aria-live="polite" aria-labelledby="pipeline-stage-title">
        <div className="inspector-head">
          <div className="inspector-meta">
            <span className={`phase-tag ${currentStage.phase === "CI" ? "ci" : "cd"}`}>
              {currentStage.phase} PHASE • STAGE {currentStage.stepNumber}
            </span>
            <h3 className="inspector-title" id="pipeline-stage-title">{currentStage.name}</h3>
            <p className="inspector-subtitle">{currentStage.subtitle}</p>
          </div>
          {currentStage.highlight && (
            <div className="inspector-highlight">
              <CheckCircle2 size={16} />
              <span>{currentStage.highlight}</span>
            </div>
          )}
        </div>

        <p className="inspector-desc">{currentStage.description}</p>

        <div className="inspector-footer">
          <div className="inspector-tools">
            <span className="tools-label">TOOLS & STACK:</span>
            <div className="tools-pills">
              {currentStage.tools.map((tool) => (
                <span key={tool} className="tool-pill">
                  {tool}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
