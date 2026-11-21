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
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (!elfsightAppId || shouldLoad) return;
    const el = ref.current;
    if (!el) return;
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
    if (!shouldLoad || !elfsightAppId) return;
    if (document.querySelector('script[data-elfsight-platform]')) return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.setAttribute("data-elfsight-platform", "true");
    document.body.appendChild(script);
  }, [shouldLoad, elfsightAppId]);

  return (
    <section ref={ref} className="bg-white py-16 md:py-20 px-5 md:px-8 border-t border-sage">
      <div className="max-w-7xl mx-auto">
        <p className="flex items-center gap-3 text-[14px] font-medium text-forest mb-4">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-forest" />
          {reviews?.badge || "Guestbook"}
        </p>
        <h2 className="text-4xl md:text-[52px] leading-[1.08] font-normal text-forest mb-8" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
          {reviews?.heading || "Notes from the back seat."}
        </h2>
        {elfsightAppId ? (
          shouldLoad ? (
            <div className={elfsightAppId} data-elfsight-app-lazy />
          ) : (
            <p className="text-[15px] leading-[1.45] text-ink max-w-lg" aria-hidden="true">
              Loading guest reviews…
            </p>
          )
        ) : (
          <p className="text-[15px] leading-[1.45] text-ink max-w-lg">
            Daily rides and passenger hellos live on{" "}
            <a
              href={contentData.site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-forest underline underline-offset-4 decoration-forest decoration-2"
            >
              Instagram @{contentData.site.instagram}
            </a>.
          </p>
        )}
      </div>
    </section>
  );
}
