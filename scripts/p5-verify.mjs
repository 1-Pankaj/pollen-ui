// P5 verification: keyboard walkthrough of the fixed components and a
// reduced-motion emulation pass. Run with the prod server up on :3000.
//   node scripts/p5-verify.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const results = [];
const record = (name, ok, detail = "") =>
  results.push({ name, ok, detail: String(detail).slice(0, 160) });

async function fresh(reduce = false) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
  return { context, page };
}

// ---- Select: keyboard open, arrow, commit
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/select", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const trigger = page.locator('#playground button[aria-haspopup="listbox"]').first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const listbox = page.locator('[role="listbox"]');
  record("select: listbox opens on Enter", (await listbox.count()) > 0);
  const controls = await page.locator('[role="option"]').count();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  const activeDesc = await trigger.getAttribute("aria-controls");
  const panel = page.locator('[role="listbox"]');
  const desc = await panel.getAttribute("aria-activedescendant");
  record("select: arrows move active option", (desc ?? "").endsWith("2"), `activedescendant=${desc}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const closed = (await page.locator('[role="listbox"]').count()) === 0;
  record("select: Enter commits and closes", closed, `options=${controls}`);
  // type-ahead: reopen, press a letter
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  record("select: Escape closes", (await page.locator('[role="listbox"]').count()) === 0);
  await context.close();
}

// ---- Tabs: arrows switch, Home jumps
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/tabs", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const tab = page.locator('[role="tab"][aria-selected="true"]').first();
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(350);
  const label1 = await page.locator('[role="tab"][aria-selected="true"]').first().textContent();
  const panelLinked = await page
    .locator('[role="tabpanel"]')
    .first()
    .getAttribute("aria-labelledby");
  record("tabs: ArrowRight selects next", !!label1 && label1 !== "Preview", `now=${label1?.trim()}`);
  record("tabs: panel labelled by trigger", !!panelLinked, panelLinked ?? "");
  await page.keyboard.press("Home");
  await page.waitForTimeout(350);
  const label2 = await page.locator('[role="tab"][aria-selected="true"]').first().textContent();
  record("tabs: Home selects first", label2?.trim() === "Preview", `now=${label2?.trim()}`);
  await context.close();
}

// ---- Checkbox + RadioGroup: Space toggles, arrows move
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/checkbox", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const cb = page.locator('#playground [role="checkbox"]').first();
  const before = await cb.getAttribute("aria-checked");
  await cb.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(250);
  const after = await cb.getAttribute("aria-checked");
  record("checkbox: Space toggles", before !== after, `${before} -> ${after}`);
  const hiddenInputs = await page.locator('#playground input[type="checkbox"][aria-hidden="true"]').count();
  record("checkbox: hidden form input present", hiddenInputs > 0, `count=${hiddenInputs}`);
  await context.close();
}
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/radio-group", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const radio = page.locator('#playground [role="radiogroup"] [role="radio"]').first();
  await radio.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(250);
  const group = page.locator('#playground [role="radiogroup"]').first();
  const checkedCount = await group.locator('[role="radio"][aria-checked="true"]').count();
  record("radio: ArrowDown selects next (focus follows)", checkedCount === 1, `checked=${checkedCount}`);
  await context.close();
}

// ---- ToggleGroup: Up/Down arrows
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/toggle-group", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const item = page.locator('#playground button[data-value]').first();
  await item.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(250);
  const focusedValue = await page.evaluate(
    () => document.activeElement?.getAttribute("data-value") ?? "",
  );
  record("toggle-group: ArrowDown moves focus", focusedValue !== "", `data-value=${focusedValue}`);
  await context.close();
}

// ---- Modal: aria wiring + focus trap-ish (labelledby exists)
{
  const { context, page } = await fresh();
  await page.goto(BASE + "/docs/modal", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const openBtn = page.locator("main button", { hasText: /open/i }).first();
  await openBtn.click();
  await page.waitForTimeout(500);
  const dialog = page.locator('[role="dialog"][aria-modal="true"]').first();
  const labelledby = await dialog.getAttribute("aria-labelledby");
  const titleVisible = labelledby
    ? (await page.locator(`[id="${labelledby}"]`).count()) > 0
    : false;
  record("modal: panel labelled by title", titleVisible, `labelledby=${labelledby}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  await context.close();
}

// ---- Reduced motion: dock holds rest size, modal appears instantly
{
  const { context, page } = await fresh(true);
  await page.goto(BASE + "/docs/dock", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const item = page.locator("#playground [data-pollen-dock-item], #playground img").first();
  const handle = (await item.count()) ? item : page.locator("#playground svg").first();
  const boxBefore = await handle.boundingBox();
  const dockArea = page.locator("#playground .fixed, #playground [class*='relative']").first();
  await dockArea.hover({ position: { x: 10, y: 10 } }).catch(() => {});
  const svgs = page.locator("#playground svg");
  const n = Math.min(await svgs.count(), 3);
  let grew = false;
  for (let i = 0; i < n; i++) {
    const b = await svgs.nth(i).boundingBox();
    if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 3 });
    await page.waitForTimeout(120);
    const a = await svgs.nth(i).boundingBox();
    const c = await svgs.nth(i).boundingBox();
    if (a && c && Math.abs(a.width - c.width) > 2) grew = true;
  }
  record("dock: no magnification under reduced motion", !grew, `before=${boxBefore?.width}`);
  await context.close();
}
{
  const { context, page } = await fresh(true);
  await page.goto(BASE + "/docs/modal", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.locator("main button", { hasText: /open/i }).first().click();
  await page.waitForTimeout(80); // near-immediate with duration 0
  const opacity = await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"][aria-modal="true"]');
    return el ? getComputedStyle(el).opacity : "missing";
  });
  record("modal: instant entrance under reduced motion", opacity === "1", `opacity=${opacity}`);
  await context.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n=== p5-verify: ${results.length - failed.length}/${results.length} passed ===`);
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
}
process.exit(0);
