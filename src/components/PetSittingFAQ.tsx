import React from "react";
import { PiWhatsappLogo } from "react-icons/pi";
import contentData from "@/lib/content";
import FAQList from "./FAQList";

interface FAQItem {
  id: number;
  number: string;
  question: string;
  answer?: string;
  answerPrefix?: string;
  answerBold?: string;
  answerMiddle?: string;
  answerBold2?: string;
  answerSuffix?: string;
}

export default function PetSittingFAQ() {
  const cmsFaqs = contentData.servicesPages?.petSitting?.faqs;

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      number: "01",
      question: "What does an in-home pet sitting visit include?",
      answerPrefix: "Each visit covers ",
      answerBold: "fresh food & water replenishment",
      answerMiddle: ", litter box or pee pad cleaning, ",
      answerBold2: "playtime, cuddles, and companionship",
      answerSuffix: ", plus daily photo and video updates.",
    },
    {
      id: 2,
      number: "02",
      question: "How long does the pet sitter stay during a visit?",
      answerPrefix: "Standard visits range from ",
      answerBold: "45 to 60 minutes",
      answerMiddle: ". We also offer ",
      answerBold2: "extended drop-in sessions or half-day stays",
      answerSuffix: " depending on your pet's needs.",
    },
    {
      id: 3,
      number: "03",
      question: "Can you take care of both dogs and cats?",
      answerPrefix: "Yes! We care for ",
      answerBold: "both dogs and cats",
      answerSuffix: ", as well as other small pets. Our sitters are trained in gentle handling.",
    },
    {
      id: 4,
      number: "04",
      question: "Can you administer medication?",
      answerPrefix: "Yes, our team can administer ",
      answerBold: "oral medication, supplements, and eye/ear drops",
      answerSuffix: " according to your veterinarian's written instructions.",
    },
    {
      id: 5,
      number: "05",
      question: "How do I receive updates while I am away?",
      answerPrefix: "After every visit, your sitter sends ",
      answerBold: "high-res photos, short videos, and a detailed check-in report",
      answerSuffix: " directly via WhatsApp.",
    },
    {
      id: 6,
      number: "06",
      question: "How do I get a price quotation?",
      answerPrefix: "Simply click ",
      answerBold: "Request a Quote",
      answerMiddle: " with your location, dates, and number of pets. We will provide a ",
      answerBold2: "transparent personalized quotation",
      answerSuffix: ". We reply on WhatsApp with the details.",
    },
  ];

  const allFaqs = cmsFaqs && cmsFaqs.length > 0 ? (cmsFaqs as unknown as FAQItem[]) : defaultFaqs;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 px-6 md:px-10 bg-canvas scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-medium text-deepgreen mb-4">Sitting questions</p>
            <h2 id="faq-heading" className="font-display text-4xl md:text-[52px] font-normal leading-[1.08] text-forest">
              Pet sitting questions
            </h2>
            <p className="text-base leading-relaxed text-ink mt-5 max-w-sm">
              Common questions about our in-home pet sitting services, routines, and booking.
            </p>
          </div>
          <FAQList items={allFaqs} showControls />
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-forest/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest">
              Need customized care or multi-day sitting?
            </h3>
            <p className="text-base leading-relaxed text-ink mt-3">
              Tell us your schedule and pet needs on WhatsApp and we will shape a custom arrangement around them.
            </p>
          </div>
          <a
            href={`https://wa.me/${contentData.site?.whatsapp || "6282266383800"}?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex min-h-12 items-center justify-center gap-2.5 bg-forest text-white hover:bg-deepgreen px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
          >
            <PiWhatsappLogo aria-hidden="true" className="text-lg" />
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
