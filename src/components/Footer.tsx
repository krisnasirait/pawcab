import React from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/lib/content";

// R-31: footer as a booking ledger, not a 4-column template.
// One row: identity, real destinations, contact. No ghost links.
export default function Footer() {
  const site = contentData.site;

  return (
    <footer id="footer" className="bg-forest text-white pt-16 pb-8 border-t-4 border-accent" data-surface="forest">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10 pb-10 border-b border-accent/25">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white shrink-0">
                <Image src="/images/logo-pawcab.png" alt="The PawCab logo" width={28} height={28} className="object-contain" />
              </span>
              <span className="font-display text-[22px] font-medium text-white">
                {site.name || "The PawCab"}
              </span>
            </div>
            <p className="mt-3 text-[14.5px] leading-[1.5] text-white/70 max-w-sm">
              Private pet rides and care across Bali. Cool cars, trained handlers, and notes kept on every regular.
            </p>
            <p className="mt-4 text-[14px] text-white/70">
              <a className="underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <nav aria-label="Services">
            <p className="text-[13px] font-medium text-accent mb-3">Services</p>
            <ul className="space-y-2.5 text-[15px] text-white/85">
              <li><Link className="hover:underline underline-offset-4 decoration-accent" href="/services/pet-transport">Pet transport with fare calculator</Link></li>
              <li><Link className="hover:underline underline-offset-4 decoration-accent" href="/services/dog-walking">Dog walking</Link></li>
              <li><Link className="hover:underline underline-offset-4 decoration-accent" href="/services/pet-sitting">Pet sitting</Link></li>
              <li><Link className="hover:underline underline-offset-4 decoration-accent" href="/stories">Passenger stories</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-[13px] font-medium text-accent mb-3">Book</p>
            <ul className="space-y-2.5 text-[15px] text-white/85">
              <li><a className="hover:underline underline-offset-4 decoration-accent" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${site.whatsapp}`}>WhatsApp {site.phone}</a></li>
              <li><a className="hover:underline underline-offset-4 decoration-accent" target="_blank" rel="noopener noreferrer" href={site.instagramUrl}>Instagram @{site.instagram}</a></li>
              <li><Link className="hover:underline underline-offset-4 decoration-accent" href="/#fare">Check a fare</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[12.5px] text-white/65">
          <p>© 2026 The PawCab Bali. Private rides across the island.</p>
          <p>{site.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
