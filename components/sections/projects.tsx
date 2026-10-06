import { ProjectGallery } from "@/components/interactive/project-gallery";
import { Reveal } from "@/components/interactive/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Projects() {
  return (
    <section
      className="section section-projects motion-project-section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            id="projects-title"
            index="03"
            eyebrow="Selected work"
            title="The work, in focus."
            description="Eight products. The backend work behind commerce, learning, local discovery, and everyday mobile experiences."
          />
        </Reveal>

      </div>
      <ProjectGallery />
    </section>
  );
}
