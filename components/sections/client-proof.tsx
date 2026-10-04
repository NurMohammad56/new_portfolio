import { CareerStory } from "@/components/interactive/career-story";
import { Reveal } from "@/components/interactive/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { careerStages } from "@/data/career";
import styles from "./client-proof.module.css";

export function ClientProof() {
  return (
    <section
      className={`section section-client career-section ${styles.section}`}
      id="experience"
      aria-labelledby="career-title"
    >
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            index="02"
            id="career-title"
            eyebrow="Career progression"
            title="Experience behind the systems."
            description="Backend development at Scaleup IT Limited, following web platform work at Arabian Services Company."
          />
        </Reveal>

        <CareerStory stages={careerStages} />
      </div>
    </section>
  );
}
