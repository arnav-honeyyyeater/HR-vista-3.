"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { brochurePages } from "@/lib/data/brochure";
import styles from "./BrochureReader.module.css";

export function BrochureMasthead() {
  const header = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: header, offset: ["start start", "end start"] });
  const coverDrift = useTransform(scrollYProgress, [0, 1], [0, -45]);
  return (
    <header ref={header} className={styles.intro}>
      <div className={`hv-container ${styles.introInner}`}>
        <div className={styles.introTopline}><p>HR VISTA 3.0 / The digital reading room</p><p>Mumbai, 2026 <span aria-hidden="true">↗</span></p></div>
        <div className={styles.introGrid}>
          <div className={styles.introCopy}>
            <h1 className={styles.introTitle}><span>Field</span><span>notes<span className={styles.titleDot}>.</span></span></h1>
            <p className={styles.introDeck}>A future of work<br />worth reading about.</p>
            <p className={styles.introDescription}>The vision, the people and the experience of HR VISTA 3.0. The complete official brochure, one page at a time.</p>
            <a className={styles.readLink} href="#brochure-reader"><span>Step inside the brochure</span><span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.coverComposition}>
            <span className={styles.coverCount} aria-hidden="true">12</span>
            <motion.a href="#brochure-reader" className={styles.coverStack} style={{ y: reduceMotion ? 0 : coverDrift, rotate: reduceMotion ? 0 : 7 }} whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.025 }} aria-label="Start reading the official HR VISTA 3.0 brochure">
              <Image className={styles.introCover} src={brochurePages[0].src} alt="HR VISTA 3.0 official brochure cover" width={334} height={422} sizes="(max-width: 560px) 220px, (max-width: 900px) 280px, 334px" priority />
              <span className={styles.coverCaption}>The official edition <span aria-hidden="true">↗</span></span>
            </motion.a>
            <div className={styles.coverTag}><span>12 pages</span><span>One shared future.</span></div>
          </div>
        </div>
        <div className={styles.introMeta}><span>21–22 November 2026</span><span>Jio Grounds / BKC / Mumbai</span><span>HR VISTA 3.0 <span aria-hidden="true">↗</span></span></div>
      </div>
    </header>
  );
}

function ReadingDialog({ index, onChange, onClose }: { index: number; onChange: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); previousFocus?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { viewport.current?.scrollTo({ top: 0, left: 0 }); }, [index, zoomed]);
  return (
    <dialog ref={dialog} className={styles.dialog} aria-label="Brochure reading mode" onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => handlePageKeys(event, index, onChange)} data-lenis-prevent="true">
      <div className={styles.dialogToolbar}>
        <span className={styles.dialogTitle}>HR VISTA 3.0 · {index + 1} / {brochurePages.length}</span>
        <div className={styles.dialogActions}>
          <button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? "Fit to screen" : "Zoom in"} <span aria-hidden="true">{zoomed ? "−" : "+"}</span></button>
          <button type="button" autoFocus onClick={onClose} aria-label="Close reading mode">Close <span aria-hidden="true">×</span></button>
        </div>
      </div>
      <div className={styles.dialogViewport} ref={viewport} data-lenis-prevent="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={zoomed ? styles.zoomedPage : styles.dialogPage} src={brochurePages[index].src} alt={`Page ${index + 1}: ${brochurePages[index].title}. ${brochurePages[index].summary}`} width={834} height={1053} />
      </div>
      <div className={styles.dialogFooter}>
        <button type="button" onClick={() => onChange(index - 1)} disabled={index === 0}>← Previous</button>
        <p aria-live="polite">{brochurePages[index].title}</p>
        <button type="button" onClick={() => onChange(index + 1)} disabled={index === brochurePages.length - 1}>Next →</button>
      </div>
    </dialog>
  );
}

function handlePageKeys(event: KeyboardEvent<HTMLElement>, index: number, onChange: (index: number) => void) {
  const target = event.target;
  if (target instanceof HTMLElement && target.closest("input, select, textarea, [contenteditable='true']")) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault(); event.stopPropagation();
    const next = index + (event.key === "ArrowLeft" ? -1 : 1);
    if (next >= 0 && next < brochurePages.length) onChange(next);
  }
}

