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

export default function DogWalkingFAQ() {
  const cmsFaqs = contentData.servicesPages?.dogWalking?.faqs;

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      number: "01",
      question: "How many dogs can join each walking session?",
      answerPrefix: "Each session accommodates ",
      answerBold: "up to 2 dogs",
      answerSuffix: " to ensure personalized attention and a comfortable experience.",
    },
    {
      id: 2,
      number: "02",
      question: "How long is each walking session?",
      answerPrefix: "Our standard walking session lasts ",
      answerBold: "1 hour",
      answerSuffix: ".",
    },
    {
      id: 3,
      number: "03",
      question: "Will my dog be walked with other dogs?",
      answerPrefix: "Our walking sessions are ",
      answerBold: "privately arranged",
      answerSuffix: ".",
    },
    {
      id: 4,
      number: "04",
      question: "Do I need to be home during the walk?",
      answerPrefix: "Not necessarily! We can walk your dog ",
      answerBold: "without you being present",
      answerSuffix: ", as long as pick-up and access arrangements have been confirmed in advance.",
    },
    {
      id: 5,
      number: "05",
      question: "Is transportation included in the walking fee?",
      answerPrefix:
        "Transportation is not required for Neighborhood Walks. For Beach Walks, ",
      answerBold: "an additional Pet Transportation fee applies",
      answerSuffix: " based on your location.",
    },
    {
      id: 6,
      number: "06",
      question: "Can I choose which beach my dog visits?",
      answerPrefix: "Of course! You can request your ",
      answerBold: "preferred beach",
      answerSuffix: ", or we can recommend a suitable beach near your location.",
    },
    {
      id: 7,
      number: "07",
      question: "Do you provide same-day booking?",
      answerPrefix: "Yes! ",
      answerBold: "Same-day bookings are welcome",
      answerSuffix: ", subject to availability. However, advance booking is recommended.",
    },
    {
      id: 8,
      number: "08",
      question: "What happens if it rains?",
      answerPrefix: "If weather conditions are unsuitable, we'll discuss ",
      answerBold: "rescheduling the walk",
      answerSuffix: " to keep your dog safe and comfortable.",
    },
    {
      id: 9,
      number: "09",
      question: "Will my dog be allowed off-leash?",
      answerPrefix: "For safety, dogs are ",
      answerBold: "kept on a leash",
      answerSuffix:
        " during walks unless a safe, permitted area and suitable arrangements have been confirmed in advance.",
    },
    {
      id: 10,
      number: "10",
      group: "Basic Obedience Add-On",
      question: "Can I add basic obedience training to my pet's session?",
      answerPrefix: "Absolutely! ",
      answerBold: "Basic obedience exercises",
      answerMiddle: " can be added to your ",
      answerBold2: "Pet Walking or Pet Sitting session",
      answerSuffix: " upon request.",
    },
    {
      id: 11,
      number: "11",
      group: "Basic Obedience Add-On",
      question: "What will my dog learn?",
      answerPrefix: "We focus on essential commands such as ",
      answerBold: "Sit, Down, Stay, Come",
      answerMiddle: ", and ",
      answerBold2: "basic leash manners",
      answerSuffix: ", depending on your dog's needs.",
    },
    {
      id: 12,
      number: "12",
      group: "Basic Obedience Add-On",
      question: "Is this a professional dog training program?",
      answerPrefix: "No. This is a ",
      answerBold: "light obedience reinforcement service",
      answerSuffix:
        " designed to encourage good habits during your pet's regular activities.",
    },
    {
      id: 13,
      number: "13",
      group: "Basic Obedience Add-On",
      question: "Is there an additional charge?",
      answerPrefix: "Yes. Basic Obedience is available as an ",
      answerBold: "optional add-on",
      answerSuffix: " for an additional fee.",
    },
    {
      id: 14,
      number: "14",
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
            <p className="text-sm font-medium text-midnight mb-4">Walking questions</p>
            <h2 id="faq-heading" className="font-display text-4xl md:text-[52px] font-normal leading-[1.08] text-navy">
              Dog walking questions
            </h2>
            <p className="text-base leading-relaxed text-ink mt-5 max-w-sm">
              Everything you need to know about our neighborhood and beach walking sessions.
            </p>
          </div>
          <FAQList items={allFaqs} showControls />
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-navy/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-navy">
              Have a special request for your dog?
            </h3>
            <p className="text-base leading-relaxed text-ink mt-3">
              Chat with our team on WhatsApp for customized schedules, route preferences, or multiple dogs.
            </p>
          </div>
          <a
            href={`https://wa.me/${contentData.site?.whatsapp || "6285857883906"}?text=Hi%20PawCab,%20I%20have%20a%20question%20about%20your%20dog%20walking%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex min-h-12 items-center justify-center gap-2.5 bg-navy text-white hover:bg-midnight px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
          >
            <PiWhatsappLogo aria-hidden="true" className="text-lg" />
            Chat with Us
          </a>
        </div>
      </div>
    </section>
  );
}
