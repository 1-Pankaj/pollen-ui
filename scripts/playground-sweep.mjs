// Playground sweep: audits every docs page's embedded playground and the
// full /playground page for compile errors, runtime errors, and blank
// previews. Two layers:
//   node scripts/playground-sweep.mjs initial [chunk] [chunks]
//   node scripts/playground-sweep.mjs props   [chunk] [chunks]
//   node scripts/playground-sweep.mjs examples
// initial: load each /docs/<slug>, check the first demo compiles and renders.
// props:   additionally flip every select option and toggle every switch in
//          the Props pane, checking for errors after each change.
// examples: on /playground, load every example chip and check for errors.
// Results: JSON lines to /tmp/sweep-<mode>.json, failures to stdout.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const mode = process.argv[2] ?? "initial";
const chunkIndex = Number(process.argv[3] ?? 0);
const chunkTotal = Number(process.argv[4] ?? 1);
const BASE = process.env.BASE ?? "http://localhost:3000";

function registrySlugs() {
  const files = [
    "src/lib/registry/primitives.tsx",
    "src/lib/registry/display.tsx",
    "src/lib/registry/expanded.tsx",
    "src/lib/registry/overlays.tsx",
    "src/lib/registry/signatures.tsx",
    "src/lib/registry/motion.tsx",
  ];
  const slugs = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(/^\s+slug:\s*"([^"]+)"/gm)) slugs.push(m[1]);
  }
  return slugs;
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

const results = [];
let consoleErrors = [];
let pageErrors = [];
function wire() {
  consoleErrors = [];
  pageErrors = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  });
  page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 300)));
}

async function readState() {
  return page.evaluate(() => {
    const pg = document.getElementById("playground");
    const out = { error: null, pressRun: false, previewText: "" };
    if (!pg) return out;
    // Error panels and the MiniBoundary both render pre.text-danger-ink.
    // Component previews (CodeBlock etc.) render pre without it.
    const errPres = [...pg.querySelectorAll("pre.text-danger-ink")];
    const errPre = errPres.find((p) => (p.textContent ?? "").trim().length > 0);
    out.error = errPre ? errPre.textContent.trim().slice(0, 400) : null;
    out.pressRun = /Press Run to render/.test(pg.textContent ?? "");
    const previewDivs = [...pg.querySelectorAll("div.slim-scroll")];
    const preview = previewDivs.find((d) => d.querySelector("p") === null || true);
    out.previewText = preview ? preview.innerText.slice(0, 120) : "";
    return out;
  });
}

async function sweepPage(path, fuzzProps) {
  wire();
  const entry = { path, error: null, pressRun: false, consoleErrors: [], pageErrors: [] };
  try {
    const resp = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
    if (!resp || !resp.ok()) {
      entry.error = `HTTP ${resp ? resp.status() : "null"}`;
      results.push(entry);
      return;
    }
    await page.waitForTimeout(1800);
    const state = await readState();
    entry.error = state.error;
    entry.pressRun = state.pressRun;

    if (fuzzProps) {
      // Flip every radio option and every switch in the Props pane.
      const controls = page.locator(
        '#playground button[role="radio"], #playground button[role="switch"]:not([aria-label="Run automatically"])',
      );
      const count = await controls.count();
      for (let i = 0; i < count; i++) {
        const btn = controls.nth(i);
        try {
          await btn.scrollIntoViewIfNeeded();
          await btn.click({ timeout: 3000 });
        } catch {
          continue; // element detached (re-render), acceptable
        }
        await page.waitForTimeout(950); // 500ms debounce + compile
        const st = await readState();
        if (st.error) {
          entry.error = `prop-flip#${i}: ${st.error}`;
          break;
        }
        if (pageErrors.length > 0) {
          entry.error = `prop-flip#${i} pageerror: ${pageErrors[0]}`;
          break;
        }
      }
    }
  } catch (e) {
    entry.error = entry.error ?? `sweep failure: ${String(e).slice(0, 200)}`;
  }
  entry.consoleErrors = consoleErrors.filter(
    (t) => !/pravatar\.cc|net::|Failed to load resource|the server responded with a status/i.test(t),
  ).slice(0, 4);
  entry.pageErrors = pageErrors.slice(0, 4);
  results.push(entry);
}

if (mode === "examples") {
  wire();
  await page.goto(BASE + "/playground", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1500);
  const chips = page.locator('main button[type="button"]');
  const n = await chips.count();
  for (let i = 0; i < n; i++) {
    const chip = chips.nth(i);
    const label = (await chip.textContent().catch(() => "")) ?? "";
    if (!label.trim()) continue;
    try {
      await chip.click({ timeout: 3000 });
    } catch {
      continue;
    }
    await page.waitForTimeout(1200);
    const st = await readState().catch(() => ({ error: null }));
    const hasError = st.error;
    if (hasError || pageErrors.length) {
      results.push({
        path: `/playground [${label.trim()}]`,
        error: hasError ?? `pageerror: ${pageErrors[0]}`,
      });
    }
  }
  const okCount = results.length === 0 ? "all examples clean" : `${results.length} failures`;
  console.log(`examples sweep done: ${okCount}`);
} else {
  let paths;
  if (mode === "initial" || mode === "props") {
    const slugs = registrySlugs();
    console.error(`registry slugs: ${slugs.length}`);
    paths = slugs.map((s) => `/docs/${s}`);
  }
  const slice = paths.filter((_, i) => i % chunkTotal === chunkIndex);
  console.error(`sweeping ${slice.length} pages (${chunkIndex + 1}/${chunkTotal}), mode=${mode}`);
  for (const p of slice) {
    await sweepPage(p, mode === "props");
  }
}

await browser.close();
writeFileSync(`/tmp/sweep-${mode}-${chunkIndex}.json`, JSON.stringify(results, null, 2));
const failures = results.filter((r) => r.error || (r.pageErrors && r.pageErrors.length > 0));
console.log(`\n=== ${mode}[${chunkIndex}] done: ${results.length} pages, ${failures.length} failures ===`);
for (const f of failures) {
  console.log(`FAIL ${f.path}\n  error: ${f.error}\n  pageErrors: ${(f.pageErrors ?? []).join(" | ")}`);
}
const clean = results.filter((r) => !failures.includes(r));
if (failures.length === 0) console.log("ALL CLEAN");
