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
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

// Narrative order: promise (hero) -> proof strip -> fare (the action)
// -> services -> hospitality -> map -> passengers -> cabin -> how -> reviews.
export default function Home() {
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
      <ReviewsSection />
      <Footer />
    </main>
  );
}
