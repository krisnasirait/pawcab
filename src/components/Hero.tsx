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
      className="bg-canvas pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">
          <div className="min-w-0">
            <p className="text-[15px] sm:text-[16px] text-ink">
              Private pet mobility across Bali
            </p>
            <h1
              id="hero-heading"
              className="font-normal text-navy text-[clamp(3.25rem,8vw,7rem)] leading-[1.02] tracking-[-0.02em] mt-6"
            >
              Calm rides for dogs who hate traffic.
            </h1>
            <p className="text-[16px] sm:text-[18px] leading-[1.55] text-ink max-w-lg mt-7">
              {hero.description} The fare follows the zone rate card, measured live from the map.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Button variant="primary" href={hero.primaryCtaHref}>
                {hero.primaryCtaText}
              </Button>
              <Button variant="outline" href="#fare">
                Check your fare
              </Button>
            </div>
            <p className="mt-7 text-[14px] sm:text-[15px] leading-relaxed text-ink">
              {site.serviceArea}
            </p>
          </div>

          <div className="min-w-0">
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-[28px] bg-sand">
              <Image
                src={hero.bgImage}
                alt="German Shepherd looking out of a PawCab SUV window with bamboo trees behind"
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        <aside
          aria-labelledby="hero-fare-heading"
          className="mt-12 sm:mt-16 border-t border-b border-navy/15 py-8 sm:py-10"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div>
              <h2 id="hero-fare-heading" className="font-medium text-[20px] leading-snug tracking-normal text-navy">
                The fare, upfront
              </h2>
              <p className="text-[14px] text-ink mt-1.5">Measured live from the map</p>
            </div>
            <dl className="text-[15px] sm:text-[16px]">
              <div>
                <dt className="text-ink">0 to 5 km</dt>
                <dd className="mt-1 font-semibold tabular-nums text-navy">
                  Rp 51.000 to 76.000
                </dd>
              </div>
            </dl>
            <dl className="text-[15px] sm:text-[16px]">
              <div>
                <dt className="text-ink">5.1 to 15 km</dt>
                <dd className="mt-1 font-semibold tabular-nums text-navy">
                  Rp 13.000 to 16.000 / km
                </dd>
              </div>
            </dl>
            <dl className="text-[15px] sm:text-[16px]">
              <div>
                <dt className="text-ink">Round trip</dt>
                <dd className="mt-1 font-semibold tabular-nums text-navy">
                  2 × one-way fare
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
