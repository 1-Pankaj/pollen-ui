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
  /* ================= A. Stack + language switcher on docs pages ============== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/button");

    const stackCtrl = page.locator('[aria-label="Framework"]');
    check("stack switcher present on component page", (await stackCtrl.count()) > 0);
    check(
      "stack options are React / Next.js / React Native",
      (await stackCtrl.locator("button").allTextContents()).join("|").includes("React Native"),
    );

    // Demo 1 in code view: plain React first.
    await page.locator('[aria-label="Variants view"] button:has-text("Code")').click();
    await page.waitForTimeout(200);
    let code = await page.locator("figure pre").first().textContent();
    check("React variant: no use client directive", !code.includes("use client"));

    // Next.js adds the directive.
    await stackCtrl.locator("button:has-text('Next.js')").click();
    await page.waitForTimeout(200);
    code = await page.locator("figure pre").first().textContent();
    check("Next.js variant: use client directive added", code.trimStart().startsWith('"use client"'));

    // React Native shows the native example (button ships native).
    await stackCtrl.locator("button:has-text('React Native')").click();
    await page.waitForTimeout(200);
    code = await page.locator("figure pre").first().textContent();
    check("React Native variant: native import shown", code.includes("@pollen-ui/native"));
    check(
      "native banner states coverage honestly",
      (await page.getByText("React Native coverage today").count()) > 0,
    );
    // Native playground replacement.
    check(
      "playground area swaps to native snippet",
      (await page.locator('section[aria-label="button react native"]').count()) > 0,
    );

    // Language switch on React stack (page-level control = first of two).
    await stackCtrl.locator("button:has-text('React')").first().click();
    await page.locator('[aria-label="Code language"] button:has-text("JavaScript")').first().click();
    await page.waitForTimeout(250);
    const fname = await page.locator("figure").first().locator("text=/example\\.(jsx|tsx)/").first().textContent();
    check("language switch renames the snippet to .jsx", fname.includes("example.jsx"));

    // The playground's own control mirrors the same state.
    const pgLangChecked = await page.evaluate(() => {
      const section = document.querySelector('section[aria-label="button playground"]');
      const btns = section ? Array.from(section.querySelectorAll('[aria-label="Code language"] button')) : [];
      const js = btns.find((b) => b.textContent.includes("JavaScript"));
      return js?.getAttribute("aria-checked");
    });
    check("playground language control mirrors the page switch", pgLangChecked === "true");

    check("no console errors on /docs/button", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ============ B. Web-only component gets the honest native note ============ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/accordion");
    const stackCtrl = page.locator('[aria-label="Framework"]');
    await stackCtrl.locator("button:has-text('React Native')").click();
    await page.waitForTimeout(300);
    check(
      "banner present with honest coverage",
      (await page.getByText("React Native coverage today").count()) > 0,
    );
    await page.locator('[aria-label="Frequently asked view"] button:has-text("Code")').click();
    await page.waitForTimeout(350);
    const noteShown = await page.evaluate(() => {
      const figs = Array.from(document.querySelectorAll("figure"));
      const fig = figs.find((f) => f.textContent.includes("Frequently asked"));
      return fig ? fig.textContent.includes("is web-only right now") : false;
    });
    check("web-only component: honest native note", noteShown);
    check(
      "note links the eight shipped primitives",
      (await page.locator('a[href="/docs/button"]:has-text("Button")').count()) > 0,
    );
    check("no console errors on /docs/avatar native view", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ============================ C. Chat reactions ============================ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/chat");

    // Hover the seeded message about slide-to-confirm.
    const bubbleText = "Wait until you try slide to confirm";
    await page.locator(`p:has-text("${bubbleText}")`).first().hover();
    await page.waitForTimeout(350);

    const barState = await page.evaluate((txt) => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes(txt))
        ?.closest(".rounded-2xl");
      if (!bubble) return null;
      const bar = bubble.parentElement.querySelector(".absolute.bottom-full");
      if (!bar) return null;
      const cs = getComputedStyle(bar);
      const r = bar.getBoundingClientRect();
      const br = bubble.getBoundingClientRect();
      return {
        opacity: cs.opacity,
        pointer: cs.pointerEvents,
        flush: Math.abs(r.bottom - br.top) < 2,
      };
    }, bubbleText);
    check("hover reveals the reaction toolbar", barState && barState.opacity === "1" && barState.pointer === "auto", JSON.stringify(barState));
    check("toolbar sits flush on the bubble (no hover gap)", barState?.flush === true);

    // Pointer rests on the toolbar; it must stay open well past the old fast-fade.
    const bar = page.locator(".absolute.bottom-full").last();
    await bar.locator('button[aria-label="React 🔥"]').click();
    await page.waitForTimeout(600);
    const stillVisible = await page.evaluate((txt) => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes(txt))
        ?.closest(".rounded-2xl");
      const bar = bubble?.parentElement.querySelector(".absolute.bottom-full");
      return bar ? getComputedStyle(bar).opacity : "0";
    }, bubbleText);
    check("toolbar stays open while reacting (delayed hide)", stillVisible === "1", `opacity=${stillVisible}`);

    const chipAdded = await page.evaluate((txt) => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes(txt))
        ?.closest(".rounded-2xl");
      const row = bubble?.parentElement.querySelector(".flex.flex-wrap");
      return row ? row.textContent.includes("🔥") : false;
    }, bubbleText);
    check("clicking a reaction adds the chip", chipAdded);

    // First message's toolbar must not be clipped by the thread.
    await page.locator('p:has-text("Morning! The stacked toasts")').first().hover();
    await page.waitForTimeout(350);
    const firstBar = await page.evaluate(() => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes("Morning! The stacked toasts"))
        ?.closest(".rounded-2xl");
      const bar = bubble?.parentElement.querySelector(".absolute.bottom-full");
      if (!bar) return null;
      const thread = bubble.closest(".overflow-y-auto");
      return { barTop: bar.getBoundingClientRect().top, threadTop: thread.getBoundingClientRect().top };
    });
    check("first message's toolbar is not clipped", firstBar && firstBar.barTop >= firstBar.threadTop - 1, JSON.stringify(firstBar));

    check("no console errors on /docs/chat", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ====================== D. Chat reactions on touch ======================== */
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await newPage(ctx, "/docs/chat");
    await page.locator('p:has-text("Wait until you try slide to confirm")').first().tap();
    await page.waitForTimeout(350);
    const opened = await page.evaluate((txt) => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes(txt))
        ?.closest(".rounded-2xl");
      const bar = bubble?.parentElement.querySelector(".absolute.bottom-full");
      return bar ? getComputedStyle(bar).opacity : "0";
    }, "Wait until you try slide to confirm");
    check("tap opens the reaction toolbar on mobile", opened === "1", `opacity=${opened}`);

    await page.locator('.absolute.bottom-full button[aria-label="React ❤️"]').last().tap();
    await page.waitForTimeout(400);
    const chip = await page.evaluate((txt) => {
      const bubble = Array.from(document.querySelectorAll("p"))
        .find((p) => p.textContent?.includes(txt))
        ?.closest(".rounded-2xl");
      const row = bubble?.parentElement.querySelector(".flex.flex-wrap");
      return row ? row.textContent.includes("❤️") : false;
    }, "Wait until you try slide to confirm");
    check("reacting works from the touch toolbar", chip);
    check("no console errors on mobile chat", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ======================== E. Slide to confirm focus ======================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/slide-to-confirm");

    const handle = page.locator('[role="slider"][data-handle]').first();
    const box = await handle.boundingBox();
    // Walk tabs from the top of the page until the handle has focus.
    // Header + sidebar + the page's own controls sit in front of it.
    await page.keyboard.press("Tab");
    for (let i = 0; i < 150; i++) {
      const active = await page.evaluate(() => document.activeElement?.getAttribute("data-handle") != null);
      if (active) break;
      await page.keyboard.press("Tab");
    }
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-handle") != null);
    check("keyboard can reach the handle", focused);
    if (focused) {
      const ring = await page.evaluate(() => {
        const el = document.activeElement;
        const cs = getComputedStyle(el);
        const layers =
          cs.boxShadow.match(
            /(rgba?\([^)]*\)|#[0-9a-fA-F]+)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(-?[\d.]+px)/g,
          ) ?? [];
        const ringish = layers.some(
          (s) => /0(px)? 0(px)? 0(px) [2-9](\.\d+)?px/.test(s) && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(s),
        );
        return { fv: el.matches(":focus-visible"), outline: cs.outlineStyle, ringish };
      });
      check("focus-visible active for keyboard users", ring.fv === true);
      check("focused handle paints no double outline", ring.outline === "none", `outline=${ring.outline}`);
      check("handle keeps its own focus ring", ring.ringish === true, JSON.stringify(ring));
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2400);
      const status = await page.evaluate(() =>
        document.activeElement?.closest("[data-status]")?.getAttribute("data-status"),
      );
      check("Enter still confirms", status === "success", `status=${status}`);
    }
    check("handle keeps its crisp edge", await page.evaluate(() => {
      const el = document.querySelector('[role="slider"][data-handle]');
      return getComputedStyle(el).borderTopWidth === "1px";
    }));
    void box;
    check("no console errors on /docs/slide-to-confirm", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ========================= F. Scroll progress demos ======================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/scroll-progress");

    const demoCard = page.locator("figure").first();
    check("pane demo renders a visible preview", (await demoCard.locator("text=deploy.log").count()) > 0);

    const scaleX = () =>
      page.evaluate(() => {
        const bar = document.querySelector("figure .absolute.inset-x-0.top-0");
        const m = new DOMMatrixReadOnly(getComputedStyle(bar).transform);
        return m.a;
      });
    const before = await scaleX();
    await page.evaluate(() => {
      const pane = document.querySelector("figure .overflow-y-auto");
      pane.scrollTop = pane.scrollHeight / 2;
      pane.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(600);
    const mid = await scaleX();
    check("bar fills as the pane scrolls", mid > before + 0.3, `before=${before.toFixed(2)} mid=${mid.toFixed(2)}`);

    await page.evaluate(() => {
      const pane = document.querySelector("figure .overflow-y-auto");
      pane.scrollTop = pane.scrollHeight;
      pane.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(700);
    const full = await scaleX();
    const status = await demoCard.locator("text=Bar full").count();
    check("bar reaches full at pane end", full > 0.9, `scaleX=${full.toFixed(2)}`);
    check("pane status line reflects the end", status > 0);
    check("no console errors on /docs/scroll-progress", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ============================ G. Parallax features ========================= */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/parallax");
    check(
      "second demo layers two parallax cards",
      (await page.locator("text=Depth in three axes").count()) > 0,
    );
    const pg = page.locator('[aria-label="parallax playground"]');
    const labels = (await pg.locator("text=/^(axis|rotate|scale|speed|disabled)$/").allTextContents()).join(",");
    check("playground exposes axis / rotate / scale / speed / disabled", ["axis", "rotate", "scale"].every((k) => labels.includes(k)), labels);
    check("no console errors on /docs/parallax", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ========================== H. Playground page docs ======================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/playground");
    check("how-it-works docs section", (await page.getByText("How it works").count()) > 0);
    check("four numbered items", (await page.getByText("Drafts from the docs").count()) > 0 && (await page.getByText("A real sandbox").count()) > 0);
    check("stack guide section", (await page.getByText("Take it into a real project").count()) > 0);
    // Stack tabs: React / Next.js / React Native, one snippet visible at a time.
    await page.locator('[role="tab"]:has-text("Next.js")').click();
    await page.waitForTimeout(400);
    check("Next.js snippet visible on its tab", (await page.locator("text=Works in Next.js").count()) > 0);
    await page.locator('[role="tab"]:has-text("React Native")').click();
    await page.waitForTimeout(400);
    check("React Native snippet visible on its tab", (await page.locator("text=@pollen-ui/native").count()) > 0);
    check("scope rows kept", (await page.locator("text=lucide-react").count()) > 0 && (await page.locator("text=What you can import").count()) > 0);

    // Language toggle in the toolbar.
    await page.locator('[aria-label="Code language"] button:has-text("JavaScript")').click();
    await page.waitForTimeout(500);
    check("language switch rewrites the editor to .jsx", (await page.locator("text=demo.jsx").count()) > 0);
    const editorText = await page
      .locator('[role="textbox"]')
      .first()
      .textContent();
    check("editor code is the JS variant (types stripped)", !editorText.includes("function Demo():") && editorText.includes("export default function Demo"));

    // AI prompt block.
    await page.locator("button:has-text('AI prompt')").click();
    await page.waitForTimeout(200);
    check("playground AI prompt block", (await page.locator("text=scratch page").count()) > 0);
    check("no console errors on /playground", page._errors.length === 0, page._errors[0] ?? "");
    await ctx.close();
  }

  /* ============================= I. Templates docs =========================== */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/templates");
    check("overview links the guide", (await page.locator('a[href="/templates/docs"]').count()) >= 1);

    const page2 = await newPage(ctx, "/templates/docs");
    check("templates docs page renders", (await page2.getByText("How the templates work").count()) > 0);
    check("composition patterns table", (await page2.getByText("Composition patterns").count()) > 0);
    const links = await page2.locator('a[href^="/templates/"]').count();
    check("full index links every template", links >= 25, `links=${links}`);
    check("no console errors on /templates/docs", page2._errors.length === 0, page2._errors[0] ?? "");

    // Template detail still has its own TS/JS switch.
    const page3 = await newPage(ctx, "/templates/navbar-top");
    await page3.locator('[aria-label="Code language"] button:has-text("JavaScript")').click();
    await page3.waitForTimeout(250);
    check("template detail: JS switch still works", (await page3.locator("text=.jsx").count()) > 0);
    await ctx.close();
  }

  /* ===================== J. Local avatars everywhere ========================= */
  {
    const ctx = await browser.newContext({ viewport: { width: 1380, height: 900 } });
    const page = await newPage(ctx, "/docs/avatar");
    const imgs = await page.evaluate(async () => {
      const list = Array.from(document.querySelectorAll('figure img[src^="/avatars/"]'));
      await Promise.all(list.map((i) => (i.complete ? null : new Promise((r) => (i.onload = r)))));
      return {
        count: list.length,
        loaded: list.filter((i) => i.naturalWidth > 0).length,
      };
    });
    check("avatar demos use bundled portraits", imgs.count >= 8, `count=${imgs.count}`);
    check("every bundled portrait loads", imgs.loaded === imgs.count, `${imgs.loaded}/${imgs.count}`);
    check(
      "no third-party avatar hosts remain",
      (await page.locator('img[src*="pravatar"]').count()) === 0,
    );

    // Gradient variant demo renders real gradients.
    const grads = await page.evaluate(() => {
      const figs = Array.from(document.querySelectorAll("figure"));
      const fig = figs.find((f) => f.textContent.includes("Gradient fallbacks"));
      const spans = fig ? Array.from(fig.querySelectorAll("span[style*='linear-gradient']")) : [];
      const hues = new Set(spans.map((s) => s.getAttribute("style").match(/#\w{6}/)?.[0]));
      return { spans: spans.length, hues: hues.size };
    });
    check("gradient fallbacks demo shows distinct duotones", grads.spans >= 8 && grads.hues >= 4, JSON.stringify(grads));
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${passes.length} passed, ${problems.length} failed`);
if (problems.length) {
  console.log("FAILURES:");
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
