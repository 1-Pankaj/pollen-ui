import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = "/tmp/render";
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1380, height: 900 } });

// 1. Slide to confirm with keyboard focus (single ring).
await page.goto(`${BASE}/docs/slide-to-confirm`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
for (let i = 0; i < 150; i++) {
  const hit = await page.evaluate(() => document.activeElement?.getAttribute("data-handle") != null);
  if (hit) break;
  await page.keyboard.press("Tab");
}
await page.evaluate(() => document.querySelector('[role="slider"][data-handle]')?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/slide-focus.png` });

// 2. Avatar page gradient demo.
await page.goto(`${BASE}/docs/avatar`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.evaluate(() => {
  const fig = Array.from(document.querySelectorAll("figure")).find((f) => f.textContent.includes("Gradient fallbacks"));
  fig?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/avatar-gradient.png` });

// 3. Chat hover reaction toolbar.
await page.goto(`${BASE}/docs/chat`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.locator('p:has-text("Wait until you try slide to confirm")').first().hover();
await page.waitForTimeout(400);
await page.evaluate(() => {
  const fig = document.querySelector("figure");
  fig?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(200);
await page.locator('p:has-text("Wait until you try slide to confirm")').first().hover();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/chat-hover.png` });

// 4. Playground docs sections.
await page.goto(`${BASE}/playground`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h2")).find((x) => x.textContent.includes("Take it into"));
  h?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/playground-docs.png` });

// 5. Templates guide.
await page.goto(`${BASE}/templates/docs`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/templates-docs.png` });

// 6. Button page with the new stack switcher + native selected.
await page.goto(`${BASE}/docs/button`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.locator('[aria-label="Framework"] button:has-text("React Native")').click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/stack-native.png` });

await browser.close();
console.log("screenshots written");
