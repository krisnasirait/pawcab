import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

// Public web config (safe to ship client-side; restrict the key to this
// domain in the Firebase console under Build > App Check / GCP credentials).
const firebaseConfig = {
  apiKey: "AIzaSyC4ZS7Kd6-BYcfjn-ji7X3uUNIrkcs_uNM",
  authDomain: "pawcab-147c8.firebaseapp.com",
  projectId: "pawcab-147c8",
  storageBucket: "pawcab-147c8.firebasestorage.app",
  messagingSenderId: "667887321716",
  appId: "1:667887321716:web:20bab6ae79a41a44368721",
  measurementId: "G-SHLYGKHVK6",
};

let app: FirebaseApp | undefined;

/** Browser-only singleton; undefined during SSR/prerender. */
export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === "undefined") return undefined;
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}

import type { Analytics } from "firebase/analytics";

let analyticsInstance: Analytics | null | undefined;

/** Append `?analytics_debug=1` to preview events in the console (dev only). */
export function analyticsDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("analytics_debug");
  } catch {
    return false;
  }
}

async function getAnalyticsInstance(): Promise<Analytics | undefined> {
  if (typeof window === "undefined") return undefined;
  if (analyticsInstance !== undefined) return analyticsInstance ?? undefined;
  // Never send from dev builds; DebugView-style checks use the console.
  if (process.env.NODE_ENV !== "production") {
    analyticsInstance = null;
    return undefined;
  }
  try {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      analyticsInstance = null;
      return undefined;
    }
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    analyticsInstance = (await isSupported()) ? getAnalytics(firebaseApp) : null;
  } catch {
    analyticsInstance = null;
  }
  return analyticsInstance ?? undefined;
}

/**
 * Starts Google Analytics for Firebase. Dynamically imported so the
 * Analytics SDK never joins the initial bundle, and skipped outside
 * production so dev traffic never pollutes the property.
 */
export async function initAnalytics(): Promise<void> {
  await getAnalyticsInstance();
}

/** Fire-and-forget event. Safe to call anywhere, including server code. */
export async function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
): Promise<void> {
  if (analyticsDebugEnabled()) {
    console.info("[analytics]", name, params);
  }
  const instance = await getAnalyticsInstance();
  if (!instance) return;
  const { logEvent } = await import("firebase/analytics");
  logEvent(instance, name, params);
}
