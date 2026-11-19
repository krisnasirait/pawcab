import React from "react";
import Image from "next/image";
import Button from "./Button";
import { BsArrowRight } from "react-icons/bs";
import contentData from "@/lib/content";

export default function Hero() {
  const hero = contentData.home.hero;

  return (
    <section className="relative h-screen min-h-[650px] w-full flex flex-col justify-between bg-deep-midnight px-6 md:px-10 overflow-hidden">
      {/* Background photo: the product in its real setting. The gradient is
          a readability scrim, not decoration: white text sits on the dark
          left half, and a bottom fade carries the closing quote. */}
      <Image
        src={hero.bgImage}
        alt="Dog riding calmly in The PawCab pet taxi in Bali"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-deep-midnight/70 via-deep-midnight/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep-midnight/70 via-transparent to-transparent"
      />

      {/* Main Content Area aligned with Navbar max-w-7xl */}
      <div className="relative z-10 flex-grow flex items-center max-w-7xl mx-auto w-full pt-20">
        <div className="max-w-lg text-soft-white mt-8 md:mt-12">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-3 font-medium">
            {hero.badge}
          </p>
          <h1 className="font-semibold text-5xl md:text-6xl text-white lg:text-7xl leading-tight mb-5">
            {hero.title1} <br />
            {hero.title2} <br />
            <span className="italic text-pawcab-gold">{hero.title3Accent}</span>
          </h1>
          <p className="text-base md:text-lg font-normal leading-relaxed mb-8 max-w-sm md:max-w-md text-soft-white/90">
            {hero.description}
          </p>
          <Button variant="primary" icon={<BsArrowRight aria-hidden="true" />} href={hero.primaryCtaHref}>
            {hero.primaryCtaText}
          </Button>
        </div>
      </div>

      {/* Bottom Text aligned with Navbar width */}
      <div className="relative z-10 max-w-8xl mx-auto w-full pb-10 hidden md:flex justify-end pointer-events-none">
        <p className="text-soft-white/80 font-medium tracking-[0.2em] leading-loose text-sm uppercase text-right">
          {hero.bottomQuoteLines?.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
