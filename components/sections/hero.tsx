import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { socialLinks, siteIdentity } from "@/data/portfolio";
import { HeroFlow } from "@/components/interactive/hero-flow";
import { HeroMeshFallback } from "@/components/visuals/hero-mesh-fallback";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-title">
      <div className={styles.frame}>
        <HeroFlow fallback={<HeroMeshFallback />} />
        <div className={styles.topbar}>
          <span className={styles.edition}>NUR MOHAMMAD / PORTFOLIO</span>
          <a href="#contact" className={styles.contactLink}>Let&apos;s talk <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
        <aside className={styles.rail} aria-label="Social profiles">
          <span className={styles.railLabel}>BACKEND-FIRST | BUILT TO LAST</span>
          <span className={styles.railLine} aria-hidden="true" />
          <div className={styles.socials}>
            {socialLinks.filter(link => link.href).map(link => (
              <a key={link.label} href={link.href!} aria-label={link.label} target={link.label === "Email" ? undefined : "_blank"} rel="noreferrer">
                {link.label === "Email" ? <Mail size={15} aria-hidden="true" /> : <span aria-hidden="true">{link.monogram}</span>}
              </a>
            ))}
          </div>
        </aside>
        <div className={styles.copy}>
          <p className={styles.intro}>I&apos;M <span>{siteIdentity.name.toUpperCase()}</span></p>
          <h1 className={styles.title} id="hero-title">Backend<span>Developer.</span></h1>
          <p className={styles.support}>AI-assisted frontend.</p>
          <p className={styles.description}>Reliable APIs, real-time systems, and the backend behind mobile &amp; web products.</p>
          <div className={styles.actions}>
            <a href="#projects" className={styles.workLink}>Explore work <ArrowUpRight size={15} aria-hidden="true" /></a>
            <span className={styles.availability}><i aria-hidden="true" />Available for selected projects</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.details}><span>Dhaka, Bangladesh</span><span>2+ years of experience</span></div>
          <a href="#experience" className={styles.scrollLink}>SCROLL TO DISCOVER <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
