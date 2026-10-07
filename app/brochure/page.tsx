import type { Metadata } from "next";
import { BrochureMasthead, BrochureReader } from "@/components/site/BrochureReader";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { brochurePages } from "@/lib/data/brochure";
import styles from "@/components/site/BrochureReader.module.css";

export const metadata: Metadata = {
  title: "Brochure — HR VISTA 3.0",
  description: "Read the complete 12-page HR VISTA 3.0 brochure: the theme, expected delegate profile, experience and Mumbai setting for 21–22 November 2026.",
};

export default async function BrochurePage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const { page } = await searchParams;
  const requestedPage = typeof page === "string" && /^\d+$/.test(page) ? Number(page) : NaN;
  const initialPage = Number.isSafeInteger(requestedPage) && requestedPage >= 1 && requestedPage <= brochurePages.length ? requestedPage : 1;
  return (
    <div className="hv">
      <SiteHeader />
      <main id="main-content" className={`hv ${styles.page}`}>
        <BrochureMasthead />
        <div className="hv-container">
          <BrochureReader initialPage={initialPage} />
          <section className={styles.summaryList} aria-labelledby="brochure-text-heading">
            <p className="hv-eyebrow">The brochure in words</p>
            <h2 id="brochure-text-heading" className="hv-section-title">Explore each chapter.</h2>
            <p className="hv-copy">Text summaries of all {brochurePages.length} pages. Expected attendance and corporate participation are subject to confirmation.</p>
            <div className={styles.summaryGrid}>
              {brochurePages.map((page, index) => (
                <details key={page.src}>
                  <summary><span>{String(index + 1).padStart(2, "0")}</span>{page.title}</summary>
                  <p>{page.summary}</p>
                  <a href={page.src} target="_blank" rel="noreferrer">Open page {index + 1} image <span aria-hidden="true">↗</span></a>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
