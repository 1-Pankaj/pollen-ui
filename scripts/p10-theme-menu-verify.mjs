import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const problems = [];
const passes = [];

function check(name, cond, detail = "") {
  if (cond) {
    passes.push(name);
    console.log(`PASS  ${name}${detail ? ` (${detail})` : ""}`);
  } else {
    problems.push(name);
    console.log(`FAIL  ${name}${detail ? ` (${detail})` : ""}`);
  }
}

const browser = await chromium.launch();

try {
  // ---------- 1. Theme menu: no ring on the panel, check on one row ----------
  const page = await browser.newPage({ viewport: { width: 1380, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 140)}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForTimeout(400);

  const trigger = page.locator('[aria-label="Toggle theme"]').first();
  await trigger.click();
  await page.waitForTimeout(450);
  const menu = page.locator('[role="menu"]').last();

  const outline = await menu.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      style: cs.outlineStyle,
      width: cs.outlineWidth,
      color: cs.outlineColor,
    };
  });
  check(
    "theme menu panel paints no focus outline",
    outline.style === "none" || parseFloat(outline.width) === 0,
    `style=${outline.style} width=${outline.width}`,
  );

  // The check sits on the selected item's row, to the right of the label.
  const row = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll('[role="menu"] [role="menuitem"]'),
    );
    const sel = items.find(
      (el) => el.querySelector("svg[class*='shrink-0']") !== null,
    );
    if (!sel) return null;
    const label = sel.querySelector("span.flex-1");
    const icon = sel.querySelector("svg[class*='shrink-0']");
    const a = label.getBoundingClientRect();
    const b = icon.getBoundingClientRect();
    return {
      label: label.textContent.trim(),
      sameRow: Math.abs(a.top - b.top) < 4 && Math.abs(a.bottom - b.bottom) < 4,
      rightOfLabel: b.left > a.left,
      insidePanel:
        b.right <=
        sel.closest('[role="menu"]').getBoundingClientRect().right - 4,
    };
  });
  check("selected item carries the check", row !== null, row?.label ?? "none");
  if (row) {
    check("check is on the label's row, not wrapped below", row.sameRow);
    check("check sits at the row's end", row.rightOfLabel && row.insidePanel);
  }

  await page.screenshot({ path: "/tmp/render/theme-menu-dark.png" });

  // Switching still works: Light -> html.light
  await page.getByRole("menuitem", { name: "Light" }).click();
  await page.waitForTimeout(500);
  const isLight = await page.evaluate(() =>
    document.documentElement.classList.contains("light"),
  );
  check("picking Light switches the document to light", isLight);

  await page.screenshot({ path: "/tmp/render/theme-menu-light.png" });

  // ---------- 2. Keyboard path: Enter opens, first item focused, no ring ----------
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(450);
  const kb = await page.evaluate(() => {
    const menu = document.querySelector('[role="menu"]:last-of-type');
    const active = document.activeElement;
    const cs = menu ? getComputedStyle(menu) : null;
    return {
      open: !!menu,
      outlineNone: cs ? cs.outlineStyle === "none" : false,
      activeIsItem: active?.getAttribute("role") === "menuitem",
      activeLabel: active?.textContent?.trim() ?? "",
    };
  });
  check("keyboard open keeps the panel ring-free", kb.open && kb.outlineNone);
  check(
    "keyboard open lands focus on the first item",
    kb.activeIsItem,
    kb.activeLabel,
  );
  await page.keyboard.press("Escape");

  // ---------- 3. Select listbox: no ring ----------
  await page.goto(`${BASE}/docs/select`, { waitUntil: "networkidle" });
  await page.emulateMedia({ colorScheme: "dark" });
  const selectTrigger = page.locator('[aria-haspopup="listbox"]').first();
  await selectTrigger.click();
  await page.waitForTimeout(450);
  const listboxOutline = await page.evaluate(() => {
    const lb = document.querySelector('[role="listbox"]');
    if (!lb) return null;
    const cs = getComputedStyle(lb);
    return cs.outlineStyle === "none" || parseFloat(cs.outlineWidth) === 0;
  });
  check("select listbox paints no focus outline", listboxOutline === true);
  await page.keyboard.press("Escape");

  // ---------- 4. Modal dialog: no ring ----------
  await page.goto(`${BASE}/docs/modal`, { waitUntil: "networkidle" });
  const openBtn = page.getByRole("button", { name: /open dialog/i }).first();
  await openBtn.click();
  await page.waitForTimeout(550);
  const dialogOutline = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return null;
    const cs = getComputedStyle(dlg);
    return cs.outlineStyle === "none" || parseFloat(cs.outlineWidth) === 0;
  });
  check("modal dialog paints no focus outline", dialogOutline === true);
  await page.keyboard.press("Escape");

  // ---------- 5. Page errors ----------
  check("no page or console errors anywhere", errors.length === 0, errors.slice(0, 3).join(" | "));

  await page.close();
} catch (err) {
  problems.push(`suite errored: ${err.message.split("\n")[0]}`);
  console.log(`FAIL  suite errored: ${err.message.split("\n")[0]}`);
} finally {
  await browser.close();
}

console.log(`\n${problems.length === 0 ? "ALL PASS" : `${problems.length} FAILURE(S)`}`);
process.exit(problems.length === 0 ? 0 : 1);
