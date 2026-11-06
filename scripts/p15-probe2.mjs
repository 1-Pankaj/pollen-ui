import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const dumpTransform = (sel) =>
  page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) return "MISSING";
    const s = getComputedStyle(el);
    return JSON.stringify({ transform: s.transform, scale: s.scale, translate: s.translate, rotate: s.rotate });
  }, sel);

// magnetic-button: hover near the edge
await page.goto("http://localhost:3000/docs/magnetic-button", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const magBtn = page.locator("main figure > div button, main figure > div a").first();
console.log("magnetic before:", await dumpTransform("main figure > div button"));
const box = await magBtn.boundingBox();
await page.mouse.move(box.x + 3, box.y + 3);
await page.waitForTimeout(150);
await page.mouse.move(box.x + 2, box.y + 2);
await page.waitForTimeout(500);
console.log("magnetic after edge-hover:", await dumpTransform("main figure > div button"));
console.log("magnetic btn tag:", await magBtn.evaluate((el) => el.outerHTML.slice(0, 200)));

// tilt-card
await page.goto("http://localhost:3000/docs/tilt-card", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const tilt = page.locator("main figure > div > div").first();
const tbox = await tilt.boundingBox();
console.log("tilt target:", await tilt.evaluate((el) => el.outerHTML.slice(0, 150)));
await page.mouse.move(tbox.x + tbox.width * 0.15, tbox.y + tbox.height * 0.15);
await page.waitForTimeout(150);
await page.mouse.move(tbox.x + tbox.width * 0.1, tbox.y + tbox.height * 0.1);
await page.waitForTimeout(600);
console.log("tilt after hover:", await dumpTransform("main figure > div > div"));

// pressable-card
await page.goto("http://localhost:3000/docs/pressable-card", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const press = page.locator("main figure > div button, main figure > div [role=button]").first();
const pbox = await press.boundingBox();
await page.mouse.move(pbox.x + pbox.width / 2, pbox.y + pbox.height / 2);
await page.mouse.down();
await page.waitForTimeout(400);
console.log("pressable during press:", await dumpTransform("main figure > div button, main figure > div [role=button]"));
console.log("pressable target:", await press.evaluate((el) => el.outerHTML.slice(0, 150)));
await page.mouse.up();

await browser.close();
