import React from "react";
import Button from "./Button";
import contentData from "@/lib/content";

// R-31: booking IS a sequence, so numbered steps are honest here
// (frontend-design allows numbers for real sequences). Each step is a
// hard-surface card: lime step mark, 1px ink border, solid offset shadow.
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
    <section className="bg-white py-16 md:py-24 border-t border-sand">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-medium text-navy mb-4">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-navy" />
            How booking works
          </p>
          <h2 className="text-4xl md:text-[56px] leading-[1.05] font-normal text-navy">
            Priced in a minute, booked on WhatsApp.
          </h2>
          <div className="mt-8">
            <Button
              variant="secondary"
              href={contentData.site?.whatsapp ? `https://wa.me/${contentData.site.whatsapp}` : "https://wa.me/6285857883906"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </Button>
            <p className="mt-4 text-[13.5px] text-ink">Real humans, plus dogs in the office.</p>
          </div>
        </div>

        <ol className="border-t border-navy/20">
          {steps.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-4 px-1 py-5 md:py-6 border-b border-navy/20"
            >
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent text-navy font-medium text-[15px] border-2 border-navy"
              >
                {s.number || i + 1}
              </span>
              <div>
                <p className="text-[12.5px] font-medium text-midnight">Step {s.number || i + 1}</p>
                <h3 className="text-[20px] font-normal leading-[1.25] text-navy mt-0.5">{s.title}</h3>
                <p className="text-[15px] leading-[1.45] text-ink mt-1 max-w-md">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
