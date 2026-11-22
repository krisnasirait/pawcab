"use client";

import React, { useState } from "react";
import { AppContent, GalleryItem } from "@/types/content";
import ImageField from "../ImageField";
import { BsPlusLg, BsTrash3 } from "react-icons/bs";

interface HomeTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
}

export default function HomeTab({ content, onChange }: HomeTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    | "hero"
    | "features"
    | "about"
    | "services"
    | "coverage"
    | "gallery"
    | "comfort"
    | "reviews"
    | "howItWorks"
  >("hero");

  const updateHero = (
    field: keyof AppContent["home"]["hero"],
    val: AppContent["home"]["hero"][keyof AppContent["home"]["hero"]]
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        hero: {
          ...content.home.hero,
          [field]: val,
        },
      },
    });
  };

  const updateAbout = (
    field: keyof AppContent["home"]["about"],
    val: AppContent["home"]["about"][keyof AppContent["home"]["about"]]
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        about: {
          ...content.home.about,
          [field]: val,
        },
      },
    });
  };

  const updateCoverage = (
    field: keyof AppContent["home"]["coverage"],
    val: AppContent["home"]["coverage"][keyof AppContent["home"]["coverage"]]
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        coverage: {
          ...content.home.coverage,
          [field]: val,
        },
      },
    });
  };

  const updateComfort = (
    field: keyof AppContent["home"]["comfort"],
    val: AppContent["home"]["comfort"][keyof AppContent["home"]["comfort"]]
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        comfort: {
          ...content.home.comfort,
          [field]: val,
        },
      },
    });
  };

  const updateReviews = (
    field: keyof AppContent["home"]["reviews"],
    val: string
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        reviews: {
          ...content.home.reviews,
          [field]: val,
        },
      },
    });
  };

  const updateHowItWorks = (
    field: keyof AppContent["home"]["howItWorks"],
    val: AppContent["home"]["howItWorks"][keyof AppContent["home"]["howItWorks"]]
  ) => {
    onChange({
      ...content,
      home: {
        ...content.home,
        howItWorks: {
          ...content.home.howItWorks,
          [field]: val,
        },
      },
    });
  };

  // Gallery handlers
  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      name: "New Furry Passenger",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
    };
    onChange({
      ...content,
      home: {
        ...content.home,
        gallery: {
          ...content.home.gallery,
          items: [...(content.home.gallery?.items || []), newItem],
        },
      },
    });
  };

  const handleUpdateGalleryItem = (index: number, field: keyof GalleryItem, val: string) => {
    const items = [...(content.home.gallery?.items || [])];
    items[index] = { ...items[index], [field]: val };
    onChange({
      ...content,
      home: {
        ...content.home,
        gallery: {
          ...content.home.gallery,
          items,
        },
      },
    });
  };

  const handleDeleteGalleryItem = (index: number) => {
    const items = [...(content.home.gallery?.items || [])];
    items.splice(index, 1);
    onChange({
      ...content,
      home: {
        ...content.home,
        gallery: {
          ...content.home.gallery,
          items,
        },
      },
    });
  };

  const subTabs = [
    { id: "hero", label: "Hero Banner" },
    { id: "features", label: "Features Row" },
    { id: "about", label: "About PawCab" },
    { id: "services", label: "Core Services" },
    { id: "coverage", label: "Bali Coverage" },
    { id: "gallery", label: "Passengers Gallery" },
    { id: "comfort", label: "Comfort & Safety" },
    { id: "reviews", label: "Customer Reviews" },
    { id: "howItWorks", label: "How It Works" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-pawcab-gold text-midnight shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. HERO SECTION */}
      {activeSubTab === "hero" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Homepage Hero Banner</h3>
            <p className="text-xs text-neutral-400">
              Manage the primary visual headline, description, call-to-actions, and background image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Header Badge
              </label>
              <input
                type="text"
                value={content.home?.hero?.badge || ""}
                onChange={(e) => updateHero("badge", e.target.value)}
                placeholder="Exclusive Pet Mobility"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Headline Line 1
              </label>
              <input
                type="text"
                value={content.home?.hero?.title1 || ""}
                onChange={(e) => updateHero("title1", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Headline Line 2
              </label>
              <input
                type="text"
                value={content.home?.hero?.title2 || ""}
                onChange={(e) => updateHero("title2", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Headline Line 3 (Gold Accent & Italic)
              </label>
              <input
                type="text"
                value={content.home?.hero?.title3Accent || ""}
                onChange={(e) => updateHero("title3Accent", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={content.home?.hero?.description || ""}
                onChange={(e) => updateHero("description", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={content.home?.hero?.primaryCtaText || ""}
                onChange={(e) => updateHero("primaryCtaText", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Primary CTA URL / WhatsApp Link
              </label>
              <input
                type="text"
                value={content.home?.hero?.primaryCtaHref || ""}
                onChange={(e) => updateHero("primaryCtaHref", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={content.home?.hero?.secondaryCtaText || ""}
                onChange={(e) => updateHero("secondaryCtaText", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Secondary CTA URL
              </label>
              <input
                type="text"
                value={content.home?.hero?.secondaryCtaHref || ""}
                onChange={(e) => updateHero("secondaryCtaHref", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Hero Background Image"
                value={content.home?.hero?.bgImage || ""}
                onChange={(val) => updateHero("bgImage", val)}
                helperText="Recommended size: 1920x1080px or high resolution landscape photo."
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. FEATURES ROW */}
      {activeSubTab === "features" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">4 Feature Highlights Row</h3>
            <p className="text-xs text-neutral-400">
              The 4 key pillars displayed directly below the hero banner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(content.home?.features || []).map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-pawcab-gold uppercase tracking-wider">
                    Feature #{idx + 1}
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={feat.title || ""}
                    onChange={(e) => {
                      const feats = [...(content.home.features || [])];
                      feats[idx] = { ...feats[idx], title: e.target.value };
                      onChange({
                        ...content,
                        home: { ...content.home, features: feats },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={feat.description || ""}
                    onChange={(e) => {
                      const feats = [...(content.home.features || [])];
                      feats[idx] = { ...feats[idx], description: e.target.value };
                      onChange({
                        ...content,
                        home: { ...content.home, features: feats },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ABOUT SECTION */}
      {activeSubTab === "about" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">About The PawCab</h3>
            <p className="text-xs text-neutral-400">
              Story intro, photo, and background overlay on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={content.home?.about?.badge || ""}
                onChange={(e) => updateAbout("badge", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.home?.about?.ctaText || ""}
                onChange={(e) => updateAbout("ctaText", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 1
              </label>
              <input
                type="text"
                value={content.home?.about?.headingLine1 || ""}
                onChange={(e) => updateAbout("headingLine1", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 2
              </label>
              <input
                type="text"
                value={content.home?.about?.headingLine2 || ""}
                onChange={(e) => updateAbout("headingLine2", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Story Paragraph
              </label>
              <textarea
                rows={3}
                value={content.home?.about?.description || ""}
                onChange={(e) => updateAbout("description", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="About Section Image"
                value={content.home?.about?.image || ""}
                onChange={(val) => updateAbout("image", val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SERVICES SECTION */}
      {activeSubTab === "services" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">3 Core Services Showcase</h3>
            <p className="text-xs text-neutral-400">
              Manage the 3 main cards displayed on the homepage services section.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(content.home?.services?.items || []).map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pawcab-gold/20 text-pawcab-gold font-mono">
                    Service {srv.id}
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={srv.title || ""}
                      onChange={(e) => {
                        const items = [...(content.home.services?.items || [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        onChange({
                          ...content,
                          home: {
                            ...content.home,
                            services: { ...content.home.services, items },
                          },
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={srv.description || ""}
                      onChange={(e) => {
                        const items = [...(content.home.services?.items || [])];
                        items[idx] = { ...items[idx], description: e.target.value };
                        onChange({
                          ...content,
                          home: {
                            ...content.home,
                            services: { ...content.home.services, items },
                          },
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                    />
                  </div>

                  <ImageField
                    label="Cover Photo"
                    value={srv.image || ""}
                    onChange={(val) => {
                      const items = [...(content.home.services?.items || [])];
                      items[idx] = { ...items[idx], image: val };
                      onChange({
                        ...content,
                        home: {
                          ...content.home,
                          services: { ...content.home.services, items },
                        },
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BALI COVERAGE */}
      {activeSubTab === "coverage" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Bali Coverage Section</h3>
            <p className="text-xs text-neutral-400">
              The zone map illustration and Bali landscape banner on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={content.home?.coverage?.badge || ""}
                onChange={(e) => updateCoverage("badge", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.home?.coverage?.ctaText || ""}
                onChange={(e) => updateCoverage("ctaText", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 1
              </label>
              <input
                type="text"
                value={content.home?.coverage?.headingLine1 || ""}
                onChange={(e) => updateCoverage("headingLine1", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 2
              </label>
              <input
                type="text"
                value={content.home?.coverage?.headingLine2 || ""}
                onChange={(e) => updateCoverage("headingLine2", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                rows={2}
                value={content.home?.coverage?.description || ""}
                onChange={(e) => updateCoverage("description", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <ImageField
                label="Side Landscape Photo"
                value={content.home?.coverage?.sideImage || ""}
                onChange={(val) => updateCoverage("sideImage", val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. PASSENGERS GALLERY */}
      {activeSubTab === "gallery" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Passengers Gallery ({(content.home?.gallery?.items || []).length} Pets)
              </h3>
              <p className="text-xs text-neutral-400">
                Manage the photo reel of happy furry passengers traveling with The PawCab.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add Passenger Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(content.home?.gallery?.items || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(idx)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                    title="Delete passenger photo"
                  >
                    <BsTrash3 className="text-xs" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Pet Name / Caption
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateGalleryItem(idx, "name", e.target.value)}
                    placeholder="e.g. Luna"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <ImageField
                  label="Pet Photo"
                  value={item.image}
                  onChange={(val) => handleUpdateGalleryItem(idx, "image", val)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. COMFORT & SAFETY */}
      {activeSubTab === "comfort" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Comfort & Safety Section</h3>
            <p className="text-xs text-neutral-400">
              Details on vehicle hygiene, crate options, and safety equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={content.home?.comfort?.badge || ""}
                onChange={(e) => updateComfort("badge", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 1
              </label>
              <input
                type="text"
                value={content.home?.comfort?.headingLine1 || ""}
                onChange={(e) => updateComfort("headingLine1", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading Line 2
              </label>
              <input
                type="text"
                value={content.home?.comfort?.headingLine2 || ""}
                onChange={(e) => updateComfort("headingLine2", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={content.home?.comfort?.description || ""}
                onChange={(e) => updateComfort("description", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Feature Bullet Points (1 per line)
              </label>
              <textarea
                rows={4}
                value={(content.home?.comfort?.features || []).join("\n")}
                onChange={(e) =>
                  updateComfort(
                    "features",
                    e.target.value.split("\n").filter((f) => f.trim().length > 0)
                  )
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Comfort / Crate Photo"
                value={content.home?.comfort?.image || ""}
                onChange={(val) => updateComfort("image", val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. REVIEWS */}
      {activeSubTab === "reviews" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Google Reviews Widget</h3>
            <p className="text-xs text-neutral-400">
              Integrated with Elfsight Google Reviews widget.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Section Heading
              </label>
              <input
                type="text"
                value={content.home?.reviews?.heading || ""}
                onChange={(e) => updateReviews("heading", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Elfsight App Class ID
              </label>
              <input
                type="text"
                value={content.home?.reviews?.elfsightAppId || ""}
                onChange={(e) => updateReviews("elfsightAppId", e.target.value)}
                placeholder="elfsight-app-c1a7d814-8e07-4cf9-b595-0369eaca3594"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                The class name from your Elfsight dashboard embedding code.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 9. HOW IT WORKS */}
      {activeSubTab === "howItWorks" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">4 Step How It Works</h3>
            <p className="text-xs text-neutral-400">
              The straightforward booking process displayed at the bottom of the page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={content.home?.howItWorks?.badge || ""}
                onChange={(e) => updateHowItWorks("badge", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Heading
              </label>
              <input
                type="text"
                value={content.home?.howItWorks?.heading || ""}
                onChange={(e) => updateHowItWorks("heading", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(content.home?.howItWorks?.steps || []).map((step, idx) => (
              <div
                key={step.number || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pawcab-gold text-midnight text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Step {step.number}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const steps = [...(content.home.howItWorks?.steps || [])];
                      steps[idx] = { ...steps[idx], title: e.target.value };
                      onChange({
                        ...content,
                        home: {
                          ...content.home,
                          howItWorks: { ...content.home.howItWorks, steps },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const steps = [...(content.home.howItWorks?.steps || [])];
                      steps[idx] = { ...steps[idx], description: e.target.value };
                      onChange({
                        ...content,
                        home: {
                          ...content.home,
                          howItWorks: { ...content.home.howItWorks, steps },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
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

