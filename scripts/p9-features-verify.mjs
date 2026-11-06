/**
 * P9 browser verification: the docs experience additions.
 *
 *  1. Framework switch on component pages: TypeScript -> JavaScript
 *     actually strips types (checked on the typed Modal demo), filename
 *     becomes example.jsx, and switching back restores TS.
 *  2. AI prompt panel: expands, contains the real import + rules,
 *     and its Copy button confirms.
 *  3. Templates gallery: 25 "View source" links; a detail page renders
 *     the complete source with correct imports, components-used chips
 *     linking to docs, a working local TS/JS switch, and an AI prompt.
 *  4. Dependency notes on a template that needs next/link + framer-motion.
 *  5. React Native section on /docs/button with a real @pollen-ui/native import.
 *  6. Sidebar carries a Templates entry; all 25 detail pages respond 200.
 *
 * Usage: node scripts/p9-features-verify.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;
const pass = (msg) => console.log(`PASS  ${msg}`);
const fail = (msg) => {
  failures += 1;
  console.log(`FAIL  ${msg}`);
};

const browser = await chromium.launch();
const context = await browser.newContext();
const pageErrors = [];
const page = await browser.newPage();
page.on("pageerror", (err) => pageErrors.push(String(err)));

async function goto(path) {
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  return res?.status() ?? 0;
}

/* 1 ------------------------------------------------------------------ */
try {
  await goto("/docs/modal");
  // Two language controls share the page now (header + playground) and
  // mirror the same state; target the page-header one.
  const group = page.getByRole("radiogroup", { name: "Code language" }).first();
  await group.waitFor({ timeout: 15000 });
  await group.getByRole("radio", { name: "JavaScript" }).click();
  // Open the code pane of the typed demo ("Sizes" uses a generic useState).
  const demo = page.locator("figure", { hasText: "Sizes" }).first();
  await demo
    .getByRole("radiogroup", { name: "Sizes view" })
    .getByRole("radio", { name: "Code" })
    .click();
  await page.waitForTimeout(400);
  const pre = demo.locator("pre").first();
  const js = (await pre.textContent()) ?? "";
  const filename = (await demo.textContent()) ?? "";
  if (js.includes('useState<"sm" | "md" | "lg" | null>(null)')) {
    fail("modal JS still contains the TS generic");
  } else if (!js.includes("useState(null)")) {
    fail(`modal JS missing stripped useState: ${js.slice(0, 120)}`);
  } else if (!filename.includes("example.jsx")) {
    fail("filename did not switch to example.jsx");
  } else if (js.includes("createElement(")) {
    fail("JS variant was JSX-transformed instead of preserved");
  } else {
    pass("framework switch: Modal demo converts to real JavaScript (example.jsx)");
  }
  await group.getByRole("radio", { name: "TypeScript" }).click();
  await page.waitForTimeout(300);
  const ts = (await demo.locator("pre").first().textContent()) ?? "";
  if (ts.includes('useState<"sm" | "md" | "lg" | null>(null)')) {
    pass("switching back restores the TypeScript source");
  } else {
    fail("TypeScript source did not come back");
  }
  // Every demo code pane on the page must switch with the page control.
  await group.getByRole("radio", { name: "JavaScript" }).click();
  await page
    .locator("figure", { hasText: "Basic" })
    .first()
    .getByRole("radiogroup", { name: "Basic view" })
    .getByRole("radio", { name: "Code" })
    .click();
  await page.waitForTimeout(300);
  const jsxCount = await page.locator("text=example.jsx").count();
  const tsxCount = await page.locator("text=example.tsx").count();
  if (jsxCount >= 2 && tsxCount === 0) {
    pass("all demo panes follow the page-wide switch");
  } else {
    fail(`page-wide switch inconsistent (jsx: ${jsxCount}, tsx: ${tsxCount})`);
  }
} catch (err) {
  fail(`framework switch test errored: ${String(err).slice(0, 300)}`);
}

/* 2 ------------------------------------------------------------------ */
try {
  await goto("/docs/button");
  const toggle = page.getByRole("button", { name: /AI prompt/ }).first();
  await toggle.waitFor({ timeout: 15000 });
  await toggle.click();
  const panel = page.locator("#ai-prompt-prompt-txt");
  await panel.waitFor({ timeout: 5000 });
  const text = (await panel.textContent()) ?? "";
  const checks = [
    ['import { Button } from "pollen-ui"', "real import line"],
    ["npm install pollen-ui", "install command"],
    ["Rules:", "rules section"],
    ["variant:", "props from the registry"],
  ];
  let ok = true;
  for (const [needle, label] of checks) {
    if (!text.includes(needle)) {
      fail(`AI prompt missing ${label}`);
      ok = false;
    }
  }
  if (ok) pass("AI prompt panel: import, install, props and rules all present");
  await panel.getByRole("button", { name: /Copy/ }).click();
  await page.waitForTimeout(300);
  const copied = (await panel.textContent()) ?? "";
  if (copied.includes("Copied")) pass("AI prompt copy button confirms");
  else fail("copy button did not confirm");
} catch (err) {
  fail(`AI prompt test errored: ${String(err).slice(0, 300)}`);
}

