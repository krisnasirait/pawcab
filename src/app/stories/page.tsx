import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PiArrowDown, PiArrowRight, PiCarProfile, PiChatCircleDots, PiHeart, PiMapPin, PiPawPrint, PiShieldCheck, PiStarFill, PiWhatsappLogo } from "react-icons/pi";
import contentData from "@/lib/content";

export const metadata: Metadata = {
  title: "Pawcab Stories | The PawCab Bali",
  description:
    "Real experiences, happy paws, and journeys made better with The PawCab. Explore real stories of pets traveling safely across Bali.",
  alternates: { canonical: "/stories" },
  openGraph: { title: "Pawcab Stories | The PawCab Bali", description: "Real experiences, happy paws, and journeys made better with The PawCab. Explore real stories of pets traveling safely across Bali.", url: "/stories", type: "website" },
};

const defaultHighlightIcons = [
  <PiHeart key="1" className="text-2xl sm:text-3xl text-midnight" />,
  <PiCarProfile key="2" className="text-2xl sm:text-3xl text-midnight" />,
  <PiShieldCheck key="3" className="text-2xl sm:text-3xl text-midnight" />,
  <PiChatCircleDots key="4" className="text-2xl sm:text-3xl text-midnight" />,
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
      icon: <PiHeart className="text-2xl sm:text-3xl text-midnight" />,
      title: "Compassionate Care",
      subtitle: "Every pet treated like family",
    },
    {
      icon: (
        <PiCarProfile className="text-2xl sm:text-3xl text-midnight" />
      ),
      title: "Private & Spacious",
      subtitle: "No shared cages or unfamiliar pets",
    },
    {
      icon: (
        <PiShieldCheck className="text-2xl sm:text-3xl text-midnight" />
      ),
      title: "Safe & Stress-Free",
      subtitle: "Calm driving & trained handlers",
    },
    {
      icon: (
        <PiChatCircleDots className="text-2xl sm:text-3xl text-midnight" />
      ),
      title: "Live Trip Updates",
      subtitle: "Photos & updates via WhatsApp",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-ivory text-midnight flex flex-col selection:bg-pawcab-gold selection:text-midnight">
      {/* Light Theme Navbar */}
      <Header theme="light" />

      <main data-ui="public" className="flex-grow bg-canvas">
        {/* ========================================================
            HERO SECTION (Consistent with other service pages)
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
              <span className="text-ink font-semibold">Stories</span>
            </nav>

            {/* Header Content */}
            <div className="max-w-2xl lg:max-w-xl">
              {/* Eyebrow Badge */}
              <div className="mb-4">
                <p className="tracking-[0.25em] text-xs md:text-sm text-ink font-semibold">
                  {storiesContent?.hero?.badge || "COMMUNITY & EXPERIENCES"}
                </p>
              </div>

              {/* Page Title */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] text-navy font-normal leading-[1.08] tracking-tight mb-6">
                {storiesContent?.hero?.title || "Pawcab Stories"}
              </h1>

              {/* Subtitle */}
              <p className="text-ink font-normal text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {storiesContent?.hero?.subtitle || "Real experiences, happy paws, and journeys made better with The PawCab."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I'd%20like%20to%20book%20a%20ride%20for%20my%20pet.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-midnight transition-colors duration-200 group"
                >
                  Book a Journey
                  <PiArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </a>

                <a
                  href="#featured-story"
                  className="inline-flex items-center gap-2 border border-midnight/30 text-midnight px-7 py-4 rounded-full font-medium text-sm hover:bg-midnight hover:text-soft-white transition-colors duration-200 bg-white/60"
                >
                  Read Our Stories
                  <PiArrowDown />
                </a>
              </div>
            </div>
            </div>
            <div className="relative rounded-[28px] overflow-hidden bg-sand aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storiesContent?.hero?.heroImage || "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200&auto=format&fit=crop"}
                alt="Three dogs playing together in shallow water at a Bali beach"
                fetchPriority="high"
                className="w-full h-full object-cover object-center"
              />
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
                <div className="w-12 h-12 rounded-2xl bg-warm-ivory flex items-center justify-center shrink-0 border border-sand-beige/40">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-normal text-base text-midnight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink mt-0.5">
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
            <div className="rounded-[32px] bg-warm-ivory border border-sand-beige/50 overflow-hidden flex flex-col lg:flex-row items-center">
              {/* Photo on Left */}
              <div className="w-full lg:w-5/12 relative aspect-[16/10] lg:aspect-[4/3] max-h-[260px] lg:max-h-[340px] overflow-hidden shrink-0">
                <img
                  src="/images/story-window-gaze.jpeg"
                  alt="Happy dog gazing out of a car window"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-navy text-[0.75rem] font-medium border border-navy">
                    <PiPawPrint className="text-xs" /> Spotlight Story
                  </span>
                </div>
              </div>

              {/* Text on Right */}
              <div className="w-full lg:w-7/12 p-6 sm:p-8 md:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-ink font-semibold mb-2">
                    <span className="flex items-center gap-1 text-ink">
                      <PiMapPin className="text-navy" /> Canggu → Echo Beach
                    </span>
                    <span>•</span>
                    <span>Beach Adventure</span>
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-midnight font-normal leading-snug mb-3">
                    How Luna Found Her Travel Confidence in Bali
                  </h2>

                  <p className="text-ink text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                    Getting Luna into vehicles used to mean anxious pacing, panting, and distress.
                    With The PawCab’s flat-floor setup, soothing climate control, and her human
                    seated right by her side, Luna now gazes happily out the window and looks forward
                    to weekend adventures.
                  </p>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-sand-beige/30 border border-sand-beige/50 mb-4">
                    <div className="flex items-center gap-1 text-navy mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <PiStarFill key={i} className="text-[0.65rem]" />
                      ))}
                    </div>
                    <blockquote className="text-xs italic text-midnight/90 leading-relaxed font-medium">
                      &ldquo;We used to dread taking Luna anywhere because of car anxiety. With The PawCab, she hops right in with tail wags. It changed our Bali lifestyle completely.&rdquo;
                    </blockquote>
                    <p className="text-[0.7rem] font-bold text-midnight mt-1.5">
                      Sarah & Luna, Canggu
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sand-beige/40">
                  <span className="text-[0.7rem] font-semibold text-ink">
                    Full Private Service
                  </span>
                  <a
                    href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20read%20Luna's%20story%20and%20would%20like%20to%20book%20a%20similar%20trip.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-midnight hover:text-pawcab-navy transition-colors"
                  >
                    Book a Similar Ride <PiArrowRight />
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
        <section className="bg-navy text-white py-16 md:py-20 px-6 md:px-10" data-surface="navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs text-navy font-semibold mb-2">
                Trusted Across Bali
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white">
                Every Mile, Handled with Heart.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-display text-4xl sm:text-5xl text-navy font-normal mb-2">
                  {storiesContent?.metrics?.[0]?.value || "500+"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 tracking-wider">
                  {storiesContent?.metrics?.[0]?.label || "Happy Trips Completed"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-display text-4xl sm:text-5xl text-navy font-normal mb-2">
                  {storiesContent?.metrics?.[1]?.value || "100%"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 tracking-wider">
                  {storiesContent?.metrics?.[1]?.label || "Private Pet Cabins"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-display text-4xl sm:text-5xl text-navy font-normal mb-2">
                  {storiesContent?.metrics?.[2]?.value || "4.9★"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 tracking-wider">
                  {storiesContent?.metrics?.[2]?.label || "Owner Satisfaction"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-soft-white/5 border border-soft-white/10">
                <p className="font-display text-4xl sm:text-5xl text-navy font-normal mb-2">
                  {storiesContent?.metrics?.[3]?.value || "18+"}
                </p>
                <p className="text-xs sm:text-sm text-soft-white/70 tracking-wider">
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
            <div className="w-16 h-16 rounded-full bg-sand-beige/40 flex items-center justify-center mx-auto mb-6 text-midnight">
              <PiHeart className="text-3xl text-midnight" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-midnight font-normal leading-tight mb-4">
              Ready to Create Your Pet&apos;s Next Happy Story?
            </h2>

            <p className="text-ink text-base md:text-lg max-w-xl mx-auto mb-8 font-normal">
              Whether it&apos;s a scenic beach day, a comfortable vet visit, or
              a relocation across Bali, we handle every ride door to door.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20would%20like%20to%20book%20a%20ride%20for%20my%20pet.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-accent text-navy px-8 py-4 rounded-full font-medium text-sm border-2 border-line hover:bg-accent-hover transition-colors duration-200"
              >
                <PiWhatsappLogo className="text-base" />
                Book via WhatsApp
              </a>

              <Link
                href="/#services"
                className="inline-flex items-center gap-2 border border-midnight/30 text-midnight px-7 py-4 rounded-full font-semibold text-xs sm:text-sm hover:bg-midnight hover:text-soft-white transition-colors duration-200"
              >
                See Our Services
                <PiArrowRight />
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
