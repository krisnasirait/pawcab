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

export default function DogWalkingFAQ() {
  const cmsFaqs = contentData.servicesPages?.dogWalking?.faqs;

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      number: "01",
      question: "How long is each dog walking session?",
      answerPrefix: "Each session lasts for ",
      answerBold: "1 full hour",
      answerMiddle: " of active exploration, exercise, and ",
      answerBold2: "personalized attention",
      answerSuffix: " for your dog.",
    },
    {
      id: 2,
      number: "02",
      question: "How many dogs can participate per session?",
      answerPrefix: "Our walks are private and semi-private for safety: ",
      answerBold: "up to 2 dogs per session",
      answerSuffix: " from the same household or compatible companions.",
    },
    {
      id: 3,
      number: "03",
      question: "How does transportation work for the Beach Walk?",
      answerPrefix: "For the Beach Walk, ",
      answerBold: "private transportation is included",
      answerMiddle: ". We pick up your pet in our ",
      answerBold2: "air-conditioned vehicle",
      answerSuffix: ", head to a safe dog-friendly beach, and bring them back fresh and happy.",
    },
    {
      id: 4,
      number: "04",
      question: "Can pet owners join the walk?",
      answerPrefix: "Yes! Pet parents are ",
      answerBold: "always welcome to join",
      answerSuffix: " the adventure, especially for sunset beach walks.",
    },
    {
      id: 5,
      number: "05",
      question: "What should I prepare before the walker arrives?",
      answerPrefix: "Please prepare a ",
      answerBold: "secure harness or leash",
      answerMiddle: ", collar with ID tag, and any ",
      answerBold2: "special treats or medications",
      answerSuffix: " if your pet has dietary restrictions.",
    },
    {
      id: 6,
      number: "06",
      question: "Do you send updates during the walk?",
      answerPrefix: "Yes! We provide ",
      answerBold: "photo and video updates",
      answerMiddle: " along with a brief summary of how your dog enjoyed their outing.",
      answerSuffix: "",
    },
    {
      id: 7,
      number: "07",
      question: "What happens if it rains during the scheduled time?",
      answerPrefix: "If the weather is unsafe or raining heavily, we can ",
      answerBold: "reschedule with zero penalty",
      answerSuffix: " or wait until the rain clears.",
    },
    {
      id: 8,
      number: "08",
      question: "Can you handle reactive or anxious dogs?",
      answerPrefix: "Yes, our walkers are experienced with various temperaments. Since our walks are ",
      answerBold: "private 1-on-1 sessions",
      answerSuffix: ", we can customize the route to avoid triggers.",
    },
  ];

  const allFaqs = cmsFaqs && cmsFaqs.length > 0 ? (cmsFaqs as unknown as FAQItem[]) : defaultFaqs;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 px-6 md:px-10 bg-canvas scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-medium text-deepgreen mb-4">Walking questions</p>
            <h2 id="faq-heading" className="font-display text-4xl md:text-[52px] font-normal leading-[1.08] text-forest">
              Dog walking questions
            </h2>
            <p className="text-base leading-relaxed text-ink mt-5 max-w-sm">
              Everything you need to know about our neighborhood and beach walking sessions.
            </p>
          </div>
          <FAQList items={allFaqs} showControls />
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-forest/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-display text-[28px] md:text-[32px] font-normal leading-[1.15] text-forest">
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
            className="shrink-0 inline-flex min-h-12 items-center justify-center gap-2.5 bg-forest text-white hover:bg-deepgreen px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200"
          >
            <PiWhatsappLogo aria-hidden="true" className="text-lg" />
            Chat with Us
          </a>
        </div>
      </div>
    </section>
  );
}
