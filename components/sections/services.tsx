import { Reveal } from "@/components/interactive/reveal";
import { ServiceDetails } from "@/components/interactive/service-details";
import { SectionHeading } from "@/components/ui/section-heading";

export function Services() {
  return (
    <section className="section section-services" id="services" aria-labelledby="services-title">
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            id="services-title"
            index="05"
            eyebrow="What I deliver"
            title="What I can own."
            description="One product layer or the full route to production."
          />
        </Reveal>

        <ServiceDetails />
      </div>
    </section>
  );
}
