import React from "react";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: hospitality, not SaaS. About reads like a guesthouse note:
// photo dominates, text is short, quote is a real handler line.
// Forest band, lime serif, one CTA.
export default function AboutSection() {
  const about = contentData.home.about;

  return (
    <section id="about" className="bg-forest text-white py-16 md:py-24" data-surface="forest">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="rounded-[28px] overflow-hidden aspect-[4/5] max-h-[620px] w-full bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={about.image}
              alt="PawCab handler with a relaxed passenger"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figure className="relative z-10 -mt-8 mx-4 md:mx-6 md:max-w-sm rounded-2xl bg-white text-forest p-5 border border-forest/20">
            <blockquote className="text-[15px] leading-[1.45] font-medium">
              “Traffic is stressful for dogs. So we drive like there is a sleeping puppy in the back. There usually is.”
            </blockquote>
            <figcaption className="mt-2.5 text-[13px] text-ink">PawCab driving note, taped to every dashboard</figcaption>
          </figure>
        </div>

        <div className="order-1 lg:order-2 pb-6 lg:pb-16">
          <p className="flex items-center gap-3 text-[14px] font-medium text-accent mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-accent" />
            Why PawCab exists
          </p>
          <h2 className="text-4xl md:text-[56px] leading-[1.05] font-normal text-accent">
            Built for dogs who deserve the back seat.
          </h2>
          <p className="text-[17px] md:text-[18px] leading-[1.55] text-white/85 mt-5 max-w-lg">
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
