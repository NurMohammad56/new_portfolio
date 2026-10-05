"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { siteIdentity, socialLinks } from "@/data/portfolio";
import { Reveal } from "@/components/interactive/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./contact.module.css";

const email = "nurmohammad0605@gmail.com";

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visible = useInView(sectionRef, { margin: "100px" });
  const [copyStatus, setCopyStatus] = useState("");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus("Email copied.");
    } catch {
      setCopyStatus("Could not copy. Please select the email address.");
    }
  };

  return (
    <section ref={sectionRef} className={`section ${styles.section}`} id="contact" aria-labelledby="contact-title">
      <div className={styles.atmosphere} aria-hidden="true" data-active={visible}>
        <svg viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice" className={styles.contours}>
          {Array.from({ length: 16 }, (_, index) => (
            <path key={index} d={`M ${650 + index * 24} -60 C ${350 + index * 27} 175, ${1150 + index * 25} 295, ${700 + index * 29} 540 S ${660 + index * 34} 760, ${980 + index * 27} 870`} />
          ))}
          <path className={styles.tracer} d="M 938 -60 C 674 175, 1450 295, 1048 540 S 1068 760, 1304 870" />
          <circle cx="900" cy="193" r="2" /><circle cx="1070" cy="475" r="2" /><circle cx="700" cy="670" r="2" />
        </svg>
      </div>
      <div className="site-shell">
        <Reveal>
          <SectionHeading index="07" eyebrow="Get in touch" id="contact-title"
            title="Let's talk about your next project."
            description="Have a product to build or a backend to improve? Tell me what you need." />
        </Reveal>
        <Reveal className={styles.layout} distance={16}>
          <div className={styles.intro}>
            <span className={styles.availability}><i aria-hidden="true" />Available for backend & API work</span>
            <p>APIs, data systems, real-time features, and production setup for mobile and web products.</p>
            <small>Based in Bangladesh · UTC +06:00</small>
          </div>
          <div className={styles.channels}>
            <div className={styles.emailRow}>
              <div>
                <span className={styles.label}>EMAIL</span>
                <a className={styles.email} href={`mailto:${email}`}>{email}<ArrowUpRight size={22} aria-hidden="true" /></a>
              </div>
              <button className={styles.copy} type="button" onClick={copyEmail} aria-label="Copy email address">
                {copyStatus === "Email copied." ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <p className={styles.status} role="status">{copyStatus}</p>
            <a className={styles.whatsapp} href="https://wa.me/8801889376903" target="_blank" rel="noreferrer">
              <span><small>WHATSAPP</small>+880 1889 376903</span>
              <span>Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></span>
            </a>
            <div className={styles.socials}>
              {socialLinks.filter(channel => channel.label !== "Email" && channel.href).map(channel => (
                <a key={channel.label} href={channel.href!} target="_blank" rel="noreferrer">{channel.label}<ArrowUpRight size={15} aria-hidden="true" /></a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div className="footer-brand">
          <span>
            <strong>{siteIdentity.name}</strong>
            <small>{siteIdentity.role}</small>
          </span>
        </div>
        <p>© {new Date().getFullYear()} {siteIdentity.initials}. Built for the route to production.</p>
        <div className="footer-links">
          {socialLinks.map((channel) =>
            channel.href ? (
              <a href={channel.href} target="_blank" rel="noreferrer" key={channel.label}>
                {channel.label}
              </a>
            ) : (
              <span key={channel.label}>{channel.label}</span>
            ),
          )}
          <a href="#home">Top <ArrowUpRight aria-hidden="true" size={15} /></a>
        </div>
      </div>
    </footer>
  );
}
