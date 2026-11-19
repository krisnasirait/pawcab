"use client";

import React, { useState, useEffect, useRef } from "react";
import { BsSearch, BsX } from "react-icons/bs";
import { searchPlacesBali, type OsmPlace } from "@/lib/routing";

interface AddressSearchInputProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  inputId: string;
  value: OsmPlace | null;
  onSelect: (place: OsmPlace) => void;
  onClear: () => void;
}

type SearchStatus = "idle" | "searching" | "ready" | "empty" | "error";

/**
 * Address autocomplete powered by OpenStreetMap Nominatim, restricted to
 * Bali. A real combobox: ArrowUp/Down + Enter to pick, Escape to dismiss,
 * with loading, empty, and error states (R-27) instead of silent failure.
 */
export default function AddressSearchInput({
  label,
  icon,
  placeholder,
  inputId,
  value,
  onSelect,
  onClear,
}: AddressSearchInputProps) {
  const [query, setQuery] = useState(value?.short ?? "");
  const [results, setResults] = useState<OsmPlace[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = `${inputId}-listbox`;

  // Keep the input text in sync when the parent swaps or clears the value.
  // Render-phase guard (React-endorsed prev-value pattern), not an effect.
  const [syncedValue, setSyncedValue] = useState(value);
  if (syncedValue !== value) {
    setSyncedValue(value);
    setQuery(value?.short ?? "");
  }

  // Debounced search against Nominatim; stale requests are aborted.
  // The effect only subscribes to the external search; status transitions
  // start from input events below, so nothing cascades from the effect body.
  useEffect(() => {
    if (status !== "searching") return;
    const trimmed = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const places = await searchPlacesBali(trimmed, controller.signal);
        if (controller.signal.aborted) return;
        setResults(places);
        setActiveIdx(places.length > 0 ? 0 : -1);
        setStatus(places.length > 0 ? "ready" : "empty");
      } catch {
        if (controller.signal.aborted) return;
        setResults([]);
        setStatus("error");
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, status, attempt]);

  // Close the suggestions when tapping outside.
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const choose = (place: OsmPlace) => {
    onSelect(place);
    setQuery(place.short);
    setOpen(false);
    setResults([]);
    setStatus("idle");
  };

  const handleClear = () => {
    onClear();
    setQuery("");
    setResults([]);
    setStatus("idle");
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && open && activeIdx >= 0) {
      e.preventDefault();
      choose(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel =
    open && (status === "searching" || status === "ready" || status === "empty" || status === "error");

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Field Label */}
      <label
        htmlFor={inputId}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-warm-taupe font-bold mb-2"
      >
        {icon}
        {label}
      </label>

      <div className="relative">
        <BsSearch
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-taupe text-xs pointer-events-none"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={
            activeIdx >= 0 ? `${listId}-option-${activeIdx}` : undefined
          }
          autoComplete="off"
          value={query}
          onChange={(e) => {
            const text = e.target.value;
            setQuery(text);
            const trimmed = text.trim();
            if (trimmed.length < 3 || (value && trimmed === value.short)) {
              setStatus("idle");
              setResults([]);
              setOpen(false);
            } else {
              setStatus("searching");
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-white border border-warm-taupe rounded-xl pl-9 pr-12 py-3 text-xs sm:text-sm font-medium text-deep-midnight placeholder:text-warm-taupe focus:outline-none focus:border-pawcab-navy focus:ring-1 focus:ring-pawcab-navy transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${label}`}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-sm text-warm-taupe hover:text-deep-midnight transition-colors"
          >
            <BsX aria-hidden="true" className="text-lg" />
          </button>
        )}
      </div>

      {/* Suggestions Panel */}
      {showPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-sand-beige/70 overflow-hidden">
          {status === "searching" && (
            <div
              className="flex items-center gap-3 px-4 py-4 text-xs sm:text-sm text-warm-taupe font-medium"
              role="status"
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-sand-beige border-t-pawcab-navy"
              />
              Searching addresses in Bali...
            </div>
          )}

          {status === "ready" && (
            <ul
              id={listId}
              role="listbox"
              aria-label={`${label} suggestions`}
              className="max-h-64 overflow-y-auto divide-y divide-sand-beige/20 overscroll-contain"
            >
              {results.map((place, idx) => (
                <li key={`${place.lat},${place.lon}-${idx}`}>
                  <button
                    id={`${listId}-option-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={idx === activeIdx}
                    onClick={() => choose(place)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors min-h-[44px] ${
                      idx === activeIdx
                        ? "bg-pawcab-gold/20 text-deep-midnight"
                        : "text-deep-midnight hover:bg-warm-ivory"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full bg-pawcab-navy shrink-0"
                    />
                    <span className="min-w-0">
                      <span
                        className="block truncate text-xs sm:text-sm font-semibold"
                        title={place.name}
                      >
                        {place.short}
                      </span>
                      <span className="block truncate text-[11px] text-warm-taupe font-normal">
                        {place.name}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {status === "empty" && (
            <p className="px-4 py-4 text-xs sm:text-sm text-warm-taupe">
              No places found in Bali. Try a nearby landmark, street, or beach.
            </p>
          )}

          {status === "error" && (
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
              <p className="text-xs sm:text-sm text-warm-taupe">
                Address search failed. Check your connection and retry.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("searching");
                  setAttempt((n) => n + 1);
                }}
                className="shrink-0 px-4 py-2 min-h-[44px] rounded-full bg-deep-midnight text-soft-white text-xs font-bold uppercase tracking-wider hover:bg-pawcab-navy transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      <p className="mt-1.5 text-[11px] text-warm-taupe">
        Address search by{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-deep-midnight transition-colors"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </div>
  );
}
