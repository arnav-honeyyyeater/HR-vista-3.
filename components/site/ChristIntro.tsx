"use client";
import { useEffect, useState } from "react";
import styles from "./Journey.module.css";

export function ChristIntro() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || location.hash || window.scrollY > 20) return;
    try {
      if (sessionStorage.getItem("hr-vista-intro")) return;
      sessionStorage.setItem("hr-vista-intro", "seen");
    } catch {
      /* Storage is optional. */
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1850);
    const dismiss = () => setVisible(false);
    reduced.addEventListener("change", dismiss);
    return () => {
      clearTimeout(timer);
      reduced.removeEventListener("change", dismiss);
    };
  }, []);
  if (!visible) return null;
  return (
    <div className={styles.intro} aria-label="CHRIST presents HR VISTA">
      <div className={styles.introBrand}>
        <img
          src="/media/raw/logo_christ_lavasa.png"
          alt="CHRIST (Deemed to be University), Pune Lavasa Campus"
          width={360}
          height={140}
          onError={() => setVisible(false)}
        />
        <span>PRESENTS</span>
        <strong>HR VISTA 3.0</strong>
      </div>
      <button type="button" onClick={() => setVisible(false)}>
        Skip intro ↗
      </button>
    </div>
  );
}
