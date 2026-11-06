import { chromium } from "playwright";
import fs from "fs";

/**
 * P15 full-site sweep: every docs page (62), every guide, every template,
 * both themes. Reports non-200s, console errors, page errors, broken
 * images and horizontal overflow. Captures figure + full-page shots for
 * the pages that matter.
 */

const OUT = "/home/z/my-project/shots/p15";
if (!process.env.THEME || process.env.THEME === "light") {
  fs.rmSync(OUT, { recursive: true, force: true });
}
for (const dir of ["components", "pages", "mobile", "templates"]) {
  fs.mkdirSync(`${OUT}/${dir}`, { recursive: true });
}

const BASE = "http://localhost:3000";

// Extract template ids from the generated data (unique "id":"x","title" shape).
const gen = fs.readFileSync("src/lib/docs-data.generated.ts", "utf8");
const TEMPLATE_IDS = [...gen.matchAll(/"id":"([a-z0-9-]+)","title":"/g)].map((m) => m[1]);
const COMPONENT_SLUGS = [...new Set([...gen.matchAll(/"([a-z0-9-]+)":"[A-Z][A-Za-z]+"/g)].map((m) => m[1]))]
  .filter((s) => s.length > 2 && s.includes("-") || ["kbd", "card", "table", "toast", "tabs", "chart"].includes(s));
// Safer: use the authoritative slugToExport map.
const slugMapMatch = gen.match(/export const slugToExport: Record<string, string> = (\{[^}]+\})/);
const SLUGS = slugMapMatch ? Object.keys(JSON.parse(slugMapMatch[1].replace(/=/, ":"))) : COMPONENT_SLUGS;

const STATIC_PAGES = [
  "/", "/docs", "/docs/installation", "/docs/theming", "/docs/frameworks",
  "/docs/mobile", "/docs/react-native", "/docs/licensing", "/playground",
  "/templates", "/templates/docs",
];

const problems = [];
const overflowReport = [];
const brokenImages = [];
const FULL_SHOTS = new Set([
  "/", "/docs", "/playground", "/docs/react-native", "/templates", "/templates/docs",
  "/docs/button", "/docs/avatar", "/docs/chat", "/docs/command",
  "/docs/slide-to-confirm", "/docs/scroll-progress", "/docs/parallax", "/docs/knob",
]);

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

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

async function auditPage(page, path, theme, { figures = false, full = false, dir = "pages" } = {}) {
  try {
    const response = await gotoWithRetry(page, `${BASE}${path}`);
    if (!response || response.status() !== 200) {
      problems.push(`${path} returned ${response ? response.status() : "no response"} (${theme})`);
      return;
    }
    await page.waitForTimeout(800);

    // Broken images
    const badImgs = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => img.complete && img.naturalWidth === 0 && img.getAttribute("src"))
        .map((img) => img.getAttribute("src")),
    );
    for (const src of badImgs) brokenImages.push(`${path} (${theme}): broken img ${src}`);

    // Horizontal overflow
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }));
    if (overflow.scrollW > overflow.innerW + 1) {
      overflowReport.push(`${path} (${theme}): scrollWidth ${overflow.scrollW} > viewport ${overflow.innerW}`);
    }

    if (figures) {
      const items = page.locator("main figure");
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        try {
          const fig = items.nth(i);
          await fig.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          const cap = await fig.locator("figcaption span").first().innerText().catch(() => `${i}`);
          const file = `${OUT}/components/${slugify(path)}-${i}-${slugify(cap)}-${theme}.png`;
          await fig.screenshot({ path: file, animations: "disabled" });
        } catch (err) {
          problems.push(`figure ${i} on ${path} (${theme}): ${err.message.split("\n")[0]}`);
        }
      }
    }

    if (full || FULL_SHOTS.has(path)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      const height = await page.evaluate(() => document.body.scrollHeight);
      await page.setViewportSize({ width: 1440, height: Math.min(height + 120, 12000) });
      await page.waitForTimeout(1000);
      const name = path === "/" ? "home" : slugify(path);
      await page.screenshot({ path: `${OUT}/${dir}/${name}-${theme}.png`, animations: "disabled" });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  } catch (err) {
    problems.push(`${path} (${theme}): ${err.message.split("\n")[0]}`);
    try { await page.setViewportSize({ width: 1440, height: 900 }); } catch {}
  }
}

const browser = await chromium.launch();
const THEMES = process.env.THEME ? [process.env.THEME] : ["light", "dark"];

for (const theme of THEMES) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  await page.addInitScript(([t]) => localStorage.setItem("theme", t), [theme]);
  page.on("pageerror", (err) => problems.push(`pageerror on ${page.url()}: ${err.message.split("\n")[0]}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console error on ${page.url()}: ${msg.text().slice(0, 200)}`);
  });

  for (const path of STATIC_PAGES) {
    await auditPage(page, path, theme, { figures: path.startsWith("/docs") && path !== "/docs", full: true });
  }
  for (const slug of SLUGS) {
    await auditPage(page, `/docs/${slug}`, theme, { figures: true, full: true });
  }
  for (const id of TEMPLATE_IDS) {
    await auditPage(page, `/templates/${id}`, theme, { full: true, dir: "templates" });
  }
  await context.close();
}

// Mobile pass: home, playground, a docs page, react-native guide, nav drawer
if (!process.env.THEME || process.env.THEME === "light") {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  page.on("pageerror", (err) => problems.push(`mobile pageerror: ${err.message.split("\n")[0]}`));

  for (const path of ["/", "/playground", "/docs/button", "/docs/react-native", "/docs/chat", "/templates"]) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1000);
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }));
    if (overflow.scrollW > overflow.innerW + 1) {
      overflowReport.push(`MOBILE ${path}: scrollWidth ${overflow.scrollW} > viewport ${overflow.innerW}`);
    }
    const height = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width: 390, height: Math.min(height + 120, 20000) });
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${OUT}/mobile/m-${slugify(path)}.png`, animations: "disabled" });
    await page.setViewportSize({ width: 390, height: 844 });
  }

  // Mobile nav drawer
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/mobile/drawer.png`, animations: "disabled" });
  await context.close();
}

await browser.close();

const count = (dir) => {
  try { return fs.readdirSync(`${OUT}/${dir}`).length; } catch { return 0; }
};

console.log(`swept: ${SLUGS.length} components x2 themes, ${TEMPLATE_IDS.length} templates x2, ${STATIC_PAGES.length} static x2`);
console.log("shots:", { components: count("components"), pages: count("pages"), templates: count("templates"), mobile: count("mobile") });

if (overflowReport.length) {
  console.log(`\nHORIZONTAL OVERFLOW (${overflowReport.length}):`);
  for (const o of overflowReport) console.log(" !", o);
}
if (brokenImages.length) {
  console.log(`\nBROKEN IMAGES (${brokenImages.length}):`);
  for (const b of brokenImages) console.log(" !", b);
}
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of [...new Set(problems)].slice(0, 60)) console.log(" -", p);
} else {
  console.log("\nNo page errors, no console errors, all routes 200.");
}
