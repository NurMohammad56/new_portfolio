import { Reveal } from "@/components/interactive/reveal";
import { StackShowcase } from "@/components/interactive/stack-showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { stackFocusGroups } from "@/data/stack-focus";

export function Stack() {
  return (
    <section className="section section-stack" id="skills" aria-labelledby="stack-title">
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            index="04"
            id="stack-title"
            eyebrow="Technical toolkit"
            title="The stack behind the work."
            description="Backend tools first, with AI-assisted interfaces and practical production infrastructure."
          />
        </Reveal>

        <StackShowcase groups={stackFocusGroups} />
      </div>
    </section>
  );
}
