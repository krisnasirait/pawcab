import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DogWalkingPricing from "@/components/DogWalkingPricing";
import DogWalkingFAQ from "@/components/DogWalkingFAQ";
import { PiArrowRight, PiCamera, PiDog, PiDrop, PiHouse, PiPawPrint, PiTreePalm } from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "Dog Walking Services in Bali | The PawCab",
  description:
    "Little walks, big adventures. Safe, thoughtful neighborhood and beach dog walking in Bali tailored to your dog's pace and personality.",
  alternates: { canonical: "/services/dog-walking" },
  openGraph: { title: "Dog Walking Services in Bali | The PawCab", description: "Little walks, big adventures. Safe, thoughtful neighborhood and beach dog walking in Bali tailored to your dog's pace and personality.", url: "/services/dog-walking", type: "website" },
};

export default function DogWalkingPage() {
  const highlights = [
    {
      icon: <PiDog className="text-3xl text-midnight" />,
      title: "1-on-1 Attention",
      subtitle: "Up to 2 dogs only, no crowded packs",
    },
    {
      icon: <PiCamera className="text-3xl text-midnight" />,
      title: "Photo & Video Updates",
      subtitle: "Live moments sent to WhatsApp",
    },
    {
      icon: <PiDrop className="text-3xl text-midnight" />,
      title: "Hydration & Treats",
      subtitle: "Fresh water breaks & healthy snacks",
    },
    {
      icon: <PiPawPrint className="text-3xl text-midnight" />,
      title: "Clean Paws Return",
      subtitle: "Towel-dried and freshened up",
    },
  ];

  const walkOptions = [
    {
      id: "neighborhood",
      title: "Neighborhood Walk",
      description:
        "A relaxing walk around your home or villa, perfect for daily exercise and fresh air.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop",
      imageAlt: "Dogs walking happily on an outdoor path",
      icon: <PiHouse className="text-2xl text-midnight" />,
      badgeBg: "bg-warm-ivory",
    },
    {
      id: "beach",
      title: "Beach Walk",
      description:
        "A fun outdoor adventure with transportation to a suitable beach location.",
      image:
        "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1000&auto=format&fit=crop",
      imageAlt: "Dog joyfully running on a sunny beach near the ocean",
      icon: <PiTreePalm className="text-2xl text-midnight" />,
      badgeBg: "bg-warm-ivory",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-midnight flex flex-col selection:bg-pawcab-gold selection:text-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main data-ui="public" className="flex-grow bg-canvas">
        {/* ========================================================
            HERO / HEADER SECTION (With Unsplash Photo & Smooth Blend)
            ======================================================== */}
        <section className="w-full px-6 md:px-10 pt-12 md:pt-16 pb-12 md:pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-ink font-medium mb-8">
              <Link
                href="/"
                className="hover:text-midnight transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/#services"
                className="hover:text-midnight transition-colors"
              >
                Our Services
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">Pet Walking</span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Eyebrow Badge */}
              <div className="mb-4">
                <p className="tracking-[0.25em] text-xs md:text-sm text-ink font-semibold">
                  PET WALKING
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] text-navy font-normal leading-[1.08] tracking-tight mb-6">
                Little Walks, <br />
                Big Adventures.
              </h1>

              {/* Description */}
              <p className="text-ink font-normal text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Give your furry companion the opportunity to explore, exercise,
                and enjoy the outdoors. Our pet walking service is thoughtfully
                tailored to your dog&apos;s pace, personality, and needs,
                ensuring a safe and fun experience every time.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20Dog%20Walking%20session%20for%20my%20pet.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-midnight transition-colors duration-200 group"
                >
                  Book a Walk
                  <PiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </a>

                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 border border-midnight/30 text-midnight px-7 py-4 rounded-full font-medium text-sm hover:bg-midnight hover:text-soft-white transition-colors duration-200 bg-white/60"
                >
                  View Fares
                </a>
              </div>
            </div>
            </div>
            <div className="relative rounded-[28px] overflow-hidden bg-sand aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1782067128048-1e2f7c18bcf1?q=80&w=1170&auto=format&fit=crop"
                alt="Person walking happy dog outdoors on a leash"
                fetchPriority="high"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            WALK OPTIONS CARDS SECTION (Neighborhood Walk & Beach Walk)
            ======================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-warm-ivory">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {walkOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="bg-white rounded-[32px] overflow-hidden border border-sand-beige/40 transition-colors duration-200 group flex flex-col"
                >
                  {/* Top Image Container */}
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-sand-beige/20">
                    <img
                      src={opt.image}
                      alt={opt.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content Container with Overlapping Icon Badge */}
                  <div className="p-7 sm:p-9 pt-0 relative flex-grow flex flex-col justify-between">
                    {/* Floating Circular Badge Overlapping Image */}
                    <div className="-mt-8 mb-5 relative z-10 flex">
                      <div className="w-16 h-16 rounded-2xl bg-warm-ivory border-2 border-white flex items-center justify-center shrink-0 group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                        {opt.icon}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-normal text-midnight mb-3">
                        {opt.title}
                      </h3>
                      <p className="text-ink font-normal text-sm sm:text-base leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-sand-beige/30 flex items-center justify-between">
                      <span className="text-xs text-ink font-semibold">
                        1 Hour Duration
                      </span>
                      <a
                        href="#pricing"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-midnight group-hover:text-midnight transition-colors"
                      >
                        See Pricing <PiArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Walking care included" className="py-10 md:py-16 px-6 md:px-10 bg-canvas">
          <ul role="list" className="max-w-7xl mx-auto grid md:grid-cols-2 md:gap-x-16 border-t border-navy/20">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-5 py-7 md:py-9 border-b border-navy/20">
                <span aria-hidden="true" className="shrink-0 mt-1 text-navy [&>svg]:size-6">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink">
                    {item.subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ========================================================
            PRICING SECTION (Dog Walking Fares)
            ======================================================== */}
        <DogWalkingPricing />

        {/* ========================================================
            FAQ SECTION (Dog Walking FAQs)
            ======================================================== */}
        <DogWalkingFAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
