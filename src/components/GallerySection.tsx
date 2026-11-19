"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import contentData from "@/lib/content";

export default function GallerySection() {
  const gallery = contentData.home.gallery;
  const galleryItems = gallery.items || [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const showNext = useCallback(() => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % galleryItems.length : 0
    );
  }, [lightboxIndex, galleryItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + galleryItems.length) % galleryItems.length
        : 0
    );
  }, [lightboxIndex, galleryItems.length]);

  // When the lightbox opens, move focus to the close button; on close,
  // return focus to the thumbnail that opened it (R-32, R-26).
  const lightboxOpen = lightboxIndex !== null;
  useEffect(() => {
    if (!lightboxOpen) return;
    triggerRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => {
      triggerRef.current?.focus?.();
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex, showNext, showPrev]);

  return (
    <section id="gallery" className="bg-soft-white py-16 md:py-20 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-warm-taupe font-semibold mb-2">
            {gallery.badge || "Gallery"}
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight">
            {gallery.heading || "Our Passengers"}
          </h2>
          {gallery.subtitle && (
            <p className="text-warm-taupe text-sm mt-2 max-w-xl">
              {gallery.subtitle}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {galleryItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View photo of ${item.name || `passenger ${idx + 1}`}`}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-sand-beige/20 border border-sand-beige/40 shadow-sm hover:shadow-xl hover:border-pawcab-gold/70 transition-all duration-300 text-left group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name || `PawCab Passenger ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-midnight/80 via-deep-midnight/30 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                <p className="text-white text-xs font-semibold truncate text-center">
                  {item.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Passenger photo viewer"
          className="fixed inset-0 z-50 bg-deep-midnight/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            ref={closeRef}
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image preview"
            className="absolute top-4 right-4 md:top-6 md:right-8 w-11 h-11 rounded-full bg-soft-white/10 hover:bg-soft-white/20 text-soft-white flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <IoClose className="text-2xl" />
          </button>

          {/* Previous Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-soft-white/10 hover:bg-soft-white/25 text-soft-white flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-105"
          >
            <IoChevronBack className="text-xl md:text-2xl" />
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-soft-white/10 hover:bg-soft-white/25 text-soft-white flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-105"
          >
            <IoChevronForward className="text-xl md:text-2xl" />
          </button>

          {/* Active Image Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryItems[lightboxIndex].image}
              alt={galleryItems[lightboxIndex].name}
              width={1200}
              height={900}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            {/* Caption & Counter */}
            <div className="mt-4 text-center">
              <p className="text-soft-white font-medium text-base md:text-lg">
                {galleryItems[lightboxIndex].name}
              </p>
              <p className="text-soft-white/60 text-xs md:text-sm font-light mt-0.5">
                {lightboxIndex + 1} of {galleryItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
