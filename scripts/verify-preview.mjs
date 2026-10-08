import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Verify a running preview, including bundles needed for navigation.
const origin = process.argv[2] ?? "http://127.0.0.1:3005";
const scripts = new Set();
for (const route of ["/", "/work", "/brochure?page=11", "/sponsors"]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, `${route} must load`);
  const html = await response.text();
  assert.match(html, /HR VISTA/, `${route} must contain the site`);
  for (const match of html.matchAll(/<script[^>]+src="([^\"]+)"/g)) scripts.add(match[1]);
  console.log(`PASS ${route}`);
}
for (const src of scripts) {
  const response = await fetch(new URL(src, origin));
  assert.equal(response.status, 200, `JavaScript bundle missing: ${src}`);
  assert.match(response.headers.get("content-type") ?? "", /javascript/);
}
console.log(`PASS ${scripts.size} JavaScript bundles`);
const pdfResponse = await fetch(new URL("/brochure/HR-VISTA-3.0.pdf", origin));
assert.equal(pdfResponse.status, 200);
const served = Buffer.from(await pdfResponse.arrayBuffer());
const source = await readFile(new URL("../public/brochure/HR-VISTA-3.0.pdf", import.meta.url));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
assert.equal(served.subarray(0, 4).toString(), "%PDF");
assert.equal(hash(served), hash(source), "Download must match the complete brochure");
console.log(`PASS brochure download (${served.length.toLocaleString()} bytes)`);
