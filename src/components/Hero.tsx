import React from "react";
import Image from "next/image";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: hero opens with the most characteristic thing in this world:
// a calm dog riding shotgun in the PawCab SUV, plus the one action
// that matters (price the ride). No single-word accent, no eyebrow pill.
// Headline is one thought set in Fraunces; the fare panel is the focal point.
export default function Hero() {
  const hero = contentData.home.hero;
  const site = contentData.site;

  return (
    <section className="relative w-full bg-[#0E2A21] text-[#FFFEFA] overflow-hidden">
      <Image
        src={hero.bgImage}
        alt="Dog riding calmly in The PawCab pet taxi in Bali"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0E2A21] via-[#0E2A21]/72 to-[#0E2A21]/18" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0E2A21]/85 via-transparent to-[#0E2A21]/25" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 md:px-8 pt-32 md:pt-40 pb-10 md:pb-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-end">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#FFFEFA]/85 mb-5">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#FFC61A]" />
            Private pet mobility across Bali
          </p>
          <h1 className="font-semibold text-[#FFFEFA] text-[42px] leading-[1.02] sm:text-6xl lg:text-[76px] mb-6" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            Calm rides for dogs who hate traffic.
          </h1>
          <p className="text-[17px] md:text-lg leading-relaxed text-[#FFFEFA]/85 max-w-xl mb-8">
            {hero.description} Pricing is one flat rate per kilometre, measured live from the map.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" href={hero.primaryCtaHref}>
              {hero.primaryCtaText}
            </Button>
            <a
              href="#fare"
              className="inline-flex items-center justify-center min-h-[48px] px-7 py-3.5 rounded-[10px] border border-white/30 text-[#FFFEFA] font-semibold text-[15px] hover:bg-white/10 transition-colors"
            >
              Check your fare
            </a>
          </div>
          <p className="mt-5 text-[13.5px] text-[#FFFEFA]/70">
            {site.operatingHours} · {site.serviceArea}
          </p>
        </div>

        {/* Boarding-pass fare teaser: the single focal object. */}
        <aside aria-label="Fare preview" className="bg-[#FFFEFA] text-[#0E2A21] rounded-2xl p-6 md:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.35)] max-w-md w-full justify-self-end">
          <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-dashed border-[#D8C9AE]">
            <p className="font-semibold text-[15px]">The fare, upfront</p>
            <p className="text-[13px] text-[#3F382E]">Measured live from the map</p>
          </div>
          <dl className="py-4 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#3F382E]">Flat rate</dt>
              <dd className="font-bold">Rp 10.000 / km</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#3F382E]">Minimum fare</dt>
              <dd className="font-bold">Rp 65.000</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#3F382E]">Cabin</dt>
              <dd className="font-bold text-right">Private, cool, up to 3 dogs</dd>
            </div>
          </dl>
          <a
            href="#fare"
            className="flex items-center justify-center min-h-[48px] rounded-[10px] bg-[#0E2A21] text-[#FFFEFA] font-semibold text-[15px] hover:bg-[#16453a] transition-colors"
          >
            Price my ride below
          </a>
          <p className="mt-3 text-[13px] leading-relaxed text-[#3F382E]">
            Type two Bali addresses and the map measures the real driving distance. The WhatsApp message writes itself.
          </p>
        </aside>
      </div>
    </section>
  );
}
