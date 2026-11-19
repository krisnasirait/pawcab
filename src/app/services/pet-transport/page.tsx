import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PetTransportPricing from "@/components/PetTransportPricing";
import PetTransportFAQ from "@/components/PetTransportFAQ";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import { PiCarProfile, PiSnowflake, PiPawPrint, PiUser } from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "Private Pet Transportation | The PawCab Bali",
  description:
    "Safe, comfortable, and stress-free private pet transportation across Bali. Door-to-door rides for vet visits, grooming, airport transfers, and adventures.",
  alternates: { canonical: "/services/pet-transport" },
  openGraph: { title: "Private Pet Transportation | The PawCab Bali", description: "Safe, comfortable, and stress-free private pet transportation across Bali. Door-to-door rides for vet visits, grooming, airport transfers, and adventures.", url: "/services/pet-transport", type: "website" },
};

const defaultIcons = [
  <PiCarProfile key="1" className="text-3xl text-deep-midnight" />,
  <PiSnowflake key="2" className="text-3xl text-deep-midnight" />,
  <PiPawPrint key="3" className="text-3xl text-deep-midnight" />,
  <PiUser key="4" className="text-3xl text-deep-midnight" />,
];

export default function PetTransportPage() {
  const transport = contentData.servicesPages?.petTransport;
  const rawHighlights = transport?.highlights || [];

  const highlights = rawHighlights.length > 0 ? rawHighlights.map((h, idx) => ({
    icon: defaultIcons[idx % defaultIcons.length],
    title: h.title,
    subtitle: h.subtitle,
  })) : [
    {
      icon: <PiCarProfile className="text-3xl text-deep-midnight" />,
      title: "Private Vehicle",
      subtitle: "Just for you and your pet",
    },
    {
      icon: <PiSnowflake className="text-3xl text-deep-midnight" />,
      title: "Air-Conditioned",
      subtitle: "Comfortable in every journey",
    },
    {
      icon: <PiPawPrint className="text-3xl text-deep-midnight" />,
      title: "Up to 3 Large Dogs",
      subtitle: "Spacious and safe",
    },
    {
      icon: <PiUser className="text-3xl text-deep-midnight" />,
      title: "Owner Can Join",
      subtitle: "You're welcome to come along",
    },
  ];

  const comfortFeatures = transport?.comfortFeatures && transport.comfortFeatures.length > 0 ? transport.comfortFeatures : [
    "Clean and well-maintained vehicle",
    "Pet-friendly and comfortable interior",
    "Medium crate available",
    "Regular sanitization",
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-midnight flex flex-col selection:bg-pawcab-gold selection:text-deep-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main className="flex-grow">
        {/* ========================================================
            HERO / HEADER SECTION (With Unsplash Photo & Smooth Gradient)
            ======================================================== */}
        <section className="relative min-h-[600px] lg:min-h-[660px] w-full flex items-center pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-10 overflow-hidden bg-warm-ivory">
          {/* Background Image on the Right */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[56%] h-full">
            <img
              src={transport?.hero?.heroImage || "https://images.unsplash.com/photo-1703828654117-112baa788e51?q=80&w=1170&auto=format&fit=crop"}
              alt="Golden retriever looking out car window"
              fetchPriority="high"
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
              <span className="text-warm-taupe font-semibold">
                Pet Transportation
              </span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-pawcab-gold inline-block" />
                <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                  {transport?.hero?.badge || "PRIVATE PET TRANSPORTATION"}
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-deep-midnight font-bold leading-[1.12] tracking-tight mb-6">
                {transport?.hero?.title || (
                  <>
                    A Private Ride <br />
                    Just for Your Pet.
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-warm-taupe font-medium text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {transport?.hero?.subtitle || "Safe, comfortable, and stress-free transportation for your beloved companions. Whether it's a vet appointment, grooming session, airport transfer, or a little adventure, we make sure your pets travel in comfort with a personal touch."}
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/?text=Hi%20PawCab,%20I%20would%20like%20to%20book%20a%20private%20pet%20transportation%20ride."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-deep-midnight text-soft-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-pawcab-navy transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  Book a Ride
                  <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                <Link
                  href="/#coverage"
                  className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-all duration-300 bg-warm-ivory/60 backdrop-blur-sm"
                >
                  Check Zones & Rates
                </Link>
              </div>
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
                  <p className="text-xs md:text-sm text-warm-taupe font-medium max-w-[200px]">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            COMFORT IN EVERY DETAIL (Image on Left, Card on Right)
            ======================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Crate Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-sand-beige/40 bg-sand-beige/20 aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] max-h-[580px] w-full group">
                  <Image
                    src="/images/pet-crate.jpg"
                    alt="Comfortable golden retriever inside safe car pet crate"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Content Card */}
              <div className="lg:col-span-6">
                <div className="bg-soft-white rounded-3xl p-8 sm:p-10 md:p-12 shadow-sm border border-sand-beige/50">
                  <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-deep-midnight mb-4 leading-tight">
                    Comfort in Every Detail
                  </h2>

                  <p className="text-warm-taupe font-medium text-sm sm:text-base leading-relaxed mb-8">
                    Our vehicle is designed to provide a safe and enjoyable
                    travel experience for pets, with a clean, spacious, and
                    air-conditioned cabin. A medium-sized crate is available
                    upon request.
                  </p>

                  {/* Bullet Checklist */}
                  <ul className="space-y-4">
                    {comfortFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3.5">
                        <BsCheckCircleFill className="text-deep-midnight text-xl shrink-0" />
                        <span className="text-deep-midnight font-medium text-sm sm:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Quick booking link inside card */}
                  <div className="mt-10 pt-8 border-t border-sand-beige/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-warm-taupe font-semibold">
                        Custom arrangements?
                      </p>
                      <p className="text-xs text-warm-taupe font-medium mt-0.5">
                        Multiple stops or special care available
                      </p>
                    </div>
                    <a
                      href="https://wa.me/?text=Hi%20PawCab,%20I%20have%20a%20question%20about%20pet%20transportation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep-midnight hover:text-pawcab-navy transition-colors"
                    >
                      Inquire Directly <BsArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PRICING SECTION (Zone-Based Fare & Maps)
            ======================================================== */}
        <PetTransportPricing />

        {/* ========================================================
            FAQ SECTION (Pet Transport FAQs)
            ======================================================== */}
        <PetTransportFAQ />

        {/* ========================================================
            BOTTOM CALL TO ACTION BANNER
            ======================================================== */}
        {/* <section className="bg-deep-midnight text-soft-white py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-pawcab-gold font-semibold mb-2">
                Stress-Free Pet Mobility
              </p>
              <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold">
                Ready for your pet&apos;s next comfortable ride?
              </h3>
              <p className="text-soft-white/70 font-medium text-sm mt-2 max-w-xl">
                Reserve your ride in advance. We pick up from your doorstep
                anywhere in Bali.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a
                href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20ride%20for%20my%20pet."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-pawcab-gold text-deep-midnight px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-lg"
              >
                <BsWhatsapp className="text-lg" />
                Book via WhatsApp
              </a>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
