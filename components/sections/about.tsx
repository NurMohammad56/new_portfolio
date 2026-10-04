import { ArrowDownRight } from "lucide-react";
import { capabilitySummary } from "@/data/portfolio";
import { Reveal } from "@/components/interactive/reveal";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section className="section section-about" id="about" aria-labelledby="about-title">
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            index="02"
            id="about-title"
            eyebrow="Operating model"
            title={capabilitySummary.headline}
            description="The interface is only one layer. I connect product thinking, application engineering, backend infrastructure, and the work required to ship."
          />
        </Reveal>

        <div className="about-editorial-grid">
          <Reveal className="about-statement" delay={0.08}>
            <p>
              I work across the <em>whole product surface</em>—so an idea does not get
              lost between design, code, infrastructure, and launch.
            </p>
            <div className="about-signature">
              <span>NUR MOHAMMAD</span>
              <span>BACKEND SYSTEMS · MOBILE APPS</span>
            </div>
          </Reveal>

          <Reveal className="experience-block" delay={0.16}>
            <div className="experience-number">
              <strong>{capabilitySummary.experienceValue}</strong>
              <span>{capabilitySummary.experienceLabel}</span>
            </div>
            <p>{capabilitySummary.introduction}</p>
            <div className="scope-line">
              {capabilitySummary.deliveryScope.map((scope, index) => (
                <span key={scope}>
                  <i>{String(index + 1).padStart(2, "0")}</i>{scope}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="capability-surface" amount={0.12}>
          <div className="capability-surface-head">
            <span>PRODUCT CAPABILITY MAP</span>
            <span>{capabilitySummary.capabilities.length} CONNECTED DISCIPLINES</span>
          </div>
          <ul>
            {capabilitySummary.capabilities.map((capability, index) => (
              <li key={capability.label}>
                <span className="capability-number">{String(index + 1).padStart(2, "0")}</span>
                <Icon name={capability.icon} aria-hidden="true" size={18} strokeWidth={1.5} />
                <span>{capability.label}</span>
                <ArrowDownRight aria-hidden="true" size={16} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
