/**
 * Finalization visual smoke: capture the new docs pages and a component
 * page with its keyboard table, in light + dark where meaningful.
 * Output: /tmp/render/p6-*.png
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = "/tmp/render";
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "p6-frameworks", path: "/docs/frameworks", dark: false },
  { name: "p6-mobile", path: "/docs/mobile", dark: false },
  { name: "p6-licensing", path: "/docs/licensing", dark: false },
  { name: "p6-select-keyboard", path: "/docs/select", dark: false },
  { name: "p6-select-keyboard-dark", path: "/docs/select", dark: true },
  { name: "p6-input-pill", path: "/docs/input", dark: false },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  if (shot.dark) {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });
  }
  await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: false });
  console.log(`captured ${shot.name}`);
  await page.close();
}
await browser.close();
console.log("done");
