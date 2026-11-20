import React from "react";
import contentData from "@/lib/content";

// R-31: comfort as a two-column ledger with a photo, not six identical
// icon cards. Icons removed on purpose: the photo is the evidence.
export default function ComfortSection() {
  const comfort = contentData.home?.comfort;
  const points: { title: string; desc: string }[] = [
    { title: "Room to lie down", desc: "Folded seats, non-slip mats, space for up to three large dogs." },
    { title: "Cool the whole way", desc: "Air conditioning on before pickup, shade cloths for waiting." },
    { title: "You can ride along", desc: "Sit with nervous dogs, or send them with the handler." },
    { title: "Clean between rides", desc: "Sanitised mats and a rinse of bowls after every trip." },
    { title: "Medium crate on request", desc: "For escape artists, puppies, and airport handoffs." },
    { title: "Notes stay on file", desc: "Reactive, carsick, deaf, or just picky about windows. We remember." },
  ];

  return (
    <section className="bg-[#FFFEFA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#0E6B5E] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#0E6B5E]" />
            Inside the car
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
Cool, clean, and room to lie down.
          </h2>
          <dl className="mt-8 border-t border-[#0E2A21]/15">
            {points.map((p) => (
              <div key={p.title} className="py-4 border-b border-[#0E2A21]/15 grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-4">
                <dt className="font-bold text-[15px] text-[#0E2A21]">{p.title}</dt>
                <dd className="text-[15px] leading-relaxed text-[#3F382E]">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="overflow-hidden rounded-xl aspect-[4/5] max-h-[640px] bg-[#D8C9AE]/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comfort?.image || "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop"}
            alt="Dog resting comfortably in the PawCab cabin"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
