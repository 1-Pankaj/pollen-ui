import { chromium } from "playwright";

// Probe: dump the interactive skeleton of each failing demo's first figure.
const SLUGS = process.argv[2]
  ? process.argv[2].split(",")
  : ["command", "combobox", "drawer", "tooltip", "otp-input", "pagination", "rating", "tag-input", "skeleton", "spinner", "marquee", "magnetic-button", "tilt-card", "pressable-card"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const slug of SLUGS) {
  await page.goto(`http://localhost:3000/docs/${slug}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(600);
  const outline = await page.evaluate(() => {
    const fig = document.querySelector("main figure");
    if (!fig) return "NO FIGURE";
    const lines = [];
    const walk = (el, depth) => {
      if (depth > 5 || lines.length > 40) return;
      const tag = el.tagName.toLowerCase();
      const attrs = [];
      for (const a of el.attributes || []) {
        if (["class", "style"].includes(a.name)) {
          if (a.name === "class" && /animate|transform|marquee/.test(a.value)) attrs.push(`class~=${a.value.slice(0, 80)}`);
          continue;
        }
        attrs.push(`${a.name}=${a.value.slice(0, 40)}`);
      }
      const text = el.children.length === 0 ? el.textContent?.trim().slice(0, 30) : "";
      lines.push(`${"  ".repeat(depth)}<${tag}${attrs.length ? " " + attrs.join(" ") : ""}>${text || ""}`);
      for (const c of el.children) walk(c, depth + 1);
    };
    walk(fig, 0);
    return lines.join("\n");
  });
  console.log(`\n########## ${slug} ##########\n${outline}`);
}
await browser.close();
