import React from "react";
import BaliZoneMap from "./BaliZoneMap";
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
    <section id="coverage" className="bg-sagewash py-14 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-medium text-forest mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-forest" />
            Where we drive
          </p>
          <h2 className="text-4xl md:text-[56px] leading-[1.05] font-normal text-forest">
            If it is in Bali, we will come to the gate.
          </h2>
          <p className="text-[17px] leading-[1.55] text-ink mt-4 max-w-md">
            {coverage?.description || "Four zones, each with its own rate card. Type two addresses and the fare follows the zone you are in."}
          </p>
          <ul className="mt-8 border-t border-forest/20">
            {zones.map((z) => (
              <li key={z.name} className="py-4 border-b border-forest/20 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-medium text-[15px] text-forest sm:w-64 shrink-0">{z.name}</span>
                <span className="text-[14px] text-ink">{z.note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" href={coverage?.ctaHref || "/services/pet-transport#pricing"}>
              {coverage?.ctaText || "See zones and rates"}
            </Button>
          </div>
        </div>
        <div>
          <BaliZoneMap />
          <p className="mt-4 text-[13.5px] text-ink leading-[1.45]">
            Tap a zone to see its areas, then price the ride. Tell us your gate colour and your dog&apos;s name, and the driver will find you.
          </p>
        </div>
      </div>
    </section>
  );
}
