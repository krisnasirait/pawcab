"use client";

import React, { useState } from "react";
import { BsArrowRight, BsStarFill } from "react-icons/bs";
import { PiMapPin, PiCalendarBlank } from "react-icons/pi";
import contentData from "@/lib/content";

export type Story = {
  id: string;
  title: string;
  petName: string;
  ownerName: string;
  category: "adventures" | "vet" | "relocation" | "daily";
  categoryLabel: string;
  location: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  fullStory: string;
  quote: string;
  rating: number;
};

const defaultStoriesData: Story[] = [
  {
    id: "luna-echo-beach",
    title: "Luna's First Sunset Run at Echo Beach",
    petName: "Luna",
    ownerName: "Sarah & Luna",
    category: "adventures",
    categoryLabel: "Beach Adventure",
    location: "Canggu to Echo Beach",
    date: "October 2026",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Two happy dogs running freely on open grass in the sunshine",
    excerpt:
      "Luna used to get car-sick on normal rides. With PawCab’s spacious, temperature-controlled cabin and her human right beside her, she had the calmest ride of her life.",
    fullStory:
      "Before discovering PawCab, getting Luna into any regular car was a stressful ordeal. She would pace, pant, and refuse to enter. PawCab provided a flat, clean floor mat, gentle air conditioning, and a driver who understood pets. By the time we arrived at Echo Beach, Luna was relaxed, happy, and energized for an unforgettable sunset run.",
    quote:
      "PawCab completely changed how we explore Bali. Luna hopped in without any hesitation!",
    rating: 5,
  },
  {
    id: "milo-koko-ubud",
    title: "Milo & Koko: Moving to Their New Villa in Ubud",
    petName: "Milo & Koko",
    ownerName: "David & Christine",
    category: "relocation",
    categoryLabel: "Villa Relocation",
    location: "Seminyak to Ubud",
    date: "September 2026",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Cute calm cat looking comfortably through soft light",
    excerpt:
      "Relocating two rescue cats across Bali can be noisy and nerve-wracking. PawCab provided a quiet, crate-secure environment with smooth braking all the way.",
    fullStory:
      "Cats are sensitive to motion and loud noises. When moving our villa from Seminyak up to Ubud, we were dreading the two-hour transit. PawCab arrived on time, secured the carriers safely, kept the vehicle cool and quiet, and took the scenic roads with minimal abrupt stops. Both cats arrived purring and calm.",
    quote:
      "Door-to-door, prompt arrival, and zero complaints from our two cats the whole trip.",
    rating: 5,
  },
  {
    id: "rocky-sunset-vet",
    title: "Rocky's Post-Surgery Comfort Ride",
    petName: "Rocky",
    ownerName: "Amanda M.",
    category: "vet",
    categoryLabel: "Vet & Health",
    location: "Sanur to Sunset Vet",
    date: "October 2026",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Golden retriever dog resting calmly with head down",
    excerpt:
      "After an unexpected surgery, Rocky needed extra gentle handling. The PawCab team assisted with smooth boarding, plush padding, and careful navigation.",
    fullStory:
      "Rocky had a delicate leg surgery and couldn't be jostled around. The PawCab driver helped lift him onto a supportive orthopedic blanket in the rear cabin, drove at a careful pace, and took extra wide turns. It gave me immense peace of mind knowing he was comfortable every meter of the ride.",
    quote:
      "The driver was empathetic and drove with exceptional care. Truly grateful.",
    rating: 5,
  },
  {
    id: "bruno-uluwatu-adventure",
    title: "Bruno's Sunny Day in Uluwatu",
    petName: "Bruno",
    ownerName: "Michael & Maya",
    category: "adventures",
    categoryLabel: "Day Adventure",
    location: "Uluwatu Cliffs & Cafes",
    date: "August 2026",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
    imageAlt:
      "Happy dog seated inside car with safety harness enjoying the ride",
    excerpt:
      "Bruno spent a sunny afternoon exploring pet-friendly cafes along the Bukit peninsula. PawCab picked them up with cold fresh water and crisp AC ready.",
    fullStory:
      "A 35kg Labrador in Bali heat usually means endless drool and car distress. With PawCab, Bruno had ample room to lie down fully stretched out, chilled water bowl on standby, and plenty of fresh cool airflow. We hit three different cafes in Uluwatu without a single worry about transport.",
    quote:
      "Traveling around Bali with a 35kg lab has never been this seamless and enjoyable.",
    rating: 5,
  },
  {
    id: "bella-grooming-day",
    title: "Bella's Regular Salon Day in Style",
    petName: "Bella",
    ownerName: "Jessica T.",
    category: "daily",
    categoryLabel: "Routine Care",
    location: "Kerobokan to Grooming Salon",
    date: "October 2026",
    image:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Fluffy and adorable puppy looking clean and pampered",
    excerpt:
      "No fur worries, no taxi rejections. Bella enjoys her monthly pampering trips smelling fresh, riding back safely without messing any seats.",
    fullStory:
      "Hailing a regular taxi with a dog in Bali is always a gamble. PawCab is built specifically for pets. Whether Bella is on her way to get washed or coming back fluffed and smelling like lavender, PawCab treats her like royalty. It makes routine pet maintenance effortless.",
    quote:
      "PawCab makes routine grooming runs completely stress-free. Always on time!",
    rating: 5,
  },
  {
    id: "whiskey-sunset-walk",
    title: "Whiskey's Sunset Walk at Pererenan",
    petName: "Whiskey",
    ownerName: "Tom H.",
    category: "adventures",
    categoryLabel: "Beach Walk",
    location: "Pererenan Beach",
    date: "September 2026",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Attentive dog enjoying walking outdoors in nature",
    excerpt:
      "With high energy and curiosity, Whiskey needed an afternoon outing while his owner was working. PawCab picked him up and delivered live photo updates on WhatsApp.",
    fullStory:
      "Working remotely in Bali means busy afternoon Zoom meetings. Whiskey was bursting with energy, so we booked a PawCab beach walk. The handler sent real-time photos of Whiskey splashing in shallow waves, followed by a clean-paws towel return right back to our villa.",
    quote:
      "The live photos sent to my WhatsApp gave me total peace of mind during work.",
    rating: 5,
  },
];

