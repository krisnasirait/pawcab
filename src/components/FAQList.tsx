"use client";

import { useRef } from "react";
import { PiMinus, PiPlus } from "react-icons/pi";

interface FAQItem {
  id: number;
  question: string;
  group?: string;
  answer?: string;
  answerPrefix?: string;
  answerBold?: string;
  answerMiddle?: string;
  answerBold2?: string;
  answerSuffix?: string;
}

export default function FAQList({ items, showControls = false }: { items: FAQItem[]; showControls?: boolean }) {
  const listRef = useRef<HTMLDivElement>(null);

  const setAll = (open: boolean) => {
    listRef.current?.querySelectorAll("details").forEach((item) => { item.open = open; });
  };

  return (
    <div className="min-w-0">
      {showControls && (
        <div className="flex flex-wrap justify-end gap-x-6 mb-3">
          <button type="button" onClick={() => setAll(true)} className="min-h-11 text-sm font-medium text-navy underline underline-offset-4 decoration-navy/40 hover:decoration-navy">
            Expand All
          </button>
          <button type="button" onClick={() => setAll(false)} className="min-h-11 text-sm font-medium text-navy underline underline-offset-4 decoration-navy/40 hover:decoration-navy">
            Collapse All
          </button>
        </div>
      )}
      <div ref={listRef} className="border-t border-navy/25">
        {items.map((item, index) => (
          <div key={item.id}>
          {item.group && (index === 0 || items[index - 1].group !== item.group) && (
            <p className="pt-8 pb-1 text-[13px] font-semibold tracking-widest text-navy/70">
              {item.group}
            </p>
          )}
          <details open={index === 0} className="group border-b border-navy/25">
            <summary className="flex min-h-16 items-start justify-between gap-5 py-6 list-none text-navy hover:text-midnight [&::-webkit-details-marker]:hidden">
              <h3 className="font-text text-lg md:text-xl font-medium leading-snug">{item.question}</h3>
              <span aria-hidden="true" className="shrink-0 mt-1 text-xl">
                <PiPlus className="group-open:hidden" />
                <PiMinus className="hidden group-open:block" />
              </span>
            </summary>
            <p className="max-w-prose pr-8 pb-6 text-base leading-relaxed text-ink">
              {item.answer ? item.answer : (
                <>
                  {item.answerPrefix}
                  {item.answerBold && <strong className="font-semibold text-navy">{item.answerBold}</strong>}
                  {item.answerMiddle}
                  {item.answerBold2 && <strong className="font-semibold text-navy">{item.answerBold2}</strong>}
                  {item.answerSuffix}
                </>
              )}
            </p>
          </details>
          </div>
        ))}
      </div>
    </div>
  );
}
