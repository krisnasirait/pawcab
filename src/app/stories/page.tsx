import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BsArrowRight,
  BsArrowDown,
  BsStarFill,
  BsWhatsapp,
} from "react-icons/bs";
import {
  PiHeart,
  PiCarProfile,
  PiShieldCheck,
  PiChatCircleDots,
  PiMapPin,
  PiPawPrint,
} from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "Pawcab Stories | The PawCab Bali",
  description:
    "Real experiences, happy paws, and journeys made better with The PawCab. Explore real stories of pets traveling safely across Bali.",
  alternates: { canonical: "/stories" },
  openGraph: { title: "Pawcab Stories | The PawCab Bali", description: "Real experiences, happy paws, and journeys made better with The PawCab. Explore real stories of pets traveling safely across Bali.", url: "/stories", type: "website" },
};

const defaultHighlightIcons = [
  <PiHeart key="1" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiCarProfile key="2" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiShieldCheck key="3" className="text-2xl sm:text-3xl text-deep-midnight" />,
  <PiChatCircleDots key="4" className="text-2xl sm:text-3xl text-deep-midnight" />,
];

export default function StoriesPage() {
  const storiesContent = contentData.stories;
  const rawHighlights = storiesContent?.highlights || [];

  const highlights = rawHighlights.length > 0 ? rawHighlights.map((h, idx) => ({
    icon: defaultHighlightIcons[idx % defaultHighlightIcons.length],
    title: h.title,
    subtitle: h.subtitle,
  })) : [
    {
      icon: <PiHeart className="text-2xl sm:text-3xl text-deep-midnight" />,
      title: "Compassionate Care",
      subtitle: "Every pet treated like family",
    },
    {
      icon: (
        <PiCarProfile className="text-2xl sm:text-3xl text-deep-midnight" />
      ),
      title: "Private & Spacious",
      subtitle: "No shared cages or unfamiliar pets",
    },
    {
      icon: (
        <PiShieldCheck className="text-2xl sm:text-3xl text-deep-midnight" />
      ),
      title: "Safe & Stress-Free",
      subtitle: "Calm driving & trained handlers",
    },
    {
      icon: (
        <PiChatCircleDots className="text-2xl sm:text-3xl text-deep-midnight" />
      ),
      title: "Live Trip Updates",
      subtitle: "Photos & updates via WhatsApp",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-midnight flex flex-col selection:bg-pawcab-gold selection:text-deep-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main className="flex-grow">
        {/* ========================================================
            HERO SECTION (Consistent with other service pages)
            ======================================================== */}
        <section className="relative min-h-[600px] lg:min-h-[660px] w-full flex items-center pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-10 overflow-hidden bg-warm-ivory">
          {/* Background Image on the Right from Unsplash */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] lg:w-[54%] h-full">
            <img
              src={storiesContent?.hero?.heroImage || "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200&auto=format&fit=crop"}
              alt="Happy dog enjoying a calm car journey"
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
            {/* Mobile overlay for text readability */}
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
              <span className="text-warm-taupe font-semibold">Stories</span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Eyebrow Badge */}
              <div className="mb-4">
                <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                  {storiesContent?.hero?.badge || "COMMUNITY & EXPERIENCES"}
                </p>
              </div>

              {/* Page Title */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-deep-midnight font-bold leading-[1.14] tracking-tight mb-6">
                {storiesContent?.hero?.title || "Pawcab Stories"}
              </h1>

              {/* Subtitle */}
              <p className="text-warm-taupe font-normal text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {storiesContent?.hero?.subtitle || "Real experiences, happy paws, and journeys made better with The PawCab."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20ride%20for%20my%20pet."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-deep-midnight text-soft-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-pawcab-navy transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  Book a Journey
                  <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                <a
                  href="#featured-story"
                  className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-all duration-300 bg-warm-ivory/60 backdrop-blur-sm"
                >
                  Read Our Stories
                  <BsArrowDown />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            HIGHLIGHTS ROW
            ======================================================== */}
        <section className="bg-sand-beige/25 border-y border-sand-beige/40 py-8 px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-warm-ivory flex items-center justify-center shrink-0 shadow-sm border border-sand-beige/40">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-base text-deep-midnight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-warm-taupe mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SPOTLIGHT FEATURED STORY (Editorial Layout)
            ======================================================== */}
        <section id="featured-story" className="py-12 md:py-16 px-6 md:px-10 bg-soft-white">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl bg-warm-ivory border border-sand-beige/50 overflow-hidden shadow-md flex flex-col lg:flex-row items-center">
              {/* Photo on Left */}
              <div className="w-full lg:w-5/12 relative aspect-[16/10] lg:aspect-[4/3] max-h-[260px] lg:max-h-[340px] overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1200&auto=format&fit=crop"
                  alt="Dog running joyfully on sunny beach in Bali"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pawcab-gold text-deep-midnight text-[0.7rem] font-bold uppercase tracking-wider shadow">
                    <PiPawPrint className="text-xs" /> Spotlight Story
                  </span>
                </div>
              </div>

              {/* Text on Right */}
              <div className="w-full lg:w-7/12 p-6 sm:p-8 md:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-warm-taupe font-semibold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1 text-warm-taupe">
                      <PiMapPin className="text-pawcab-gold" /> Canggu → Echo Beach
                    </span>
                    <span>•</span>
                    <span>Beach Adventure</span>
                  </div>

                  <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl text-deep-midnight font-bold leading-snug mb-3">
                    How Luna Found Her Travel Confidence in Bali
                  </h2>

                  <p className="text-warm-taupe text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                    Getting Luna into vehicles used to mean anxious pacing, panting, and distress.
                    With The PawCab’s flat-floor setup, soothing climate control, and her human
                    seated right by her side, Luna now gazes happily out the window and looks forward
                    to weekend adventures.
                  </p>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-sand-beige/30 border border-sand-beige/50 mb-4">
                    <div className="flex items-center gap-1 text-brass mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <BsStarFill key={i} className="text-[0.65rem]" />
                      ))}
                    </div>
                    <blockquote className="text-xs italic text-deep-midnight/90 leading-relaxed font-medium">
                      &ldquo;We used to dread taking Luna anywhere because of car anxiety. With The PawCab, she hops right in with tail wags. It changed our Bali lifestyle completely.&rdquo;
                    </blockquote>
                    <p className="text-[0.7rem] font-bold text-deep-midnight mt-1.5">
                      Sarah & Luna, Canggu
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sand-beige/40">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-warm-taupe">
                    Full Private Service
                  </span>
                  <a
                    href="https://wa.me/?text=Hi%20PawCab,%20I%20read%20Luna's%20story%20and%20would%20like%20to%20book%20a%20similar%20trip."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-deep-midnight hover:text-pawcab-navy transition-colors"
                  >
                    Book a Similar Ride <BsArrowRight />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            STORIES GRID (Interactive Client Component)
            ======================================================== */}
        {/* <StoriesGrid /> */}

        {/* ========================================================
            COMMUNITY METRICS & TRUST
            ======================================================== */}
        <section className="bg-deep-midnight text-soft-white py-16 md:py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="uppercase tracking-[0.2em] text-xs text-pawcab-gold font-semibold mb-2">
                Trusted Across Bali
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white">
                Every Mile, Handled with Heart.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-playfair text-4xl sm:text-5xl text-pawcab-gold font-bold mb-2">
                  {storiesContent?.metrics?.[0]?.value || "500+"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 uppercase tracking-wider">
                  {storiesContent?.metrics?.[0]?.label || "Happy Trips Completed"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-playfair text-4xl sm:text-5xl text-pawcab-gold font-bold mb-2">
                  {storiesContent?.metrics?.[1]?.value || "100%"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 uppercase tracking-wider">
                  {storiesContent?.metrics?.[1]?.label || "Private Pet Cabins"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-playfair text-4xl sm:text-5xl text-pawcab-gold font-bold mb-2">
                  {storiesContent?.metrics?.[2]?.value || "4.9★"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 uppercase tracking-wider">
                  {storiesContent?.metrics?.[2]?.label || "Owner Satisfaction"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-playfair text-4xl sm:text-5xl text-pawcab-gold font-bold mb-2">
                  {storiesContent?.metrics?.[3]?.value || "18+"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 uppercase tracking-wider">
                  {storiesContent?.metrics?.[3]?.label || "Bali Zones Covered"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BOTTOM CTA BANNER
            ======================================================== */}
        <section className="bg-warm-ivory py-16 md:py-24 px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-sand-beige/40 flex items-center justify-center mx-auto mb-6 text-deep-midnight">
              <PiHeart className="text-3xl text-deep-midnight" />
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight font-bold leading-tight mb-4">
              Ready to Create Your Pet&apos;s Next Happy Story?
            </h2>

            <p className="text-warm-taupe text-base md:text-lg max-w-xl mx-auto mb-8 font-normal">
              Whether it&apos;s a scenic beach day, a comfortable vet visit, or
              a relocation across Bali, we handle every ride door to door.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/?text=Hi%20PawCab,%20I%20would%20like%20to%20book%20a%20ride%20for%20my%20pet."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-pawcab-gold text-deep-midnight px-8 py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <BsWhatsapp className="text-base" />
                Book via WhatsApp
              </a>

              <Link
                href="/#services"
                className="inline-flex items-center gap-2 border border-deep-midnight/30 text-deep-midnight px-7 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-deep-midnight hover:text-soft-white transition-all duration-300"
              >
                See Our Services
                <BsArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
