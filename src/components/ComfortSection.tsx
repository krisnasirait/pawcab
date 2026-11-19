import React from "react";
import {
  PiSnowflake,
  PiUser,
  PiPawPrint,
  PiBroom,
  PiHeart,
  PiCarProfile,
} from "react-icons/pi";
import contentData from "@/lib/content";

export default function ComfortSection() {
  const comfort = contentData.home?.comfort;

  const details = [
    {
      icon: <PiCarProfile className="text-2xl text-deep-midnight" />,
      title: comfort?.features?.[0] || "Spacious cabin",
      subtitle: "No cramped kennels",
    },
    {
      icon: <PiUser className="text-2xl text-deep-midnight" />,
      title: comfort?.features?.[1] || "Owner can join",
      subtitle: "Ride together",
    },
    {
      icon: <PiSnowflake className="text-2xl text-deep-midnight" />,
      title: comfort?.features?.[2] || "Air-conditioned",
      subtitle: "For a cooler, calmer ride",
    },
    {
      icon: <PiPawPrint className="text-2xl text-deep-midnight" />,
      title: comfort?.features?.[3] || "Suitable for all breeds",
      subtitle: "All breeds & sizes",
    },
    {
      icon: <PiBroom className="text-2xl text-deep-midnight" />,
      title: "Clean & pet-friendly",
      subtitle: "Always fresh and hygienic",
    },
    {
      icon: <PiHeart className="text-2xl text-deep-midnight" />,
      title: "Pet-loving crew",
      subtitle: "Trained and caring team",
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-20 px-10 overflow-hidden bg-warm-ivory">
      {/* Background Image on the Right with Soft Left Gradient Blend */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] lg:w-[52%] h-full">
        <img
          src={comfort?.image || "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop"}
          alt="Comfortable dog in car"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft edge blend gradient on the left edge into warm-ivory */}
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

      {/* Content aligned with Navbar max-w-7xl */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Details Side (Left) */}
        <div className="w-full md:w-7/12 lg:w-6/12 flex flex-col justify-center">
          <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-warm-taupe font-semibold mb-3">
            {comfort?.badge || "A Ride Made For Dogs"}
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight mb-8">
            {comfort?.headingLine1 ? `${comfort.headingLine1} ${comfort.headingLine2 || ""}` : "Comfort in Every Detail."}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-6">
            {details.map((detail, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-sand-beige/40 flex items-center justify-center shrink-0">
                  {detail.icon}
                </div>
                <div>
                  <p className="font-medium text-deep-midnight text-xl mb-1">
                    {detail.title}
                  </p>
                  <p className="text-xs text-warm-taupe">
                    {detail.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side empty space for image visibility in flex layout */}
        <div className="w-full md:w-5/12 lg:w-6/12 hidden md:block" />
      </div>

      {/* Bottom quote: set on a scrim pill so it holds contrast over the photo. */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mt-6 hidden md:flex justify-end pointer-events-none">
        <p className="font-playfair italic text-soft-white text-xl md:text-2xl lg:text-3xl bg-deep-midnight/45 rounded-full px-7 py-2.5">
          {comfort?.quoteText || "Comfort Comes First"}
        </p>
      </div>
    </section>
  );
}
