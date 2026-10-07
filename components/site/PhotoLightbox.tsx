"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import styles from "./PhotoLightbox.module.css";

export interface GalleryPhoto { src: string; alt: string; caption: string; source?: string; }

export function PhotoLightbox({ photos, index, onChange, onClose, label }: {
  photos: GalleryPhoto[]; index: number; onChange: (index: number) => void; onClose: () => void; label: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); previousFocus?.focus({ preventScroll: true }); };
  }, []);
  const move = (direction: number) => onChange((index + direction + photos.length) % photos.length);
  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); event.stopPropagation(); move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }
  const photo = photos[index];
  return (
    <dialog ref={dialog} className={styles.dialog} aria-label={label} onKeyDown={onKeyDown} onCancel={(event) => { event.preventDefault(); onClose(); }} data-lenis-prevent="true">
      <div className={styles.toolbar}><p>{label}</p><button type="button" autoFocus onClick={onClose} aria-label="Close photo gallery">Close <span aria-hidden="true">×</span></button></div>
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.photo} src={photo.src} alt={photo.alt} width={1600} height={900} />
        <figcaption className={styles.caption} aria-live="polite">{photo.caption}{photo.source && <a href={photo.source} target="_blank" rel="noreferrer">Photo: CHRIST Lavasa / Flickr ↗</a>}</figcaption>
      </figure>
      <div className={styles.controls}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo">← <span>Previous</span></button>
        <span aria-live="polite">{index + 1} / {photos.length}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next photo"><span>Next</span> →</button>
      </div>
    </dialog>
  );
}
