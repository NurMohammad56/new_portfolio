import { MotionProvider } from "@/components/interactive/reveal";
import { Navigation } from "@/components/interactive/navigation";
import { ClientProof } from "@/components/sections/client-proof";
import { Contact, Footer } from "@/components/sections/contact";
import { Deployment } from "@/components/sections/deployment";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { navigation, siteIdentity, techGroups } from "@/data/portfolio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteIdentity.name,
  url: "https://nurmohammad.dev",
  jobTitle: siteIdentity.role,
  description: siteIdentity.heroDescription,
  knowsAbout: techGroups.flatMap((group) =>
    group.technologies.map((technology) => technology.name),
  ),
};

export default function Home() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navigation items={navigation} />
      <main id="main-content">
        <Hero />
        <ClientProof />
        <Projects />
        <Stack />
        <Services />
        <Deployment />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </MotionProvider>
  );
}
