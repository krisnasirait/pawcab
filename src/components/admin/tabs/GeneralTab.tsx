"use client";

import React from "react";
import { AppContent } from "@/types/content";
import { BsGlobe, BsWhatsapp } from "react-icons/bs";

interface GeneralTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
}

export default function GeneralTab({ content, onChange }: GeneralTabProps) {
  const updateSite = (field: keyof AppContent["site"], val: string) => {
    onChange({
      ...content,
      site: {
        ...content.site,
        [field]: val,
      },
    });
  };

  const updateFooter = (
    field: keyof AppContent["footer"],
    val: AppContent["footer"][keyof AppContent["footer"]]
  ) => {
    onChange({
      ...content,
      footer: {
        ...content.footer,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Brand & Identity */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <h3 className="font-playfair text-xl font-bold text-white mb-1 flex items-center gap-2">
          <BsGlobe className="text-pawcab-gold text-lg" />
          <span>Brand & Identity</span>
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Global identity, title, and brand tagline used across the website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Website / Brand Name
            </label>
            <input
              type="text"
              value={content.site?.name || ""}
              onChange={(e) => updateSite("name", e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Brand Tagline
            </label>
            <input
              type="text"
              value={content.site?.tagline || ""}
              onChange={(e) => updateSite("tagline", e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>
        </div>
      </div>

      {/* Contact & WhatsApp */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <h3 className="font-playfair text-xl font-bold text-white mb-1 flex items-center gap-2">
          <BsWhatsapp className="text-emerald-400 text-lg" />
          <span>Contact & Socials</span>
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Manage your WhatsApp hotline, operating hours, email, and social profiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Display Phone
            </label>
            <input
              type="text"
              value={content.site?.phone || ""}
              onChange={(e) => updateSite("phone", e.target.value)}
              placeholder="+62 858-xxxx-xxxx"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              WhatsApp Number (Digits only, no +, e.g. 62822...)
            </label>
            <input
              type="text"
              value={content.site?.whatsapp || ""}
              onChange={(e) => updateSite("whatsapp", e.target.value.replace(/\D/g, ""))}
              placeholder="6285857883906"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Default WhatsApp Inquire Message
            </label>
            <textarea
              rows={2}
              value={content.site?.defaultWhatsappMessage || ""}
              onChange={(e) => updateSite("defaultWhatsappMessage", e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={content.site?.instagram || ""}
              onChange={(e) => updateSite("instagram", e.target.value)}
              placeholder="thepawcab"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Instagram Full URL
            </label>
            <input
              type="text"
              value={content.site?.instagramUrl || ""}
              onChange={(e) => updateSite("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/thepawcab"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={content.site?.email || ""}
              onChange={(e) => updateSite("email", e.target.value)}
              placeholder="hello@thepawcab.com"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Operating Hours
            </label>
            <input
              type="text"
              value={content.site?.operatingHours || ""}
              onChange={(e) => updateSite("operatingHours", e.target.value)}
              placeholder="Daily 07:00 - 21:00 WITA"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Service Area Description
            </label>
            <input
              type="text"
              value={content.site?.serviceArea || ""}
              onChange={(e) => updateSite("serviceArea", e.target.value)}
              placeholder="Denpasar, Badung, Gianyar, Tabanan & across Bali"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <h3 className="font-playfair text-xl font-bold text-white mb-1">Footer Configuration</h3>
        <p className="text-xs text-neutral-400 mb-6">
          Footer brand description, copyright line, and links.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Footer Description
            </label>
            <textarea
              rows={2}
              value={content.footer?.brandDescription || ""}
              onChange={(e) => updateFooter("brandDescription", e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Copyright Notice
            </label>
            <input
              type="text"
              value={content.footer?.copyrightText || ""}
              onChange={(e) => updateFooter("copyrightText", e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

