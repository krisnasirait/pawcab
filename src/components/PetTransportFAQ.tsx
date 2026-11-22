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

export default function PetTransportFAQ() {
  const cmsFaqs = contentData.servicesPages?.petTransport?.faqs;

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      number: "01",
      question: "What type of vehicle do you use for pet transportation?",
      answerPrefix: "We use a ",
      answerBold: "comfortable SUV",
      answerMiddle: " to provide a ",
      answerBold2: "more private journey",
      answerSuffix: " for your pets.",
    },
    {
      id: 2,
      number: "02",
      question: "How many pets can travel in the car?",
      answerPrefix: "Our vehicle can accommodate up to ",
      answerBold: "3 large or 4 medium-sized dogs",
      answerSuffix:
        ", depending on the size and individual space requirements.",
    },
    {
      id: 3,
      number: "03",
      question: "Is the vehicle air-conditioned?",
      answerPrefix: "Yes, ",
      answerBold: "AC is kept on throughout the journey",
      answerSuffix: " to keep your pets comfortable.",
    },
    {
      id: 4,
      number: "04",
      question: "Can pet owner travel with their pets?",
      answerPrefix: "Absolutely! Up to ",
      answerBold: "2 people",
      answerSuffix: " are welcome.",
    },
    {
      id: 5,
      number: "05",
      question: "Do you provide pet transportation outside Bali?",
      answerPrefix: "At the moment, our transportation service is available ",
      answerBold: "within Bali only",
      answerSuffix: ".",
    },
    {
      id: 6,
      number: "06",
      question:
        "What if my destination is outside your listed service zones but still within Bali?",
      answerPrefix: "No problem! Please contact us for ",
      answerBold: "personalized quotation",
      answerSuffix: ".",
    },
    {
      id: 7,
      number: "07",
      question: "Do I need to book in advance?",
      answerPrefix: "",
      answerBold: "Advance booking is highly recommended",
      answerSuffix: " to secure your preferred date and time.",
    },
    {
      id: 8,
      number: "08",
      question: "Do you accept same-day booking?",
      answerPrefix: "Yes, ",
      answerBold: "same-day bookings are welcome",
      answerSuffix: ", subject to availability.",
    },
    {
      id: 9,
      number: "09",
      question: "Do you provide round-trip service?",
      answerPrefix: "Yes. Both ",
      answerBold: "one-way and round-trip services",
      answerSuffix: " are available.",
    },
    {
      id: 10,
      number: "10",
      question: "Is there any additional fee if I need the driver to wait?",
      answerPrefix:
        "Yes. Waiting service is available upon request at an additional ",
      answerBold: "IDR 15,000/hour",
      answerSuffix: ".",
    },
    {
      id: 11,
      number: "11",
      question: "Will my pet travel with other pets?",
      answerPrefix: "No. The PawCab provides ",
      answerBold: "private transportation",
      answerSuffix: ".",
    },
    {
      id: 12,
      number: "12",
      question: "Do you provide a pet crate?",
      answerPrefix: "Yes, a ",
      answerBold: "medium-sized pet crate",
      answerSuffix: " is available upon request.",
    },
    {
      id: 13,
      number: "13",
      question: "Can you transport my pet without me?",
      answerPrefix: "Absolutely! Your pet can travel with us ",
      answerBold: "without the owner present",
      answerSuffix: ".",
    },
  ];

  const allFaqs = cmsFaqs && cmsFaqs.length > 0 ? (cmsFaqs as unknown as FAQItem[]) : defaultFaqs;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 px-6 md:px-10 bg-canvas scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-medium text-midnight mb-4">Transport questions</p>
            <h2 id="faq-heading" className="font-display text-4xl md:text-[52px] font-normal leading-[1.08] text-navy">
              Frequently asked questions
            </h2>
          </div>
          <FAQList items={allFaqs} />
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-navy/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-midnight mb-3">Personal pet concierge</p>
            <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-navy">
              Have a unique question or custom itinerary?
            </h3>
            <p className="text-base leading-relaxed text-ink mt-3">
              Whether you need multiple pick-ups, airport transfers with oversized crates, or special medical visits, our Bali team is here to assist.
            </p>
          </div>
          <a
            href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20have%20questions%20about%20Pet%20Transportation%20service.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex min-h-12 items-center justify-center gap-2.5 bg-navy text-white hover:bg-midnight px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
          >
            <PiWhatsappLogo aria-hidden="true" className="text-lg" />
            Chat with Concierge
          </a>
        </div>
      </div>
    </section>
  );
}
