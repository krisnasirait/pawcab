import React from "react";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: coverage is a ledger, not a dark SaaS band. Paper background,
// map in a thin rattan frame, zone list as text rows. One booking CTA.
export default function CoverageSection() {
  const coverage = contentData.home?.coverage;
  const zones = [
    { name: "South Denpasar, Sanur, Kuta, Seminyak", note: "Home ground, fastest pickup" },
    { name: "Canggu, Kerobokan, Berawa, Pererenan", note: "Daily runs, morning and dusk" },
    { name: "Jimbaran, Nusa Dua, Uluwatu", note: "South runs, plan a little extra time" },
    { name: "Tanah Lot, Tabanan, Sukawati, outer Bali", note: "Custom routes, ask on WhatsApp" },
  ];

  return (
    <section id="coverage" className="bg-[#FFFEFA] py-16 md:py-24 border-y border-[#D8C9AE]/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#0E6B5E] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#0E6B5E]" />
            Where we drive
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            If it is in Bali, we will come to the gate.
          </h2>
          <p className="text-[16px] leading-relaxed text-[#3F382E] mt-4 max-w-md">
            {coverage?.description || "One island, one flat rate per kilometre. No zone maths for you to do."}
          </p>
          <ul className="mt-8 border-t border-[#0E2A21]/15">
            {zones.map((z) => (
              <li key={z.name} className="py-4 border-b border-[#0E2A21]/15 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-semibold text-[15px] text-[#0E2A21] sm:w-64 shrink-0">{z.name}</span>
                <span className="text-[14px] text-[#3F382E]">{z.note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" href={coverage?.ctaHref || "/services/pet-transport#pricing"}>
              {coverage?.ctaText || "See zones and rates"}
            </Button>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-[#D8C9AE] bg-white p-3 shadow-[0_10px_30px_rgba(14,42,33,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverage?.mapImage || "/images/map-zone.png"}
            alt="PawCab Bali coverage map"
            loading="lazy"
            className="w-full h-auto object-contain rounded-lg"
          />
          <p className="px-2 py-3 text-[13.5px] text-[#3F382E] leading-relaxed">
            Screenshot this map when you book. Tell us your gate colour and your dog's name, and the driver will find you.
          </p>
        </div>
      </div>
    </section>
  );
}
