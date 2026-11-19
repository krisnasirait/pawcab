import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DogWalkingPricing from "@/components/DogWalkingPricing";
import DogWalkingFAQ from "@/components/DogWalkingFAQ";
import { BsArrowRight } from "react-icons/bs";
import {
  PiHouse,
  PiTreePalm,
  PiDog,
  PiCamera,
  PiDrop,
  PiPawPrint,
} from "react-icons/pi";

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
      icon: <PiDog className="text-3xl text-deep-midnight" />,
      title: "1-on-1 Attention",
      subtitle: "Up to 2 dogs only, no crowded packs",
    },
    {
      icon: <PiCamera className="text-3xl text-deep-midnight" />,
      title: "Photo & Video Updates",
      subtitle: "Live moments sent to WhatsApp",
    },
    {
      icon: <PiDrop className="text-3xl text-deep-midnight" />,
      title: "Hydration & Treats",
      subtitle: "Fresh water breaks & healthy snacks",
    },
    {
      icon: <PiPawPrint className="text-3xl text-deep-midnight" />,
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
      icon: <PiHouse className="text-2xl text-deep-midnight" />,
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
      icon: <PiTreePalm className="text-2xl text-deep-midnight" />,
      badgeBg: "bg-warm-ivory",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-midnight flex flex-col selection:bg-pawcab-gold selection:text-deep-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main className="flex-grow">
        {/* ========================================================
            HERO / HEADER SECTION (With Unsplash Photo & Smooth Blend)
            ======================================================== */}
        <section className="relative min-h-[620px] lg:min-h-[680px] w-full flex items-center pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-10 overflow-hidden bg-warm-ivory">
          {/* Background Image on the Right */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] lg:w-[54%] h-full">
            <img
              src="https://images.unsplash.com/photo-1782067128048-1e2f7c18bcf1?q=80&w=1170&auto=format&fit=crop"
              alt="Person walking happy dog outdoors on a leash"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft edge blend gradient on the left edge into warm-ivory */}
            <div
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                background:
                  "linear-gradient(to right, #F7F2E8 0%, rgba(247, 242, 232, 0.95) 15%, rgba(247, 242, 232, 0.6) 30%, rgba(247, 242, 232, 0) 48%)",
              }}
            />
            {/* Mobile overlay for 100% text readability */}
            <div
              className="absolute inset-0 pointer-events-none md:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(247, 242, 232, 0.97) 0%, rgba(247, 242, 232, 0.88) 55%, rgba(247, 242, 232, 0.25) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-warm-taupe font-medium mb-8">
              <Link
                href="/"
                className="hover:text-deep-midnight transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/#services"
                className="hover:text-deep-midnight transition-colors"
              >
                Our Services
              </Link>
              <span>/</span>
              <span className="text-warm-taupe font-semibold">Pet Walking</span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-pawcab-gold inline-block" />
                <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                  PET WALKING
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-deep-midnight font-bold leading-[1.14] tracking-tight mb-6">
                Little Walks, <br />
                Big Adventures.
              </h1>

              {/* Description */}
              <p className="text-warm-taupe font-normal text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Give your furry companion the opportunity to explore, exercise,
                and enjoy the outdoors. Our pet walking service is thoughtfully
                tailored to your dog&apos;s pace, personality, and needs,
                ensuring a safe and fun experience every time.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20Dog%20Walking%20session%20for%20my%20pet."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-deep-midnight text-soft-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-pawcab-navy transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  Book a Walk
                  <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-all duration-300 bg-warm-ivory/60 backdrop-blur-sm"
                >
                  View Fares
                </a>
              </div>
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
                  className="bg-white rounded-3xl overflow-hidden border border-sand-beige/40 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  {/* Top Image Container */}
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-sand-beige/20">
                    <img
                      src={opt.image}
                      alt={opt.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content Container with Overlapping Icon Badge */}
                  <div className="p-7 sm:p-9 pt-0 relative flex-grow flex flex-col justify-between">
                    {/* Floating Circular Badge Overlapping Image */}
                    <div className="-mt-8 mb-5 relative z-10 flex">
                      <div className="w-16 h-16 rounded-2xl bg-warm-ivory border-2 border-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {opt.icon}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-deep-midnight mb-3">
                        {opt.title}
                      </h3>
                      <p className="text-warm-taupe font-normal text-sm sm:text-base leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-sand-beige/30 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-warm-taupe font-semibold">
                        1 Hour Duration
                      </span>
                      <a
                        href="#pricing"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-deep-midnight group-hover:text-pawcab-navy transition-colors"
                      >
                        See Pricing <BsArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FEATURE HIGHLIGHTS ROW (4 Columns with Circular Icons)
            ======================================================== */}
        <section
          className="relative py-16 md:py-20 px-6 md:px-10 overflow-hidden bg-white"
          style={{
            background:
              "linear-gradient(180deg, #F7F2E8 0%, rgba(255, 255, 255, 0.85) 15%, #FFFFFF 28%, #FFFFFF 72%, rgba(255, 255, 255, 0.85) 85%, #F7F2E8 100%)",
          }}
        >
          {/* Top Smooth Gradient Overlay */}
          <div
            className="absolute inset-x-0 top-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, #F7F2E8 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* Bottom Smooth Gradient Overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #F7F2E8 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-3 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-warm-ivory/80 flex items-center justify-center mb-4 shadow-sm border border-sand-beige/40">
                    {item.icon}
                  </div>
                  <h3 className="font-playfair text-lg md:text-xl font-bold text-deep-midnight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-warm-taupe font-normal max-w-[200px]">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
