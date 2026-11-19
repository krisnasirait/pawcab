"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BsArrowRight,
  BsInfoCircle,
  BsArrowLeftRight,
  BsWhatsapp,
  BsChevronDown,
  BsSearch,
  BsCheck2,
} from "react-icons/bs";
import {
  PiMapPin,
  PiNavigationArrow,
  PiCalculator,
  PiHouse,
  PiBuildings,
  PiLink,
  PiNotePencil,
} from "react-icons/pi";
import {
  PAWCAB_AREAS,
  calculateFare,
  formatRupiah,
} from "@/data/fareCalculatorData";

/* ============================================================================
   CUSTOM LOCATION SELECT DROPDOWN COMPONENT
   ============================================================================ */
interface LocationSelectProps {
  label: string;
  type: "pickup" | "dropoff";
  selectedId: string;
  onSelect: (id: string) => void;
}

function LocationSelect({
  label,
  type,
  selectedId,
  onSelect,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeZoneFilter, setActiveZoneFilter] = useState<number | "all">(
    "all",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedArea = useMemo(
    () => PAWCAB_AREAS.find((a) => a.id === selectedId) || PAWCAB_AREAS[0],
    [selectedId],
  );

  const isPickup = type === "pickup";

  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
    setActiveZoneFilter("all");
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectArea = (id: string) => {
    onSelect(id);
    handleClose();
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filtered areas based on query & zone filter
  const filteredAreas = useMemo(() => {
    return PAWCAB_AREAS.filter((area) => {
      const matchesSearch = area.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesZone =
        activeZoneFilter === "all" || area.zoneId === activeZoneFilter;
      return matchesSearch && matchesZone;
    });
  }, [search, activeZoneFilter]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Field Label */}
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold">
          {isPickup ? (
            <PiMapPin className="text-pawcab-gold text-base shrink-0" />
          ) : (
            <PiNavigationArrow className="text-pawcab-navy text-base shrink-0" />
          )}
          {label}
        </label>
        <span className="text-[10px] text-warm-taupe font-medium">
          {isPickup ? "Origin" : "Destination"}
        </span>
      </div>

      {/* Trigger Card */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full text-left rounded-2xl p-4 transition-all duration-300 border flex items-center justify-between gap-3 shadow-xs hover:shadow-md cursor-pointer ${
          isOpen
            ? "border-pawcab-navy bg-white ring-2 ring-pawcab-navy/20 shadow-md"
            : "border-sand-beige/70 bg-warm-ivory/50 hover:bg-white hover:border-pawcab-navy/60"
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Circular Badge Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform ${
              isPickup
                ? "bg-pawcab-gold/25 text-deep-midnight border border-pawcab-gold/50"
                : "bg-pawcab-navy/15 text-pawcab-navy border border-pawcab-navy/30"
            }`}
          >
            {isPickup ? (
              <PiMapPin className="text-xl text-deep-midnight" />
            ) : (
              <PiNavigationArrow className="text-xl text-pawcab-navy" />
            )}
          </div>

          {/* Area & Zone Information */}
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-warm-taupe leading-none mb-1">
              {isPickup ? "Pick up at" : "Drop off at"}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-playfair text-lg sm:text-xl font-bold text-deep-midnight truncate">
                {selectedArea.name}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sand-beige/40 text-[10px] font-bold text-deep-midnight uppercase tracking-wider border border-sand-beige/60">
                Zone {selectedArea.zoneId}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron Indicator */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 text-warm-taupe ${
            isOpen ? "rotate-180 text-deep-midnight bg-sand-beige/40" : ""
          }`}
        >
          <BsChevronDown className="text-xs" />
        </div>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-sand-beige/70 overflow-hidden">
          {/* Search Box Header */}
          <div className="p-3 border-b border-sand-beige/30 bg-warm-ivory/50 space-y-2.5">
            <div className="relative">
              <BsSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-taupe text-xs pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search area (e.g. Canggu, Sanur, Ubud)..."
                className="w-full bg-white border border-warm-taupe rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:ring-1 focus:ring-pawcab-navy transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-sm text-warm-taupe hover:text-deep-midnight w-11 h-11 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Zone Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-warm-taupe tracking-wider mr-1 shrink-0">
                Zone:
              </span>
              {(["all", 1, 2, 3, 4] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setActiveZoneFilter(z)}
                  className={`px-3 py-1 min-h-[44px] inline-flex items-center rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeZoneFilter === z
                      ? "bg-deep-midnight text-white shadow-xs"
                      : "bg-white text-warm-taupe border border-sand-beige/60 hover:bg-sand-beige/30"
                  }`}
                >
                  {z === "all" ? "All" : `Zone ${z}`}
                </button>
              ))}
            </div>
          </div>

          {/* Area List (Grouped by Zone) */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-sand-beige/20 overscroll-contain">
            {filteredAreas.length === 0 ? (
              <div className="py-8 text-center text-xs text-warm-taupe">
                No location found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              [1, 2, 3, 4]
                .filter(
                  (zId) =>
                    activeZoneFilter === "all" || activeZoneFilter === zId,
                )
                .map((zId) => {
                  const areasInZone = filteredAreas.filter(
                    (a) => a.zoneId === zId,
                  );
                  if (areasInZone.length === 0) return null;

                  return (
                    <div key={zId}>
                      {/* Sticky Zone Section Header */}
                      <div className="px-4 py-1.5 bg-sand-beige/25 text-[10px] font-bold uppercase tracking-widest text-warm-taupe sticky top-0 backdrop-blur-xs flex items-center justify-between border-y border-sand-beige/30">
                        <span>Zone {zId}</span>
                        <span className="text-[9px] font-medium text-warm-taupe">
                          {areasInZone.length}{" "}
                          {areasInZone.length === 1 ? "area" : "areas"}
                        </span>
                      </div>

                      {/* Area Items */}
                      {areasInZone.map((area) => {
                        const isSelected = area.id === selectedId;
                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => handleSelectArea(area.id)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-pawcab-gold/20 text-deep-midnight font-bold"
                                : "text-warm-taupe hover:bg-warm-ivory hover:text-deep-midnight"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isSelected
                                    ? "bg-pawcab-navy"
                                    : "bg-sand-beige/80"
                                }`}
                              />
                              <span className="truncate">{area.name}</span>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0 ml-2">
                              <span className="text-[10px] font-semibold text-warm-taupe">
                                Zone {area.zoneId}
                              </span>
                              {isSelected && (
                                <BsCheck2 className="text-pawcab-navy text-base font-bold shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN PET TRANSPORT PRICING COMPONENT
   ============================================================================ */
export default function PetTransportPricing() {
  // State: Default origin & destination (e.g., Seminyak -> Canggu)
  const [fromAreaId, setFromAreaId] = useState<string>("seminyak");
  const [toAreaId, setToAreaId] = useState<string>("canggu");

  // Specific address & maps links
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropoffAddress, setDropoffAddress] = useState<string>("");
  const [pickupMapsLink, setPickupMapsLink] = useState<string>("");
  const [dropoffMapsLink, setDropoffMapsLink] = useState<string>("");

  // Optional trip notes / pet details
  const [tripNote, setTripNote] = useState<string>("");

  // Fare & distance calculation
  const calculation = useMemo(() => {
    return calculateFare(fromAreaId, toAreaId);
  }, [fromAreaId, toAreaId]);

  const fromArea = useMemo(
    () => PAWCAB_AREAS.find((a) => a.id === fromAreaId) || PAWCAB_AREAS[0],
    [fromAreaId],
  );
  const toArea = useMemo(
    () => PAWCAB_AREAS.find((a) => a.id === toAreaId) || PAWCAB_AREAS[1],
    [toAreaId],
  );

  // Swap origin and destination details
  const handleSwap = () => {
    setFromAreaId(toAreaId);
    setToAreaId(fromAreaId);
    setPickupAddress(dropoffAddress);
    setDropoffAddress(pickupAddress);
    setPickupMapsLink(dropoffMapsLink);
    setDropoffMapsLink(pickupMapsLink);
  };

  // Automated WhatsApp booking message with full details
  const waMessage = useMemo(() => {
    let msg = `Hi PawCab, I would like to book a Pet Transport:\n\n`;
    msg += `📍 *PICKUP:* ${fromArea.name} (Zone ${calculation.fromZone})\n`;
    if (pickupAddress.trim()) {
      msg += `   Address: ${pickupAddress.trim()}\n`;
    }
    if (pickupMapsLink.trim()) {
      msg += `   Maps: ${pickupMapsLink.trim()}\n`;
    }

    msg += `\n🏁 *DROP-OFF:* ${toArea.name} (Zone ${calculation.toZone})\n`;
    if (dropoffAddress.trim()) {
      msg += `   Address: ${dropoffAddress.trim()}\n`;
    }
    if (dropoffMapsLink.trim()) {
      msg += `   Maps: ${dropoffMapsLink.trim()}\n`;
    }

    msg += `\n📏 *ESTIMATE:* ~${calculation.distanceKm} km (${formatRupiah(calculation.ratePerKm)}/km)\n`;
    msg += `💰 *TOTAL FARE:* ${formatRupiah(calculation.finalFare)}\n`;

    if (tripNote.trim()) {
      msg += `\n📝 *NOTE / PET DETAILS:*\n${tripNote.trim()}\n`;
    }

    msg += `\nPlease confirm driver availability. Thank you!`;
    return msg;
  }, [
    fromArea,
    toArea,
    calculation,
    pickupAddress,
    dropoffAddress,
    pickupMapsLink,
    dropoffMapsLink,
    tripNote,
  ]);

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 px-6 md:px-10 bg-soft-white border-t border-sand-beige/40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-pawcab-gold inline-block" />
            <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-warm-taupe font-semibold">
              PRICING
            </p>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-deep-midnight font-bold leading-tight mb-4">
            Zone-Based Fare
          </h2>
          <p className="text-warm-taupe font-normal text-base md:text-lg leading-relaxed">
            Calculate your private pet transportation fare based on distance
            (km) and zone-specific rates across Bali.
          </p>
        </div>

        {/* ========================================================
            INTERACTIVE CALCULATOR WIDGET (LUXURY CARD)
            ======================================================== */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-3xl p-6 sm:p-9 md:p-10 border border-sand-beige/50 shadow-xl relative overflow-visible">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pawcab-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Widget Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-sand-beige/30 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-warm-ivory border border-sand-beige/50 flex items-center justify-center text-deep-midnight">
                  <PiCalculator className="text-2xl text-deep-midnight" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight">
                    Trip Fare Estimator
                  </h3>
                  <p className="text-xs text-warm-taupe font-medium">
                    Select your pickup and drop-off points to view estimated
                    distance and rate per km
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pawcab-gold/20 text-deep-midnight text-xs font-semibold uppercase tracking-wider">
                <PiCalculator className="text-xs text-pawcab-navy" /> Per-KM Zone
                Matrix
              </span>
            </div>

            {/* Input Selectors: Redesigned Custom Dropdowns & Address Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-start mb-6">
              {/* Pickup Column */}
              <div className="lg:col-span-5 space-y-3.5">
                <LocationSelect
                  label="Pickup Location"
                  type="pickup"
                  selectedId={fromAreaId}
                  onSelect={(id) => setFromAreaId(id)}
                />

                {/* Pickup Address */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold mb-1.5">
                    <PiHouse className="text-pawcab-gold text-sm shrink-0" />
                    Pickup Address / Villa Name
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Villa Lotus, Jl. Kayu Aya No. 8"
                    className="w-full bg-warm-ivory/50 border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Pickup Google Maps Link (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold">
                      <PiLink className="text-pawcab-gold text-sm shrink-0" />
                      Google Maps Link
                    </label>
                    <span className="text-[10px] uppercase font-semibold text-warm-taupe bg-sand-beige/30 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>
                  <input
                    type="url"
                    value={pickupMapsLink}
                    onChange={(e) => setPickupMapsLink(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-warm-ivory/50 border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Swap Button Column */}
              <div className="lg:col-span-1 flex justify-center py-2 lg:py-0 self-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Pickup & Drop-off details"
                  className="w-12 h-12 rounded-full bg-white hover:bg-pawcab-gold text-deep-midnight border border-sand-beige/70 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer group"
                >
                  <BsArrowLeftRight className="text-base group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              {/* Drop-off Column */}
              <div className="lg:col-span-5 space-y-3.5">
                <LocationSelect
                  label="Drop-off Location"
                  type="dropoff"
                  selectedId={toAreaId}
                  onSelect={(id) => setToAreaId(id)}
                />

                {/* Drop-off Address */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold mb-1.5">
                    <PiBuildings className="text-pawcab-navy text-sm shrink-0" />
                    Drop-off Address / Destination Name
                  </label>
                  <input
                    type="text"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    placeholder="e.g. Sunset Vet Clinic, Jl. Sunset Road"
                    className="w-full bg-warm-ivory/50 border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Drop-off Google Maps Link (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold">
                      <PiLink className="text-pawcab-navy text-sm shrink-0" />
                      Google Maps Link
                    </label>
                    <span className="text-[10px] uppercase font-semibold text-warm-taupe bg-sand-beige/30 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>
                  <input
                    type="url"
                    value={dropoffMapsLink}
                    onChange={(e) => setDropoffMapsLink(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-warm-ivory/50 border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Note Section (Optional) */}
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-warm-ivory/40 border border-sand-beige/60">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold">
                  <PiNotePencil className="text-pawcab-navy text-base shrink-0" />
                  Trip Notes & Pet Details
                </label>
                <span className="text-[10px] uppercase font-semibold text-warm-taupe bg-sand-beige/30 px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <textarea
                value={tripNote}
                onChange={(e) => setTripNote(e.target.value)}
                rows={2}
                placeholder="e.g. 2 large dogs (Golden Retriever), owner will ride along, crate required, pick up at 10:00 AM..."
                className="w-full bg-white border border-warm-taupe rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy transition-all resize-none shadow-2xs"
              />
            </div>

            {/* Live Calculation Result Display (Luxury Gradient Card with PawCab Theme) */}
            <div className="rounded-3xl bg-gradient-to-br from-deep-midnight via-[#1c2e52] to-pawcab-navy text-soft-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Subtle gold accent blur */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-pawcab-gold/15 rounded-full blur-2xl pointer-events-none" />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left py-2">
                {/* Distance Indicator */}
                <div className="border-b md:border-b-0 md:border-r border-soft-white/15 pb-4 md:pb-0 md:pr-4">
                  <span className="text-[11px] uppercase tracking-widest text-soft-white/60 font-semibold block mb-1">
                    Estimated Distance
                  </span>
                  <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                    <span className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                      {calculation.distanceKm}
                    </span>
                    <span className="text-xs font-bold text-pawcab-gold uppercase tracking-wider">
                      KM
                    </span>
                  </div>
                  <p className="text-[11px] text-soft-white/60 mt-1">
                    Trip route distance
                  </p>
                </div>

                {/* Rate Per KM for Zone Pair */}
                <div className="border-b md:border-b-0 md:border-r border-soft-white/15 pb-4 md:pb-0 md:pr-4">
                  <span className="text-[11px] uppercase tracking-widest text-soft-white/60 font-semibold block mb-1">
                    Rate Per KM
                  </span>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                      {formatRupiah(calculation.ratePerKm)}
                    </span>
                    <span className="text-xs text-soft-white/70">/ KM</span>
                  </div>
                  <p className="text-[11px] text-soft-white/60 mt-1">
                    Zone {calculation.fromZone} to Zone {calculation.toZone}
                  </p>
                </div>

                {/* Total Fare */}
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-pawcab-gold font-bold block mb-1">
                    Total Estimated Fare
                  </span>
                  <p className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-pawcab-gold tracking-tight">
                    {formatRupiah(calculation.finalFare)}
                  </p>
                  <p className="text-[11px] text-soft-white/70 mt-1">
                    {calculation.distanceKm} km ×{" "}
                    {formatRupiah(calculation.ratePerKm)}/km
                  </p>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <div className="mt-6 pt-5 border-t border-soft-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-soft-white/70">
                  <span className="font-semibold text-soft-white">
                    Private Vehicle:
                  </span>{" "}
                  Fully air-conditioned, sanitized cabin, no shared pets.
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-pawcab-gold hover:bg-yellow-400 text-deep-midnight font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BsWhatsapp className="text-base" />
                  Book This Ride
                  <BsArrowRight className="text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Note / Disclaimer Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-warm-ivory/60 border border-sand-beige/40 flex items-start sm:items-center gap-3 text-xs text-warm-taupe">
          <BsInfoCircle className="text-base text-warm-taupe shrink-0 mt-0.5 sm:mt-0" />
          <p>
            Fares are calculated based on estimated distance (km) and PawCab
            zone rates. All rides are private, fully air-conditioned, and
            sanitized for your pet&apos;s safety and comfort. For multi-stop
            itineraries or custom destinations outside listed zones, please
            contact our support team for a personalized quotation.
          </p>
        </div>

        {/* Interactive Google MyMaps */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-warm-taupe font-semibold mb-1">
                Interactive Zone Map
              </p>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-deep-midnight">
                The Coverage Map
              </h3>
            </div>
            <p className="text-xs text-warm-taupe font-normal max-w-sm sm:text-right">
              Pinch or scroll to zoom. Tap any highlighted area to verify your
              exact zone.
            </p>
          </div>

          <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-sand-beige/50 bg-white">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1ebzNOKwkJKVQrDPvSP931djaAh4fG50&ehbc=2E312F"
              width="100%"
              height="380"
              className="w-full h-[300px] sm:h-[350px] md:h-[380px] border-0"
              loading="lazy"
              title="PawCab Bali Zone Coverage Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
