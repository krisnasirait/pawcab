"use client";

import React, { useState } from "react";
import { AppContent, StoriesContent, StoryItem } from "@/types/content";
import ImageField from "../ImageField";
import { BsPlusLg, BsTrash3, BsBookmarkStar } from "react-icons/bs";

interface StoriesTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
  onRequestDeleteConfirm: (title: string, onConfirm: () => void) => void;
}

export default function StoriesTab({
  content,
  onChange,
  onRequestDeleteConfirm,
}: StoriesTabProps) {
  const [activeSection, setActiveSection] = useState<
    "stories" | "spotlight" | "metrics" | "hero"
  >("stories");

  const stories = content.stories;

  const updateStories = (
    field: keyof StoriesContent,
    val: StoriesContent[keyof StoriesContent]
  ) => {
    onChange({
      ...content,
      stories: {
        ...stories,
        [field]: val,
      },
    });
  };

  // Add / Edit / Delete Story
  const handleAddStory = () => {
    const newStory: StoryItem = {
      id: `story-${Date.now()}`,
      title: "New PawCab Adventure",
      petName: "Pet Name",
      ownerName: "Owner Name",
      category: "adventures",
      categoryLabel: "Beach Adventure",
      location: "Canggu to Seminyak",
      date: "November 2026",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
      excerpt: "Short summary of the story here...",
      fullStory: "Full story description of the ride experience...",
      quote: "A wonderful quote from the pet owner.",
      rating: 5,
    };
    updateStories("storiesList", [newStory, ...(stories?.storiesList || [])]);
  };

  const handleUpdateStory = (
    index: number,
    field: keyof StoryItem,
    val: StoryItem[keyof StoryItem]
  ) => {
    const list = [...(stories?.storiesList || [])];
    list[index] = { ...list[index], [field]: val };
    updateStories("storiesList", list);
  };

  const handleDeleteStory = (index: number) => {
    const story = stories?.storiesList?.[index];
    onRequestDeleteConfirm(
      `Are you sure you want to delete "${story?.title || "this story"}"?`,
      () => {
        const list = [...(stories?.storiesList || [])];
        list.splice(index, 1);
        updateStories("storiesList", list);
      }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSection("stories")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSection === "stories"
              ? "bg-pawcab-gold text-deep-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Customer Stories ({(stories?.storiesList || []).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("spotlight")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSection === "spotlight"
              ? "bg-pawcab-gold text-deep-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Spotlight Story
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("metrics")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSection === "metrics"
              ? "bg-pawcab-gold text-deep-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Key Metrics & Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("hero")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeSection === "hero"
              ? "bg-pawcab-gold text-deep-midnight shadow-md"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Hero Banner
        </button>
      </div>

      {/* 1. STORIES LIST */}
      {activeSection === "stories" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-playfair text-xl font-bold text-white">PawCab Customer Stories</h3>
              <p className="text-xs text-neutral-400">
                Manage the community gallery of verified pet passenger experiences in Bali.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStory}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-deep-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add New Story
            </button>
          </div>

          <div className="space-y-6">
            {(stories?.storiesList || []).map((story, idx) => (
              <div
                key={story.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-pawcab-gold/20 text-pawcab-gold font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-neutral-200">
                      {story.title || "Untitled Story"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteStory(idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-red-400 hover:text-error-dark hover:bg-red-950/40 rounded-lg transition cursor-pointer w-fit"
                  >
                    <BsTrash3 /> Delete Story
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Story Headline
                      </label>
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => handleUpdateStory(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Pet Name
                        </label>
                        <input
                          type="text"
                          value={story.petName}
                          onChange={(e) => handleUpdateStory(idx, "petName", e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          value={story.ownerName}
                          onChange={(e) => handleUpdateStory(idx, "ownerName", e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Category
                        </label>
                        <select
                          value={story.category}
                          onChange={(e) => handleUpdateStory(idx, "category", e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                        >
                          <option value="adventures">Beach / Adventure</option>
                          <option value="vet">Veterinary Care</option>
                          <option value="relocation">Villa Relocation</option>
                          <option value="daily">Daily Rides</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={story.location}
                          onChange={(e) => handleUpdateStory(idx, "location", e.target.value)}
                          placeholder="e.g. Canggu"
                          className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Short Excerpt (Grid Card)
                      </label>
                      <textarea
                        rows={2}
                        value={story.excerpt}
                        onChange={(e) => handleUpdateStory(idx, "excerpt", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Full Story (Modal Dialog)
                      </label>
                      <textarea
                        rows={3}
                        value={story.fullStory}
                        onChange={(e) => handleUpdateStory(idx, "fullStory", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Owner Quote
                      </label>
                      <input
                        type="text"
                        value={story.quote}
                        onChange={(e) => handleUpdateStory(idx, "quote", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs italic focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageField
                      label="Story Photo"
                      value={story.image}
                      onChange={(val) => handleUpdateStory(idx, "image", val)}
                      helperText="Square or landscape high-quality photo of the pet."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SPOTLIGHT STORY */}
      {activeSection === "spotlight" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
              <BsBookmarkStar className="text-pawcab-gold" />
              <span>Spotlight Featured Story</span>
            </h3>
            <p className="text-xs text-neutral-400">
              The prominent hero feature showcased on the top of the Stories page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Headline Title
              </label>
              <input
                type="text"
                value={stories?.spotlightStory?.title || ""}
                onChange={(e) =>
                  updateStories("spotlightStory", {
                    ...stories?.spotlightStory,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={stories?.spotlightStory?.petName || ""}
                  onChange={(e) =>
                    updateStories("spotlightStory", {
                      ...stories?.spotlightStory,
                      petName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={stories?.spotlightStory?.ownerName || ""}
                  onChange={(e) =>
                    updateStories("spotlightStory", {
                      ...stories?.spotlightStory,
                      ownerName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Owner Quote
              </label>
              <input
                type="text"
                value={stories?.spotlightStory?.quote || ""}
                onChange={(e) =>
                  updateStories("spotlightStory", {
                    ...stories?.spotlightStory,
                    quote: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Full Spotlight Story
              </label>
              <textarea
                rows={4}
                value={stories?.spotlightStory?.story || ""}
                onChange={(e) =>
                  updateStories("spotlightStory", {
                    ...stories?.spotlightStory,
                    story: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Spotlight Image"
                value={stories?.spotlightStory?.image || ""}
                onChange={(val) =>
                  updateStories("spotlightStory", {
                    ...stories?.spotlightStory,
                    image: val,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. KEY METRICS */}
      {activeSection === "metrics" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-playfair text-xl font-bold text-white">Impact & Trust Metrics</h3>
            <p className="text-xs text-neutral-400">
              The 4 statistical counters displayed on the Stories page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(stories?.metrics || []).map((m, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => {
                      const metrics = [...(stories?.metrics || [])];
                      metrics[idx] = { ...metrics[idx], label: e.target.value };
                      updateStories("metrics", metrics);
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Stat Value
                  </label>
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => {
                      const metrics = [...(stories?.metrics || [])];
                      metrics[idx] = { ...metrics[idx], value: e.target.value };
                      updateStories("metrics", metrics);
                    }}
                    placeholder="1,200+"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={m.description}
                    onChange={(e) => {
                      const metrics = [...(stories?.metrics || [])];
                      metrics[idx] = { ...metrics[idx], description: e.target.value };
                      updateStories("metrics", metrics);
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HERO */}
      {activeSection === "hero" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-playfair text-xl font-bold text-white">Stories Page Hero</h3>
            <p className="text-xs text-neutral-400">
              Hero title, subtitle, and photo for `/stories`.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={stories?.hero?.badge || ""}
                onChange={(e) =>
                  updateStories("hero", { ...stories?.hero, badge: e.target.value })
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
                value={stories?.hero?.title || ""}
                onChange={(e) =>
                  updateStories("hero", { ...stories?.hero, title: e.target.value })
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
                value={stories?.hero?.subtitle || ""}
                onChange={(e) =>
                  updateStories("hero", { ...stories?.hero, subtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Hero Photo"
                value={stories?.hero?.heroImage || ""}
                onChange={(val) =>
                  updateStories("hero", { ...stories?.hero, heroImage: val })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

