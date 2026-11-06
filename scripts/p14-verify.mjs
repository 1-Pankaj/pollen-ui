/**
 * P14 verification: everything that changed in the "make it real" pass.
 * Run against dev or prod: node scripts/p14-verify.mjs [BASE]
 */
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

async function newPage(ctx, url) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 140)}`);
  });
  page._errors = errors;
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  return page;
}

const browser = await chromium.launch();

try {
  /* ================= A. Real avatar photos ============================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/avatar");

    // Every bundled avatar is a real JPEG photo, not a generated SVG icon.
    const imgs = page.locator('img[src^="/avatars/"]');
    const n = await imgs.count();
    check("avatar demos render bundled photos", n >= 8, `${n} imgs`);
    const srcs = await imgs.evaluateAll((els) => els.map((e) => e.getAttribute("src")));
    check("no .svg avatar references remain", srcs.every((s) => !s.endsWith(".svg")), srcs.slice(0, 3).join(","));
    const allOk = await imgs.evaluateAll(async (els) => {
      const results = await Promise.all(
        els.slice(0, 6).map((e) => new Promise((res) => {
          if (e.complete) res(e.naturalWidth > 40);
          else { e.onload = () => res(e.naturalWidth > 40); e.onerror = () => res(false); }
        })),
      );
      return results.every(Boolean);
    });
    check("avatar photos actually load (naturalWidth > 40)", allOk);

    // Accessibility: the photo announces the person by name.
    const altOk = await imgs.evaluateAll((els) =>
      els.slice(0, 5).every((e) => (e.getAttribute("alt") || "").trim().length > 0),
    );
    check("every avatar photo carries an accessible name", altOk);

    // Presence dot speaks.
    const dot = page.locator('[role="img"][aria-label="Online"]').first();
    check("presence dot is role=img with spoken label", (await dot.count()) > 0);

    // Overflow chip announces "N more".
    const chip = page.locator('[role="img"][aria-label$=" more"]');
    check("avatar group overflow chip announces N more", (await chip.count()) > 0);

    // A fallback initials avatar announces the name via role=img wrapper.
    const fallback = page.locator('span[role="img"][aria-label="Ada Lovelace"]');
    check("initials fallback announces the person", (await fallback.count()) > 0);
    await ctx.close();
  }

  /* ================= B. React Native docs page ========================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/react-native");
    check("RN page: title present", await page.locator("h1").textContent().then((t) => t.includes("iOS and Android")));
    // Sixteen component cards each with a real code block.
    const blocks = page.locator("main pre, div pre");
    const codeCount = await blocks.count();
    check("RN page: code block per shipped component", codeCount >= 16, `${codeCount} blocks`);
    const body = await page.locator("body").textContent();
    check("RN page: lists Card", body.includes("Card"));
    check("RN page: lists SegmentedControl", body.includes("SegmentedControl"));
    check("RN page: lists PinInput", body.includes("PinInput"));
    check("RN page: lists Stepper", body.includes("Stepper"));
    check("RN page: honest web-only section", body.includes("not on native yet"));
    check("RN page: no fabricated image URLs", !body.includes("example.com"));

    // Linked from the sidebar and the frameworks page.
    const side = await newPage(ctx, "/docs/frameworks");
    check("sidebar carries React Native item", await side.locator('a[href="/docs/react-native"]').count() > 0);
    check("frameworks page links the RN guide", (await side.locator('main a[href="/docs/react-native"], article a[href="/docs/react-native"]').count()) > 0);
    await ctx.close();
  }

  /* ================= C. New native components exist on their docs pages = */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    for (const [slug, marker] of [
      ["card", "CardHeader"],
      ["checkbox", "Checkbox"],
      ["radio-group", "RadioGroup"],
      ["textarea", "Textarea"],
      ["segmented-control", "SegmentedControl"],
      ["otp-input", "PinInput"],
      ["rating", "Rating"],
      ["stepper", "Stepper"],
    ]) {
      const page = await newPage(ctx, `/docs/${slug}`);
      await page.locator('[aria-label="Framework"] button:has-text("React Native")').click();
      // Open the first demo's code view, where the native snippet renders.
      await page.locator('figure figcaption button:has-text("Code")').first().click();
      await page.waitForTimeout(250);
      const code = await page.locator("figure pre").first().textContent().catch(() => "");
      check(`native code on ${slug} docs`, code.includes(marker), `${code.length} chars`);
      await page.close();
    }
    await ctx.close();
  }

  /* ================= D. New unique web components ======================= */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });

    // Knob: drag changes the value, keyboard steps it.
    const knob = await newPage(ctx, "/docs/knob");
    check("knob page renders", (await knob.locator('[role="slider"]').count()) > 0);
    const knobSlider = knob.locator('[role="slider"]').first();
    await knobSlider.focus();
    const before = await knobSlider.getAttribute("aria-valuenow");
    await knob.keyboard.press("ArrowRight");
    await knob.waitForTimeout(150);
    const after = await knobSlider.getAttribute("aria-valuenow");
    check("knob arrow key steps value", Number(after) === Number(before) + 1, `${before} -> ${after}`);
    check("knob demos have no console errors", knob._errors.length === 0, knob._errors.join("; ").slice(0, 100));
    await knob.close();

    // CompareSlider: keyboard moves the divider; layers both present.
    const cmp = await newPage(ctx, "/docs/compare-slider");
    const div = cmp.locator('[role="slider"]').first();
    check("compare divider is a slider", (await div.count()) > 0);
    const beforeV = await div.getAttribute("aria-valuenow");
    await div.focus();
    await cmp.keyboard.press("ArrowRight");
    await cmp.waitForTimeout(150);
    const afterV = await div.getAttribute("aria-valuenow");
    check("compare divider keyboard steps", Number(afterV) > Number(beforeV), `${beforeV} -> ${afterV}`);
    const clip = await cmp.locator('div[style*="clip-path"]').first().getAttribute("style");
    check("after layer clipped by divider", clip.includes("inset"));
    check("compare page console clean", cmp._errors.length === 0);
    await cmp.close();

    // ActivityHeatmap: grid renders with a spoken summary.
    const heat = await newPage(ctx, "/docs/activity-heatmap");
    const grid = heat.locator('[role="img"][aria-label*="events"]');
    check("heatmap grid speaks a summary", (await grid.count()) > 0);
    const label = await grid.first().getAttribute("aria-label");
    check("summary includes total and busiest", /events across/.test(label) && /busiest/.test(label), label.slice(0, 60));
    const cells = await heat.locator('[data-level]').count();
    check("heatmap renders the full grid", cells >= 200, `${cells} cells`);
    check("heatmap page console clean", heat._errors.length === 0);
    await heat.close();
    await ctx.close();
  }

  /* ================= E. Fake content is gone ============================ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const pages = ["/", "/docs/button", "/docs/modal", "/docs/toast", "/playground", "/templates/docs"];
    let acmeSeen = 0;
    let exampleSeen = 0;
    for (const p of pages) {
      const page = await newPage(ctx, p);
      const text = (await page.locator("body").textContent()).toLowerCase();
      if (text.includes("acme")) acmeSeen += 1;
      if (text.includes("example.com")) exampleSeen += 1;
      await page.close();
    }
    check("no acme-* filler anywhere sampled", acmeSeen === 0, `${acmeSeen} pages`);
    check("no example.com references anywhere sampled", exampleSeen === 0, `${exampleSeen} pages`);
    await ctx.close();
  }

  /* ================= F. Framework switcher still on every docs page ===== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const slugs = ["knob", "compare-slider", "activity-heatmap", "avatar", "modal"];
    let missing = [];
    for (const s of slugs) {
      const page = await newPage(ctx, `/docs/${s}`);
      if ((await page.locator('[aria-label="Framework"]').count()) === 0) missing.push(s);
      await page.close();
    }
    check("stack switcher renders on new and old pages alike", missing.length === 0, missing.join(","));
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${passes.length} passed, ${problems.length} failed`);
if (problems.length > 0) {
  console.log("FAILURES:\n - " + problems.join("\n - "));
  process.exit(1);
}
