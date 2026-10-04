import { ArrowDownRight, LayoutDashboard, Server, Smartphone, PanelsTopLeft } from "lucide-react";
import { Reveal } from "@/components/interactive/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { careerDeliveryRecord } from "@/data/career";

const recordIcons = [PanelsTopLeft, LayoutDashboard, Smartphone, Server] as const;

export function Experience() {
  return (
    <section
      className="section section-experience delivery-record-section"
      aria-labelledby="delivery-record-title"
    >
      <div className="site-shell">
        <Reveal>
          <SectionHeading
            id="delivery-record-title"
            index="03"
            eyebrow="Delivery record"
            title="Work measured by what shipped."
            description="A category-by-category view of completed delivery across web applications, admin dashboards, mobile apps, and backend work."
          />
        </Reveal>

        <div className="delivery-record-grid">
          {careerDeliveryRecord.map((item, index) => {
            const RecordIcon = recordIcons[index];
            return (
              <Reveal className="delivery-record-card" key={item.label}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <RecordIcon aria-hidden="true" size={20} strokeWidth={1.45} />
                </div>
                <strong>{item.value}</strong>
                <h3>{item.label}</h3>
                <p>Completed project deliverables</p>
                <ArrowDownRight aria-hidden="true" size={18} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