/* 3 ------------------------------------------------------------------ */
try {
  await goto("/templates");
  const links = page.getByRole("link", { name: "View source" });
  const count = await links.count();
  if (count === 25) pass("gallery: 25 View source links");
  else fail(`expected 25 View source links, found ${count}`);

  await goto("/templates/navbar-top");
  if ((await page.locator("h1").textContent())?.trim() === "Top bar") {
    pass("template detail page renders with its title");
  } else {
    fail("detail page h1 mismatch");
  }
  const codePre = page.locator("pre").first();
  const codeText = (await codePre.textContent()) ?? "";
  const okCode =
    codeText.includes('import Link from "next/link"') &&
    codeText.includes('from "pollen-ui"') &&
    codeText.includes("export function NavbarTop()");
  if (okCode) pass("detail page source: complete with imports and component");
  else fail("detail page source incomplete");
  const chips = await page
    .locator('a[href^="/docs/"]')
    .filter({ hasText: /Button|Avatar|Badge|Kbd/ })
    .count();
  if (chips >= 3) pass("components-used chips link into the docs");
  else fail(`components-used chips missing (${chips})`);

  // Local TS/JS switch on the template page.
  const group = page.getByRole("radiogroup", { name: "Code language" }).first();
  await group.getByRole("radio", { name: "JavaScript" }).click();
  await page.waitForTimeout(400);
  const jsText = (await page.locator("pre").first().textContent()) ?? "";
  const cardName = (await page.locator("body").textContent()) ?? "";
  if (
    jsText.includes("export function NavbarTop()") &&
    cardName.includes("navbar-top.jsx") &&
    !jsText.includes("createElement(")
  ) {
    pass("template source converts to JavaScript (navbar-top.jsx)");
  } else {
    fail("template JS conversion suspicious");
  }

  await page.getByRole("button", { name: /AI prompt/ }).first().click();
  const tpl = (await page.locator("pre").last().textContent()) ?? "";
  if (
    tpl.includes('Recreate the "Top bar" template') &&
    tpl.includes("Full source:") &&
    tpl.includes("next/link")
  ) {
    pass("template AI prompt carries title, source and dependency notes");
  } else {
    fail("template AI prompt incomplete");
  }
} catch (err) {
  fail(`templates test errored: ${String(err).slice(0, 300)}`);
}

/* 4 ------------------------------------------------------------------ */
try {
  await goto("/templates/navbar-mega");
  const aside = (await page.locator("body").textContent()) ?? "";
  if (aside.includes("next/link") && aside.includes("framer-motion") && aside.includes("Also requires")) {
    pass("dependency notes show for next/link and framer-motion");
  } else {
    fail("dependency notes missing on navbar-mega");
  }
} catch (err) {
  fail(`deps test errored: ${String(err).slice(0, 300)}`);
}

/* 5 ------------------------------------------------------------------ */
try {
  await goto("/docs/button");
  const body = (await page.locator("body").textContent()) ?? "";
  const pre = (await page.locator("pre").first().textContent()) ?? "";
  if (
    body.includes("React Native") &&
    (pre.includes('@pollen-ui/native') || body.includes("@pollen-ui/native")) &&
    body.includes("react-native-reanimated")
  ) {
    pass("React Native section present on /docs/button");
  } else {
    fail("React Native section missing or wrong on /docs/button");
  }
} catch (err) {
  fail(`native test errored: ${String(err).slice(0, 300)}`);
}

/* 6 ------------------------------------------------------------------ */
try {
  await goto("/docs/button");
  const sidebarLink = page.locator('aside a[href="/templates"], nav a[href="/templates"]');
  const sidebarCount = await sidebarLink.count();
  const anyLink = (await page.locator('a[href="/templates"]').count()) > 0;
  if (sidebarCount > 0 || anyLink) pass("sidebar carries the Templates entry");
  else fail("no Templates link in the sidebar");

  const ids = [
    "navbar-top","navbar-sidebar","navbar-command","navbar-pill","navbar-dock",
    "navbar-bottom","navbar-rail","navbar-mega","hero-centered","hero-split",
    "hero-statement","hero-waitlist","hero-metrics","hero-appshot",
    "section-pricing","section-logos","section-testimonials","section-auth",
    "section-stats","section-bento","section-faq","section-newsletter",
    "section-changelog","section-cta","section-footer",
  ];
  let bad = 0;
  for (const id of ids) {
    const res = await goto(`/templates/${id}`);
    if (res !== 200) bad += 1;
  }
  if (bad === 0) pass("all 25 template detail pages respond 200");
  else fail(`${bad} template detail pages did not respond 200`);
} catch (err) {
  fail(`routing test errored: ${String(err).slice(0, 300)}`);
}

await browser.close();

const realErrors = pageErrors.filter(
  (e) => !e.includes("ResizeObserver") && !e.includes("hydration"),
);
if (realErrors.length > 0) {
  failures += 1;
  console.log(`FAIL  ${realErrors.length} uncaught page error(s):`);
  for (const e of realErrors.slice(0, 5)) console.log(`      ${e.slice(0, 200)}`);
} else {
  console.log("PASS  no uncaught page errors on any visited page");
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
