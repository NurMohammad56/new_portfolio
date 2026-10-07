"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { CompanyLogo } from "@/components/ui/company-logo";
import { NmLettermark } from "@/components/ui/nm-lettermark";
import type { CareerStage } from "@/data/career";
import { diaryChapter, diaryLeafProgress, diaryOpenness, diaryPageTiming, diaryTimeline, smoothRange } from "./diary-timeline";
import styles from "./career-diary.module.css";

const BOOK_MEDIA = "(min-width: 900px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia(BOOK_MEDIA);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const getSnapshot = () => window.matchMedia(BOOK_MEDIA).matches;
const getServerSnapshot = () => false;

function CareerEntry({ stage, page }: { stage: CareerStage; page: number }) {
  return (
    <div className={styles.entry} data-diary-entry>
      <header className={styles.entryHeader}><span>CHAPTER {stage.number}</span><span>{stage.phase}</span></header>
      <div className={styles.company}>
        <span className={styles.companyMark} data-company={stage.logoId}><CompanyLogo id={stage.logoId} size={32} /></span>
        {stage.organizationUrl ? <a href={stage.organizationUrl} target="_blank" rel="noopener noreferrer">{stage.organization}<ArrowUpRight size={14} aria-hidden="true" /></a> : <span>{stage.organization}</span>}
      </div>
      <h3>{stage.role}</h3>
      <div className={styles.metadata}><span>{stage.duration}</span>{stage.location && <span>{stage.location}</span>}</div>
      <p className={styles.summary}>{stage.summary}</p>
      <div className={styles.focus}><h4>THE WORK, IN BRIEF</h4><ul>{stage.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></div>
      <footer className={styles.pageFooter}><span>NUR MOHAMMAD / CAREER NOTES</span><span>{String(page).padStart(2, "0")}</span></footer>
    </div>
  );
}

function AnimatedDiary({ stages }: { stages: readonly CareerStage[] }) {
  const track = useRef<HTMLDivElement>(null);
  const chapterRef = useRef(-1);
  const [chapter, setChapter] = useState(-1);
  const [phase, setPhase] = useState("cover");
  const phaseRef = useRef("cover");
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 88px", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.85, restDelta: 0.0001 });
  const opening = useTransform(progress, value => -180 * diaryOpenness(value));
  const shift = useTransform(progress, value => `${-25 * (1 - diaryOpenness(value))}%`);
  const bookTilt = useTransform(progress, value => 9 - 5 * diaryOpenness(value));
  const bookYaw = useTransform(progress, value => -10 + 7 * diaryOpenness(value));
  const bookRoll = useTransform(progress, value => -1.2 * (1 - diaryOpenness(value)));
  const bookLift = useTransform(progress, value => Math.sin(diaryOpenness(value) * Math.PI) * 24);
  // Counter the perspective enlargement while a face swings toward the viewer.
  // Reading holds stay full-size; the cover cannot collide with the navbar.
  const bookScale = useTransform(progress, value => {
    let depth = Math.sin(diaryOpenness(value) * Math.PI);
    for (let index = 0; index < stages.length - 1; index++) depth = Math.max(depth, Math.sin(diaryLeafProgress(value, index, stages.length) * Math.PI));
    return 1 - depth * 0.24;
  });
  const ribbonOpacity = useTransform(progress, value => 1 - smoothRange(diaryOpenness(value), 0.08, 0.6));
  const castShadow = useTransform(progress, value => Math.sin(diaryOpenness(value) * Math.PI) * 0.22);
  useMotionValueEvent(progress, "change", value => {
    const next = diaryChapter(value, stages.length);
    if (chapterRef.current !== next) {
      chapterRef.current = next;
      setChapter(next);
    }
    const nextPhase = value >= diaryTimeline.closeEnd ? "closed" : value >= diaryTimeline.closeStart ? "closing" : value >= diaryTimeline.openEnd ? "reading" : value > diaryTimeline.openStart ? "opening" : "cover";
    if (phaseRef.current !== nextPhase) { phaseRef.current = nextPhase; setPhase(nextPhase); }
  });
  const goTo = (index: number) => {
    const element = track.current;
    if (!element) return;
    const destination = index < 0 ? 0 : diaryPageTiming(index, stages.length).destination;
    const start = element.getBoundingClientRect().top + window.scrollY - 88;
    const distance = element.offsetHeight - window.innerHeight + 88;
    window.scrollTo({ top: start + distance * destination, behavior: "smooth" });
  };
  const closeDiary = () => {
    const element = track.current;
    if (!element) return;
    const start = element.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: start + (element.offsetHeight - window.innerHeight + 88) * 0.985, behavior: "smooth" });
  };
  const last = stages[stages.length - 1];
  return (
    <div ref={track} className={styles.track} style={{ height: `${360 + Math.max(0, stages.length - 2) * 110}svh` }} data-career-diary data-mode="animated" data-chapter={chapter} data-phase={phase} data-chapters={stages.length}>
      <div className={styles.sticky}>
        <div className={styles.sceneHeader}><span><BookOpen size={13} aria-hidden="true" /> THE CAREER JOURNAL</span><span>SCROLL TO OPEN & TURN THE PAGES</span></div>
        <div className={styles.scene}>
          <div className={styles.aura} aria-hidden="true" />
          <m.div className={styles.book} style={{ x: shift, rotateX: bookTilt, rotateY: bookYaw, rotateZ: bookRoll, z: bookLift, scale: bookScale }} data-diary-book>
            <div className={`${styles.binding} ${styles.bindingRight}`} aria-hidden="true" />
            <article className={`${styles.page} ${styles.rightPage}`} aria-hidden={chapter !== stages.length - 1} inert={chapter !== stages.length - 1}><CareerEntry stage={last} page={stages.length * 2} /></article>
            <div className={styles.paperEdge} aria-hidden="true" />
            <m.span className={styles.coverShade} style={{ opacity: castShadow }} aria-hidden="true" />
            {stages.slice(0, -1).map((stage, index) => <DiaryLeaf key={stage.id} stage={stage} index={index} count={stages.length} progress={progress} active={chapter === index} />)}
            <m.div className={styles.cover} style={{ rotateY: opening }} aria-hidden="true" data-diary-cover>
              <div className={styles.coverFront}>
                <div className={styles.coverBorder} />
                <span className={styles.coverEyebrow}>THE PERSONAL JOURNAL</span>
                <NmLettermark className={styles.coverMark} />
                <h3>Notes<br /><em>from work.</em></h3>
                <span className={styles.coverRule} /><p>Nur Mohammad</p>
                <span className={styles.coverRole}>BACKEND DEVELOPER<br />AI-ASSISTED FRONTEND</span>
                <span className={styles.coverFoot}>{String(stages.length).padStart(2, "0")} CHAPTERS / BUILT THROUGH EXPERIENCE</span>
              </div>
              <div className={styles.coverBack} data-diary-inside-cover>
                <div className={styles.journalNotes}>
                  <span className={styles.notesEyebrow}>A RECORD OF THE WORK</span>
                  <h3>Behind every<br />system, a story.</h3>
                  <p>Building dependable backends.<br />Learning through real products.</p>
                  <div className={styles.contents}><span>IN THIS JOURNAL</span>{stages.map(stage => <div key={stage.id}><span>{stage.number}</span><div><strong>{stage.organization}</strong><small>{stage.duration}</small></div></div>)}</div>
                  <NmLettermark className={styles.signature} /><span className={styles.notesFoot}>NUR MOHAMMAD · DHAKA, BANGLADESH</span>
                </div>
              </div>
              <span className={styles.coverThickness} />
              <m.span className={styles.ribbon} style={{ opacity: ribbonOpacity }} />
            </m.div>
            <span className={styles.spine} aria-hidden="true" />
          </m.div>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => goTo(phase === "closed" || phase === "closing" ? stages.length - 1 : chapter <= 0 ? -1 : chapter - 1)} disabled={phase === "cover"} aria-label={phase === "closed" || phase === "closing" ? "Reopen last experience chapter" : chapter === 0 ? "Return to diary cover" : "Previous experience chapter"}><ArrowLeft size={17} /></button>
          <div className={styles.chapterButtons} aria-label="Career diary chapters">{stages.map((stage, index) => <button type="button" key={stage.id} onClick={() => goTo(index)} aria-current={chapter === index ? "step" : undefined} aria-label={`Read ${stage.role} at ${stage.organization}`}><span>{stage.number}</span>{stage.organization}</button>)}</div>
          {phase === "closed" ? <a href="#projects" aria-label="Continue to selected projects"><ArrowDown size={17} /></a> : chapter === stages.length - 1 || phase === "closing" ? <button type="button" onClick={closeDiary} aria-label="Close career diary"><BookOpen size={17} /></button> : <button type="button" onClick={() => goTo(Math.min(chapter + 1, stages.length - 1))} aria-label={chapter < 0 ? "Open career diary" : "Next experience chapter"}><ArrowRight size={17} /></button>}
        </div>
        <div className={styles.readingStatus}><span aria-live="polite">{phase === "closed" ? "JOURNAL CLOSED / THE STORY CONTINUES" : phase === "closing" ? "CLOSING THE JOURNAL" : chapter < 0 ? "OPEN THE JOURNAL" : `CHAPTER ${stages[chapter].number} / ${String(stages.length).padStart(2, "0")}`}</span><span>{phase === "closed" ? "CONTINUE TO SELECTED WORK" : phase === "closing" || chapter === stages.length - 1 ? "SCROLL TO CLOSE THE JOURNAL" : "SCROLL AT YOUR OWN PACE"}<ArrowDown size={12} aria-hidden="true" /></span></div>
        <div className={styles.progressTrack} aria-hidden="true"><m.span style={{ scaleX: progress }} /></div>
      </div>
    </div>
  );
}