export function BrochureReader({ initialPage = 1 }: { initialPage?: number }) {
  const [index, setIndex] = useState(() => Number.isInteger(initialPage) && initialPage >= 1 && initialPage <= brochurePages.length ? initialPage - 1 : 0);
  const [reading, setReading] = useState(false);
  const thumbnailButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const page = brochurePages[index];
  useEffect(() => {
    setIndex(Number.isInteger(initialPage) && initialPage >= 1 && initialPage <= brochurePages.length ? initialPage - 1 : 0);
  }, [initialPage]);
  useEffect(() => {
    // Warm only the two adjacent document images; thumbnails use small optimised images.
    [index - 1, index + 1].filter((next) => next >= 0 && next < brochurePages.length).forEach((next) => {
      const adjacentImage = new window.Image();
      adjacentImage.src = brochurePages[next].src;
    });
    const button = thumbnailButtons.current[index];
    if (button?.parentElement) {
      const track = button.parentElement;
      track.scrollTo({ left: Math.max(0, button.offsetLeft - track.offsetLeft - track.clientWidth / 2 + button.offsetWidth / 2), behavior: "auto" });
    }
  }, [index]);
  return (
    <section id="brochure-reader" className={styles.reader} aria-label="12-page brochure reader" tabIndex={0} onKeyDown={(event) => handlePageKeys(event, index, setIndex)}>
      <div className={styles.readerHeader}>
        <div><p className="hv-eyebrow">HR VISTA / 12-page official brochure</p><h2>Take a closer look.</h2></div>
        <button type="button" className="hv-button hv-button--secondary" onClick={() => setReading(true)}>Open reading mode <span aria-hidden="true">↗</span></button>
      </div>
      <div className={styles.toolbar}>
        <button type="button" className={styles.navButton} onClick={() => setIndex(index - 1)} disabled={index === 0}><span aria-hidden="true">←</span> Previous</button>
        <label className={styles.pageSelector}>Page
          <select aria-label="Choose a brochure page" value={index} onChange={(event) => setIndex(Number(event.target.value))}>
            {brochurePages.map((item, i) => <option key={item.src} value={i}>{i + 1} — {item.title}</option>)}
          </select>
          <span>of {brochurePages.length}</span>
        </label>
        <button type="button" className={styles.navButton} onClick={() => setIndex(index + 1)} disabled={index === brochurePages.length - 1}>Next <span aria-hidden="true">→</span></button>
      </div>
      <div className={styles.stage}>
        <span className={styles.stageNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <figure>
          <button type="button" className={styles.pageButton} onClick={() => setReading(true)} aria-label={`Open page ${index + 1} in larger reading mode`}>
            {/* Keep the cover rendered and meaningful before JavaScript loads. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.documentPage} src={page.src} alt={`HR VISTA 3.0 brochure, page ${index + 1}: ${page.title}`} width={834} height={1053} decoding="async" />
            <span className={styles.enlargeHint}>View larger <span aria-hidden="true">↗</span></span>
          </button>
          <figcaption className={styles.pageSummary} aria-live="polite">
            <span className={styles.pageNumber}>Page {index + 1} of {brochurePages.length}</span>
            <h3>{page.title}</h3><p>{page.summary}</p>
          </figcaption>
        </figure>
      </div>
      <nav className={styles.thumbnailTrack} aria-label="Brochure page thumbnails" data-lenis-prevent="true">
        {brochurePages.map((item, i) => (
          <button type="button" key={item.src} ref={(element) => { thumbnailButtons.current[i] = element; }} aria-pressed={index === i} aria-label={`Read page ${i + 1}: ${item.title}`} onClick={() => setIndex(i)}>
            <Image src={item.src} alt="" width={72} height={91} sizes="72px" loading="lazy" />
            <span>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </nav>
      <p className={styles.keyboardHint}>Choose a thumbnail or use ← / → while the reader is focused. Open reading mode to zoom into the page.</p>
      {reading && <ReadingDialog index={index} onChange={setIndex} onClose={() => setReading(false)} />}
    </section>
  );
}
