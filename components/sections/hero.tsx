import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import { socialLinks, siteIdentity } from "@/data/portfolio";
import { HeroFlow } from "@/components/interactive/hero-flow";
import { HeroMeshFallback } from "@/components/visuals/hero-mesh-fallback";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-title">
      <div className={styles.frame} data-hero-frame>
        <HeroFlow fallback={<HeroMeshFallback />} />
        <div className={styles.topbar} data-hero-chrome>
          <span className={styles.edition}>NUR MOHAMMAD / PORTFOLIO</span>
          <a href="#contact" className={styles.contactLink} data-magnetic="0.25">Let&apos;s talk <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
        <aside className={styles.rail} aria-label="Social profiles" data-hero-chrome>
          <span className={styles.railLabel}>BACKEND-FIRST | BUILT TO LAST</span>
          <span className={styles.railLine} aria-hidden="true" />
          <div className={styles.socials}>
            {socialLinks.filter(link => link.href).map(link => (
              <a key={link.label} href={link.href!} aria-label={link.label} target={link.label === "Email" ? undefined : "_blank"} rel="noreferrer" data-magnetic="0.45">
                {link.label === "Email" ? <Mail size={15} aria-hidden="true" /> : <span aria-hidden="true">{link.monogram}</span>}
              </a>
            ))}
          </div>
        </aside>
        <div className={styles.copy} data-hero-copy data-depth="-14">
          <p className={styles.intro} data-hero-rise>I&apos;M <span>{siteIdentity.name.toUpperCase()}</span></p>
          <h1 className={styles.title} id="hero-title" data-hero-title>Backend<span>Developer.</span></h1>
          <p className={styles.support} data-hero-rise>AI-assisted frontend.</p>
          <p className={styles.description} data-hero-rise>Reliable APIs, real-time systems, and the backend behind mobile &amp; web products.</p>
          <div className={styles.actions} data-hero-rise>
            <a href="#projects" className={styles.workLink} data-magnetic="0.3">Explore work <ArrowUpRight size={15} aria-hidden="true" /></a>
            <span className={styles.availability}><i aria-hidden="true" />Available for selected projects</span>
          </div>
        </div>
        <figure className={styles.portrait} data-hero-portrait>
          <span className={styles.portraitHalo} aria-hidden="true" data-hero-halo data-depth="12" />
          <div className={styles.portraitImage} data-hero-portrait-image data-depth="26">
            <Image src="/nur-hero-cutout.png" alt="Nur Mohammad" fill sizes="(max-width: 950px) 260px, (max-width: 1120px) 38vw, 480px" loading="eager" />
          </div>
          <figcaption data-hero-caption><span>THE PERSON BEHIND THE APIs</span><i aria-hidden="true" /> DHAKA, BD</figcaption>
        </figure>
        <div className={styles.bottom} data-hero-chrome>
          <div className={styles.details}><span>Dhaka, Bangladesh</span><span>2+ years of experience</span></div>
          <a href="#experience" className={styles.scrollLink}>SCROLL TO DISCOVER <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
