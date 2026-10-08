"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

const LINKS = [
  { label: "Our journey", href: "/#lavasa" },
  { label: "Mumbai", href: "/#mumbai" },
  { label: "Editions", href: "/#editions" },
  { label: "Brochure", href: "/brochure" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resolve = (href: string) => home && href.startsWith("/#") ? href.slice(1) : href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab" || !panel) return;
      const links = Array.from(panel.querySelectorAll<HTMLElement>("a, button"));
      const first = links[0];
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); toggleRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); toggleRef.current?.focus();
      } else if (document.activeElement === toggleRef.current) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 1024px)");
    const resize = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", resize);
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      media.removeEventListener("change", resize);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header className={[styles.header, home ? styles.home : styles.paper, scrolled ? styles.scrolled : ""].join(" ")}>
      <a href="#main-content" className={styles.skip}>Skip to content</a>
      <div className={styles.bar}>
        <Link href={home ? "#top" : "/"} className={styles.wordmark} aria-label="HR VISTA 3.0 home">
          <span className={styles.dot} aria-hidden="true" />
          <span>HR VISTA <span className={styles.version}>3.0</span></span>
        </Link>
        <nav className={styles.desktop} aria-label="Primary">
          {LINKS.map((link) => <Link key={link.label} href={resolve(link.href)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className={styles.actions}>
          <a href="/brochure/HR-VISTA-3.0.pdf" download className={styles.join}>Download brochure <span aria-hidden="true">↓</span></a>
          <button ref={toggleRef} className={styles.toggle} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            <span className={open ? styles.topOpen : ""} />
            <span className={open ? styles.bottomOpen : ""} />
          </button>
        </div>
      </div>
      {open && <div ref={panelRef} className={styles.panel} id="mobile-navigation">
        <nav aria-label="Mobile">
          {LINKS.map((link, index) => <Link key={link.label} href={resolve(link.href)} onClick={() => setOpen(false)}><span className={styles.number} aria-hidden="true">0{index + 1}</span>{link.label}<span aria-hidden="true">↗</span></Link>)}
          <Link href="/brochure" className={styles.mobileJoin} onClick={() => setOpen(false)}>Explore the brochure <span aria-hidden="true">↗</span></Link>
        </nav>
        <p>21–22 November 2026 · Mumbai</p>
      </div>}
    </header>
  );
}
