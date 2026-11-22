import React from "react";
import Link from "next/link";
import contentData from "@/lib/content";

// R-31: services are not a sequence, so no 01/02/03 markers (frontend-design).
// Editorial index: alternating large rows, one rounded image each, left
// aligned, on the public canvas. No inset panel, no offset shadows.
export default function ServicesSection() {
  const section = contentData.home?.services;
  const services = section?.items?.length
    ? section.items
    : [
        { id: "t", title: "Pet Transport", description: "Door-to-door private rides across Bali.", href: "/services/pet-transport", image: "https://images.unsplash.com/photo-1638612844419-0a7a606290b1?q=80&w=1170&auto=format&fit=crop" },
        { id: "w", title: "Dog Walking", description: "A proper outing while you work.", href: "/services/dog-walking", image: "https://images.unsplash.com/photo-1659639237692-2442096a1f04?q=80&w=1170&auto=format&fit=crop" },
        { id: "s", title: "Pet Sitting", description: "Someone stays, so they can stay home.", href: "/services/pet-sitting", image: "https://plus.unsplash.com/photo-1661342557114-a67e3c6679a8?q=80&w=1170&auto=format&fit=crop" },
      ];

  return (
    <section id="services" className="bg-canvas py-14 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="flex items-center gap-3 text-[14px] font-medium text-navy mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-navy" />
            What we do
          </p>
          <h2 className="text-4xl md:text-[56px] leading-[1.05] font-normal text-navy">
            Three ways we look after your dog.
          </h2>
          <p className="text-[17px] leading-[1.55] text-ink mt-4">
            {section?.subtitle || "Rides are the heart of PawCab. Walking and sitting keep the same handler, the same notes, the same calm."}
          </p>
        </div>

        <div className="border-t border-navy/20">
          {services.map((s, idx) => (
            <div key={s.id}>
              <Link
                href={s.href}
                className={`group grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-12 items-center py-8 md:py-10 border-b border-navy/20 ${
                  idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="rounded-[28px] overflow-hidden bg-sand aspect-[16/10]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-[32px] font-normal text-navy leading-[1.15] transition-colors duration-200 group-hover:text-midnight">
                    {s.title}
                  </h3>
                  <p className="text-[16px] leading-[1.55] text-ink mt-3 max-w-md">{s.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-navy">
                    <span className="underline underline-offset-4 decoration-navy decoration-2">See {s.title.toLowerCase()}</span>
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
