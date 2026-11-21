import React from "react";
import Image from "next/image";
import Button from "./Button";
import contentData from "@/lib/content";

export default function Hero() {
  const hero = contentData.home.hero;
  const site = contentData.site;

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-canvas pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-14"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-9 sm:gap-12 lg:gap-14 items-center">
          <div className="max-w-xl">
            <p className="text-[14px] sm:text-[15px] font-medium text-deepgreen mb-5 sm:mb-6">
              Private pet mobility across Bali
            </p>
            <h1
              id="hero-heading"
              className="font-normal text-forest text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.02em] mb-6"
            >
              Calm rides for dogs who hate traffic.
            </h1>
            <p className="text-[17px] sm:text-[18px] leading-[1.55] text-ink max-w-lg">
              {hero.description} The fare follows the zone rate card, measured live from the map.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-7 sm:mt-8">
              <Button variant="primary" href={hero.primaryCtaHref}>
                {hero.primaryCtaText}
              </Button>
              <a
                href="#fare"
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-full border-2 border-forest text-forest font-medium text-[16px] hover:bg-forest hover:text-on-dark transition-colors"
              >
                Check your fare
              </a>
            </div>
            <p className="mt-6 text-[13px] sm:text-[14px] leading-relaxed text-ink max-w-sm">
              {site.serviceArea}
            </p>
          </div>

          <div className="relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-[6/5] rounded-[28px] overflow-hidden bg-sage group">
            <Image
              src={hero.bgImage}
              alt="Dog looking out of a car window"
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1280px) 608px, (min-width: 1024px) 48vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
              className="object-cover object-[60%_center] transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        </div>

        <aside
          aria-labelledby="hero-fare-heading"
          className="mt-10 sm:mt-12 lg:mt-14 pt-6 sm:pt-7 border-t border-forest/25"
        >
          <div className="grid lg:grid-cols-[0.9fr_2fr] gap-6 lg:gap-10">
            <div>
              <h2 id="hero-fare-heading" className="font-text font-medium text-[18px] leading-snug tracking-normal">
                The fare, upfront
              </h2>
              <p className="text-[13px] text-ink mt-1.5">Measured live from the map</p>
            </div>
            <dl className="grid sm:grid-cols-3 gap-4 sm:gap-5 text-[14px]">
              <div className="flex justify-between items-baseline gap-4 sm:block">
                <dt className="text-ink">0 to 5 km</dt>
                <dd className="font-medium text-forest sm:mt-2 text-right sm:text-left">
                  Rp 50.000 to 75.000
                </dd>
              </div>
              <div className="flex justify-between items-baseline gap-4 sm:block">
                <dt className="text-ink">5.1 to 15 km</dt>
                <dd className="font-medium text-forest sm:mt-2 text-right sm:text-left">
                  Rp 12.000 to 15.000 / km
                </dd>
              </div>
              <div className="flex justify-between items-baseline gap-4 sm:block">
                <dt className="text-ink">Round trip waiting</dt>
                <dd className="font-medium text-forest sm:mt-2 text-right sm:text-left">
                  Rp 15.000 / hour
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-4 border-t border-forest/15">
            <p className="text-[13px] leading-relaxed text-ink max-w-2xl">
              Type two Bali addresses and the map measures the real driving distance. The WhatsApp message writes itself.
            </p>
            <a
              href="#fare"
              className="inline-flex items-center min-h-[44px] shrink-0 self-start font-medium text-[14px] text-forest underline underline-offset-4 decoration-forest/50 hover:decoration-forest rounded-sm"
            >
              Price my ride below
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
