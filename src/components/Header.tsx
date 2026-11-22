"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/lib/content";

interface HeaderProps {
  /** Kept for call sites that still pass a theme; the lime bar is now opaque everywhere. */
  theme?: "dark" | "light";
}

const NAV_LINKS = [
  { label: "Rides", href: "/services/pet-transport" },
  { label: "Walking", href: "/services/dog-walking" },
  { label: "Sitting", href: "/services/pet-sitting" },
  { label: "Passengers", href: "/#passengers" },
  { label: "Fare", href: "/#fare" },
];

export default function Header({ theme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  void theme;

  const ctaHref =
    contentData.navigation?.ctaButton?.href ||
    "https://wa.me/6285857883906?text=Hello%20The%20PawCab!%20I%20would%20like%20to%20book%20a%20ride%20for%20my%20pet.";

  // Escape dismisses the menu and focus returns to the trigger (R-32).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setMenuOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 left-0 w-full z-30 bg-navy/95 backdrop-blur text-white border-b border-white/10"
      data-surface="navy"
    >
      <div className="max-w-7xl mx-auto w-full px-5 md:px-8 flex justify-between items-center min-h-[72px] md:min-h-[80px] py-3">
        <Link href="/" className="flex items-center gap-2.5 min-h-[44px]" aria-label="The PawCab home">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 border border-white/15 shrink-0">
            <Image
              src="/images/logo-pawcab.png"
              alt="The PawCab logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg md:text-[22px] font-medium tracking-wide text-white">
              THE PAWCAB
            </span>
            <span className="text-[11px] font-medium tracking-wide text-white/70 mt-0.5">
              Private pet rides, Bali
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7 text-[16px] font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/85 underline-offset-[6px] decoration-2 decoration-transparent hover:decoration-accent hover:underline hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center min-h-[44px] rounded-full bg-accent text-navy font-medium text-[15px] px-5 py-2.5 border-2 border-accent hover:bg-accent-hover hover:border-accent-hover transition-colors duration-200"
          >
            Book a ride
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            ref={triggerRef}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors"
          >
            <span aria-hidden="true" className="text-xl leading-none">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          ref={panelRef}
          data-surface="light" className="lg:hidden mx-4 mb-3 rounded-2xl bg-white text-navy border border-navy/20 overflow-hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3.5 min-h-[48px] flex items-center rounded-xl text-[16px] font-medium text-navy hover:bg-surface hover:text-midnight transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mb-2 inline-flex items-center justify-center rounded-full bg-accent text-navy font-medium px-5 py-3.5 min-h-[48px] text-[15px] border-2 border-line"
            >
              Book a ride
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
