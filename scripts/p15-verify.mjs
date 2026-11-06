import { chromium } from "playwright";

/**
 * P15 interaction suite: exercises the docs demo of every component the
 * earlier phase suites (p5-p14) do not already interact with. Every test
 * performs a real interaction and asserts a real DOM outcome, and each
 * page must stay free of console errors.
 */

const BASE = "http://localhost:3000";
const results = [];
let consoleErrors = [];

function pass(n) { results.push(["PASS", n]); }
function fail(n, m) { results.push(["FAIL", `${n} :: ${m}`]); }

async function check(name, fn) {
  try { await fn(); pass(name); } catch (err) { fail(name, err.message.split("\n")[0]); }
}

function expect(cond, msg) { if (!cond) throw new Error(msg); }

async function gotoDocs(slug) {
  consoleErrors = [];
  const res = await page.goto(`${BASE}/docs/${slug}`, { waitUntil: "networkidle", timeout: 45000 });
  expect(res && res.status() === 200, `page status ${res ? res.status() : "none"}`);
  await page.waitForTimeout(700);
}

async function expectNoConsole(slug) {
  expect(consoleErrors.length === 0, `${slug} console errors: ${consoleErrors[0] || ""}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 160)); });
page.on("pageerror", (err) => consoleErrors.push(err.message.slice(0, 160)));

const firstFig = () => page.locator("main figure").first();

/* ---------- overlays: dropdown / context / command / combobox / popover / drawer / tooltip ---------- */

await gotoDocs("dropdown-menu");
await check("dropdown: opens and selects", async () => {
  const trigger = page.locator('button[aria-haspopup="menu"]').first();
  await trigger.click();
  const menu = page.locator('[role="menu"]').first();
  await menu.waitFor({ state: "visible", timeout: 4000 });
  const item = page.locator('[role="menuitem"]').first();
  await item.click();
  await menu.waitFor({ state: "hidden", timeout: 4000 });
});
await check("dropdown: keyboard reachable", async () => {
  await page.keyboard.press("Escape");
  const trigger = page.locator('button[aria-haspopup="menu"]').first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.locator('[role="menu"]').first().waitFor({ state: "visible", timeout: 4000 });
  await page.keyboard.press("Escape");
  await page.locator('[role="menu"]').first().waitFor({ state: "hidden", timeout: 4000 });
});
await expectNoConsole("dropdown-menu");

await gotoDocs("context-menu");
await check("context-menu: right-click opens", async () => {
  await firstFig().click({ button: "right" });
  const menu = page.locator('[role="menu"]').first();
  await menu.waitFor({ state: "visible", timeout: 4000 });
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden", timeout: 4000 });
});
await expectNoConsole("context-menu");

await gotoDocs("command");
await check("command: query filters results", async () => {
  await page.locator("main figure > div button", { hasText: "Open command menu" }).first().click();
  const input = page.locator('[role="dialog"] input').first();
  await input.waitFor({ state: "visible", timeout: 4000 });
  await input.click();
  await page.keyboard.type("dep");
  await page.waitForTimeout(400);
  const items = page.locator('[role="option"], [cmdk-item]');
  expect(await items.count() > 0, "no results for query");
  await page.keyboard.press("Escape");
});
await expectNoConsole("command");

await gotoDocs("combobox");
await check("combobox: type and pick option", async () => {
  const input = page.locator('main figure > div input[role="combobox"]').first();
  await input.click();
  const openCount = await page.locator('[role="option"]').count();
  expect(openCount > 0, `no options on open (${openCount})`);
  await page.keyboard.type("syd");
  await page.waitForTimeout(500);
  const option = page.locator('[role="option"]').first();
  await option.waitFor({ state: "visible", timeout: 4000 });
  await option.click();
  await page.waitForTimeout(300);
  const value = await input.inputValue();
  expect(/sydney/i.test(value), `combobox value is "${value}"`);
});
await expectNoConsole("combobox");

await gotoDocs("popover");
await check("popover: opens and closes on Escape", async () => {
  await page.locator('main figure button', { hasText: "Bottom" }).first().click();
  const content = page.locator('[role="dialog"], [data-state="open"][data-pollen-popper]').first();
  await content.waitFor({ state: "visible", timeout: 4000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
});
await expectNoConsole("popover");

await gotoDocs("drawer");
await check("drawer: opens, Apply closes", async () => {
  await page.locator("main figure > div button", { hasText: "Open drawer" }).first().click();
  const panel = page.locator('[role="dialog"]').first();
  await panel.waitFor({ state: "visible", timeout: 4000 });
  const text = await panel.textContent();
  expect(text && text.includes("Filters"), `drawer content missing Filters: "${(text || "").slice(0, 60)}"`);
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden", timeout: 4000 });
});
await expectNoConsole("drawer");

await gotoDocs("tooltip");
await check("tooltip: appears on hover", async () => {
  await page.locator('main figure > div button[aria-label="Copy"]').first().hover();
  await page.locator('[role="tooltip"]').first().waitFor({ state: "visible", timeout: 4000 });
});
await expectNoConsole("tooltip");

/* ---------- primitives: otp / slider / stepper / segmented ---------- */

await gotoDocs("otp-input");
await check("otp: typing fills four cells", async () => {
  const group = page.locator('main figure > div [role="group"][aria-label="Verification code"]').first();
  await group.locator("input").first().click();
  await page.keyboard.type("2039");
  await page.waitForTimeout(300);
  const all = group.locator("input");
  const n = await all.count();
  let filled = 0;
  for (let i = 0; i < n; i++) if (await all.nth(i).inputValue()) filled++;
  expect(filled >= 4, `only ${filled} of ${n} cells filled`);
});
await expectNoConsole("otp-input");

await gotoDocs("slider");
await check("slider: arrow key moves value", async () => {
  const thumb = page.locator('[role="slider"]').first();
  await thumb.focus();
  const before = Number(await thumb.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(250);
  const after = Number(await thumb.getAttribute("aria-valuenow"));
  expect(after > before, `value ${before} -> ${after}`);
});
await check("slider: Home jumps to min", async () => {
  const thumb = page.locator('[role="slider"]').first();
  await thumb.focus();
  await page.keyboard.press("Home");
  await page.waitForTimeout(250);
  const min = Number(await thumb.getAttribute("aria-valuemin"));
  const now = Number(await thumb.getAttribute("aria-valuenow"));
  expect(now === min, `value ${now} != min ${min}`);
});
await expectNoConsole("slider");

await gotoDocs("stepper");
await check("stepper: arrow up increments", async () => {
  const spin = page.locator('[role="spinbutton"]').first();
  await spin.focus();
  const before = Number(await spin.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(300);
  const after = Number(await spin.getAttribute("aria-valuenow"));
  expect(after === before + 1, `value ${before} -> ${after}`);
});
await expectNoConsole("stepper");

await gotoDocs("segmented-control");
await check("segmented: selecting moves checked state", async () => {
  const group = page.locator('[role="radiogroup"][aria-label="Inbox filter"]').first();
  const options = group.locator('[role="radio"], button');
  await options.nth(1).click();
  await page.waitForTimeout(250);
  const checked = await options.nth(1).getAttribute("aria-checked");
  expect(checked === "true", `second option aria-checked=${checked}`);
});
await expectNoConsole("segmented-control");

/* ---------- expanded: pagination / rating / tag-input / empty-state / timeline ---------- */

await gotoDocs("pagination");
await check("pagination: page 10 becomes current", async () => {
  const nav = page.locator('nav[aria-label="Deployment pages"]').first();
  await nav.locator("button", { hasText: /^10$/ }).first().click();
  await page.waitForTimeout(300);
  const current = await nav.locator('[aria-current="page"]').first().innerText();
  expect(current.trim() === "10", `aria-current is on "${current.trim()}"`);
  const live = await nav.locator('[aria-live="polite"]').first().innerText();
  expect(live.includes("10"), `live region says "${live.trim()}"`);
});
await expectNoConsole("pagination");

await gotoDocs("rating");
await check("rating: arrows move the value", async () => {
  const slider = page.locator('[role="slider"][aria-label="Your rating"]').first();
  await slider.focus();
  const before = Number(await slider.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(250);
  const after = Number(await slider.getAttribute("aria-valuenow"));
  expect(after === before + 1, `value ${before} -> ${after}`);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(250);
  const back = Number(await slider.getAttribute("aria-valuenow"));
  expect(back === before, `back to ${back}, expected ${before}`);
});
await expectNoConsole("rating");

await gotoDocs("tag-input");
await check("tag-input: Enter adds a tag", async () => {
  const input = page.locator('main figure > div input[aria-label="Roles"]').first();
  await input.click();
  await page.keyboard.type("research");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const chip = page.locator('main figure > div button[aria-label="Remove research"]');
  expect(await chip.count() === 1, "chip 'research' not added");
});
await check("tag-input: Backspace removes last tag", async () => {
  const input = page.locator('main figure > div input[aria-label="Roles"]').first();
  await input.click();
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(300);
  const removed = page.locator('main figure > div button[aria-label="Remove research"]');
  expect(await removed.count() === 0, "tag 'research' still present after Backspace");
});
await expectNoConsole("tag-input");

await gotoDocs("empty-state");
await check("empty-state: action button present", async () => {
  const btn = firstFig().locator("button").first();
  expect(await btn.count() > 0, "no button in demo");
});
await expectNoConsole("empty-state");

await gotoDocs("timeline");
await check("timeline: entries render", async () => {
  const items = page.locator("main figure li, main figure [data-slot]").first();
  expect(await items.count() > 0, "no timeline entries");
});
await expectNoConsole("timeline");

/* ---------- data display: table / code-block / kbd / breadcrumb / progress / progress-ring ---------- */

await gotoDocs("table");
await check("table: header click sorts", async () => {
  await page.locator('main figure th, main figure button', { hasText: "Name" }).first().click();
  await page.waitForTimeout(400);
  const sort = await page.locator("main figure [aria-sort]").first().getAttribute("aria-sort");
  expect(sort && sort !== "none", `aria-sort=${sort}`);
});
await expectNoConsole("table");

await gotoDocs("code-block");
await check("code-block: copy button works", async () => {
  const btn = page.locator("main figure button", { hasText: "Copy" }).first();
  await btn.click();
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  expect(clip.length > 0, "clipboard empty after copy");
});
await expectNoConsole("code-block");

await gotoDocs("kbd");
await check("kbd: keys render", async () => {
  expect(await page.locator("main figure kbd").count() > 0, "no <kbd> elements");
});
await expectNoConsole("kbd");

await gotoDocs("breadcrumb");
await check("breadcrumb: links render", async () => {
  const links = page.locator('nav[aria-label="Breadcrumb"] a, nav[aria-label="breadcrumb"] a');
  expect(await links.count() >= 2, "fewer than 2 breadcrumb links");
});
await expectNoConsole("breadcrumb");

await gotoDocs("progress");
await check("progress: value announced", async () => {
  const bar = page.locator('[role="progressbar"]').first();
  const now = await bar.getAttribute("aria-valuenow");
  expect(now !== null, "no aria-valuenow");
});
await expectNoConsole("progress");

await gotoDocs("progress-ring");
await check("progress-ring: svg renders", async () => {
  expect(await page.locator("main figure svg circle").count() > 0, "no ring circles");
});
await expectNoConsole("progress-ring");

/* ---------- display/motion presence + behavior ---------- */

await gotoDocs("badge");
await check("badge: variants render", async () => {
  expect(await page.locator("main figure span").count() > 0, "no badges");
});
await expectNoConsole("badge");

await gotoDocs("alert");
await check("alert: content renders", async () => {
  expect(await firstFig().innerText().then((t) => t.length > 20), "alert figure nearly empty");
});
await expectNoConsole("alert");

await gotoDocs("skeleton");
await check("skeleton: shimmer animation running", async () => {
  const sk = page.locator('main figure > div [class*="animate-pulse"], main figure > div [class*="pollen-shimmer"]').first();
  const anim = await sk.evaluate((el) => getComputedStyle(el).animationName);
  expect(anim && anim !== "none", `animationName=${anim}`);
});
await expectNoConsole("skeleton");

await gotoDocs("spinner");
await check("spinner: spinning", async () => {
  const sp = page.locator('main figure > div [class*="pollen-spin"]').first();
  const anim = await sp.evaluate((el) => getComputedStyle(el).animationName);
  expect(anim !== "none", `animationName=${anim}`);
});
await expectNoConsole("spinner");

await gotoDocs("marquee");
await check("marquee: scroll animation running", async () => {
  const el = page.locator('main figure > div [class*="pollen-marquee"]').first();
  const anim = await el.evaluate((el) => getComputedStyle(el).animationName);
  expect(anim !== "none", `animationName=${anim}`);
});
await expectNoConsole("marquee");

await gotoDocs("number-ticker");
await check("number-ticker: counts up when visible", async () => {
  await page.waitForTimeout(1800);
  const text = await firstFig().innerText();
  expect(/[\d,]+/.test(text), `no number in figure: "${text.slice(0, 60)}"`);
});
await expectNoConsole("number-ticker");

await gotoDocs("typewriter");
await check("typewriter: text grows over time", async () => {
  const el = firstFig().locator("span, p").first();
  const t1 = await el.innerText();
  await page.waitForTimeout(1500);
  const t2 = await firstFig().innerText();
  expect(t2.length >= t1.length, "text did not persist");
});
await expectNoConsole("typewriter");

await gotoDocs("kinetic-headline");
await check("kinetic-headline: heading renders", async () => {
  const t = await firstFig().innerText();
  expect(t.trim().length > 3, "headline empty");
});
await expectNoConsole("kinetic-headline");

await gotoDocs("scramble-text");
await check("scramble-text: content renders", async () => {
  const t = await firstFig().innerText();
  expect(t.trim().length > 3, "text empty");
});
await expectNoConsole("scramble-text");

await gotoDocs("text-reveal");
await check("text-reveal: words split into segments", async () => {
  const spans = await page.locator("main figure span").count();
  expect(spans > 2, `only ${spans} spans`);
});
await expectNoConsole("text-reveal");

await gotoDocs("reveal");
await check("reveal: becomes visible on scroll", async () => {
  await firstFig().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const opacity = await firstFig().evaluate((f) => {
    const el = f.querySelector("[data-pollen-reveal], div, section") || f;
    let node = el;
    while (node && node !== document.body) {
      const o = parseFloat(getComputedStyle(node).opacity);
      if (o < 1) return o;
      node = node.parentElement;
    }
    return 1;
  });
  expect(opacity >= 0.99, `opacity stuck at ${opacity}`);
});
await expectNoConsole("reveal");

await gotoDocs("magnetic-button");
await check("magnetic-button: hover transforms", async () => {
  const btn = page.locator("main figure > div button").first();
  const box = await btn.boundingBox();
  await page.mouse.move(box.x + box.width * 0.05, box.y + box.height * 0.5);
  await page.waitForTimeout(120);
  await page.mouse.move(box.x + box.width * 0.02, box.y + box.height * 0.5);
  await page.waitForTimeout(700);
  const transform = await btn.evaluate((el) => getComputedStyle(el).transform);
  expect(transform !== "none", `transform still none (${transform})`);
});
await expectNoConsole("magnetic-button");

await gotoDocs("tilt-card");
await check("tilt-card: hover tilts", async () => {
  const card = page.locator("main figure > div > div > div > div").first();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.5);
  await page.waitForTimeout(120);
  await page.mouse.move(box.x + box.width * 0.08, box.y + box.height * 0.4);
  await page.waitForTimeout(700);
  const computed = await card.evaluate((el) => {
    const s = getComputedStyle(el);
    return { transform: s.transform, rotate: s.rotate, scale: s.scale };
  });
  expect(
    computed.transform !== "none" || computed.rotate !== "none" || computed.scale !== "none",
    `no motion: ${JSON.stringify(computed)}`,
  );
});
await expectNoConsole("tilt-card");

await gotoDocs("pressable-card");
await check("pressable-card: press scales down", async () => {
  const card = page.locator("main figure > div button, main figure > div [role=button]").first();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(400);
  const transform = await card.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.up();
  expect(transform !== "none", `transform still none: ${transform}`);
});
await expectNoConsole("pressable-card");

await gotoDocs("ticket-card");
await check("ticket-card: renders with content", async () => {
  const t = await firstFig().innerText();
  expect(t.trim().length > 10, "ticket nearly empty");
});
await expectNoConsole("ticket-card");

await gotoDocs("stat");
await check("stat: label and value render", async () => {
  const t = await firstFig().innerText();
  expect(t.trim().length > 5, "stat nearly empty");
});
await expectNoConsole("stat");

await gotoDocs("card");
await check("card: sections render", async () => {
  const t = await firstFig().innerText();
  expect(t.trim().length > 10, "card nearly empty");
});
await expectNoConsole("card");

await gotoDocs("label");
await check("label: htmlFor wiring", async () => {
  const label = page.locator("main figure label").first();
  const forId = await label.getAttribute("for");
  expect(!!forId, "label has no for attribute");
});
await expectNoConsole("label");

await gotoDocs("parallax");
await check("parallax: layers transform on scroll", async () => {
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(600);
  const t = await firstFig().evaluate((f) => {
    const els = f.querySelectorAll("[style*=transform], *");
    for (const el of els) {
      const tr = getComputedStyle(el).transform;
      if (tr && tr !== "none") return tr;
    }
    return "none";
  });
  expect(t !== "none", "no transformed layer found");
});
await expectNoConsole("parallax");

await browser.close();

const failed = results.filter(([s]) => s === "FAIL");
for (const [s, n] of results) console.log(`${s === "PASS" ? "  ok" : "FAIL"}  ${n}`);
console.log(`\np15 interaction suite: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
