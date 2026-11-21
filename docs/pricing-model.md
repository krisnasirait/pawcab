# Pricing model

Sources: the printed SERVICES & RATES card (`WhatsApp Image 2026-11-21 at 00.36.01.jpeg`),
with transport rates reconfirmed against `WhatsApp Image 2026-11-21 at 11.53.42.jpeg`
and the owner's Denpasar → Kuta Selatan highest-zone example.
This file records the rates and rules the site applies. Rates live in
`content.json` and are edited from `/admin` (Pet Transport, Dog Walking, Pet Sitting tabs).

## Pet transport (zone rate card)

| Zone | Areas | 0 to 5 km (fixed) | 5.1 to 15 km (per km) |
|---|---|---|---|
| 1 | Kota Denpasar, Sanur, Seminyak, Legian, Kuta | Rp 50.000 | Rp 12.000 |
| 2 | Kuta Utara, Sempidi, Darmasaba, Batu Bulan | Rp 65.000 | Rp 13.000 |
| 3 | Kuta Selatan, Nusa Dua | Rp 70.000 | Rp 14.000 |
| 4 | Tanah Lot, Seseh, Tabanan (Kediri, Kerambitan), Mengwi, Abiansemal, Sukawati, Pecatu | Rp 75.000 | Rp 15.000 |

Rules implemented in `src/data/fareCalculatorData.ts` (`quoteZoneFare`):

- **Zone of a trip** = the higher-numbered pickup/drop-off zone, which has the higher fixed and
  per-km rates on the supplied card. Direction does not change the rate. Both endpoints must
  resolve to configured zones; either endpoint outside/unknown requires a manual quote.
  Each address is mapped to the nearest of the 30 listed service areas (`zoneForPoint`). A point
  more than 25 km from every area is treated as outside. This remains a proximity heuristic,
  not polygon containment or administrative-boundary lookup; points near borders can differ from
  the custom display map. No zoning algorithm or directory changes were authorised in this update.
- **Distance tier**: 5 km or less is the fixed zone fare; above 5 km up to 15 km is
  `full driving distance x zone per-km`, rounded to the nearest Rp 1.000. There is no extra fixed
  fee added to the per-km tier. This retains the existing full-distance interpretation of the card.
- **Beyond 15 km, outside the zones, or a full-day booking**: the calculator refuses to invent a
  number and shows "Quoted by hand", with the WhatsApp CTA.
- **Round trip waiting**: Rp 15.000 per hour, chosen per booking (1 to 4 hours), added to the total.
- Extra pet companion fee (Rp 35.000) and max 3 pets stay as they were in the CMS.

Owner example, at supplied test distances (not a claim about the real route length): Kota Denpasar
(Zone 1) ↔ Kuta Selatan (Zone 3) uses Zone 3 in both directions: 5 km = Rp 70.000,
10 km = Rp 140.000, 15 km = Rp 210.000, beyond 15 km = manual quote. At 10 km with
2 hours waiting, the estimate is Rp 170.000. Return-leg pricing is not newly inferred.

Live check (headless, 2026-11-21): Seminyak to Canggu, 9.8 km, resolves to Zone 2, Rp 13.000/km,
total Rp 128.000.

Regression check: `node scripts/check-fares.mjs` loads the actual calculator and CMS data,
checks the supplied rate card, all 16 zone combinations at tier edges, invalid/unknown endpoint
zones, all 29 area centres, the owner examples in both directions, and waiting fees.
Production browser fixture check (2026-11-21): controlled search/route responses, not live route
measurements, verified Zone 1 → 3 at 5/10 km, reversed 3 → 1 at 10 km, beyond-15-km manual
quotes, and one unknown endpoint. Result/WhatsApp totals agreed. At 320/390/1440 px there was
no horizontal overflow; total text is now white on forest rather than forest on forest.
TypeScript, targeted ESLint, token checks, diff checks and production build passed.

The existing Ubud/Gianyar directory entries remain; this rate-card image does not independently
confirm their boundaries or placement.

## Pet walking (three zone rates, one hour)

| Zone | Areas | Rate |
|---|---|---|
| 1 | Denpasar, Kuta, Legian, Seminyak, Sanur | Rp 80.000 / hour |
| 2 | Kerobokan, Dalung, Canggu | Rp 90.000 / hour |
| 3 | Jimbaran, Nusa Dua, Benoa | Rp 100.000 / hour |

One hour, private, up to 2 dogs, inside your neighbourhood. A beach walk or a walk outside the
residence adds a transport fee; anything outside the three zones is quoted on WhatsApp.

## Pet sitting (quoted, not packaged)

No fixed price is shown anywhere. A booking is quoted on three factors, matching the card:

- Location (where in Bali, plus travel time)
- Number of pets
- Duration (single visit, full day, overnight, multi-day)

The page (`/services/pet-sitting#rates`) lists the three factors and sends a pre-filled WhatsApp
message with empty Location / Pets / Dates fields.

## Owner decisions (2026-11-21)

- **Phone/WhatsApp is now `+62 858-5788-3906` / `6285857883906`** (owner update 2026-11-21; the printed
  card's number, previously retired). Every WhatsApp link on all five routes now carries the number, so no
  link opens a bare contact picker: verified 4/4 on `/`, 5/5 on `/stories`, 5/5 on pet transport,
  7/7 on dog walking, 7/7 on pet sitting.
- **Zone lists follow the card.** Ubud and Gianyar were added as their own Zone 4 areas,
  Peguyangan as a Zone 1 area after a Peguyangan Kangin drop-off misresolved to Zone 2, and
  Seseh Beach / South Pecatu / South Abiansemal as Zone 4 anchors after the 100-case zone test
  exposed beach/south-Bukit/south-district miszones (33 areas total, up from 27). All resolve in
  the calculator, appear as dots on the coverage map, and show in their zone detail.
  "Sukawati / South Ubud" became "Sukawati" now that Ubud stands alone.
  The zone chips read 7 / 8 / 5 / 13.

## Still open

- **Full-day transport pricing.** The card says "quoted based on destination and duration"; the site
  quotes those by hand, which matches. Say if you want a fixed full-day rate instead.
