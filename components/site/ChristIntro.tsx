"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ChristIntro.module.css";

const OPEN_DURATION_MS = 1400;

type IntroBoot = {
  replay: boolean;
  previousRestoration: ScrollRestoration;
  claimed?: boolean;
};

/** Runs while the home page is parsed, before the drum or hash target paints. */
const INTRO_BOOTSTRAP = `(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const reload = navigation && navigation.type === 'reload';
  const replay = (!location.hash || reload) && navigation?.type !== 'back_forward';
  const previousRestoration = history.scrollRestoration;
  window.__hrVistaIntroBoot = { replay, previousRestoration };
  if (!replay) return;
  history.scrollRestoration = 'manual';
  if (reload && location.hash) {
    history.replaceState(history.state, '', location.pathname + location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.dataset.intro = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'entered' : 'loading';
})();`;

/** The intro opens the actual photo wall underneath it; it has no second scene. */
export function ChristIntro() {
  const [phase, setPhase] = useState<"loading" | "opening" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const skip = useRef<HTMLButtonElement>(null);
  const enter = useRef<() => void>(() => {});
  const entry = useRef<IntroBoot | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;
    const boot = (window as Window & { __hrVistaIntroBoot?: IntroBoot }).__hrVistaIntroBoot;
    // Keep the decision through Strict Mode's effect replay, while allowing a
    // later client-side visit to honour its own link rather than old navigation.
    if (!entry.current) {
      entry.current = boot && !boot.claimed
        ? boot
        : { replay: !location.hash, previousRestoration: history.scrollRestoration };
      if (boot) boot.claimed = true;
    }
    const { replay, previousRestoration } = entry.current;
    if (preference.matches || !replay) {
      html.dataset.intro = "entered";
      if (replay) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      history.scrollRestoration = previousRestoration;
      setPhase("done");
      window.dispatchEvent(new Event("hr-vista:entered"));
      return () => { delete html.dataset.intro; };
    }

    let cancelled = false;
    let opening = false;
    let finished = false;
    let restoreFocus = false;
    let resetFrame = 0;
    const timers: number[] = [];
    const main = document.querySelector<HTMLElement>("#main-content");
    const header = document.querySelector<HTMLElement>("header");
    const footer = document.querySelector<HTMLElement>("footer");
    const previousOverflow = document.body.style.overflow;
    const previousGutter = html.style.scrollbarGutter;
    const previousMainInert = main?.inert ?? false;
    const previousHeaderInert = header?.inert ?? false;
    const previousFooterInert = footer?.inert ?? false;
    html.dataset.intro = "loading";
    history.scrollRestoration = "manual";
    // Browser restoration and late hash scrolling can happen after hydration.
    // Hold the actual landing scene at the top until the curtain is fully open.
    const resetScroll = () => {
      if (finished || cancelled) return;
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      resetFrame = requestAnimationFrame(resetScroll);
    };
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();
    // Reserve the scrollbar width while locked, so releasing the page does
    // not change the drum's perspective or shift the fixed navigation.
    html.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;
    if (header) header.inert = true;
    if (footer) footer.inert = true;

    const unlock = () => {
      document.body.style.overflow = previousOverflow;
      html.style.scrollbarGutter = previousGutter;
      if (main) main.inert = previousMainInert;
      if (header) header.inert = previousHeaderInert;
      if (footer) footer.inert = previousFooterInert;
      history.scrollRestoration = previousRestoration;
    };
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      cancelAnimationFrame(resetFrame);
      html.dataset.intro = "entered";
      setPhase("done");
      unlock();
      window.dispatchEvent(new Event("hr-vista:entered"));
      if (restoreFocus || document.activeElement === skip.current) {
        document.querySelector<HTMLElement>("[data-hero-drag]")?.focus({ preventScroll: true });
      }
    };
    const begin = () => {
      if (opening || finished || cancelled) return;
      opening = true;
      restoreFocus = document.activeElement === skip.current;
      setProgress(100);
      if (preference.matches) { finish(); return; }

      // The wall starts settling before the shutters uncover it. Keep scroll
      // and page focus locked until every part has reached its final pose.
      html.dataset.intro = "opening";
      setPhase("opening");
      window.dispatchEvent(new Event("hr-vista:enter"));
      timers.push(window.setTimeout(finish, OPEN_DURATION_MS));
    };
    enter.current = begin;
    const onPreferenceChange = () => {
      if (preference.matches) { setProgress(100); finish(); }
    };

    // Decode the opening photographs and fonts, with a deadline so the intro
    // never waits indefinitely for a missing image or an unavailable font.
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-hero-panel] img"))
      .filter(image => image.closest<HTMLElement>("[data-hero-panel]")?.style.visibility !== "hidden");
    const assets = [...images.map(image => image.decode().catch(() => {})), document.fonts.ready];
    let loaded = 0;
    const ready = Promise.allSettled(assets.map(asset => Promise.resolve(asset).finally(() => {
      loaded++;
      if (!cancelled && !opening) setProgress(Math.round(loaded / assets.length * 100));
    })));
    const minimum = new Promise<void>(resolve => timers.push(window.setTimeout(resolve, 1000)));
    void Promise.all([ready, minimum]).then(begin);
    timers.push(window.setTimeout(begin, 2800));
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      cancelled = true;
      cancelAnimationFrame(resetFrame);
      timers.forEach(clearTimeout);
      preference.removeEventListener("change", onPreferenceChange);
      enter.current = () => {};
      unlock();
      delete html.dataset.intro;
    };
  }, []);

  if (phase === "done") return null;
  return (
    <>
    <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
    <noscript><style>{`.${styles.intro}{display:none}`}</style></noscript>
    <div className={styles.intro} data-phase={phase} data-lenis-prevent data-site-intro>
      <div className={styles.shutters} aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ "--strip": i } as CSSProperties} />)}
      </div>
      <div className={styles.topline}><span>HR VISTA / 03</span><span>LAVASA → MUMBAI</span></div>
      <div className={styles.brand}>
        <img className={styles.christ} src="/media/raw/logo_christ_lavasa.png" alt="CHRIST (Deemed to be University) presents" width={250} height={85} loading="eager" />
        <div className={styles.wordmark} aria-label="HR VISTA 3.0"><span>HR VISTA</span><em>3.0</em></div>
        <p>A new chapter. A bigger world.</p>
        <div className={styles.progress} role="progressbar" aria-label="Preparing the photo wall" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <span className={styles.status} role="status">{phase === "opening" ? "WELCOME TO WHAT’S NEXT" : "SETTING THE STAGE"}</span>
      </div>
      <div className={styles.bottomline}><span>PEOPLE. POSSIBILITY. PERSPECTIVE.</span><button ref={skip} type="button" onClick={() => enter.current()}>Enter the experience <span>↗</span></button></div>
    </div>
    </>
  );
}
