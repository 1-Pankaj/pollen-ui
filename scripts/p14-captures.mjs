import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = "/tmp/render";
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  { url: "/docs/avatar", name: "avatar" },
  { url: "/docs/react-native", name: "rn-guide" },
  { url: "/docs/knob", name: "knob" },
  { url: "/docs/compare-slider", name: "compare" },
  { url: "/docs/activity-heatmap", name: "heatmap" },
  { url: "/docs/stepper", name: "stepper" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
for (const s of shots) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}${s.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${s.name}.jpg`, type: "jpeg", quality: 60, fullPage: false });
  console.log("captured", s.name);
  await page.close();
}
await browser.close();