type CategoryFilter = "all" | "adventures" | "vet" | "relocation" | "daily";

export default function StoriesGrid() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const cmsStories = (contentData.stories?.storiesList as unknown as Story[]) || [];
  const storiesList = cmsStories.length > 0 ? cmsStories : defaultStoriesData;

  const filteredStories = storiesList.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <section
      id="stories-list"
      className="py-16 md:py-24 px-6 md:px-10 bg-warm-ivory"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header & Category Filters */}
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-midnight/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-soft-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-sand-beige shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl bg-sand-beige/20">
              <img
                src={selectedStory.image}
                alt={selectedStory.imageAlt}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-deep-midnight/80 text-white flex items-center justify-center hover:bg-deep-midnight transition-colors cursor-pointer"
                aria-label="Close story"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="inline-block px-3 py-1 rounded-full bg-pawcab-gold text-deep-midnight text-xs font-bold uppercase tracking-wider shadow">
                  {selectedStory.categoryLabel}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 text-xs text-warm-taupe font-medium mb-3">
                <span className="flex items-center gap-1.5">
                  <PiMapPin className="text-pawcab-gold text-sm" />
                  {selectedStory.location}
                </span>
                <span>•</span>
                <span>{selectedStory.date}</span>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl text-deep-midnight font-bold leading-snug mb-4">
                {selectedStory.title}
              </h3>

              <div className="prose text-warm-taupe text-sm md:text-base leading-relaxed space-y-4 mb-8">
                <p>{selectedStory.fullStory}</p>
              </div>

              {/* Quote Highlight */}
              <div className="bg-warm-ivory rounded-2xl p-5 border border-sand-beige/50 mb-6">
                <div className="flex items-center gap-1 text-pawcab-gold mb-2">
                  {[...Array(selectedStory.rating)].map((_, i) => (
                    <BsStarFill key={i} className="text-sm" />
                  ))}
                </div>
                <p className="text-sm italic text-deep-midnight font-medium mb-2">
                  &ldquo;{selectedStory.quote}&rdquo;
                </p>
                <p className="text-xs text-warm-taupe font-semibold">
                  — {selectedStory.ownerName}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 rounded-full border border-deep-midnight/20 text-deep-midnight text-xs font-semibold uppercase tracking-wider hover:bg-deep-midnight/5 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={`https://wa.me/?text=Hi%20PawCab,%20I%20read%20the%20story%20about%20${encodeURIComponent(
                    selectedStory.petName,
                  )}%20and%20would%20like%20to%20book%20a%20ride%20for%20my%20pet.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-pawcab-gold text-deep-midnight text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Book a Similar Ride <BsArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
