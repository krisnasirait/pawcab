import React from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/lib/content";

// R-31: footer as a booking ledger, not a 4-column template.
// One row: identity, real destinations, contact. No ghost links.
export default function Footer() {
  const site = contentData.site;

  return (
    <footer id="footer" className="bg-[#0E2A21] text-[#FFFEFA] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10 pb-10 border-b border-white/12">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/images/logo-pawcab.png" alt="The PawCab logo" width={36} height={36} className="object-contain rounded-full bg-[#FFFEFA] p-0.5" />
              <span className="font-elmessiri text-lg font-bold" style={{ fontFamily: "'El Messiri', serif" }}>
                {site.name || "The PawCab"}
              </span>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/70 max-w-sm">
              Private pet rides and care across Bali. Cool cars, trained handlers, and notes kept on every regular.
            </p>
            <p className="mt-4 text-[14px] text-white/70">
              {site.operatingHours} · <a className="underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <nav aria-label="Services">
            <p className="text-[13px] font-bold text-[#FFC61A] mb-3">Services</p>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link className="hover:underline underline-offset-4" href="/services/pet-transport">Pet transport with fare calculator</Link></li>
              <li><Link className="hover:underline underline-offset-4" href="/services/dog-walking">Dog walking</Link></li>
              <li><Link className="hover:underline underline-offset-4" href="/services/pet-sitting">Pet sitting</Link></li>
              <li><Link className="hover:underline underline-offset-4" href="/stories">Passenger stories</Link></li>
            </ul>
          </nav>
          <div>
            <p className="text-[13px] font-bold text-[#FFC61A] mb-3">Book</p>
            <ul className="space-y-2.5 text-[15px]">
              <li><a className="hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${site.whatsapp}`}>WhatsApp {site.phone}</a></li>
              <li><a className="hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={site.instagramUrl}>Instagram @{site.instagram}</a></li>
              <li><a className="hover:underline underline-offset-4" href="/#fare">Check a fare</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[12.5px] text-white/50">
          <p>© 2026 The PawCab Bali. Private rides across the island.</p>
          <p>{site.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
