import { chromium } from "playwright";
import fs from "fs";

const OUT = "/home/z/my-project/shots/p15";
fs.mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

// Desktop full page
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/playground`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 1440, height: Math.min(height + 120, 16000) });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/playground-desktop-full.png`, animations: "disabled" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await ctx.close();
}

// Mobile full page
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/playground`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 390, height: Math.min(height + 120, 20000) });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/playground-mobile-full.png`, animations: "disabled" });
  await ctx.close();
}

await browser.close();
console.log("captured", fs.readdirSync(OUT));
