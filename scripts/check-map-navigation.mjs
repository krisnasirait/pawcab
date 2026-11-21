// Requires Node.js 22+ and Chrome with --remote-debugging-port=9333.
// Run against next dev or next start: node scripts/check-map-navigation.mjs http://localhost:3000
import assert from "node:assert/strict";

const base = process.argv[2] || "http://localhost:3000";
const targets = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const target = targets.find((item) => item.type === "page");
assert.ok(target, "Open a Chrome tab with remote debugging enabled");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") {
    const detail = message.params.exceptionDetails;
    errors.push(detail.exception?.description || detail.text);
  }
  const task = pending.get(message.id);
  if (task) {
    pending.delete(message.id);
    if (message.error) task.reject(new Error(JSON.stringify(message.error)));
    else task.resolve(message.result);
  }
});
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  pending.set(requestId, { resolve, reject });
  socket.send(JSON.stringify({ id: requestId, method, params }));
});
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function waitFor(expression) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  assert.fail(`Timed out: ${expression}\n${errors.join("\n")}`);
}
const mapReady = `location.pathname === '/' && document.querySelectorAll('#coverage .leaflet-overlay-pane path').length === 39`;
async function revealCoverageMap() {
  // The map is lazy-mounted near the viewport; bring it into view first.
  await evaluate(`document.querySelector('#coverage').scrollIntoView()`);
}
try {
  await call("Page.enable");
  await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await call("Page.navigate", { url: base });
  await revealCoverageMap();
  await waitFor(mapReady);
  for (let cycle = 0; cycle < 3; cycle++) {
    await evaluate(`document.querySelector('a[href="/services/dog-walking"]').click()`);
    await waitFor(`location.pathname === '/services/dog-walking'`);
    await evaluate(`document.querySelector('header a[aria-label="The PawCab home"]').click()`);
    await revealCoverageMap();
    await waitFor(mapReady);
    assert.equal(await evaluate(`document.querySelectorAll('#coverage .leaflet-container').length`), 1);
    await evaluate(`[...document.querySelectorAll('#coverage [aria-pressed]')].find(b => b.innerText === 'All zones').click()`);
    await waitFor(`document.querySelector('#coverage [aria-live]').innerText.includes('29 areas')`);
    await evaluate(`[...document.querySelectorAll('#coverage [aria-pressed]')].find(b => b.innerText.startsWith('Zone 3')).click()`);
    await waitFor(`document.querySelector('#coverage [aria-live]').innerText.startsWith('Zone 3:')`);
    console.log(`PASS navigation cycle ${cycle + 1}: one map, 10 polygons + 29 markers, working filter`);
  }
  assert.deepEqual(errors, [], "No runtime exceptions during cached navigation");
} finally {
  socket.close();
}
