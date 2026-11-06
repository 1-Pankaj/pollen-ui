// Capture a docs page at desktop or mobile size, light or dark.
// Usage: node scripts/smoke-page.mjs <path> <light|dark> [mobile|android]
// Writes /tmp/smoke-page.png; open it with the Read tool for review.
import { chromium } from "playwright";

const target = process.argv[2] ?? "/";
const theme = process.argv[3] === "dark" ? "dark" : "light";
const device = process.argv[4];

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }, // iOS class
  android: { width: 360, height: 800, isMobile: true, hasTouch: true }, // Android class
};
const vp = viewports[device ?? "desktop"] ?? viewports.desktop;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: vp.width, height: vp.height },
  isMobile: vp.isMobile ?? false,
  hasTouch: vp.hasTouch ?? false,
  deviceScaleFactor: 2,
  userAgent:
    device === "mobile"
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : device === "android"
        ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        : undefined,
});
const page = await context.newPage();
await page.addInitScript((t) => {
  try {
    window.localStorage.setItem("theme", t);
  } catch {}
}, theme);
await page.goto("http://localhost:3000" + target, {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(2200);

// Report horizontal overflow, the #1 phone failure.
const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  overflowers: [...document.querySelectorAll("body *")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > document.documentElement.clientWidth + 1 && r.width > 8;
    })
    .slice(0, 5)
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
}));
const overflowLabel =
  overflow.scrollWidth > overflow.clientWidth
    ? `HORIZONTAL OVERFLOW ${overflow.scrollWidth} > ${overflow.clientWidth}; offenders: ${overflow.overflowers.join(" | ") || "(filtered)"}`
    : "none";
console.log(
  `overflow check ${target} [${theme}${device ? " " + device : ""}]:`,
  overflowLabel,
);

await page.screenshot({ path: "/tmp/smoke-page.png" });
console.log("captured /tmp/smoke-page.png");
await browser.close();
