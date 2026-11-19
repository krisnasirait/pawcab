import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PetSittingFAQ from "@/components/PetSittingFAQ";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import {
  PiHouse,
  PiBowlFood,
  PiTennisBall,
  PiShieldCheck,
  PiFileText,
  PiChatCircleDots,
  PiCalendarCheck,
  PiHeart,
} from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "In-Home Pet Sitting in Bali | The PawCab",
  description:
    "Loving care, right at home. In-home pet sitting in Bali allowing your pets to stay comfortable in their familiar environment with personalized routines.",
  alternates: { canonical: "/services/pet-sitting" },
  openGraph: { title: "In-Home Pet Sitting in Bali | The PawCab", description: "Loving care, right at home. In-home pet sitting in Bali allowing your pets to stay comfortable in their familiar environment with personalized routines.", url: "/services/pet-sitting", type: "website" },
};

const defaultHighlightIcons = [
  <PiHouse key="1" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiBowlFood key="2" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiTennisBall key="3" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiShieldCheck key="4" className="text-2xl sm:text-3xl text-deep-midnight" />,
];

export default function PetSittingPage() {
  const petSitting = contentData.servicesPages?.petSitting;
  const rawHighlights = petSitting?.highlights || [];

  const highlights = rawHighlights.length > 0 ? rawHighlights.map((h, idx) => ({
    icon: defaultHighlightIcons[idx % defaultHighlightIcons.length],
    title: h.title,
    subtitle: h.subtitle,
  })) : [
    {
      icon: <PiHouse className="text-2xl sm:text-3xl text-deep-midnight" />,
      title: "In-Home Care",
      subtitle: "In your house, villa, or accommodation",
    },
    {
      icon: <PiBowlFood className="text-2xl sm:text-3xl text-deep-midnight" />,
      title: "Feeding & Fresh Water",
      subtitle: "Based on your pet's routine",
    },
    {
      icon: (
        <PiTennisBall className="text-2xl sm:text-3xl text-deep-midnight" />
      ),
      title: "Playtime & Companionship",
      subtitle: "Personalized attention",
    },
    {
      icon: (
        <PiShieldCheck className="text-2xl sm:text-3xl text-deep-midnight" />
      ),
      title: "Peace of Mind",
      subtitle: "Regular updates and photos",
    },
  ];

  const careFeatures: string[] = [
    "Care tailored to your pet's needs",
    "Feeding and fresh water",
    "Playtime and companionship",
    "Home environment kept tidy",
    "Regular updates and photos",
  ];

  const steps = [
    {
      num: 1,
      icon: <PiFileText className="text-2xl text-deep-midnight" />,
      title: "Share Your Details",
      desc: "Tell us your location, preferred dates, and your pet's needs.",
    },
    {
      num: 2,
      icon: <PiChatCircleDots className="text-2xl text-deep-midnight" />,
      title: "Get a Quotation",
      desc: "We'll provide a personalized quote based on your request.",
    },
    {
      num: 3,
      icon: <PiCalendarCheck className="text-2xl text-deep-midnight" />,
      title: "Confirm Booking",
      desc: "Once confirmed, our team will take care of the rest.",
    },
    {
      num: 4,
      icon: <PiHeart className="text-2xl text-deep-midnight" />,
      title: "We Take Care",
      desc: "Your pet will receive loving care while you're away.",
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
              src="https://images.unsplash.com/photo-1455287278107-115faab3eafa?q=80&w=1171&auto=format&fit=crop"
              alt="Golden retriever dog resting comfortably at home on a bed"
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
              <span className="text-warm-taupe font-semibold">Pet Sitting</span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-pawcab-gold inline-block" />
                <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                  PET SITTING
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-deep-midnight font-bold leading-[1.14] tracking-tight mb-6">
                Loving Care, <br />
                Right at Home.
              </h1>

              {/* Description */}
              <p className="text-warm-taupe font-normal text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Our in-home pet sitting service allows your beloved companions
                to stay happy and comfortable in their familiar environment.
                From feeding and playtime to everyday care, we provide
                personalized attention based on your pet&apos;s unique routine
                and needs.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-deep-midnight text-soft-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-pawcab-navy transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  Request a Quote
                  <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-all duration-300 bg-warm-ivory/60 backdrop-blur-sm"
                >
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HIGHLIGHTS ROW (4 Columns with Circular Icons)
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
            PERSONALIZED CARE SECTION (Image Left, Content Card Right)
            ======================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-warm-ivory">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-sand-beige/40 bg-sand-beige/20 aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full group">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1200&auto=format&fit=crop"
                    alt="Caregiver petting a happy calm pet at home"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Card */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-3xl p-8 sm:p-10 md:p-12 shadow-sm border border-sand-beige/40">
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-deep-midnight mb-4 leading-tight">
                    Personalized Care
                  </h2>

                  <p className="text-warm-taupe font-normal text-sm sm:text-base leading-relaxed mb-8">
                    We focus on maintaining your pet&apos;s routine and comfort,
                    so they feel safe and loved while you&apos;re away.
                  </p>

                  {/* Bullet Checklist */}
                  <ul className="space-y-4 mb-8">
                    {careFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3.5">
                        <BsCheckCircleFill className="text-deep-midnight text-xl shrink-0" />
                        <span className="text-deep-midnight font-medium text-sm sm:text-base">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-sand-beige/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-warm-taupe font-semibold">
                        Ready to book sitting?
                      </p>
                      <p className="text-xs text-warm-taupe font-normal mt-0.5">
                        Drop-in visits & multi-day care available
                      </p>
                    </div>
                    <a
                      href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep-midnight hover:text-pawcab-navy transition-colors"
                    >
                      Request a Quote <BsArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS SECTION (4 Steps)
            ======================================================== */}
        <section
          id="how-it-works"
          className="py-20 md:py-28 px-6 md:px-10 bg-soft-white border-t border-sand-beige/40"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-14 md:mb-16">
              <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight font-bold leading-tight">
                How It Works
              </h2>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-sand-beige/30 shadow-xs hover:shadow-md transition-all duration-300 group"
                >
                  {/* Circular Icon Badge */}
                  <div className="w-16 h-16 rounded-full bg-warm-ivory flex items-center justify-center mb-5 shadow-xs border border-sand-beige/40 group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <span className="font-playfair text-xl font-bold text-deep-midnight mb-2">
                    {step.num}
                  </span>

                  {/* Step Title */}
                  <h3 className="font-playfair text-lg font-bold text-deep-midnight mb-2">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-warm-taupe font-normal leading-relaxed max-w-[220px]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Banner inside How It Works */}
            <div className="max-w-4xl mx-auto bg-warm-ivory rounded-3xl p-8 sm:p-10 border border-sand-beige/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight mb-1">
                  Ready to arrange care for your pet?
                </h3>
                <p className="text-warm-taupe font-normal text-sm">
                  Let us know your dates and location for an instant quote.
                </p>
              </div>
              <a
                href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting."
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2.5 bg-deep-midnight text-soft-white hover:bg-pawcab-navy px-8 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                Request a Quote
                <BsArrowRight className="text-sm" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================
            FAQ SECTION (Pet Sitting FAQs)
            ======================================================== */}
        <PetSittingFAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
