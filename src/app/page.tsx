import Script from "next/script";
import contentData from "@/lib/content";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesRow from "@/components/FeaturesRow";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PetTransportPricing from "@/components/PetTransportPricing";
import CoverageSection from "@/components/CoverageSection";
import GallerySection from "@/components/GallerySection";
import ComfortSection from "@/components/ComfortSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

// Narrative order: promise (hero) -> proof strip -> fare (the action)
// -> services -> hospitality -> map -> passengers -> cabin -> how -> reviews.
export default function Home() {
  // R-38: the widget id comes from the CMS, never hardcoded, so a typo
  // can never again point Elfsight at a widget that does not exist.
  const reviews = contentData.home?.reviews;
  const elfsightAppId = reviews?.elfsightAppId?.trim();
  return (
    <main data-ui="public" className="min-h-screen relative bg-canvas">
      <Header />
      <Hero />
      <FeaturesRow />
      <PetTransportPricing />
      <ServicesSection />
      <AboutSection />
      <CoverageSection />
      <GallerySection />
      <ComfortSection />
      <HowItWorksSection />
      <section className="bg-white py-16 md:py-20 px-5 md:px-8 border-t border-sage">
        <div className="max-w-7xl mx-auto">
          <p className="flex items-center gap-3 text-[14px] font-medium text-forest mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-forest" />
            {reviews?.badge || "Guestbook"}
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.08] font-normal text-forest mb-8" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            {reviews?.heading || "Notes from the back seat."}
          </h2>
          {elfsightAppId ? (
            <>
              <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
              <div className={elfsightAppId} data-elfsight-app-lazy />
            </>
          ) : (
            <p className="text-[15px] leading-[1.45] text-ink max-w-lg">
              Daily rides and passenger hellos live on{" "}
              <a
                href={contentData.site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-forest underline underline-offset-4 decoration-forest decoration-2"
              >
                Instagram @{contentData.site.instagram}
              </a>.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
