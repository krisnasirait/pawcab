import React from "react";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: hospitality, not SaaS. About reads like a guesthouse note:
// photo dominates, text is short, quote is a real handler line.
// Sentence-case label, left aligned, one CTA.
export default function AboutSection() {
  const about = contentData.home.about;

  return (
    <section id="about" className="bg-[#0E2A21] text-[#FFFEFA] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-xl aspect-[4/5] max-h-[620px] w-full bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={about.image}
              alt="PawCab handler with a relaxed passenger"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figure className="absolute -bottom-5 left-5 right-5 md:left-8 md:right-auto md:max-w-sm rounded-xl bg-[#FFFEFA] text-[#0E2A21] p-5 shadow-xl">
            <blockquote className="text-[15px] leading-relaxed font-medium">
              “Traffic is stressful for dogs. So we drive like there is a sleeping puppy in the back. There usually is.”
            </blockquote>
            <figcaption className="mt-2 text-[13px] text-[#3F382E]">PawCab driving note, taped to every dashboard</figcaption>
          </figure>
        </div>

        <div className="order-1 lg:order-2 pb-6 lg:pb-0">
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#FFC61A] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#FFC61A]" />
            Why PawCab exists
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            Built for dogs who deserve the back seat.
          </h2>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-[#FFFEFA]/85 mt-5 max-w-lg">
            {about.description}
          </p>
          <div className="mt-8">
            <Button variant="primary" href={about.ctaHref || "/stories"}>
              {about.ctaText || "Meet our passengers"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
