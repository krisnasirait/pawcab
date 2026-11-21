"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { PiCaretLeft, PiCaretRight, PiX } from "react-icons/pi";
import contentData from "@/lib/content";

// R-31: passengers as a filmstrip, not a 6-col SaaS grid. Real names,
// horizontal scroll on mobile, quiet 12px radius, lightbox kept for access.
export default function GallerySection() {
  const gallery = contentData.home.gallery;
  const items = gallery.items || [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lightboxOpen = lightboxIndex !== null;

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0));
  }, [lightboxIndex, items.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
  }, [lightboxIndex, items.length]);

  // Capture the invoking photo button; hand focus back on every close path.
  useEffect(() => {
    if (!lightboxOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      opener?.focus?.();
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setLightboxIndex(null);
        return;
      }
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen, showNext, showPrev]);

  return (
    <section id="passengers" className="bg-forest text-white py-16 md:py-24 overflow-hidden" data-surface="forest">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-[14px] font-medium text-accent mb-4">
              <span aria-hidden="true" className="inline-block h-px w-10 bg-accent" />
              Recent passengers
            </p>
            <h2 className="text-4xl md:text-[56px] leading-[1.05] font-normal text-white">
              Regulars in the back seat.
            </h2>
          </div>
          <p className="text-[15px] text-white/70 max-w-sm leading-[1.45]">
            {gallery.subtitle || "Real dogs, real rides. Tap any photo to see who rode where."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pl-5 md:pl-8">
        <div className="flex gap-4 overflow-x-auto pb-4 pr-5 snap-x snap-mandatory" role="list" aria-label="Passenger photos">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              role="listitem"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View photo of ${item.name}`}
              className="group relative shrink-0 w-[220px] md:w-[260px] snap-start text-left"
            >
              <span className="block overflow-hidden rounded-[28px] aspect-[4/5] bg-white/10 border border-white/25 transition-colors duration-200 group-hover:border-accent/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name || `PawCab passenger ${idx + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="mt-2.5 flex items-baseline justify-between gap-3">
                <span className="font-medium text-[15px]">{item.name}</span>
                <span className="text-[12.5px] text-white/70">Ride {String(idx + 1).padStart(2, "0")}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && items[lightboxIndex!] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Passenger photo viewer"
          ref={dialogRef}
          className="fixed inset-0 z-50 bg-forest/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button ref={closeRef} onClick={() => setLightboxIndex(null)} aria-label="Close image preview" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
            <PiX className="text-2xl" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showPrev(); }} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
            <PiCaretLeft className="text-2xl" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showNext(); }} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
            <PiCaretRight className="text-2xl" />
          </button>
          <div className="max-w-3xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[lightboxIndex!].image} alt={items[lightboxIndex!].name} className="max-h-[72vh] w-auto rounded-2xl object-contain" />
            <p className="mt-4 font-medium text-accent">{items[lightboxIndex!].name}</p>
            <p className="text-white/60 text-sm">{lightboxIndex! + 1} of {items.length}</p>
          </div>
        </div>
      )}
    </section>
  );
}
