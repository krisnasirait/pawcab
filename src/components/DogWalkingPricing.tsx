import React from "react";
import { BsArrowRight, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import { PiPawPrint, PiTreePalm } from "react-icons/pi";
import contentData from "@/lib/content";

const planIcons: Record<string, React.ReactNode> = {
  neighborhood: <PiPawPrint className="text-2xl text-deep-midnight" />,
  beach: <PiTreePalm className="text-2xl text-deep-midnight" />,
};

export default function DogWalkingPricing() {
  const cmsPlans = contentData.servicesPages?.dogWalking?.pricingPlans;

  const plans = cmsPlans && cmsPlans.length > 0 ? cmsPlans.map((p) => ({
    id: p.id,
    icon: planIcons[p.id] || <PiPawPrint className="text-2xl text-deep-midnight" />,
    title: p.title,
    subtitle: p.subtitle,
    features: p.features,
    price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
    unit: p.unit || "/ session",
    waText: p.waText || `Hi PawCab, I'd like to book a ${p.title}.`,
  })) : [
    {
      id: "neighborhood",
      icon: <PiPawPrint className="text-2xl text-deep-midnight" />,
      title: "Neighborhood Walk",
      subtitle: "1 Hour Session",
      features: [
        "Up to 2 dogs per session",
        "Within your neighborhood",
        "No transportation required",
      ],
      price: "Rp 150,000",
      unit: "/ session",
      waText:
        "Hi PawCab, I'd like to book a Neighborhood Walk (1 Hour Session - Rp 150,000).",
    },
    {
      id: "beach",
      icon: <PiTreePalm className="text-2xl text-deep-midnight" />,
      title: "Beach Walk",
      subtitle: "1 Hour Session",
      features: [
        "Up to 2 dogs per session",
        "Includes transportation",
        "Visit a suitable nearby beach",
      ],
      price: "Rp 250,000",
      unit: "/ session",
      waText:
        "Hi PawCab, I'd like to book a Beach Walk (1 Hour Session - Rp 250,000).",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 px-6 md:px-10 bg-soft-white border-t border-sand-beige/40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="mb-3">
            <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
              PRICING
            </p>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight font-bold leading-tight mb-4">
            Dog Walking Fares
          </h2>
          <p className="text-warm-taupe font-light text-base md:text-lg leading-relaxed">
            Our walking services are available in two options. Choose the one that
            best suits your dog&apos;s needs.
          </p>
        </div>

        {/* 2 Pricing Cards Grid */}
        <div className="grid max-w-4xl mx-auto grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl p-7 sm:p-9 border border-sand-beige/40 shadow-sm hover:shadow-xl hover:border-pawcab-gold/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Circular Badge */}
                <div className="flex items-center gap-4 mb-7 pb-6 border-b border-sand-beige/30">
                  <div className="w-14 h-14 rounded-2xl bg-warm-ivory border border-sand-beige/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight">
                      {plan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-warm-taupe font-medium mt-0.5">
                      {plan.subtitle}
                    </p>
                  </div>
                </div>

                {/* Checklist Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <BsCheckCircleFill className="text-brass shrink-0 text-base" />
                      <span className="text-deep-midnight/85 text-sm sm:text-[15px] font-normal">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Price & CTA */}
              <div className="pt-6 border-t border-sand-beige/30">
                <div className="mb-6">
                  <p className="font-playfair text-3xl sm:text-4xl font-bold text-deep-midnight leading-none">
                    {plan.price}
                  </p>
                  <p className="text-xs sm:text-sm text-warm-taupe font-light mt-1.5">
                    {plan.unit}
                  </p>
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(plan.waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-deep-midnight text-soft-white hover:bg-pawcab-navy py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm group-hover:shadow-md"
                >
                  Book Now
                  <BsArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Note / Disclaimer Banner */}
        <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-warm-ivory/70 border border-sand-beige/40 flex items-start sm:items-center gap-3.5 text-xs sm:text-sm text-warm-taupe">
          <BsInfoCircle className="text-lg text-warm-taupe shrink-0 mt-0.5 sm:mt-0" />
          <p>
            All sessions include fresh drinking water, gentle paw cleaning after the
            walk, and real-time photo/video updates sent directly to your WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
