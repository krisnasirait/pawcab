"use client";

import React, { useState } from "react";
import { BsChevronDown, BsWhatsapp } from "react-icons/bs";
import { PiChatCircleDotsFill } from "react-icons/pi";
import contentData from "@/lib/content";

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

  // Split into 2 balanced columns
  const half = Math.ceil(allFaqs.length / 2);
  const leftFaqs = allFaqs.slice(0, half);
  const rightFaqs = allFaqs.slice(half);

  // By default, open the first item
  const [openIds, setOpenIds] = useState<number[]>([allFaqs[0]?.id || 1]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const expandAll = () => {
    setOpenIds(allFaqs.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const renderCard = (item: FAQItem) => {
    const isOpen = openIds.includes(item.id);

    return (
      <div
        key={item.id}
        className={`group rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
          isOpen
            ? "bg-white border-pawcab-gold shadow-md ring-1 ring-pawcab-gold/30"
            : "bg-soft-white/90 border-sand-beige/40 shadow-xs hover:border-sand-beige hover:shadow-sm hover:bg-white"
        }`}
      >
        {/* Card Header: the whole header is one button, so keyboard,
            screen reader, and pointer users all get the same control. */}
        <button
          type="button"
          onClick={() => toggleItem(item.id)}
          aria-expanded={isOpen}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="flex items-start gap-3.5">
            {/* Number Pill */}
            <span
              className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-playfair font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 ${
                isOpen
                  ? "bg-deep-midnight text-pawcab-gold shadow-sm"
                  : "bg-sand-beige/30 text-deep-midnight group-hover:bg-sand-beige/60"
              }`}
            >
              {item.number}
            </span>

            {/* Question Title */}
            <span className="font-playfair text-base sm:text-lg font-bold text-deep-midnight leading-snug pt-0.5 group-hover:text-pawcab-navy transition-colors">
              {item.question}
            </span>
          </span>

          {/* Chevron Indicator */}
          <span
            aria-hidden="true"
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mt-0.5 ${
              isOpen
                ? "bg-deep-midnight text-pawcab-gold rotate-180 shadow-xs"
                : "bg-sand-beige/30 text-warm-taupe group-hover:bg-sand-beige/60"
            }`}
          >
            <BsChevronDown className="text-xs transition-transform duration-300" />
          </span>
        </button>

        {/* Smooth Expand/Collapse Content Container via CSS Grid */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 mt-4 pt-3.5 border-t border-sand-beige/40"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pl-0 sm:pl-[46px] text-warm-taupe text-sm sm:text-base leading-relaxed font-normal">
              <span className="inline-block px-2 py-0.5 rounded bg-pawcab-gold/20 text-deep-midnight font-bold text-xs uppercase tracking-wider mr-2">
                Answer
              </span>
              {item.answer ? (
                <span>{item.answer}</span>
              ) : (
                <>
                  <span>{item.answerPrefix}</span>
                  {item.answerBold && (
                    <strong className="font-semibold text-deep-midnight">
                      {item.answerBold}
                    </strong>
                  )}
                  {item.answerMiddle}
                  {item.answerBold2 && (
                    <strong className="font-semibold text-deep-midnight">
                      {item.answerBold2}
                    </strong>
                  )}
                  {item.answerSuffix}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-28 px-6 md:px-10 bg-warm-ivory relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 pb-8 border-b border-sand-beige/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-beige/35 border border-sand-beige/50 text-xs font-semibold uppercase tracking-[0.2em] text-warm-taupe mb-4">
              <PiChatCircleDotsFill className="text-pawcab-navy text-sm" />
              Pet Transport Guide
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-deep-midnight font-bold tracking-tight">
              Frequently Asked <br className="hidden sm:inline" />
              <span className="italic font-normal">Questions.</span>
            </h2>
          </div>
        </div>

        {/* 2-Column Responsive Staggered Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
          {/* Column 1 */}
          <div className="space-y-4 sm:space-y-5">
            {leftFaqs.map(renderCard)}
          </div>

          {/* Column 2 */}
          <div className="space-y-4 sm:space-y-5">
            {rightFaqs.map(renderCard)}
          </div>
        </div>

        {/* Catchy Concierge Support Card at Bottom */}
        <div className="mt-12 md:mt-16 bg-deep-midnight text-soft-white rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl border border-soft-white/10 relative overflow-hidden">
          {/* Background Gold Ambient Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-pawcab-gold/15 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-pawcab-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                <PiChatCircleDotsFill className="text-base" />
                Personal Pet Concierge
              </div>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold leading-snug">
                Have a unique question or custom itinerary?
              </h3>
              <p className="text-soft-white/70 font-normal text-sm sm:text-base mt-2">
                Whether you need multiple pick-ups, airport transfers with
                oversized crates, or special medical visits, our Bali team is
                here to assist.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="https://wa.me/?text=Hi%20PawCab,%20I%20have%20questions%20about%20Pet%20Transportation%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-pawcab-gold text-deep-midnight px-8 py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <BsWhatsapp className="text-base" />
                Chat with Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
