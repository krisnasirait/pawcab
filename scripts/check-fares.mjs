import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Load the actual calculator with its real JSON inputs, without a Next.js server.
const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const content = readJson("../content.json");
const coverage = readJson("../src/data/coverage-areas.json");
const source = readFileSync(new URL("../src/data/fareCalculatorData.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
});
const exports = {};
vm.runInNewContext(outputText, {
  exports,
  require(id) {
    if (id === "@/lib/content") return content;
    if (id === "@/data/coverage-areas.json") return coverage;
    throw new Error(`Unexpected calculator dependency: ${id}`);
  },
});
const { quoteZoneFare, zoneForPoint, ZONE_RATES, FIXED_TIER_MAX_KM, QUOTED_BEYOND_KM } = exports;
const card = {
  1: { fixedUpTo5km: 50000, perKm: 12000 },
  2: { fixedUpTo5km: 65000, perKm: 13000 },
  3: { fixedUpTo5km: 70000, perKm: 14000 },
  4: { fixedUpTo5km: 75000, perKm: 15000 },
};
assert.deepEqual(JSON.parse(JSON.stringify(ZONE_RATES)), card, "CMS rates must match the supplied card");
assert.equal(FIXED_TIER_MAX_KM, 5);
assert.equal(QUOTED_BEYOND_KM, 15);
let cases = 0;
for (let pickupZone = 1; pickupZone <= 4; pickupZone++) {
  for (let dropoffZone = 1; dropoffZone <= 4; dropoffZone++) {
    for (const distanceKm of [0, 4.9, 5, 5.01, 5.1, 10, 15, 15.01]) {
      const fare = quoteZoneFare({ distanceKm, pickupZone, dropoffZone });
      const zone = Math.max(pickupZone, dropoffZone);
      const tier = distanceKm <= 5 ? "fixed" : distanceKm <= 15 ? "per_km" : "quote";
      const expected = tier === "fixed" ? card[zone].fixedUpTo5km
        : tier === "per_km" ? Math.round(distanceKm * card[zone].perKm / 1000) * 1000 : 0;
      assert.equal(fare.zone, zone);
      assert.equal(fare.tier, tier);
      assert.equal(fare.base, expected);
      assert.equal(fare.total, expected);
      assert.equal(fare.reason, tier === "quote" ? "beyond_range" : null);
      cases++;
    }
  }
}
for (const badZone of [null, 0, 5, NaN, Infinity]) {
  for (const [pickupZone, dropoffZone] of [[badZone, 3], [3, badZone], [badZone, badZone]]) {
    const fare = quoteZoneFare({ distanceKm: 8, pickupZone, dropoffZone });
    assert.equal(fare.tier, "quote", "Both endpoints must be recognised before quoting automatically");
    assert.equal(fare.reason, "outside_zone");
    assert.equal(fare.zone, null);
    assert.equal(fare.total, 0);
    cases++;
  }
}
for (const area of coverage.areas) {
  assert.equal(zoneForPoint(area.lat, area.lon), area.zoneId, `${area.name} resolves to its configured zone`);
  cases++;
}
assert.equal(zoneForPoint(-6.2, 106.8), null, "Jakarta is outside the service area");
const denpasar = coverage.areas.find((a) => a.id === "denpasar-kota");
const southKuta = coverage.areas.find((a) => a.id === "kuta-selatan");
const pickupZone = zoneForPoint(denpasar.lat, denpasar.lon);
const dropoffZone = zoneForPoint(southKuta.lat, southKuta.lon);
assert.equal(pickupZone, 1);
assert.equal(dropoffZone, 3);
for (const [distanceKm, total] of [[5, 70000], [10, 140000], [15, 210000]]) {
  assert.equal(quoteZoneFare({ distanceKm, pickupZone, dropoffZone }).total, total);
  assert.equal(quoteZoneFare({ distanceKm, pickupZone: dropoffZone, dropoffZone: pickupZone }).total, total);
  console.log(`Denpasar ↔ South Kuta, ${distanceKm} km: Zone 3, Rp${total.toLocaleString("id-ID")}`);
}
assert.equal(quoteZoneFare({ distanceKm: 10, pickupZone, dropoffZone, waitingHours: 2 }).total, 170000);
console.log(`PASS: ${cases} matrix/endpoint/location cases, owner examples, waiting fee and outside-area check.`);
