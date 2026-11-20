"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/lib/content";

interface HeaderProps {
  theme?: "dark" | "light";
}

const NAV_LINKS = [
  { label: "Rides", href: "/services/pet-transport" },
  { label: "Walking", href: "/services/dog-walking" },
  { label: "Sitting", href: "/services/pet-sitting" },
  { label: "Passengers", href: "/#passengers" },
  { label: "Fare", href: "/#fare" },
];

export default function Header({ theme = "dark" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const ctaHref =
    contentData.navigation?.ctaButton?.href ||
    "https://wa.me/6282266383800?text=Hello%20The%20PawCab!%20I%20would%20like%20to%20book%20a%20ride%20for%20my%20pet.";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isLight = theme === "light" && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FFFEFA]/95 backdrop-blur-md border-b border-[#D8C9AE]/60 text-[#0E2A21] py-3"
          : isLight
            ? "bg-transparent text-[#0E2A21] py-5"
            : "bg-gradient-to-b from-[#0E2A21]/85 to-transparent text-[#FFFEFA] py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-5 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5" aria-label="The PawCab home">
          <Image
            src="/images/logo-pawcab.png"
            alt="The PawCab logo"
            width={40}
            height={40}
            className="object-contain shrink-0 rounded-full bg-[#FFFEFA] p-0.5"
          />
          <span className="flex flex-col leading-none">
            <span
              className="font-elmessiri text-lg md:text-xl font-bold tracking-wide"
              style={{ fontFamily: "'El Messiri', serif" }}
            >
              THE PAWCAB
            </span>
            <span className={`text-[11px] font-medium tracking-wide ${isScrolled || isLight ? "text-[#3F382E]/80" : "text-white/70"}`}>
              Private pet rides, Bali
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7 text-[15px] font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-[#0E6B5E] ${
                isScrolled || isLight ? "text-[#0E2A21]" : "text-[#FFFEFA]/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className={`hidden md:block text-[13px] font-medium ${isScrolled || isLight ? "text-[#3F382E]" : "text-white/75"}`}>
            Daily 07.00 to 21.00
          </span>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center min-h-[44px] rounded-full bg-[#FFC61A] text-[#0E2A21] font-bold text-[14px] px-5 py-2.5 hover:bg-[#ffd14d] transition-colors"
          >
            Book a ride
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-[10px] border transition-colors ${
              isScrolled || isLight
                ? "border-[#0E2A21]/20 text-[#0E2A21]"
                : "border-white/30 text-white"
            }`}
          >
            <span aria-hidden="true" className="text-xl leading-none">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="lg:hidden mx-4 mt-3 rounded-2xl bg-[#0E2A21] text-[#FFFEFA] border border-white/10 shadow-2xl overflow-hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3.5 min-h-[48px] flex items-center rounded-xl text-[16px] font-medium hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mb-2 inline-flex items-center justify-center rounded-full bg-[#FFC61A] text-[#0E2A21] font-bold px-5 py-3.5 min-h-[48px] text-[15px]"
            >
              Book a ride
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