function DiaryLeaf({ stage, index, count, progress, active }: { stage: CareerStage; index: number; count: number; progress: ReturnType<typeof useSpring>; active: boolean }) {
  const turned = useTransform(progress, value => diaryLeafProgress(value, index, count));
  const rotation = useTransform(turned, value => -180 * value);
  const shadow = useTransform(turned, value => Math.sin(value * Math.PI) * 0.2);
  const depth = useTransform(turned, [0, 1], [(count - index) * 1.5, (index + 1) * 1.5]);
  const order = useTransform(turned, value => value > 0.5 ? index + 2 : count - index + 2);
  return (
    <m.div className={styles.leaf} style={{ rotateY: rotation, z: depth, zIndex: order }} data-diary-leaf>
      <article className={`${styles.page} ${styles.leafFront}`} aria-hidden={!active} inert={!active}><CareerEntry stage={stage} page={(index + 1) * 2} /><m.span className={styles.turnShade} style={{ opacity: shadow }} aria-hidden="true" /></article>
      <div className={`${styles.page} ${styles.leafBack}`} aria-hidden="true">
        <div className={styles.chapterNotes}>
          <span className={styles.notesEyebrow}>NOTES FROM CHAPTER {stage.number}</span><span className={styles.noteNumber}>{stage.number}</span>
          <CompanyLogo id={stage.logoId} size={38} /><h3>{stage.organization}</h3><p>{stage.role}</p><span className={styles.chapterDuration}>{stage.duration}</span>
          <div className={styles.recordedFocus}><span>RECORDED FOCUS</span>{stage.highlights.slice(0, 3).map(highlight => <p key={highlight}>{highlight}</p>)}</div>
          <span className={styles.notesFoot}>ONE CHAPTER IN AN ONGOING JOURNEY.</span>
        </div>
      </div>
    </m.div>
  );
}

export function CareerDiary({ stages }: { stages: readonly CareerStage[] }) {
  const animated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (stages.length === 0) return null;
  if (animated) return <AnimatedDiary stages={stages} />;
  return (
    <div className={styles.readable} data-career-diary data-mode="readable">
      <div className={styles.readableHeading}><BookOpen size={17} aria-hidden="true" /><span>THE CAREER JOURNAL / {String(stages.length).padStart(2, "0")} CHAPTERS</span></div>
      <ol>{stages.map((stage, index) => <li key={stage.id}><article className={styles.readablePage}><CareerEntry stage={stage} page={(index + 1) * 2} /></article></li>)}</ol>
      <a className={styles.continueLink} href="#projects">Continue to selected work <ArrowDown size={15} aria-hidden="true" /></a>
    </div>
  );
}
