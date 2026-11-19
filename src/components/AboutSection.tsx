import React from "react";
import Button from "./Button";
import { BsArrowRight } from "react-icons/bs";
import contentData from "@/lib/content";

export default function AboutSection() {
  const about = contentData.home.about;

  return (
    <section id="about" className="relative w-full py-16 md:py-18 px-6 md:px-10 overflow-hidden bg-warm-ivory">
      {/* Background Image on the Right */}
      <div className="absolute z-10 right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[56%] h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={about.image}
          alt={about.headingLine1 + " " + about.headingLine2}
          className="w-full h-full object-cover object-center"
        />
        {/* Soft edge blend gradient on the left edge of the image */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(to right, #F7F2E8 0%, rgba(247, 242, 232, 0.95) 12%, rgba(247, 242, 232, 0.6) 24%, rgba(247, 242, 232, 0) 42%)",
          }}
        />
        {/* Mobile overlay */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247, 242, 232, 0.96) 0%, rgba(247, 242, 232, 0.85) 50%, rgba(247, 242, 232, 0.2) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 lg:w-5/12">
          <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-warm-taupe font-semibold mb-3">
            {about.badge}
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            {about.headingLine1} <br /> {about.headingLine2}
          </h2>
          <p className="text-sm md:text-base font-normal leading-relaxed mb-6 text-warm-taupe">
            {about.description}
          </p>
          <Button variant="secondary" icon={<BsArrowRight aria-hidden="true" />} href={about.ctaHref || "/stories"}>
            {about.ctaText}
          </Button>
        </div>
      </div>

      {/* Bottom Text: sits over the photo, so it carries its own scrim. */}
      <div className="absolute bottom-10 right-10 text-right z-10 hidden md:block">
        <p className="bg-deep-midnight/55 rounded-2xl px-5 py-3 text-soft-white font-medium tracking-[0.2em] leading-loose text-base">
          {about.bottomQuoteLines?.map((line, i) => (
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
