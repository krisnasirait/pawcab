import React from "react";
import Link from "next/link";
import contentData from "@/lib/content";

// R-31: services are not a sequence, so no 01/02/03 markers (frontend-design).
// Editorial index: alternating large rows, one image each, left aligned.
// Radius stays small (12px) so only the booking pill feels round.
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
    <section id="services" className="bg-[#FFFEFA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#0E6B5E] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#0E6B5E]" />
            What we do
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            Three ways we look after your dog.
          </h2>
          <p className="text-[16px] leading-relaxed text-[#3F382E] mt-4">
            {section?.subtitle || "Rides are the heart of PawCab. Walking and sitting keep the same handler, the same notes, the same calm."}
          </p>
        </div>

        <div className="border-t border-[#0E2A21]/15">
          {services.map((s, idx) => (
            <Link
              key={s.id}
              href={s.href}
              className={`group grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-12 items-center py-8 md:py-10 border-b border-[#0E2A21]/15 ${
                idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-xl bg-[#D8C9AE]/30 aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-[32px] font-semibold text-[#0E2A21] group-hover:text-[#0E6B5E] transition-colors" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                  {s.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-[#3F382E] mt-2 max-w-md">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-[#0E2A21]">
                  <span className="underline underline-offset-4 decoration-[#0E6B5E] decoration-1 group-hover:decoration-2">See {s.title.toLowerCase()}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
