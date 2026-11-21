import { PiArrowRight } from "react-icons/pi";
import {
  formatRupiah,
  PAWCAB_ZONES,
  ZONE_RATES,
  FIXED_TIER_MAX_KM,
  QUOTED_BEYOND_KM,
  WAITING_FEE_PER_HOUR,
} from "@/data/fareCalculatorData";
import contentData from "@/lib/content";

/**
 * The printed SERVICES & RATES card, as open editorial rows.
 * Reads the same CMS zone rates the fare calculator quotes from,
 * so the list and the estimator can never disagree.
 */
export default function ZoneRateCard() {
  const whatsapp = contentData.site?.whatsapp || "6285857883906";

  return (
    <section aria-labelledby="zone-rates-heading" className="py-14 md:py-20 px-6 md:px-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <p className="flex items-center gap-3 text-[14px] font-medium text-forest mb-4">
          <span aria-hidden="true" className="inline-block h-px w-10 bg-forest" />
          Pricelist
        </p>
        <h2 id="zone-rates-heading" className="text-4xl md:text-[52px] leading-[1.08] font-normal text-forest max-w-2xl">
          One card, four zones.
        </h2>
        <p className="text-ink text-[16px] leading-relaxed mt-4 max-w-xl">
          A fixed fare to {FIXED_TIER_MAX_KM} km, then the zone rate per kilometre to {QUOTED_BEYOND_KM} km.
          Cross-zone trips use the higher of the two zones.
        </p>

        <ul role="list" className="mt-10 border-t border-forest/20">
          {PAWCAB_ZONES.map((zone) => {
            const rate = ZONE_RATES[zone.id];
            if (!rate) return null;
            return (
              <li key={zone.id} className="py-6 md:py-7 border-b border-forest/20 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold tracking-widest text-forest/70 mb-1.5">
                    ZONE {zone.id}
                  </p>
                  <h3 className="font-normal text-forest text-xl sm:text-2xl leading-snug break-words">
                    {zone.areasHeadline}
                  </h3>
                  <p className="text-[15px] text-ink mt-2 leading-relaxed">
                    0 to {FIXED_TIER_MAX_KM} km · <strong className="font-medium text-forest">{formatRupiah(rate.fixedUpTo5km)} fixed</strong>
                    <span aria-hidden="true" className="mx-2 text-forest/30">·</span>
                    {FIXED_TIER_MAX_KM + 0.1} to {QUOTED_BEYOND_KM} km · <strong className="font-medium text-forest">{formatRupiah(rate.perKm)}/km</strong>
                  </p>
                </div>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi PawCab, I would like to book a Zone ${zone.id} ride.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-zone={zone.id}
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full border-2 border-forest text-forest font-medium text-[15px] hover:bg-forest hover:text-white transition-colors duration-200 md:self-center shrink-0"
                >
                  Book Zone {zone.id} <PiArrowRight aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-[13px] leading-relaxed text-ink max-w-2xl">
          Beyond {QUOTED_BEYOND_KM} km, outside the four zones, or a full-day booking — send the route and
          we quote by hand. Round-trip waiting is {formatRupiah(WAITING_FEE_PER_HOUR)} per hour.
        </p>
      </div>
    </section>
  );
}
