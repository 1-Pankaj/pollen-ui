/**
 * P6 RTL verification: floating panels mirror in RTL, unchanged in LTR.
 * Run: node scripts/p6-rtl-verify.mjs [BASE_URL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
let failures = 0;
const ok = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();

async function openSelect(page) {
  const trigger = page.locator('[aria-haspopup="listbox"]').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.waitForTimeout(450);
  const listbox = page.getByRole("listbox").first();
  await listbox.waitFor({ state: "visible", timeout: 3000 });
  return { trigger, listbox };
}

try {
  // LTR baseline: panel starts at the trigger's left edge.
  const ltr = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await ltr.goto(`${BASE}/docs/select`, { waitUntil: "networkidle" });
  const ltrCtx = await openSelect(ltr);
  const tRect = await ltrCtx.trigger.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right };
  });
  const ltrPanel = await ltrCtx.listbox.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left };
  });
  ok(
    `LTR: panel left edge tracks trigger left (${Math.abs(ltrPanel.left - tRect.left).toFixed(1)}px)`,
    Math.abs(ltrPanel.left - tRect.left) < 2,
  );
  await ltr.close();

  // RTL: the docs page content forced right-to-left. Panels must anchor
  // to the trigger's right edge.
  const rtl = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await rtl.goto(`${BASE}/docs/select`, { waitUntil: "networkidle" });
  await rtl.evaluate(() => {
    document.documentElement.setAttribute("dir", "rtl");
  });
  const rtlCtx = await openSelect(rtl);
  const rtRect = await rtlCtx.trigger.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right };
  });
  const rtlPanel = await rtlCtx.listbox.evaluate((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { left: r.left, direction: cs.direction };
  });
  const rightDelta = Math.abs(rtlPanel.left + (rtRect.right - rtRect.left) - rtRect.right);
  ok(
    `RTL: panel right edge tracks trigger right (delta ${rightDelta.toFixed(1)}px)`,
    rightDelta < 2,
  );
  await rtl.close();
} catch (err) {
  console.error("RUNNER ERROR:", err.message);
  failures++;
} finally {
  await browser.close();
}

console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
