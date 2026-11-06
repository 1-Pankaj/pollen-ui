import { chromium } from "playwright";
import fs from "fs";

// P16 verify: avatar ring fix + real phone frame in both playgrounds.

const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/shots-p16";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript(([t]) => localStorage.setItem("theme", t), [theme]);
  page.on("pageerror", (e) => problems.push(`pageerror ${theme}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console ${theme}: ${m.text()}`);
  });

  // 1) Avatar demos
  await page.goto(`${BASE}/docs/avatar`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  const fig = page.locator("main figure").first();
  await fig.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await fig.screenshot({ path: `${OUT}/avatar-photos-${theme}.png`, animations: "disabled" });

  // Verify computed ring color now matches card
  const ring = await page.evaluate(() => {
    const el = document.querySelector('main figure span[class*="ring-2"]');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      boxShadow: cs.boxShadow.split("), ").pop(),
      surface: getComputedStyle(el.closest("figure")).backgroundColor,
    };
  });
  console.log(`avatar ring (${theme}):`, JSON.stringify(ring));

  // 2) Docs component playground -> Phone mode
  await page.goto(`${BASE}/docs/button`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  const phoneRadio = page.getByRole("radio", { name: "Phone" }).first();
  if (await phoneRadio.count()) {
    await phoneRadio.click();
    await page.waitForTimeout(700);
    const pg = page.locator("#playground");
    await pg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await pg.screenshot({ path: `${OUT}/docs-playground-phone-${theme}.png`, animations: "disabled" });
    // Confirm the frame renders: bezel element with rounded-[54px]
    const bezel = await page.evaluate(() => {
      const el = document.querySelector('#playground [aria-label="Mobile preview"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const content = el.querySelector(".slim-scroll");
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        innerW: content ? Math.round(content.getBoundingClientRect().width) : null,
      };
    });
    console.log(`docs phone frame (${theme}):`, JSON.stringify(bezel));
  } else {
    problems.push(`Phone control missing on docs/button (${theme})`);
  }

  await context.close();
}

// 3) Main /playground page -> Phone mode (dark)
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  page.on("pageerror", (e) => problems.push(`pageerror playground: ${e.message}`));

  await page.goto(`${BASE}/playground`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1000);
  const phoneRadio = page.getByRole("radio", { name: "Phone" }).first();
  if (await phoneRadio.count()) {
    await phoneRadio.click();
    await page.waitForTimeout(700);
    await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Mobile preview"]');
      el?.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/main-playground-phone-dark.png`, animations: "disabled" });
    const frame = await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Mobile preview"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    console.log("main phone frame (dark):", JSON.stringify(frame));
  } else {
    problems.push("Phone control missing on /playground");
  }

  // 4) Templates page ring check (page-background AvatarGroup override)
  await page.goto(`${BASE}/templates`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  const ringVar = await page.evaluate(() => {
    const el = document.querySelector('[class*="--avatar-ring"]');
    return el ? getComputedStyle(el).getPropertyValue("--avatar-ring").trim() : null;
  });
  console.log("templates ring override:", ringVar || "not found (may be lazy-rendered)");

  await context.close();
}

await browser.close();
console.log("PROBLEMS:", problems.length ? problems.slice(0, 12) : "none");
