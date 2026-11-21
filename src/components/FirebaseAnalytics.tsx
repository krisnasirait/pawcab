"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackEvent } from "@/lib/firebase";

/**
 * One delegated listener for every WhatsApp CTA on the site, present and
 * future. Buttons carry optional data-analytics-* attributes for rich
 * params (see Book This Ride / Book Zone N); anything else still logs a
 * generic generate_lead with the link text and page.
 */
function LeadClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const text = (anchor.innerText || "").trim().slice(0, 80);
      const params: Record<string, string | number | boolean> = {
        method: "whatsapp",
        source_page: window.location.pathname,
        link_text: text || "whatsapp",
      };
      const dataset = anchor.dataset;
      const zone = dataset.analyticsZone || /Zone (\d)/.exec(text)?.[1];
      if (zone) params.zone = zone;
      if (dataset.analyticsDistance) params.distance_km = dataset.analyticsDistance;
      if (dataset.analyticsTotal) {
        params.value = Number(dataset.analyticsTotal) || 0;
        params.currency = "IDR";
      }
      trackEvent("generate_lead", params);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

/**
 * The SDK auto-logs the initial page_view; this covers client-side
 * navigations only (skips the first render to avoid double counting).
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const query = searchParams?.toString();
    trackEvent("page_view", {
      source_page: query ? `${pathname}?${query}` : pathname,
      page_title: document.title,
    });
  }, [pathname, searchParams]);
  return null;
}

/** Mount once in the root layout; renders nothing. */
export default function FirebaseAnalytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <>
      <LeadClickTracker />
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}
