import { chromium } from "playwright";

// P16 probe: reproduce the avatar ring artifact (dark mode) and the
// playground "Phone" viewport state, so fixes target the real DOM.

const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/shots-p16";
import fs from "fs";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.addInitScript(() => localStorage.setItem("theme", "dark"));
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

// 1) Avatar docs page, Photos demo figure
await page.goto(`${BASE}/docs/avatar`, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1000);
const fig = page.locator("main figure").first();
await fig.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await fig.screenshot({ path: `${OUT}/avatar-photos-demo-dark.png`, animations: "disabled" });

// Inspect the computed ring on the group wrapper + first avatar
const ringInfo = await page.evaluate(() => {
  const out = [];
  // group wrappers are spans with class containing ring-
  document.querySelectorAll("main figure span").forEach((el) => {
    const cls = el.className || "";
    if (typeof cls === "string" && cls.includes("ring-2")) {
      const cs = getComputedStyle(el);
      out.push({
        cls: cls.slice(0, 120),
        boxShadow: cs.boxShadow,
        surface: getComputedStyle(el.closest("figure") || el).backgroundColor,
        pageBg: getComputedStyle(document.documentElement).getPropertyValue("--pollen-background"),
        card: getComputedStyle(document.documentElement).getPropertyValue("--pollen-card"),
      });
    }
  });
  return out;
});
console.log("RING INFO:", JSON.stringify(ringInfo, null, 2));

// 2) Component playground Phone mode on button docs
await page.goto(`${BASE}/docs/button`, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(900);
const phoneBtn = page.getByRole("radio", { name: "Phone" }).first();
if (await phoneBtn.count()) {
  await phoneBtn.click();
  await page.waitForTimeout(600);
  const pg = page.locator("#playground");
  await pg.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await pg.screenshot({ path: `${OUT}/playground-phone-before.png`, animations: "disabled" });
} else {
  console.log("No Phone control found on button playground");
}

// 3) Full playground page
await page.goto(`${BASE}/playground`, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/playground-page.png`, animations: "disabled" });

console.log("ERRORS:", errors.length ? errors.slice(0, 10) : "none");
await browser.close();
