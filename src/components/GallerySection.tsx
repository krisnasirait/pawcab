"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import contentData from "@/lib/content";

// R-31: passengers as a filmstrip, not a 6-col SaaS grid. Real names,
// horizontal scroll on mobile, quiet 12px radius, lightbox kept for access.
export default function GallerySection() {
  const gallery = contentData.home.gallery;
  const items = gallery.items || [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lightboxOpen = lightboxIndex !== null;

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0));
  }, [lightboxIndex, items.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
  }, [lightboxIndex, items.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
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
    <section id="passengers" className="bg-[#0E2A21] text-[#FFFEFA] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-[14px] font-medium text-[#FFC61A] mb-4">
              <span aria-hidden="true" className="inline-block h-px w-10 bg-[#FFC61A]" />
              Recent passengers
            </p>
            <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
              Regulars in the back seat.
            </h2>
          </div>
          <p className="text-[15px] text-[#FFFEFA]/75 max-w-sm leading-relaxed">
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
              <span className="block overflow-hidden rounded-xl aspect-[4/5] bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name || `PawCab passenger ${idx + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-2.5 flex items-baseline justify-between gap-3">
                <span className="font-semibold text-[15px]">{item.name}</span>
                <span className="text-[12.5px] text-[#FFFEFA]/60">Ride {String(idx + 1).padStart(2, "0")}</span>
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
          className="fixed inset-0 z-50 bg-[#0E2A21]/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button ref={closeRef} onClick={() => setLightboxIndex(null)} aria-label="Close image preview" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
            <IoClose className="text-2xl" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showPrev(); }} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
            <IoChevronBack className="text-2xl" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); showNext(); }} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center">
            <IoChevronForward className="text-2xl" />
          </button>
          <div className="max-w-3xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[lightboxIndex!].image} alt={items[lightboxIndex!].name} className="max-h-[72vh] w-auto rounded-xl object-contain" />
            <p className="mt-4 font-semibold">{items[lightboxIndex!].name}</p>
            <p className="text-white/60 text-sm">{lightboxIndex! + 1} of {items.length}</p>
          </div>
        </div>
      )}
    </section>
  );
}
