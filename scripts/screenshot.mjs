import { chromium } from "playwright";
import fs from "fs";

const OUT = "/home/z/my-project/shots";
fs.rmSync(OUT, { recursive: true, force: true });
for (const dir of ["components", "pages", "mobile"]) {
  fs.mkdirSync(`${OUT}/${dir}`, { recursive: true });
}

const BASE = "http://localhost:3000";
const SLUGS = [
  "button", "badge", "input", "textarea", "label", "select", "checkbox",
  "radio-group", "switch", "slider", "modal", "drawer", "tooltip",
  "dropdown-menu", "command", "toast", "tabs", "breadcrumb", "accordion",
  "avatar", "alert", "skeleton", "spinner", "progress", "kbd", "table",
  "card", "code-block", "segmented-control", "reveal", "text-reveal",
  "marquee", "scroll-progress", "parallax",
];
const STATIC_PAGES = ["/", "/docs", "/docs/installation", "/docs/theming"];

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

const problems = [];

async function hideChrome(page) {
  await page.addStyleTag({
    content: "nextjs-portal{display:none!important}",
  });
}

async function gotoWithRetry(page, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 6000));
    }
  }
}

async function shootPage(page, path, theme, { figures = true, full = true } = {}) {
  try {
    const response = await gotoWithRetry(page, `${BASE}${path}`);
    if (!response || response.status() !== 200) {
      problems.push(`${path} returned ${response ? response.status() : "no response"} (${theme})`);
      return;
    }
    await page.waitForTimeout(900);

    if (figures) {
      const items = page.locator("main figure");
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        try {
          const fig = items.nth(i);
          await fig.scrollIntoViewIfNeeded();
          await page.waitForTimeout(650);
          const caption = await fig.locator("figcaption span").first().innerText();
          const file = `${OUT}/components/${slugify(path)}-${i}-${slugify(caption)}-${theme}.png`;
          await fig.screenshot({ path: file, animations: "disabled" });
        } catch (err) {
          problems.push(`figure ${i} on ${path} (${theme}): ${err.message.split("\n")[0]}`);
        }
      }
    }

    if (full) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      const height = await page.evaluate(() => document.body.scrollHeight);
      await page.setViewportSize({
        width: 1440,
        height: Math.min(height + 120, 12000),
      });
      await page.waitForTimeout(1200);
      const name = path === "/" ? "home" : slugify(path).replace(/docs-/g, "");
      await page.screenshot({
        path: `${OUT}/pages/${name}-${theme}.png`,
        animations: "disabled",
      });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  } catch (err) {
    problems.push(`${path} (${theme}): ${err.message.split("\n")[0]}`);
    try {
      await page.setViewportSize({ width: 1440, height: 900 });
    } catch {}
  }
}

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  await page.addInitScript(([t]) => localStorage.setItem("theme", t), [theme]);
  page.on("pageerror", (err) => problems.push(`pageerror on ${page.url()}: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      problems.push(`console error on ${page.url()}: ${msg.text()}`);
    }
  });

  for (const path of STATIC_PAGES) {
    await shootPage(page, path, theme, { figures: path !== "/", full: true });
  }
  for (const slug of SLUGS) {
    await shootPage(page, `/docs/${slug}`, theme, { figures: true, full: false });
  }
  await context.close();
}

// Mobile pass (light + one dark drawer shot)
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  page.on("pageerror", (err) => problems.push(`mobile pageerror: ${err.message}`));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await hideChrome(page);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/mobile/home-hero.png`, animations: "disabled" });

  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 390, height: Math.min(height + 120, 20000) });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/mobile/home-full.png`, animations: "disabled" });
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${BASE}/docs/button`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/mobile/docs.png`, animations: "disabled" });

  // Mobile navigation drawer
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/mobile/drawer.png`, animations: "disabled" });

  await context.close();
}

await browser.close();

const count = (dir) => {
  try {
    return fs.readdirSync(`${OUT}/${dir}`).length;
  } catch {
    return 0;
  }
};

console.log("component shots:", count("components"));
console.log("page shots:", count("pages"));
console.log("mobile shots:", count("mobile"));
if (problems.length) {
  console.log("\nPROBLEMS:");
  for (const p of [...new Set(problems)].slice(0, 30)) console.log(" -", p);
} else {
  console.log("\nNo page errors, no console errors, all routes 200.");
}
