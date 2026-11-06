// P3 visual smoke: home page light+dark capture.
// Usage: node scripts/smoke-home.mjs   (dev server must be on :3000)
// Writes /tmp/smoke-home-{light,dark}.png; diffing happens in Python
// against screenshots/home-{light,dark}.png afterwards.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" }).catch(() => {});

async function shot(theme, path) {
  await page.emulateMedia({ colorScheme: theme === "dark" ? "dark" : "light" });
  // next-themes owns the .dark class; set its persisted theme before load.
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path });
  const mode = await page.evaluate(
    () => document.documentElement.className,
  );
  console.log("captured", path, "html.class:", mode);
}

await shot("light", "/tmp/smoke-home-light.png");
await shot("dark", "/tmp/smoke-home-dark.png");
await browser.close();
