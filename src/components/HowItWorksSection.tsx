import React from "react";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: booking IS a sequence, so numbered steps are honest here
// (frontend-design allows numbers for real sequences). Rendered as a
// vertical timeline with one connecting line, not three round-icon cards.
export default function HowItWorksSection() {
  const howItWorks = contentData.home?.howItWorks;
  const steps = howItWorks?.steps?.length
    ? howItWorks.steps
    : [
        { number: "1", title: "Price it below", description: "Type pickup and drop-off. The map gives distance and fare." },
        { title: "Send it on WhatsApp", description: "One tap sends route, distance, fare, and your notes.", number: "2" },
        { title: "We come to the gate", description: "Driver and handler arrive in a cool, clean car.", number: "3" },
      ];

  return (
    <section className="bg-[#FFFEFA] py-16 md:py-24 border-t border-[#D8C9AE]/60">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-medium text-[#0E6B5E] mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-[#0E6B5E]" />
            How booking works
          </p>
          <h2 className="text-4xl md:text-[52px] leading-[1.05] font-semibold text-[#0E2A21]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            Priced in a minute, booked on WhatsApp.
          </h2>
          <div className="mt-8">
            <Button
              variant="secondary"
              href={contentData.site?.whatsapp ? `https://wa.me/${contentData.site.whatsapp}` : "https://wa.me/6282266383800"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </Button>
            <p className="mt-3 text-[13.5px] text-[#3F382E]">Daily 07.00 to 21.00 WITA. Real humans, plus dogs in the office.</p>
          </div>
        </div>
        <ol className="relative border-l border-[#0E2A21]/20 ml-2 space-y-0">
          {steps.map((s, i) => (
            <li key={i} className="relative pl-8 pb-8 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[9px] top-1 h-[17px] w-[17px] rounded-full bg-[#FFFEFA] border-[3px] border-[#0E6B5E]" />
              <p className="text-[13px] font-bold text-[#0E6B5E]">Step {s.number || i + 1}</p>
              <h3 className="text-[19px] font-bold text-[#0E2A21] mt-1">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-[#3F382E] mt-1 max-w-md">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
