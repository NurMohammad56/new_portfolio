"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { services } from "@/data/portfolio";
import { serviceDetails } from "@/data/service-details";
import { Icon } from "@/components/ui/icon";
import styles from "./service-details.module.css";

export function ServiceDetails() {
  const [opened, setOpened] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const service = services[opened ?? 0];
  const detail = serviceDetails[service.number];

  useEffect(() => {
    if (opened === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    sheetRef.current?.scrollTo({ top: 0 });
    closeButtonRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [opened]);

  const close = () => {
    dialogRef.current?.close();
    setOpened(null);
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <div className={styles.list}>
        {services.map((item, index) => (
          <button className={styles.row} key={item.number} type="button"
            aria-haspopup="dialog" aria-controls="service-details-dialog"
            aria-expanded={opened === index} aria-label={`Explore ${item.title}`}
            onClick={event => { triggerRef.current = event.currentTarget; setOpened(index); }}>
            <span className={styles.number}>{item.number}</span>
            <span className={styles.icon}><Icon name={item.icon} size={22} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.description}>{item.description}</span>
            <ArrowUpRight className={styles.arrow} size={22} aria-hidden="true" />
          </button>
        ))}
      </div>

      <dialog id="service-details-dialog" ref={dialogRef} className={styles.dialog}
        aria-labelledby="service-detail-title" aria-describedby="service-detail-overview"
        onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <div className={styles.sheet}>
          <div className={styles.topbar}>
            <span>SERVICE / {service.number}</span>
            <button ref={closeButtonRef} className={styles.close} type="button" onClick={close} aria-label="Close service details"><X size={20} /></button>
          </div>
          <div className={styles.body} ref={sheetRef}>
            <div className={styles.heading} key={service.number}>
              <span className={styles.serviceIcon}><Icon name={service.icon} size={24} aria-hidden="true" /></span>
              <h3 id="service-detail-title">{service.title}</h3>
              <p id="service-detail-overview">{detail.overview}</p>
            </div>
            <div className={styles.details}>
              <div>
                <h4>What I can deliver</h4>
                <ul>{detail.deliverables.map(deliverable => <li key={deliverable}><Check size={16} aria-hidden="true" /><span>{deliverable}</span></li>)}</ul>
              </div>
              <div className={styles.start}>
                <h4>How we start</h4>
                <p>{detail.startingPoint}</p>
                <h4>Tools & approach</h4>
                <div className={styles.tools}>{detail.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
              </div>
            </div>
            <div className={styles.footer}>
              <a className={styles.cta} href={`mailto:nurmohammad0605@gmail.com?subject=${encodeURIComponent(`Project inquiry: ${service.title}`)}`}>
                Discuss this service <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <button className={styles.next} type="button" onClick={() => setOpened(index => ((index ?? 0) + 1) % services.length)}>
                Next service <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
