import { deploymentLanes } from "@/data/portfolio";
import { Reveal } from "@/components/interactive/reveal";
import { CicdInfinityChart } from "@/components/visuals/cicd-infinity-chart";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./deployment.module.css";

export function Deployment() {
  return (
    <section id="deployment" className={`section section-deployment ${styles.section}`} aria-labelledby="deployment-title">
      <div className="site-shell">
        <Reveal>
          <SectionHeading index="06" eyebrow="DevOps & Deployment" id="deployment-title"
            title="From code to production."
            description="Backend services, frontend applications, and websites. Configured, deployed, and maintained with practical infrastructure." />
        </Reveal>
        <Reveal amount={0.1} distance={20}>
          <CicdInfinityChart />
        </Reveal>
        <div className={styles.destinations}>
          <h3>Where the work runs</h3>
          <div className={styles.lanes}>
            {deploymentLanes.map((lane, index) => (
              <Reveal className={styles.lane} delay={index * 0.04} distance={14} key={lane.id}>
                <Icon name={lane.icon} size={22} aria-hidden="true" />
                <div><h4>{lane.label}</h4><p>{lane.destinations.join(" / ")}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
