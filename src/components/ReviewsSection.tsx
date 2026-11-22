"use client";

import { useEffect, useRef, useState } from "react";
import contentData from "@/lib/content";

/**
 * Reviews are far below the fold and pull ~470KB of third-party JS.
 * Only inject the Elfsight platform script once the section is near
 * the viewport. Until then (or when no widget id is configured) show
 * the Instagram fallback so content is never empty.
 */
export default function ReviewsSection() {
  const reviews = contentData.home?.reviews;
  const elfsightAppId = reviews?.elfsightAppId?.trim();
  const ref = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  // Always start false so server HTML matches the first client render.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!elfsightAppId || shouldLoad) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // One-time progressive enhancement, not a render loop: guarded above.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elfsightAppId, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !elfsightAppId || failed) return;
    if (!document.querySelector('script[data-elfsight-platform]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.setAttribute("data-elfsight-platform", "true");
      script.onerror = () => setFailed(true);
      document.body.appendChild(script);
    }
    // If the widget never populates (blocked CDN, broken API), fall back
    // to the Instagram link instead of leaving a hole in the layout.
    const timer = setTimeout(() => {
      const host = hostRef.current;
      if (!host || host.childElementCount === 0) {
        setFailed(true);
      } else {
        setReady(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, [shouldLoad, elfsightAppId, failed]);

  useEffect(() => {
    if (!shouldLoad || failed || ready) return;
    const host = hostRef.current;
    if (!host) return;
    const observer = new MutationObserver(() => {
      if (host.childElementCount > 0) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(host, { childList: true });
    return () => observer.disconnect();
  }, [shouldLoad, failed, ready]);

  return (
    <section ref={ref} className="bg-white py-16 md:py-20 px-5 md:px-8 border-t border-sand">
      <div className="max-w-7xl mx-auto">
        <p className="flex items-center gap-3 text-[14px] font-medium text-navy mb-4">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-navy" />
          {reviews?.badge || "Guestbook"}
        </p>
        <h2 className="text-4xl md:text-[52px] leading-[1.08] font-normal text-navy mb-8" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
          {reviews?.heading || "Notes from the back seat."}
        </h2>
        {elfsightAppId && !failed ? (
          <div className="elfsight-frame w-full max-w-full overflow-x-clip min-h-[320px]">
            {!ready && (
              <p className="text-[15px] leading-[1.45] text-ink max-w-lg" aria-hidden="true">
                Loading guest reviews…
              </p>
            )}
            {shouldLoad && (
              <div ref={hostRef} className={elfsightAppId} data-elfsight-app-lazy />
            )}
          </div>
        ) : (
          <p className="text-[15px] leading-[1.45] text-ink max-w-lg">
            Daily rides and passenger hellos live on{" "}
            <a
              href={contentData.site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-navy underline underline-offset-4 decoration-navy decoration-2"
            >
              Instagram @{contentData.site.instagram}
            </a>.
          </p>
        )}
      </div>
    </section>
  );
}
