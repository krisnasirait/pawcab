"use client";

import React, { useState } from "react";
import { AppContent, FAQItem, PetSittingContent, PetSittingServiceItem } from "@/types/content";
import ImageField from "../ImageField";
import { BsPlusLg, BsTrash3, BsStarFill } from "react-icons/bs";

interface PetSittingTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
}

export default function PetSittingTab({ content, onChange }: PetSittingTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"services" | "hero" | "faqs">("services");

  const petSitting = content.servicesPages?.petSitting;

  const updatePetSitting = (
    field: keyof PetSittingContent,
    val: PetSittingContent[keyof PetSittingContent]
  ) => {
    onChange({
      ...content,
      servicesPages: {
        ...content.servicesPages,
        petSitting: {
          ...petSitting,
          [field]: val,
        },
      },
    });
  };

  // Service Tiers
  const handleAddService = () => {
    const newService: PetSittingServiceItem = {
      id: `care-${Date.now()}`,
      title: "New Care Service",
      subtitle: "Custom Duration",
      price: 250000,
      unit: "/ session",
      features: ["Loving care", "Fresh food & water", "Photo check-in"],
      popular: false,
      waText: "Hi PawCab, I'd like to book pet sitting.",
    };
    updatePetSitting("services", [...(petSitting?.services || []), newService]);
  };

  const handleUpdateService = (
    index: number,
    field: keyof PetSittingServiceItem,
    val: PetSittingServiceItem[keyof PetSittingServiceItem]
  ) => {
    const services = [...(petSitting?.services || [])];
    services[index] = { ...services[index], [field]: val };
    updatePetSitting("services", services);
  };

  const handleDeleteService = (index: number) => {
    const services = [...(petSitting?.services || [])];
    services.splice(index, 1);
    updatePetSitting("services", services);
  };

  // FAQs
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: Date.now(),
      number: `0${(petSitting?.faqs?.length || 0) + 1}`,
      question: "Sitting FAQ Question?",
      answer: "FAQ Answer here.",
    };
    updatePetSitting("faqs", [...(petSitting?.faqs || []), newFaq]);
  };

  const handleUpdateFaq = (
    index: number,
    field: keyof FAQItem,
    val: FAQItem[keyof FAQItem]
  ) => {
    const faqs = [...(petSitting?.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: val };
    updatePetSitting("faqs", faqs);
  };

  const handleDeleteFaq = (index: number) => {
    const faqs = [...(petSitting?.faqs || [])];
    faqs.splice(index, 1);
    updatePetSitting("faqs", faqs);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs */}
      <div className="flex gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab("services")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "services"
              ? "bg-pawcab-gold text-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Quote factors ({(petSitting?.services || []).length})
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
          FAQs ({(petSitting?.faqs || []).length})
        </button>
      </div>

      {/* 1. SERVICES */}
      {activeSubTab === "services" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Pet Sitting Services</h3>
              <p className="text-xs text-neutral-400">
                Drop-in visits, half-day companions, and overnight house sitting packages.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add Service Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(petSitting?.services || []).map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleUpdateService(idx, "popular", !srv.popular)}
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition ${
                        srv.popular
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : "bg-neutral-900 text-neutral-500 hover:text-neutral-400 border border-neutral-800"
                      }`}
                    >
                      <BsStarFill className="text-[10px]" />
                      <span>{srv.popular ? "Popular" : "Standard"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(idx)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                      title="Delete Service"
                    >
                      <BsTrash3 className="text-xs" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => handleUpdateService(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Subtitle / Duration
                    </label>
                    <input
                      type="text"
                      value={srv.subtitle}
                      onChange={(e) => handleUpdateService(idx, "subtitle", e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Price (IDR)
                      </label>
                      <input
                        type="number"
                        step={10000}
                        value={srv.price}
                        onChange={(e) =>
                          handleUpdateService(idx, "price", parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-pawcab-gold font-bold text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={srv.unit}
                        onChange={(e) => handleUpdateService(idx, "unit", e.target.value)}
                        placeholder="/ visit"
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Features List (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(srv.features || []).join("\n")}
                      onChange={(e) =>
                        handleUpdateService(
                          idx,
                          "features",
                          e.target.value.split("\n").filter((f) => f.trim().length > 0)
                        )
                      }
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
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
            <h3 className="font-display text-xl font-bold text-white">Pet Sitting Hero Banner</h3>
            <p className="text-xs text-neutral-400">
              Hero title, subtitle, and photo for `/services/pet-sitting`.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={petSitting?.hero?.badge || ""}
                onChange={(e) =>
                  updatePetSitting("hero", { ...petSitting?.hero, badge: e.target.value })
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
                value={petSitting?.hero?.title || ""}
                onChange={(e) =>
                  updatePetSitting("hero", { ...petSitting?.hero, title: e.target.value })
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
                value={petSitting?.hero?.subtitle || ""}
                onChange={(e) =>
                  updatePetSitting("hero", { ...petSitting?.hero, subtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Hero Photo"
                value={petSitting?.hero?.heroImage || ""}
                onChange={(val) =>
                  updatePetSitting("hero", { ...petSitting?.hero, heroImage: val })
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
              <h3 className="font-display text-xl font-bold text-white">Pet Sitting FAQs</h3>
              <p className="text-xs text-neutral-400">
                Frequently asked questions on meet-and-greets and medications.
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
            {(petSitting?.faqs || []).map((faq, idx) => (
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

