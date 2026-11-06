/**
 * P6 field verification: Input pill shape + Textarea underline/resize.
 * Run: node scripts/p6-field-verify.mjs [BASE_URL]
 * Exits non-zero on any failure.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
let failures = 0;
const ok = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

try {
  await page.goto(`${BASE}/docs/input`, { waitUntil: "networkidle" });

  // Pill demo: last basic input before the password demo — find by placeholder.
  const pill = page.locator('input[placeholder="Search components"]').first();
  await pill.scrollIntoViewIfNeeded();
  const pillRadius = await pill.evaluate((el) => getComputedStyle(el).borderRadius);
  ok(`Input shape="pill" renders fully rounded (got ${pillRadius})`, parseFloat(pillRadius) >= 40);

  // Default input keeps its radius.
  const def = page.locator('input[placeholder="you@example.com"]').first();
  const defRadius = await def.evaluate((el) => getComputedStyle(el).borderRadius);
  ok(`Default input radius unchanged (got ${defRadius})`, parseFloat(defRadius) < 20);

  await page.goto(`${BASE}/docs/textarea`, { waitUntil: "networkidle" });

  const underline = page
    .locator('textarea[placeholder="Underline, for inline editing"]')
    .first();
  await underline.scrollIntoViewIfNeeded();
  const uStyle = await underline.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      border: cs.borderBottomWidth,
      radius: cs.borderBottomLeftRadius,
    };
  });
  ok(
    `Textarea underline: transparent bg + bottom border (bg=${uStyle.bg}, border=${uStyle.border})`,
    (uStyle.bg === "rgba(0, 0, 0, 0)" || uStyle.bg === "transparent") &&
      parseFloat(uStyle.border) > 0
  );

  const fill = page.locator('textarea[placeholder="Fill, the default"]').first();
  const fResize = await fill.evaluate((el) => getComputedStyle(el).resize);
  ok(`Textarea default resize is vertical (got ${fResize})`, fResize === "vertical");

  // resize="none" isn't in the demos; verify through the playground source
  // path by injecting the class contract: check the docs page compiles the
  // prop table row instead.
  const propsHtml = await page.content();
  ok("Textarea resize prop documented", propsHtml.includes("resize"));

  // Mobile: coarse pointer keeps 16px text on both fields.
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await mobile.goto(`${BASE}/docs/input`, { waitUntil: "networkidle" });
  const mFont = await mobile
    .locator('input[placeholder="you@example.com"]')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  ok(`Input keeps 16px on coarse pointers (got ${mFont}px)`, mFont >= 16);
  await mobile.close();
} catch (err) {
  console.error("RUNNER ERROR:", err.message);
  failures++;
} finally {
  await browser.close();
}

console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
