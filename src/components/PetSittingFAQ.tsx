import React from "react";
import { PiWhatsappLogo } from "react-icons/pi";
import contentData from "@/lib/content";
import FAQList from "./FAQList";

interface FAQItem {
  id: number;
  number: string;
  question: string;
  group?: string;
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
      question: "Where does the pet sitting take place?",
      answerPrefix: "We provide ",
      answerBold: "in-home pet sitting",
      answerMiddle: " at your ",
      answerBold2: "house, villa or accommodation",
      answerSuffix: ", so your pets can stay comfortable in a familiar environment.",
    },
    {
      id: 2,
      number: "02",
      question: "Do you offer overnight pet sitting?",
      answerPrefix: "",
      answerBold: "Overnight sitting may be arranged upon request",
      answerSuffix: ", subject to availability and confirmation.",
    },
    {
      id: 3,
      number: "03",
      question: "How long can I book a pet sitter?",
      answerPrefix: "Sitting arrangements can be tailored to your needs. Let us know your ",
      answerBold: "preferred dates and duration",
      answerSuffix: ", and we'll help you find the most suitable option.",
    },
    {
      id: 4,
      number: "04",
      question: "What does your Pet Sitting service include?",
      answerPrefix: "Our service focuses on ",
      answerBold: "companionship, supervision, feeding, fresh water, and basic daily care",
      answerSuffix: " based on your pet's usual routine.",
    },
    {
      id: 5,
      number: "05",
      question: "Can you follow my pet's feeding schedule?",
      answerPrefix: "Absolutely! We aim to follow your pet's ",
      answerBold: "regular feeding schedule",
      answerSuffix: " and care instructions to keep their routine consistent.",
    },
    {
      id: 6,
      number: "06",
      question: "Can you administer medication to my pet?",
      answerPrefix: "Please let us know your pet's ",
      answerBold: "medication requirements in advance",
      answerSuffix: ". We can discuss whether our team can safely accommodate them.",
    },
    {
      id: 7,
      number: "07",
      question: "Will my pet receive individual attention?",
      answerPrefix: "Yes! We focus on ",
      answerBold: "personalized care",
      answerSuffix:
        ", ensuring your pet receives attention, companionship, and care suited to their individual needs.",
    },
    {
      id: 8,
      number: "08",
      question: "Will I receive updates about my pet?",
      answerPrefix: "",
      answerBold: "Updates and photos can be arranged",
      answerSuffix: " during the sitting session, so you can stay connected while you're away.",
    },
    {
      id: 9,
      number: "09",
      question: "How much does pet sitting cost?",
      answerPrefix: "Our rates depend on your ",
      answerBold: "location, the number of pets, and duration",
      answerSuffix: " of care.",
    },
    {
      id: 10,
      number: "10",
      question: "Can you take my pet for a walk during the sitting session?",
      answerPrefix: "",
      answerBold: "Dog walking can be arranged upon request",
      answerSuffix: ". Additional charges may apply depending on the walking arrangements.",
    },
    {
      id: 11,
      number: "11",
      question: "What information should I provide before booking?",
      answerPrefix: "Please share your ",
      answerBold:
        "location, preferred schedule, number of pets, feeding routine, temperament, and any special care requirements",
      answerSuffix: ".",
    },
    {
      id: 12,
      number: "12",
      group: "Basic Obedience Add-On",
      question: "Can I add basic obedience training to my pet's session?",
      answerPrefix: "Absolutely! ",
      answerBold: "Basic obedience exercises",
      answerMiddle: " can be added to your ",
      answerBold2: "Pet Walking or Pet Sitting session",
      answerSuffix: " upon request.",
    },
    {
      id: 13,
      number: "13",
      group: "Basic Obedience Add-On",
      question: "What will my dog learn?",
      answerPrefix: "We focus on essential commands such as ",
      answerBold: "Sit, Down, Stay, Come",
      answerMiddle: ", and ",
      answerBold2: "basic leash manners",
      answerSuffix: ", depending on your dog's needs.",
    },
    {
      id: 14,
      number: "14",
      group: "Basic Obedience Add-On",
      question: "Is this a professional dog training program?",
      answerPrefix: "No. This is a ",
      answerBold: "light obedience reinforcement service",
      answerSuffix:
        " designed to encourage good habits during your pet's regular activities.",
    },
    {
      id: 15,
      number: "15",
      group: "Basic Obedience Add-On",
      question: "Is there an additional charge?",
      answerPrefix: "Yes. Basic Obedience is available as an ",
      answerBold: "optional add-on",
      answerSuffix: " for an additional fee.",
    },
    {
      id: 16,
      number: "16",
      group: "Basic Obedience Add-On",
      question: "Can my dog learn everything in one session?",
      answerPrefix: "Every dog learns at a ",
      answerBold: "different pace",
      answerMiddle: ". ",
      answerBold2: "Consistent practice and reinforcement at home",
      answerSuffix: " are important for long-term progress.",
    },
  ];

  const allFaqs = cmsFaqs && cmsFaqs.length > 0 ? (cmsFaqs as unknown as FAQItem[]) : defaultFaqs;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 px-6 md:px-10 bg-canvas scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-medium text-midnight mb-4">Sitting questions</p>
            <h2 id="faq-heading" className="font-display text-4xl md:text-[52px] font-normal leading-[1.08] text-navy">
              Pet sitting questions
            </h2>
            <p className="text-base leading-relaxed text-ink mt-5 max-w-sm">
              Common questions about our in-home pet sitting services, routines, and booking.
            </p>
          </div>
          <FAQList items={allFaqs} showControls />
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-navy/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-navy">
              Need customized care or multi-day sitting?
            </h3>
            <p className="text-base leading-relaxed text-ink mt-3">
              Tell us your schedule and pet needs on WhatsApp and we will shape a custom arrangement around them.
            </p>
          </div>
          <a
            href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex min-h-12 items-center justify-center gap-2.5 bg-navy text-white hover:bg-midnight px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
          >
            <PiWhatsappLogo aria-hidden="true" className="text-lg" />
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
