"use client";

import React, { useState } from "react";
import { AppContent, DogWalkingContent, DogWalkingPlan, FAQItem } from "@/types/content";
import ImageField from "../ImageField";
import { BsPlusLg, BsTrash3, BsStarFill } from "react-icons/bs";

interface DogWalkingTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
}

export default function DogWalkingTab({ content, onChange }: DogWalkingTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"pricing" | "hero" | "faqs">("pricing");

  const dogWalking = content.servicesPages?.dogWalking;

  const updateDogWalking = (
    field: keyof DogWalkingContent,
    val: DogWalkingContent[keyof DogWalkingContent]
  ) => {
    onChange({
      ...content,
      servicesPages: {
        ...content.servicesPages,
        dogWalking: {
          ...dogWalking,
          [field]: val,
        },
      },
    });
  };

  // Pricing Plans
  const handleAddPlan = () => {
    const newPlan: DogWalkingPlan = {
      id: `plan-${Date.now()}`,
      title: "New Walking Package",
      subtitle: "1 Hour Session",
      price: 200000,
      unit: "/ session",
      features: ["Up to 2 dogs", "Trained handler", "Hydration included"],
      popular: false,
      waText: "Hi PawCab, I'd like to book a walking session.",
    };
    updateDogWalking("pricingPlans", [...(dogWalking?.pricingPlans || []), newPlan]);
  };

  const handleUpdatePlan = (
    index: number,
    field: keyof DogWalkingPlan,
    val: DogWalkingPlan[keyof DogWalkingPlan]
  ) => {
    const plans = [...(dogWalking?.pricingPlans || [])];
    plans[index] = { ...plans[index], [field]: val };
    updateDogWalking("pricingPlans", plans);
  };

  const handleDeletePlan = (index: number) => {
    const plans = [...(dogWalking?.pricingPlans || [])];
    plans.splice(index, 1);
    updateDogWalking("pricingPlans", plans);
  };

  // FAQs
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: Date.now(),
      number: `0${(dogWalking?.faqs?.length || 0) + 1}`,
      question: "Walking FAQ Question?",
      answer: "FAQ Answer here.",
    };
    updateDogWalking("faqs", [...(dogWalking?.faqs || []), newFaq]);
  };

  const handleUpdateFaq = (
    index: number,
    field: keyof FAQItem,
    val: FAQItem[keyof FAQItem]
  ) => {
    const faqs = [...(dogWalking?.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: val };
    updateDogWalking("faqs", faqs);
  };

  const handleDeleteFaq = (index: number) => {
    const faqs = [...(dogWalking?.faqs || [])];
    faqs.splice(index, 1);
    updateDogWalking("faqs", faqs);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs */}
      <div className="flex gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab("pricing")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "pricing"
              ? "bg-pawcab-gold text-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Pricing Plans ({(dogWalking?.pricingPlans || []).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("hero")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "hero"
              ? "bg-pawcab-gold text-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Hero Banner
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("faqs")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "faqs"
              ? "bg-pawcab-gold text-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          FAQs ({(dogWalking?.faqs || []).length})
        </button>
      </div>

      {/* 1. PRICING PLANS */}
      {activeSubTab === "pricing" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Dog Walking Packages</h3>
              <p className="text-xs text-neutral-400">
                Manage the three zone rates, their areas, and the bullet features for each walk.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPlan}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add Walking Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(dogWalking?.pricingPlans || []).map((plan, idx) => (
              <div
                key={plan.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleUpdatePlan(idx, "popular", !plan.popular)}
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition ${
                        plan.popular
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : "bg-neutral-900 text-neutral-500 hover:text-neutral-400 border border-neutral-800"
                      }`}
                    >
                      <BsStarFill className="text-[10px]" />
                      <span>{plan.popular ? "Popular Badge Active" : "Standard Plan"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(idx)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                      title="Delete Plan"
                    >
                      <BsTrash3 className="text-xs" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Plan Title
                    </label>
                    <input
                      type="text"
                      value={plan.title}
                      onChange={(e) => handleUpdatePlan(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Subtitle / Duration
                      </label>
                      <input
                        type="text"
                        value={plan.subtitle}
                        onChange={(e) => handleUpdatePlan(idx, "subtitle", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Price (IDR)
                      </label>
                      <input
                        type="number"
                        step={10000}
                        value={plan.price}
                        onChange={(e) =>
                          handleUpdatePlan(idx, "price", parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-pawcab-gold font-bold text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Features List (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(plan.features || []).join("\n")}
                      onChange={(e) =>
                        handleUpdatePlan(
                          idx,
                          "features",
                          e.target.value.split("\n").filter((f) => f.trim().length > 0)
                        )
                      }
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      WhatsApp Booking Template
                    </label>
                    <input
                      type="text"
                      value={plan.waText || ""}
                      onChange={(e) => handleUpdatePlan(idx, "waText", e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HERO */}
      {activeSubTab === "hero" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Dog Walking Hero Banner</h3>
            <p className="text-xs text-neutral-400">
              Hero title, subtitle, and photo for `/services/dog-walking`.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={dogWalking?.hero?.badge || ""}
                onChange={(e) =>
                  updateDogWalking("hero", { ...dogWalking?.hero, badge: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={dogWalking?.hero?.title || ""}
                onChange={(e) =>
                  updateDogWalking("hero", { ...dogWalking?.hero, title: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={dogWalking?.hero?.subtitle || ""}
                onChange={(e) =>
                  updateDogWalking("hero", { ...dogWalking?.hero, subtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Hero Photo"
                value={dogWalking?.hero?.heroImage || ""}
                onChange={(val) =>
                  updateDogWalking("hero", { ...dogWalking?.hero, heroImage: val })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. FAQS */}
      {activeSubTab === "faqs" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Dog Walking FAQs</h3>
              <p className="text-xs text-neutral-400">
                Answer common questions about walk routes, reactivity, and schedules.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {(dogWalking?.faqs || []).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-pawcab-gold font-bold">
                    FAQ #{faq.number || idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                    title="Delete FAQ"
                  >
                    <BsTrash3 className="text-xs" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

