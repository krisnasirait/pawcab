import React from "react";
import contentData from "@/lib/content";

// R-31: no card grid. This strip is a ledger line: one sentence of proof,
// separated by forest hairlines, left aligned, sentence case. It answers
// "can I trust a stranger with my dog in Bali heat" in one glance.
export default function FeaturesRow() {
  const list = contentData.home?.features || [];

  const fallback = [
    { title: "Private SUV, never shared", description: "No cages, no strangers' pets in the cabin." },
    { title: "Trained handlers", description: "Calm with anxious and senior dogs." },
    { title: "Cool cabin", description: "Air conditioning, sanitised mats, water stops." },
    { title: "Island wide", description: "Denpasar to Uluwatu, Canggu to Sukawati." },
  ];

  const items = (list.length > 0 ? list : fallback).slice(0, 4);

  return (
    <section aria-label="Why PawCab" className="bg-canvas border-b border-forest/15">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-8">
        {items.map((f, i) => (
          <div
            key={i}
            className={`flex gap-4 items-start ${i > 0 ? "lg:border-l lg:border-forest/15 lg:pl-8" : ""}`}
          >
            <span aria-hidden="true" className="mt-[7px] inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-forest" />
            <div>
              <h2 className="text-[17px] font-medium text-forest leading-snug font-text">{f.title}</h2>
              <p className="text-[14.5px] leading-[1.55] text-ink mt-1.5">
                {"description" in f && f.description ? f.description : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
