"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PiList, PiX } from "react-icons/pi";
import contentData from "@/lib/content";

// R-31: the bar is chrome, not content. Solid navy (no frosted blur),
// one-line lockup (mark plus wordmark, no badge box or tagline),
// borderless burger with a hover wash. The gold CTA stays the single
// memorable element; everything else stays quiet.
interface HeaderProps {
  /** Accepted for compatibility; the header is a single navy bar on every page. */
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
      className="sticky top-0 w-full z-30 bg-navy text-white border-b border-white/10"
      data-surface="navy"
    >
      <div className="max-w-7xl mx-auto w-full px-5 md:px-8 flex justify-between items-center min-h-[64px] md:min-h-[72px] py-2">
        <Link href="/" className="flex items-center gap-2.5 min-h-[44px]" aria-label="The PawCab home">
          <Image
            src="/images/logo-pawcab.png"
            alt="The PawCab logo"
            width={32}
            height={32}
            className="object-contain shrink-0"
          />
          <span className="font-display text-lg md:text-[22px] font-medium tracking-wide text-white leading-none">
            THE PAWCAB
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
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            {menuOpen ? (
              <PiX aria-hidden="true" className="text-xl" />
            ) : (
              <PiList aria-hidden="true" className="text-xl" />
            )}
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
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 inline-flex items-center justify-center rounded-full bg-accent text-navy font-medium px-5 py-3.5 min-h-[48px] text-[15px] border-2 border-line"
            >
              Book a ride
            </a>
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
          </nav>
        </div>
      )}
    </header>
  );
}
