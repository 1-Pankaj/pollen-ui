import { chromium } from "playwright";

// Verify the home page actually reveals content on real scrolling.
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const H = await page.evaluate(() => document.body.scrollHeight);
console.log("home scrollHeight:", H);

const stops = [0, 0.2, 0.4, 0.6, 0.8, 0.95];
for (const frac of stops) {
  await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), frac);
  await page.waitForTimeout(900);
  // Measure how much visible text content exists at this stop
  const stats = await page.evaluate(() => {
    const els = [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button")];
    let visible = 0;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (r.top < innerHeight && r.bottom > 0 && parseFloat(style.opacity) > 0.5) visible++;
    }
    return { visible, total: els.length };
  });
  console.log(`scroll ${(frac * 100).toFixed(0)}%: visible interactive/text elements = ${stats.visible}/${stats.total}`);
  await page.screenshot({ path: `/home/z/my-project/shots/p15/pages/home-scroll-${Math.round(frac * 100)}.png` });
}
await browser.close();
console.log("done");
