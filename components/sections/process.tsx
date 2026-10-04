import { processSteps } from "@/data/portfolio";
import { Reveal } from "@/components/interactive/reveal";
import { Icon } from "@/components/ui/icon";

export function Process() {
  return (
    <section className="section section-process" aria-labelledby="process-title">
      <div className="site-shell">
        <Reveal className="process-heading">
          <div className="section-kicker"><span>10</span><span>How I work</span></div>
          <h2 id="process-title">A clear route from brief to launch.</h2>
          <p>Each stage has an output. Motion follows the same forward trace as the work.</p>
        </Reveal>

        <div className="process-track">
          <div className="process-line" aria-hidden="true"><i /></div>
          {processSteps.map((step, index) => (
            <Reveal
              className="process-step"
              delay={Math.min(index * 0.06, 0.3)}
              distance={20}
              key={step.number}
            >
              <div className="process-node">
                <span>{step.number}</span>
                <Icon name={step.icon} aria-hidden="true" size={21} strokeWidth={1.5} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
