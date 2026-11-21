import React from "react";
import { PiInfo } from "react-icons/pi";
import contentData from "@/lib/content";

export default function DogWalkingPricing() {
  const cmsPlans = contentData.servicesPages?.dogWalking?.pricingPlans;

  const plans = cmsPlans && cmsPlans.length > 0 ? cmsPlans.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    features: p.features,
    price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
    unit: p.unit || "/ session",
    waText: p.waText || `Hi PawCab, I'd like to book a ${p.title}.`,
  })) : [
    {
      id: "neighborhood",
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
      aria-labelledby="walking-rates-title"
      className="py-16 md:py-24 px-6 md:px-10 bg-surface scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10 md:mb-12">
          <p className="flex items-center gap-3 text-[14px] font-medium text-deepgreen mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-deepgreen" />
            Walk rates
          </p>
          <h2 id="walking-rates-title" className="font-display text-4xl md:text-[52px] text-forest font-normal leading-[1.08] mb-4">
            One hour walks, priced by zone
          </h2>
          <p className="text-ink font-normal text-base md:text-lg leading-relaxed">
            A private one hour walk in your own neighbourhood, for up to two dogs.
            Pick the zone you live in.
          </p>
        </div>

        <ul role="list" className="border-t border-forest/25 mb-8">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-x-10 items-start py-8 md:py-10 border-b border-forest/25"
            >
              <div>
                <h3 className="font-display text-[32px] md:text-[38px] font-normal leading-[1.1] text-forest mb-3">
                  {plan.title}
                </h3>
                <p className="text-base leading-relaxed text-ink max-w-sm">
                  {plan.subtitle}
                </p>
              </div>

              <ul role="list" className="space-y-2 text-sm md:text-[15px] leading-relaxed text-ink">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1 rounded-full bg-forest shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="md:col-span-2 lg:col-span-1 flex flex-wrap lg:flex-col items-start justify-between lg:items-end gap-5">
                <div className="lg:text-right">
                  <p className="text-[30px] md:text-[34px] font-normal tabular-nums leading-tight text-forest">
                    {plan.price}
                  </p>
                  <p className="text-sm text-ink mt-1">{plan.unit}</p>
                </div>
                <a
                  href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=${encodeURIComponent(plan.waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Book a walk: ${plan.title}`}
                  className="inline-flex min-h-12 items-center justify-center bg-forest text-white hover:bg-deepgreen py-3 px-6 rounded-full text-[15px] font-medium transition-colors duration-200"
                >
                  Book a walk
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="max-w-3xl flex items-start gap-3 text-sm leading-relaxed text-ink">
          <PiInfo aria-hidden="true" className="text-lg text-deepgreen shrink-0 mt-0.5" />
          <p>
            Walks stay inside your neighbourhood, up to two dogs per walk, and
            include fresh drinking water plus a gentle paw cleaning afterwards. A
            beach walk, or a walk outside your residence, adds a transport fee.
            Requests outside these three zones are quoted on WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
