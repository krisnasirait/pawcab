import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PetTransportPricing from "@/components/PetTransportPricing";
import ZoneRateCard from "@/components/ZoneRateCard";
import PetTransportFAQ from "@/components/PetTransportFAQ";
import { PiArrowRight, PiCarProfile, PiCheckCircleFill, PiPawPrint, PiSnowflake, PiUser } from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "Private Pet Transportation | The PawCab Bali",
  description:
    "Safe, comfortable, and stress-free private pet transportation across Bali. Door-to-door rides for vet visits, grooming, airport transfers, and adventures.",
  alternates: { canonical: "/services/pet-transport" },
  openGraph: { title: "Private Pet Transportation | The PawCab Bali", description: "Safe, comfortable, and stress-free private pet transportation across Bali. Door-to-door rides for vet visits, grooming, airport transfers, and adventures.", url: "/services/pet-transport", type: "website" },
};

const defaultIcons = [
  <PiCarProfile key="1" className="text-3xl text-midnight" />,
  <PiSnowflake key="2" className="text-3xl text-midnight" />,
  <PiPawPrint key="3" className="text-3xl text-midnight" />,
  <PiUser key="4" className="text-3xl text-midnight" />,
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
      icon: <PiCarProfile className="text-3xl text-midnight" />,
      title: "Private Vehicle",
      subtitle: "Just for you and your pet",
    },
    {
      icon: <PiSnowflake className="text-3xl text-midnight" />,
      title: "Air-Conditioned",
      subtitle: "Comfortable in every journey",
    },
    {
      icon: <PiPawPrint className="text-3xl text-midnight" />,
      title: "Up to 3 Large Dogs",
      subtitle: "Spacious and safe",
    },
    {
      icon: <PiUser className="text-3xl text-midnight" />,
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
    <div className="min-h-screen bg-warm-ivory text-midnight flex flex-col selection:bg-pawcab-gold selection:text-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main data-ui="public" className="flex-grow bg-canvas">
        {/* ========================================================
            HERO / HEADER SECTION (With Unsplash Photo & Smooth Gradient)
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
              <span className="text-ink font-semibold">
                Pet Transportation
              </span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Badge */}
              <div className="mb-4">
                <p className="tracking-[0.25em] text-xs md:text-sm text-ink font-semibold">
                  {transport?.hero?.badge || "PRIVATE PET TRANSPORTATION"}
                </p>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] text-navy font-normal leading-[1.08] tracking-tight mb-6">
                {transport?.hero?.title || (
                  <>
                    A Private Ride <br />
                    Just for Your Pet.
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-ink font-medium text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {transport?.hero?.subtitle || "Safe, comfortable, and stress-free transportation for your beloved companions. Whether it's a vet appointment, grooming session, airport transfer, or a little adventure, we make sure your pets travel in comfort with a personal touch."}
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20would%20like%20to%20book%20a%20private%20pet%20transportation%20ride.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-midnight transition-colors duration-200 group"
                >
                  Book a Ride
                  <PiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </a>

                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 border border-midnight/30 text-midnight px-7 py-4 rounded-full font-medium text-sm hover:bg-midnight hover:text-soft-white transition-colors duration-200 bg-white/60"
                >
                  Check Zones & Rates
                </Link>
              </div>
            </div>
            </div>
            <div className="relative rounded-[28px] overflow-hidden bg-sand aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={transport?.hero?.heroImage || "https://images.unsplash.com/photo-1703828654117-112baa788e51?q=80&w=1170&auto=format&fit=crop"}
                alt="Golden retriever looking out car window"
                fetchPriority="high"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section aria-label="Private ride features" className="py-10 md:py-16 px-6 md:px-10 bg-canvas">
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
            COMFORT IN EVERY DETAIL (Image on Left, Card on Right)
            ======================================================== */}
        <section className="py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Crate Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-[32px] overflow-hidden border border-sand-beige/40 bg-sand-beige/20 aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] max-h-[580px] w-full group">
                  <Image
                    src="/images/pet-crate.jpg"
                    alt="Comfortable golden retriever inside safe car pet crate"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Content Card */}
              <div className="lg:col-span-6">
                <div className="bg-soft-white rounded-[32px] p-8 sm:p-10 md:p-12 border border-sand-beige/50">
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-normal text-midnight mb-4 leading-tight">
                    Comfort in Every Detail
                  </h2>

                  <p className="text-ink font-medium text-sm sm:text-base leading-relaxed mb-8">
                    Our vehicle is designed to provide a safe and enjoyable
                    travel experience for pets, with a clean, spacious, and
                    air-conditioned cabin. A medium-sized crate is available
                    upon request.
                  </p>

                  {/* Bullet Checklist */}
                  <ul className="space-y-4">
                    {comfortFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3.5">
                        <PiCheckCircleFill className="text-midnight text-xl shrink-0" />
                        <span className="text-midnight font-medium text-sm sm:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Quick booking link inside card */}
                  <div className="mt-10 pt-8 border-t border-sand-beige/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-ink font-semibold">
                        Custom arrangements?
                      </p>
                      <p className="text-xs text-ink font-medium mt-0.5">
                        Multiple stops or special care available
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20have%20a%20question%20about%20pet%20transportation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-midnight hover:text-pawcab-navy transition-colors"
                    >
                      Inquire Directly <PiArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PRICELIST (printed SERVICES & RATES card)
            ======================================================== */}
        <ZoneRateCard />

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
        {/* <section className="bg-navy text-white py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs text-navy font-semibold mb-2">
                Stress-Free Pet Mobility
              </p>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal">
                Ready for your pet&apos;s next comfortable ride?
              </h3>
              <p className="text-soft-white/70 font-medium text-sm mt-2 max-w-xl">
                Reserve your ride in advance. We pick up from your doorstep
                anywhere in Bali.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a
                href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20ride%20for%20my%20pet.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-accent text-navy px-8 py-4 rounded-full font-medium text-sm border-2 border-line hover:bg-accent-hover transition-colors duration-200"
              >
                <PiWhatsappLogo className="text-lg" />
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
