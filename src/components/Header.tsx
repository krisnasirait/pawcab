"use client";

import React, { useState, useEffect, useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
import { IoClose, IoMenu } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/lib/content";

interface HeaderProps {
  theme?: "dark" | "light";
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Stories", href: "/stories" },
  { label: "About", href: "/#about" },
];

export default function Header({ theme = "dark" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const ctaHref =
    contentData.navigation?.ctaButton?.href ||
    "https://wa.me/6282266383800?text=Hello%20The%20PawCab!%20I%20would%20like%20to%20book%20a%20ride%20for%20my%20pet.";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on Escape and return focus to the trigger.
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.querySelector("a")?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const isLight = theme === "light" && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-deep-midnight/95 backdrop-blur-md shadow-lg text-soft-white"
          : isLight
            ? "py-6 bg-transparent text-deep-midnight"
            : "py-6 bg-transparent text-soft-white"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo-pawcab.png"
            alt="The PawCab Logo"
            width={48}
            height={48}
            className="object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center">
            <span
              className="font-elmessiri text-xl md:text-3xl font-bold leading-none tracking-wide"
              style={{ fontFamily: "'El Messiri', serif" }}
            >
              THE PAWCAB
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-8 text-sm tracking-widest font-medium uppercase"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-pawcab-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex border rounded-full px-5 py-2 min-h-[44px] items-center text-xs md:text-sm uppercase tracking-wider gap-2 transition-colors ${
              isLight
                ? "border-deep-midnight text-deep-midnight hover:bg-deep-midnight hover:text-soft-white"
                : "border-soft-white text-soft-white hover:bg-soft-white hover:text-deep-midnight"
            }`}
          >
            Book a Ride <BsArrowRight aria-hidden="true" />
          </a>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${
              isLight
                ? "border-deep-midnight text-deep-midnight"
                : "border-soft-white text-soft-white"
            }`}
          >
            {menuOpen ? (
              <IoClose className="text-2xl" aria-hidden="true" />
            ) : (
              <IoMenu className="text-2xl" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="lg:hidden mt-4 rounded-3xl bg-deep-midnight text-soft-white border border-soft-white/10 shadow-2xl overflow-hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3.5 min-h-[44px] flex items-center rounded-2xl text-sm uppercase tracking-widest font-medium hover:bg-soft-white/10 hover:text-pawcab-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mx-2 mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-pawcab-gold text-deep-midnight font-bold px-5 py-3.5 min-h-[44px] text-sm uppercase tracking-wider hover:bg-yellow-400 transition-colors"
            >
              Book a Ride <BsArrowRight aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
