import React from "react";
import Button from "./Button";
import { BsArrowRight } from "react-icons/bs";
import contentData from "@/lib/content";

export default function CoverageSection() {
  const coverage = contentData.home?.coverage;

  return (
    <section className="bg-deep-midnight text-soft-white flex flex-col lg:flex-row w-full">
      {/* Combined Text & Map Area with Bali Background and Midnight Filter */}
      <div
        className="flex-1 relative flex flex-col md:flex-row items-center justify-between py-8 md:py-12 lg:py-14 pr-8 md:pr-12 gap-8 overflow-hidden"
        style={{ paddingLeft: "max(2.5rem, calc((100vw - 80rem) / 2))" }}
      >
        {/* Background Image: Bali Landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Midnight Filter Overlay */}
        <div className="absolute inset-0 bg-deep-midnight/95 backdrop-blur-[1px]" />

        {/* Text Content */}
        <div className="relative z-10 w-full md:w-5/12 flex flex-col justify-center">
          <p className="uppercase tracking-[0.2em] text-xs text-pawcab-gold font-semibold mb-2">
            {coverage?.badge || "Our Coverage"}
          </p>
          <h2 className="font-playfair text-white text-3xl md:text-5xl leading-tight mb-4">
            {coverage?.headingLine1 || "Find Your"} <br /> {coverage?.headingLine2 || "PawCab Zone."}
          </h2>
          <p className="text-soft-white/80 font-normal leading-relaxed mb-6 text-sm max-w-xs">
            {coverage?.description || "Know your zone before you book. Our service covers Bali with simple, transparent pricing."}
          </p>
          <div>
            <Button variant="primary" icon={<BsArrowRight aria-hidden="true" />} href={coverage?.ctaHref || "/services/pet-transport#pricing"}>
              {coverage?.ctaText || "View Zones & Rates"}
            </Button>
          </div>
        </div>

        {/* Map Area */}
        <div className="relative z-10 w-full md:w-9/12 flex items-center justify-center">
          <img
            src={coverage?.mapImage || "/images/map-zone.png"}
            alt="PawCab Bali Coverage Map"
            className="w-full h-full object-contain drop-shadow-2xl max-h-[280px] lg:max-h-[420px]"
          />
        </div>
      </div>

      {/* Right Image (Paling Kanan) */}
      <div className="w-full lg:w-60 xl:w-72 shrink-0 relative h-48 lg:h-auto border-t lg:border-t-0 lg:border-l border-soft-white/10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverage?.sideImage || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop"}
          alt="Bali Scenic Route"
          loading="lazy"
          width={800}
          height={1000}
          className="w-full h-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-deep-midnight/50"></div>
        <div className="absolute bottom-6 right-6 text-right">
          <p className="font-medium tracking-[0.2em] leading-loose text-xs uppercase text-soft-white text-shadow">
            {(coverage?.sideQuoteLines || ["Scenic routes.", "Happier", "journeys."]).map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < (coverage?.sideQuoteLines?.length || 3) - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
