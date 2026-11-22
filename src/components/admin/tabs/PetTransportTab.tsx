"use client";

import React, { useState, useMemo } from "react";
import { AppContent, AreaItem, FAQItem, PetTransportContent, PricingConfig } from "@/types/content";
import ImageField from "../ImageField";
import ConfirmModal from "../ConfirmModal";
import {
  BsPlusLg,
  BsTrash3,
  BsCalculator,
  BsGrid3X3,
  BsMap,
  BsStarFill,
  BsSearch,
  BsArrowRight,
  BsGeoAlt,
  BsX,
  BsInfoCircle,
} from "react-icons/bs";

interface PetTransportTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
}

export default function PetTransportTab({ content, onChange }: PetTransportTabProps) {
  const [activeSection, setActiveSection] = useState<
    "hero" | "pricing" | "zones" | "areas" | "rates" | "areaDistances" | "faqs"
  >("pricing");

  // State for Area Distances (Opsi B)
  const [searchRoute, setSearchRoute] = useState("");
  const [filterFromZone, setFilterFromZone] = useState<number | "all">("all");
  const [filterToZone, setFilterToZone] = useState<number | "all">("all");
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [newOriginArea, setNewOriginArea] = useState<string>("");
  const [newDestArea, setNewDestArea] = useState<string>("");
  const [newRouteKm, setNewRouteKm] = useState<string>("");
  const [routeDeleteTarget, setRouteDeleteTarget] = useState<string | null>(null);
  const [routesPage, setRoutesPage] = useState<number>(1);
  const ROUTES_PER_PAGE = 15;

  const transport = content.servicesPages?.petTransport;
  const pricing = transport?.pricingConfig;

  const updateTransport = (
    field: keyof PetTransportContent,
    val: PetTransportContent[keyof PetTransportContent]
  ) => {
    onChange({
      ...content,
      servicesPages: {
        ...content.servicesPages,
        petTransport: {
          ...transport,
          [field]: val,
        },
      },
    });
  };

  const updatePricingConfig = (
    field: keyof PricingConfig,
    val: PricingConfig[keyof PricingConfig]
  ) => {
    onChange({
      ...content,
      servicesPages: {
        ...content.servicesPages,
        petTransport: {
          ...transport,
          pricingConfig: {
            ...pricing,
            [field]: val,
          },
        },
      },
    });
  };

  // Add / Edit / Delete Areas
  const handleAddArea = () => {
    const newArea: AreaItem = {
      id: `area-${Date.now()}`,
      name: "New Area",
      zoneId: 1,
      popular: false,
    };
    updatePricingConfig("areas", [...(pricing?.areas || []), newArea]);
  };

  const handleUpdateArea = (
    index: number,
    field: keyof AreaItem,
    val: AreaItem[keyof AreaItem]
  ) => {
    const areas = [...(pricing?.areas || [])];
    areas[index] = { ...areas[index], [field]: val };
    updatePricingConfig("areas", areas);
  };

  const handleDeleteArea = (index: number) => {
    const areas = [...(pricing?.areas || [])];
    areas.splice(index, 1);
    updatePricingConfig("areas", areas);
  };

  // Update Rate Per KM between fromZone and toZone
  const handleUpdateRate = (fromZone: number, toZone: number, rate: number) => {
    const key = `${fromZone}-${toZone}`;
    const newRates = { ...(pricing?.ratesPerKm || {}), [key]: rate };
    updatePricingConfig("ratesPerKm", newRates);
  };

  // Area Distances Handlers (Opsi B)
  const handleUpdateAreaDistance = (routeKey: string, km: number) => {
    const current = { ...(pricing?.areaDistances || {}) };
    current[routeKey] = km;
    updatePricingConfig("areaDistances", current);
  };

  const handleDeleteAreaDistance = (routeKey: string) => {
    const current = { ...(pricing?.areaDistances || {}) };
    delete current[routeKey];
    updatePricingConfig("areaDistances", current);
    setRouteDeleteTarget(null);
  };

  const handleSaveNewRoute = () => {
    if (!newOriginArea || !newDestArea) return;
    if (newOriginArea === newDestArea) {
      alert("Daerah asal dan tujuan tidak boleh sama.");
      return;
    }
    const km = parseFloat(newRouteKm);
    if (isNaN(km) || km <= 0) {
      alert("Masukkan jarak KM yang valid (lebih dari 0).");
      return;
    }

    const cleanA = newOriginArea.replace(/-/g, "_").toLowerCase();
    const cleanB = newDestArea.replace(/-/g, "_").toLowerCase();
    const key = `${cleanA}_${cleanB}`;

    const current = { ...(pricing?.areaDistances || {}) };
    current[key] = km;
    updatePricingConfig("areaDistances", current);

    setNewOriginArea("");
    setNewDestArea("");
    setNewRouteKm("");
    setShowAddRouteModal(false);
  };

  const getAreaFromKey = useMemo(() => {
    const areas = pricing?.areas || [];
    return (routeKey: string) => {
      const fromArea = areas.find((a) =>
        routeKey.startsWith(a.id.replace(/-/g, "_").toLowerCase() + "_")
      );
      if (!fromArea) return { from: null, to: null };
      const toPart = routeKey.slice(fromArea.id.replace(/-/g, "_").toLowerCase().length + 1);
      const toArea = areas.find((a) => a.id.replace(/-/g, "_").toLowerCase() === toPart);
      return { from: fromArea, to: toArea || null };
    };
  }, [pricing?.areas]);

  const getRouteFarePreview = (fromZone: number, toZone: number, distanceKm: number) => {
    const rateKey = `${fromZone}-${toZone}`;
    const rate = pricing?.ratesPerKm?.[rateKey] ?? 10000;
    const rawFare = distanceKm * rate;
    const subtotal = Math.round(rawFare / 1000) * 1000;
    const minFare = pricing?.minimumFare || 65000;
    const finalFare = Math.max(subtotal, minFare);
    return { rate, finalFare, isMin: subtotal < minFare };
  };

  const routeEntries = useMemo(() => {
    return Object.entries(pricing?.areaDistances || {});
  }, [pricing?.areaDistances]);

  const filteredRoutes = useMemo(() => {
    return routeEntries.filter(([key]) => {
      const { from, to } = getAreaFromKey(key);
      if (!from || !to) return true;

      if (filterFromZone !== "all" && from.zoneId !== filterFromZone) return false;
      if (filterToZone !== "all" && to.zoneId !== filterToZone) return false;

      if (searchRoute.trim()) {
        const q = searchRoute.toLowerCase();
        const matchName = from.name.toLowerCase().includes(q) || to.name.toLowerCase().includes(q);
        const matchKey = key.toLowerCase().includes(q);
        return matchName || matchKey;
      }

      return true;
    });
  }, [routeEntries, getAreaFromKey, filterFromZone, filterToZone, searchRoute]);

  const totalRoutePages = Math.ceil(filteredRoutes.length / ROUTES_PER_PAGE) || 1;
  const currentRoutesPage = Math.min(routesPage, totalRoutePages);
  const pagedRoutes = useMemo(() => {
    const start = (currentRoutesPage - 1) * ROUTES_PER_PAGE;
    return filteredRoutes.slice(start, start + ROUTES_PER_PAGE);
  }, [filteredRoutes, currentRoutesPage]);

  // Add / Edit / Delete FAQ
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: Date.now(),
      number: `0${(transport?.faqs?.length || 0) + 1}`,
      question: "New FAQ Question?",
      answer: "FAQ Answer details here.",
    };
    updateTransport("faqs", [...(transport?.faqs || []), newFaq]);
  };

  const handleUpdateFaq = (
    index: number,
    field: keyof FAQItem,
    val: FAQItem[keyof FAQItem]
  ) => {
    const faqs = [...(transport?.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: val };
    updateTransport("faqs", faqs);
  };

  const handleDeleteFaq = (index: number) => {
    const faqs = [...(transport?.faqs || [])];
    faqs.splice(index, 1);
    updateTransport("faqs", faqs);
  };

  const subTabs = [
    { id: "pricing", label: "Calculator & Base Fares" },
    { id: "rates", label: "Tarif Per-KM Antar Zona (1-4)" },
    { id: "areaDistances", label: `Jarak Antar-Daerah (${Object.keys(pricing?.areaDistances || {}).length})` },
    { id: "zones", label: "Zone Definitions (1-4)" },
    { id: "areas", label: `Coverage Areas (${pricing?.areas?.length || 0})` },
    { id: "hero", label: "Hero & Highlights" },
    { id: "faqs", label: `FAQs (${transport?.faqs?.length || 0})` },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === tab.id
                ? "bg-pawcab-gold text-midnight shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. CALCULATOR & BASE FARES */}
      {activeSection === "pricing" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <BsCalculator className="text-pawcab-gold" />
              <span>Fare Calculator Base Parameters</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Set the four-zone rate card, the km thresholds, the waiting fee, extra pet fee and booking rules.
            </p>
          </div>

          {/* Zone rate card: the four rows of the printed SERVICES & RATES card */}
          <div className="rounded-2xl border border-neutral-800 p-4 sm:p-5">
            <p className="text-xs font-semibold text-neutral-300 mb-1">Zone rate card</p>
            <p className="text-[11px] text-neutral-500 mb-4">
              Fixed fare up to the km threshold, then the zone rate per kilometre.
              A cross-zone trip uses the outer zone.
            </p>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((zone) => {
                const rate = pricing?.zoneRates?.[String(zone)] || {
                  fixedUpTo5km: [0, 50000, 65000, 70000, 75000][zone],
                  perKm: [0, 12000, 13000, 14000, 15000][zone],
                };
                const setRate = (field: "fixedUpTo5km" | "perKm", val: number) => {
                  const next = { ...(pricing?.zoneRates || {}) };
                  next[String(zone)] = { ...rate, [field]: val };
                  updatePricingConfig("zoneRates", next);
                };
                return (
                  <div key={zone} className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] items-center gap-3">
                    <span className="text-xs font-semibold text-pawcab-gold">Zone {zone}</span>
                    <label className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <span className="w-28 shrink-0">Fixed, 0 to 5 km</span>
                      <input
                        type="number"
                        value={rate.fixedUpTo5km}
                        onChange={(e) => setRate("fixedUpTo5km", parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <span className="w-28 shrink-0">Per km, 5.1 to 15</span>
                      <input
                        type="number"
                        value={rate.perKm}
                        onChange={(e) => setRate("perKm", parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-800">
              <label className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="w-28 shrink-0">Fixed up to km</span>
                <input
                  type="number"
                  value={pricing?.fixedTierMaxKm ?? 5}
                  onChange={(e) => updatePricingConfig("fixedTierMaxKm", parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                />
              </label>
              <label className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="w-28 shrink-0">Quote beyond km</span>
                <input
                  type="number"
                  value={pricing?.quotedBeyondKm ?? 15}
                  onChange={(e) => updatePricingConfig("quotedBeyondKm", parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                />
              </label>
              <label className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="w-28 shrink-0">Waiting fee / hour</span>
                <input
                  type="number"
                  value={pricing?.waitingFeePerHour ?? 15000}
                  onChange={(e) => updatePricingConfig("waitingFeePerHour", parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Extra Pet Companion Fee (IDR)
              </label>
              <input
                type="number"
                value={pricing?.perExtraPetFee || 35000}
                onChange={(e) => updatePricingConfig("perExtraPetFee", parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Charged for 2nd and 3rd pet
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Maximum Pets in One Ride
              </label>
              <input
                type="number"
                value={pricing?.maxPets || 3}
                onChange={(e) => updatePricingConfig("maxPets", parseInt(e.target.value, 10) || 3)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Calculator Section Heading
              </label>
              <input
                type="text"
                value={pricing?.heading || ""}
                onChange={(e) => updatePricingConfig("heading", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Booking Information Notes (1 per line)
              </label>
              <textarea
                rows={4}
                value={(pricing?.notes || []).join("\n")}
                onChange={(e) =>
                  updatePricingConfig(
                    "notes",
                    e.target.value.split("\n").filter((n) => n.trim().length > 0)
                  )
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. ANTAR-ZONA RATES & DISTANCES MATRIX */}
      {activeSection === "rates" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <BsGrid3X3 className="text-pawcab-gold" />
              <span>Antar-Zona Rates Matrix (IDR / KM)</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Customize the exact rate per kilometer charged for rides traveling from any Origin Zone to Destination Zone.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950">
                  <th className="p-3 text-neutral-400 font-semibold uppercase tracking-wider">
                    Origin &rarr; Destination
                  </th>
                  {[1, 2, 3, 4].map((toZ) => (
                    <th key={toZ} className="p-3 text-pawcab-gold font-bold text-center">
                      To Zone {toZ}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {[1, 2, 3, 4].map((fromZ) => (
                  <tr key={fromZ} className="hover:bg-neutral-800/30 transition">
                    <td className="p-3 font-semibold text-neutral-200 bg-neutral-950/60">
                      From Zone {fromZ}
                    </td>
                    {[1, 2, 3, 4].map((toZ) => {
                      const key = `${fromZ}-${toZ}`;
                      const currentRate = pricing?.ratesPerKm?.[key] ?? 10000;
                      const isSameZone = fromZ === toZ;

                      return (
                        <td key={toZ} className="p-2 text-center">
                          <div className={`p-2.5 rounded-xl border ${
                            isSameZone
                              ? "bg-pawcab-gold/5 border-pawcab-gold/30"
                              : "bg-neutral-950 border-neutral-800"
                          }`}>
                            <div className="text-[10px] text-neutral-400 mb-1 font-semibold">
                              Tarif / KM:
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] text-neutral-500">Rp</span>
                              <input
                                type="number"
                                step={500}
                                value={currentRate}
                                onChange={(e) =>
                                  handleUpdateRate(fromZ, toZ, parseInt(e.target.value, 10) || 0)
                                }
                                className="w-20 px-1.5 py-1 text-center font-bold text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:border-pawcab-gold"
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-xs text-neutral-400">
            <BsInfoCircle className="text-pawcab-gold shrink-0 mt-0.5 text-sm" />
            <div>
              <span className="text-neutral-200 font-semibold">Sistem Tarif (Opsi B):</span>{" "}
              Matriks ini khusus menentukan <strong className="text-pawcab-gold">Tarif per-KM antar Zona (IDR / KM)</strong>. Seluruh jarak tempuh (KM) dikelola secara spesifik antar-daerah pada tab{" "}
              <button
                type="button"
                onClick={() => setActiveSection("areaDistances")}
                className="text-pawcab-gold underline font-semibold hover:text-white transition cursor-pointer"
              >
                Jarak Antar-Daerah
              </button>.
            </div>
          </div>
        </div>
      )}

      {/* 2B. JARAK ANTAR-DAERAH (OPSI B) */}
      {activeSection === "areaDistances" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <BsGeoAlt className="text-pawcab-gold" />
                <span>Jarak Spesifik Antar-Daerah ({routeEntries.length} Rute)</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Kelola jarak rute kilometer antar-daerah di Bali. Tarif dihitung: Jarak Daerah (KM) × Tarif Zona (IDR/KM).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddRouteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer shrink-0"
            >
              <BsPlusLg /> Tambah Rute Baru
            </button>
          </div>

          {/* Explanation Alert */}
          <div className="p-4 bg-pawcab-gold/5 border border-pawcab-gold/20 rounded-2xl flex items-start gap-3 text-xs text-neutral-300">
            <BsInfoCircle className="text-pawcab-gold text-base shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                Logika Perhitungan Tarif PawCab (Opsi B):
              </p>
              <p className="text-neutral-400 leading-relaxed">
                1. <strong>Tarif per KM</strong> diambil dari matriks zona asal &rarr; zona tujuan (misal Canggu [Zone 2] ke Kuta [Zone 1] = Rp 10.000/km).<br />
                2. <strong>Jarak perjalanan (KM)</strong> diambil dari tabel spesifik antar daerah di bawah ini (misal Canggu - Kuta = 14 km).<br />
                3. Rute bersifat dua arah secara otomatis. Jarak dapat Anda edit langsung di kolom input di bawah.
              </p>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <BsSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs" />
              <input
                type="text"
                placeholder="Cari nama daerah (misal: Seminyak, Canggu, Ubud)..."
                value={searchRoute}
                onChange={(e) => {
                  setSearchRoute(e.target.value);
                  setRoutesPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold placeholder:text-neutral-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-neutral-400 font-semibold shrink-0">
                Zona Asal:
              </label>
              <select
                value={filterFromZone}
                onChange={(e) => {
                  setFilterFromZone(e.target.value === "all" ? "all" : parseInt(e.target.value, 10));
                  setRoutesPage(1);
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold cursor-pointer"
              >
                <option value="all">Semua Zona Asal</option>
                <option value="1">Zone 1 (Kuta, Sanur, Dps)</option>
                <option value="2">Zone 2 (Canggu, Kerobokan)</option>
                <option value="3">Zone 3 (Jimbaran, Nusa Dua)</option>
                <option value="4">Zone 4 (Tanah Lot, Ubud, Pecatu)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-neutral-400 font-semibold shrink-0">
                Zona Tujuan:
              </label>
              <select
                value={filterToZone}
                onChange={(e) => {
                  setFilterToZone(e.target.value === "all" ? "all" : parseInt(e.target.value, 10));
                  setRoutesPage(1);
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold cursor-pointer"
              >
                <option value="all">Semua Zona Tujuan</option>
                <option value="1">Zone 1 (Kuta, Sanur, Dps)</option>
                <option value="2">Zone 2 (Canggu, Kerobokan)</option>
                <option value="3">Zone 3 (Jimbaran, Nusa Dua)</option>
                <option value="4">Zone 4 (Tanah Lot, Ubud, Pecatu)</option>
              </select>
            </div>
          </div>

          {/* Routes Table */}
          <div className="overflow-x-auto border border-neutral-800 rounded-2xl bg-neutral-950">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/80">
                  <th className="p-3.5 text-neutral-400 font-semibold uppercase tracking-wider">
                    Rute Daerah (Asal &rarr; Tujuan)
                  </th>
                  <th className="p-3.5 text-neutral-400 font-semibold uppercase tracking-wider text-center">
                    Tarif Zona Berlaku
                  </th>
                  <th className="p-3.5 text-pawcab-gold font-bold uppercase tracking-wider text-center">
                    Jarak (KM)
                  </th>
                  <th className="p-3.5 text-neutral-400 font-semibold uppercase tracking-wider text-right">
                    Preview Total Fare
                  </th>
                  <th className="p-3.5 text-neutral-400 font-semibold uppercase tracking-wider text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {pagedRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500 italic">
                      Tidak ada rute yang cocok dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  pagedRoutes.map(([key, km]) => {
                    const { from, to } = getAreaFromKey(key);
                    const fromName = from?.name || key.split("_")[0];
                    const toName = to?.name || key.split("_")[1];
                    const fromZone = from?.zoneId || 1;
                    const toZone = to?.zoneId || 1;
                    const preview = getRouteFarePreview(fromZone, toZone, km);

                    return (
                      <tr key={key} className="hover:bg-neutral-900/50 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-200">{fromName}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 font-mono">
                              Z{fromZone}
                            </span>
                            <BsArrowRight className="text-neutral-500 text-xs shrink-0" />
                            <span className="font-semibold text-neutral-200">{toName}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 font-mono">
                              Z{toZone}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                            key: {key}
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="font-mono text-neutral-300 font-semibold">
                            Rp {preview.rate.toLocaleString("id-ID")}
                            <span className="text-neutral-500 text-[10px]"> / km</span>
                          </div>
                          <span className="text-[10px] text-neutral-500">
                            Zona {fromZone} &rarr; Zona {toZone}
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1">
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              value={km}
                              onChange={(e) =>
                                handleUpdateAreaDistance(key, parseFloat(e.target.value) || 0)
                              }
                              className="w-16 text-center font-bold text-xs bg-transparent text-pawcab-gold focus:outline-none"
                            />
                            <span className="text-neutral-400 font-semibold text-[11px]">km</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right font-mono">
                          <div className="font-bold text-white text-xs">
                            Rp {preview.finalFare.toLocaleString("id-ID")}
                          </div>
                          {preview.isMin ? (
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] bg-pawcab-gold/10 text-pawcab-gold border border-pawcab-gold/30">
                              Min. Fare Applied
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-500">
                              ~{km} km × Rp {preview.rate.toLocaleString("id-ID")}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => setRouteDeleteTarget(key)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                            title="Hapus Rute Jarak"
                          >
                            <BsTrash3 className="text-xs" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredRoutes.length > ROUTES_PER_PAGE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 pt-2">
              <div>
                Menampilkan {(currentRoutesPage - 1) * ROUTES_PER_PAGE + 1} -{" "}
                {Math.min(currentRoutesPage * ROUTES_PER_PAGE, filteredRoutes.length)} dari{" "}
                {filteredRoutes.length} rute
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentRoutesPage <= 1}
                  onClick={() => setRoutesPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-200 transition cursor-pointer"
                >
                  Sebelumnya
                </button>
                <span className="px-2 font-mono text-neutral-300">
                  {currentRoutesPage} / {totalRoutePages}
                </span>
                <button
                  type="button"
                  disabled={currentRoutesPage >= totalRoutePages}
                  onClick={() => setRoutesPage((p) => Math.min(p + 1, totalRoutePages))}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-200 transition cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: TAMBAH RUTE JARAK BARU */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5 animate-scaleUp">
            <button
              onClick={() => setShowAddRouteModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 cursor-pointer"
            >
              <BsX className="text-2xl" />
            </button>

            <div className="border-b border-neutral-800 pb-3">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <BsGeoAlt className="text-pawcab-gold" />
                <span>Tambah Jarak Rute Baru</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Pilih daerah asal & tujuan, lalu tentukan jarak tempuh dalam kilometer.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  Daerah Asal (Pickup Area)
                </label>
                <select
                  value={newOriginArea}
                  onChange={(e) => setNewOriginArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                >
                  <option value="">-- Pilih Daerah Asal --</option>
                  {(pricing?.areas || []).map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} (Zone {area.zoneId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  Daerah Tujuan (Drop-off Area)
                </label>
                <select
                  value={newDestArea}
                  onChange={(e) => setNewDestArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                >
                  <option value="">-- Pilih Daerah Tujuan --</option>
                  {(pricing?.areas || []).map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} (Zone {area.zoneId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  Jarak Perjalanan (Kilometer)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="misal: 12.5"
                    value={newRouteKm}
                    onChange={(e) => setNewRouteKm(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-pawcab-gold font-bold text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-xs">
                    KM
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              {newOriginArea && newDestArea && newRouteKm && (
                (() => {
                  const fromArea = (pricing?.areas || []).find((a) => a.id === newOriginArea);
                  const toArea = (pricing?.areas || []).find((a) => a.id === newDestArea);
                  if (!fromArea || !toArea) return null;
                  const km = parseFloat(newRouteKm) || 0;
                  const preview = getRouteFarePreview(fromArea.zoneId, toArea.zoneId, km);

                  return (
                    <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                      <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                        <span>Zona: Zone {fromArea.zoneId} &rarr; Zone {toArea.zoneId}</span>
                        <span>Tarif Zona: Rp {preview.rate.toLocaleString("id-ID")} / km</span>
                      </div>
                      <div className="text-xs font-semibold text-white flex items-center justify-between pt-1 border-t border-neutral-800">
                        <span>Preview Estimasi Fare:</span>
                        <span className="text-pawcab-gold font-mono font-bold text-sm">
                          Rp {preview.finalFare.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRouteModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveNewRoute}
                className="px-5 py-2 rounded-xl bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight text-xs font-bold transition cursor-pointer"
              >
                Simpan Rute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ROUTE MODAL */}
      <ConfirmModal
        isOpen={!!routeDeleteTarget}
        title="Hapus Rute Jarak"
        message={`Apakah Anda yakin ingin menghapus data jarak untuk rute '${routeDeleteTarget}'? Setelah dihapus, kalkulator akan beralih ke jarak rata-rata zona sebagai fallback.`}
        confirmText="Hapus Rute"
        cancelText="Batal"
        onConfirm={() => routeDeleteTarget && handleDeleteAreaDistance(routeDeleteTarget)}
        onCancel={() => setRouteDeleteTarget(null)}
      />

      {/* 3. ZONE DEFINITIONS */}
      {activeSection === "zones" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <BsMap className="text-pawcab-gold" />
              <span>Official Zone Definitions (4 Zones)</span>
            </h3>
            <p className="text-xs text-neutral-400">
              The headline and region description displayed on the rate chart and map.
            </p>
          </div>

          <div className="space-y-4">
            {(pricing?.zones || []).map((zone, idx) => (
              <div
                key={zone.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-pawcab-gold/20 text-pawcab-gold font-bold text-xs font-mono">
                    Zone {zone.id}
                  </span>
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => {
                      const zones = [...(pricing?.zones || [])];
                      zones[idx] = { ...zones[idx], name: e.target.value };
                      updatePricingConfig("zones", zones);
                    }}
                    className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Areas Headline
                  </label>
                  <input
                    type="text"
                    value={zone.areasHeadline}
                    onChange={(e) => {
                      const zones = [...(pricing?.zones || [])];
                      zones[idx] = { ...zones[idx], areasHeadline: e.target.value };
                      updatePricingConfig("zones", zones);
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={zone.description}
                    onChange={(e) => {
                      const zones = [...(pricing?.zones || [])];
                      zones[idx] = { ...zones[idx], description: e.target.value };
                      updatePricingConfig("zones", zones);
                    }}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COVERAGE AREAS */}
      {activeSection === "areas" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Coverage Areas List ({(pricing?.areas || []).length} Locations)
              </h3>
              <p className="text-xs text-neutral-400">
                Locations available in the pickup and drop-off dropdowns.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddArea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <BsPlusLg /> Add New Area
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(pricing?.areas || []).map((area, idx) => (
              <div
                key={area.id || idx}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between gap-2.5"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    value={area.name}
                    onChange={(e) => handleUpdateArea(idx, "name", e.target.value)}
                    className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 text-xs font-medium focus:outline-none focus:border-pawcab-gold"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={area.zoneId}
                      onChange={(e) =>
                        handleUpdateArea(idx, "zoneId", parseInt(e.target.value, 10))
                      }
                      className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-[11px] text-neutral-300 font-mono focus:outline-none"
                    >
                      <option value={1}>Zone 1</option>
                      <option value={2}>Zone 2</option>
                      <option value={3}>Zone 3</option>
                      <option value={4}>Zone 4</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleUpdateArea(idx, "popular", !area.popular)}
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded cursor-pointer transition ${
                        area.popular
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-neutral-900 text-neutral-500 hover:text-neutral-400"
                      }`}
                    >
                      <BsStarFill className="text-[9px]" />
                      <span>{area.popular ? "Popular" : "Standard"}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteArea(idx)}
                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                  title="Delete Area"
                >
                  <BsTrash3 className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HERO & HIGHLIGHTS */}
      {activeSection === "hero" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="font-display text-xl font-bold text-white">Pet Transport Page Banner</h3>
            <p className="text-xs text-neutral-400">
              Hero title, subtitle, and image for `/services/pet-transport`.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={transport?.hero?.badge || ""}
                onChange={(e) =>
                  updateTransport("hero", { ...transport?.hero, badge: e.target.value })
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
                value={transport?.hero?.title || ""}
                onChange={(e) =>
                  updateTransport("hero", { ...transport?.hero, title: e.target.value })
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
                value={transport?.hero?.subtitle || ""}
                onChange={(e) =>
                  updateTransport("hero", { ...transport?.hero, subtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                label="Hero Photo"
                value={transport?.hero?.heroImage || ""}
                onChange={(val) =>
                  updateTransport("hero", { ...transport?.hero, heroImage: val })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. FAQS */}
      {activeSection === "faqs" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Pet Transport FAQs ({(transport?.faqs || []).length} Questions)
              </h3>
              <p className="text-xs text-neutral-400">
                Frequently asked questions on vehicle type, passenger capacity, and AC.
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
            {(transport?.faqs || []).map((faq, idx) => (
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

