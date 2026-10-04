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
            description="Mobile backends, web platforms, and connected systems. Demo previews for now; real work coming soon."
          />
        </Reveal>

      </div>
      <ProjectGallery />
    </section>
  );
}
