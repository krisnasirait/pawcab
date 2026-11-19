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
      answerSuffix: ", as well as other small pets. Our sitters are trained in gentle, stress-free handling.",
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
      answerSuffix: " within minutes.",
    },
  ];

  const allFaqs = cmsFaqs && cmsFaqs.length > 0 ? (cmsFaqs as unknown as FAQItem[]) : defaultFaqs;

  const [openIds, setOpenIds] = useState<number[]>([allFaqs[0]?.id || 1]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(allFaqs.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const half = Math.ceil(allFaqs.length / 2);
  const leftFaqs = allFaqs.slice(0, half);
  const rightFaqs = allFaqs.slice(half);

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
        <button
          type="button"
          onClick={() => toggleItem(item.id)}
          aria-expanded={isOpen}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="flex items-start gap-3.5">
            <span
              className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-playfair font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 ${
                isOpen
                  ? "bg-deep-midnight text-pawcab-gold shadow-sm"
                  : "bg-sand-beige/30 text-deep-midnight group-hover:bg-sand-beige/60"
              }`}
            >
              {item.number}
            </span>

            <span className="font-playfair text-base sm:text-lg font-bold text-deep-midnight leading-snug pt-0.5 group-hover:text-pawcab-navy transition-colors">
              {item.question}
            </span>
          </span>

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

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-sand-beige/30"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="text-warm-taupe text-sm sm:text-base leading-relaxed pl-11.5 sm:pl-12.5 font-normal">
              {item.answer ? (
                <span>{item.answer}</span>
              ) : (
                <>
                  {item.answerPrefix}
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
    <section id="faq" className="py-20 md:py-28 px-6 md:px-10 bg-warm-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-sand-beige/30 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <PiChatCircleDotsFill className="text-pawcab-navy text-sm" />
              <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
                FREQUENTLY ASKED QUESTIONS
              </p>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight font-bold leading-tight">
              Pet Sitting Questions
            </h2>
            <p className="text-warm-taupe font-normal text-sm sm:text-base mt-2 max-w-xl">
              Common questions about our in-home pet sitting services, routines, and booking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="px-5 py-3 min-h-[44px] inline-flex items-center text-xs uppercase tracking-wider font-semibold rounded-full border border-deep-midnight/20 text-deep-midnight hover:bg-deep-midnight hover:text-soft-white transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-5 py-3 min-h-[44px] inline-flex items-center text-xs uppercase tracking-wider font-semibold rounded-full border border-deep-midnight/20 text-deep-midnight hover:bg-deep-midnight hover:text-soft-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-16 items-start">
          <div className="space-y-4">{leftFaqs.map(renderCard)}</div>
          <div className="space-y-4">{rightFaqs.map(renderCard)}</div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sand-beige/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-warm-ivory flex items-center justify-center shrink-0 text-pawcab-navy">
              <PiChatCircleDotsFill className="text-3xl" />
            </div>
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight">
                Need customized care or multi-day sitting?
              </h3>
              <p className="text-warm-taupe font-normal text-sm mt-1">
                Tell us your schedule and pet needs on WhatsApp for an instant custom arrangement.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/?text=Hi%20PawCab,%20I'd%20like%20to%20request%20a%20quote%20for%20In-Home%20Pet%20Sitting."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 bg-deep-midnight text-soft-white hover:bg-pawcab-navy px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            <BsWhatsapp className="text-base text-green-400" />
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
