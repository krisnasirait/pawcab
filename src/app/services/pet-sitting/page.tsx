import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PetSittingFAQ from "@/components/PetSittingFAQ";
import { PiArrowRight, PiBowlFood, PiCheckCircleFill, PiClock, PiHouse, PiMapPin, PiPawPrint, PiShieldCheck, PiTennisBall, PiWhatsappLogo } from "react-icons/pi";
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
      title: "Share Your Details",
      desc: "Tell us your location, preferred dates, and your pet's needs.",
    },
    {
      num: 2,
      title: "Get a Quotation",
      desc: "We'll provide a personalized quote based on your request.",
    },
    {
      num: 3,
      title: "Confirm Booking",
      desc: "Once confirmed, our team will take care of the rest.",
    },
    {
      num: 4,
      title: "We Take Care",
      desc: "Your pet will receive loving care while you're away.",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-midnight flex flex-col selection:bg-pawcab-gold selection:text-deep-midnight">
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
              <div className="mb-4">
                <p className="tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                  PET SITTING
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-[56px] text-forest font-normal leading-[1.08] tracking-tight mb-6">
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
                  href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent("Hi PawCab, I would like a quote for in-home pet sitting. Location: ... Pets: ... Dates: ...")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-forest text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-deepgreen transition-colors duration-200 group"
                >
                  Request a Quote
                  <PiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-medium text-sm hover:bg-deep-midnight hover:text-soft-white transition-colors duration-200 bg-white/60"
                >
                  How It Works
                </a>
              </div>
            </div>
            </div>
            <div className="relative rounded-[28px] overflow-hidden bg-sage aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1455287278107-115faab3eafa?q=80&w=1171&auto=format&fit=crop"
                alt="Golden retriever dog resting comfortably at home on a bed"
                fetchPriority="high"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section aria-label="In-home sitting care" className="py-10 md:py-16 px-6 md:px-10 bg-canvas">
          <ul role="list" className="max-w-7xl mx-auto grid md:grid-cols-2 md:gap-x-16 border-t border-forest/20">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-5 py-7 md:py-9 border-b border-forest/20">
                <span aria-hidden="true" className="shrink-0 mt-1 text-forest [&>svg]:size-6">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest mb-2">
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
            PERSONALIZED CARE SECTION (Image Left, Content Card Right)
            ======================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-warm-ivory">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-[32px] overflow-hidden border border-sand-beige/40 bg-sand-beige/20 aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full group">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1200&auto=format&fit=crop"
                    alt="Caregiver petting a happy calm pet at home"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Card */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-[32px] p-8 sm:p-10 md:p-12 border border-sand-beige/40">
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-normal text-deep-midnight mb-4 leading-tight">
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
                        <PiCheckCircleFill className="text-deep-midnight text-xl shrink-0" />
                        <span className="text-deep-midnight font-medium text-sm sm:text-base">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-sand-beige/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-warm-taupe font-semibold">
                        Ready to book sitting?
                      </p>
                      <p className="text-xs text-warm-taupe font-normal mt-0.5">
                        Drop-in visits & multi-day care available
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent("Hi PawCab, I would like a quote for in-home pet sitting. Location: ... Pets: ... Dates: ...")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-deep-midnight hover:text-pawcab-navy transition-colors"
                    >
                      Request a Quote <PiArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SITTING RATES (quote factors, no invented prices)
            ======================================================== */}
        <section id="rates" aria-labelledby="sitting-rates-heading" className="py-16 md:py-24 px-6 md:px-10 bg-sagewash scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20 items-start">
              <div>
                <p className="text-sm font-medium text-forest mb-4">Sitting rates</p>
                <h2 id="sitting-rates-heading" className="font-display text-4xl md:text-[52px] text-forest font-normal leading-[1.08] mb-5">
                  Priced around your pet, not a package
                </h2>
                <p className="text-ink text-base md:text-lg leading-relaxed max-w-sm">
                  Every sitting booking is quoted on three things. Tell us those
                  three and you get one number back on WhatsApp.
                </p>
              </div>

              <ul role="list" className="border-t border-forest/25">
                {[
                  {
                    title: "Location",
                    desc: "Where in Bali your pet stays. Travel time to your gate is part of the quote.",
                    icon: <PiMapPin className="size-6" />,
                  },
                  {
                    title: "Number of pets",
                    desc: "One pet or a full household, cats and dogs both.",
                    icon: <PiPawPrint className="size-6" />,
                  },
                  {
                    title: "Duration",
                    desc: "A single visit, a full day, an overnight, or several days in a row.",
                    icon: <PiClock className="size-6" />,
                  },
                ].map((factor) => (
                  <li key={factor.title} className="flex items-start gap-5 py-7 md:py-8 border-b border-forest/25">
                    <span aria-hidden="true" className="shrink-0 mt-1 text-forest">
                      {factor.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest mb-2">
                        {factor.title}
                      </h3>
                      <p className="text-base leading-relaxed text-ink max-w-prose">{factor.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 md:mt-14 pt-8 border-t border-forest/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="text-base leading-relaxed text-ink max-w-2xl">
                Multi-day stays, medication routines and nervous pets are all
                fine. Send the dates, the address and how many pets, and we reply
                with a personalised quotation.
              </p>
              <a
                href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent("Hi PawCab, I would like a pet sitting quote. Location: ... Pets: ... Dates: ...")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2.5 bg-accent text-forest px-7 py-3.5 min-h-[48px] rounded-full font-medium text-[15px] border-2 border-line hover:bg-accent-hover transition-colors duration-200"
              >
                <PiWhatsappLogo className="text-base" aria-hidden="true" />
                Request a Quote
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS SECTION (4 Steps)
            ======================================================== */}
        <section
          id="how-it-works"
          aria-labelledby="sitting-process-heading"
          className="py-16 md:py-24 px-6 md:px-10 bg-surface scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <h2 id="sitting-process-heading" className="font-display text-4xl md:text-[52px] text-forest font-normal leading-[1.08] mb-10 md:mb-12">
              How It Works
            </h2>

            <ol role="list" className="border-t border-forest/25">
              {steps.map((step) => (
                <li
                  key={step.num}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-5 md:gap-x-8 gap-y-2 items-baseline py-7 md:py-8 border-b border-forest/25"
                >
                  <span aria-hidden="true" className="text-xl font-medium tabular-nums text-deepgreen">
                    {step.num}
                  </span>
                  <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest">
                    {step.title}
                  </h3>
                  <p className="col-start-2 md:col-start-3 text-base leading-relaxed text-ink max-w-prose">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 md:mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest mb-3">
                  Ready to arrange care for your pet?
                </h3>
                <p className="text-ink text-base leading-relaxed">
                  Let us know your dates and location for an instant quote.
                </p>
              </div>
              <a
                href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent("Hi PawCab, I would like a quote for in-home pet sitting. Location: ... Pets: ... Dates: ...")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2.5 bg-forest text-white hover:bg-deepgreen min-h-12 px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
              >
                Request a Quote
                <PiArrowRight aria-hidden="true" className="text-base" />
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
