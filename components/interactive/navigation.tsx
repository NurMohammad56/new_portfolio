"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, FileText, Menu, X } from "lucide-react";
import { m, useScroll, useSpring } from "motion/react";
import { NmLettermark } from "@/components/ui/nm-lettermark";

export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

type NavigationProps = {
  items: readonly NavigationItem[];
};

export function Navigation({ items }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLink.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const desktopItems = items.filter((item) => item.href !== "#home");

  return (
    <header className={`site-navigation text-navigation monogram-navigation${isScrolled ? " is-scrolled" : ""}`}>
      <m.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="nav-inner">
        <a className="nav-identity" href="#home" aria-label="Nur Mohammad, home">
          <NmLettermark className="nav-lettermark" />
          <span className="nav-role">BACKEND DEVELOPER / AI-ASSISTED FRONTEND</span>
        </a>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {desktopItems.map((item) => {
            const id = item.href.slice(1);
            return (
              <a
                className={activeSection === id ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={activeSection === id ? "location" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          className="nav-cta"
          href="/resume/NUR_MOHAMMAD_RESUME.pdf"
          download="NUR_MOHAMMAD_RESUME.pdf"
          aria-label="Download Nur Mohammad's resume as a PDF"
        >
          <FileText aria-hidden="true" size={15} strokeWidth={1.8} />
          <span>Download resume</span>
          <Download aria-hidden="true" size={15} strokeWidth={1.8} />
        </a>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          ref={menuButton}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <m.div
        id="mobile-navigation"
        className="mobile-navigation"
        aria-hidden={!isOpen}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
          closed: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav aria-label="Mobile navigation">
          {items.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={closeMenu}
              ref={index === 0 ? firstMenuLink : undefined}
              tabIndex={isOpen ? 0 : -1}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          <a
            className="mobile-resume-link"
            href="/resume/NUR_MOHAMMAD_RESUME.pdf"
            download="NUR_MOHAMMAD_RESUME.pdf"
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
          >
            <span>PDF</span>
            Download resume
            <Download aria-hidden="true" />
          </a>
        </nav>
        <div className="mobile-nav-footer">
          <span>Available for selected projects</span>
          <span>UTC +06:00</span>
        </div>
      </m.div>
    </header>
  );
}
