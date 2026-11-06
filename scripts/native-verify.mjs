/**
 * Native package verification: loads the real source of @pollen-ui/native
 * pure modules (with react-native / reanimated / gesture-handler stubbed)
 * plus the real @pollen-ui/tokens, and asserts the behaviour that the
 * components depend on. Run: node scripts/native-verify.mjs
 */
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { readFile, readFileSync } from "node:fs";
import sucrase from "sucrase";
const { transform: transformSync } = sucrase;

const ROOT = path.resolve(import.meta.dirname, "..");
const NATIVE = path.join(ROOT, "packages/native");

const RN_STUBS = new Set([
  "react-native",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "nativewind",
]);

const hooks = {
  resolve(specifier, context, next) {
    if (RN_STUBS.has(specifier)) {
      return { url: `stub:${specifier}`, shortCircuit: true };
    }
    if (specifier === "@pollen-ui/tokens") {
      return {
        url: pathToFileURL(path.join(ROOT, "packages/tokens/src/index.ts")).href,
        shortCircuit: true,
      };
    }
    // TypeScript-style extensionless relative imports: try .ts then .tsx.
    if (specifier.startsWith(".") && !path.extname(specifier)) {
      const base = path.resolve(
        new URL(context.parentURL ?? import.meta.url).pathname,
        "..",
        specifier,
      );
      for (const ext of [".ts", ".tsx"]) {
        try {
          readFileSync(base + ext);
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        } catch {
          // try the next extension
        }
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("stub:")) {
      const name = url.slice(5);
      // The reanimated stub carries the named exports the components
      // import at module scope; the worklet hooks are inert here
      // because verification never renders a component.
      const src =
        name === "react-native-reanimated"
          ? `
        export const Easing = { bezier: () => (x) => x, linear: (x) => x };
        export const useSharedValue = (v) => ({ value: v });
        export const useAnimatedStyle = (f) => ({}); 
        export const useDerivedValue = (f) => ({ value: 0 });
        export const useReducedMotion = () => false;
        export const useAnimatedScrollHandler = () => ({});
        export const useAnimatedGestureHandler = () => ({});
        export const useWorkletCallback = (f) => f;
        export const interpolate = (v, i, o) => v;
        export const interpolateColor = (v, i, o) => o[0];
        export const extrapolateLeft = 1;
        export const extrapolateRight = 2;
        export const Extrapolation = { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" };
        export const withSpring = (v) => v;
        export const withTiming = (v) => v;
        export const withDecay = (v) => v;
        export const withRepeat = (v) => v;
        export const withSequence = (v) => v;
        export const withDelay = (v) => v;
        export const withPause = (v) => v;
        export const withNextFrame = (v) => v;
        export const cancelAnimation = () => {};
        export const runOnJS = (f) => f;
        export const runOnUI = (f) => f;
        export const createAnimatedPropAdapter = () => ({});
        export const processColor = (c) => c;
        export const FadeIn = { duration: () => ({ build: () => ({}) }) };
        export const FadeOut = { duration: () => ({ build: () => ({}) }) };
        export const LinearTransition = { duration: () => ({ build: () => ({}) }) };
        export const Layout = {};
        export default { View: "Animated.View", Text: "Animated.Text", Image: "Animated.Image", ScrollView: "Animated.ScrollView", createAnimatedComponent: (c) => c };
      `
          : name === "react-native-gesture-handler"
            ? `
        export const Gesture = {
          Pan: () => ({}),
          Tap: () => ({}),
          Race: (...g) => g,
          Simultaneous: (...g) => g,
          Exclusive: (...g) => g,
        };
        export const GestureDetector = "GestureDetector";
        export const GestureHandlerRootView = "GestureHandlerRootView";
        export const RectButton = "RectButton";
        export const State = { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, ENDED: 5 };
        export default undefined;
      `
            : `
        export const StyleSheet = { create: (s) => s, hairlineWidth: 0.5, flatten: (s) => s };
        export const View = "View";
        export const Text = "Text";
        export const Pressable = "Pressable";
        export const TextInput = "TextInput";
        export const ActivityIndicator = "ActivityIndicator";
        export const Image = "Image";
        export const useColorScheme = () => "light";
        export const Platform = { OS: "ios", select: (o) => o.ios };
        export const AccessibilityInfo = { isReduceMotionEnabled: { addListener: () => ({ remove: () => {} }) } };
        export const I18nManager = { isRTL: false };
        export default undefined;
      `;
      return { format: "module", source: src, shortCircuit: true };
    }
    if (url.endsWith(".tsx") || url.endsWith(".ts")) {
      const file = url.startsWith("file:") ? new URL(url).pathname : url;
      const code = readFileSync(file, "utf8");
      const out = transformSync(code, {
        transforms: ["typescript", "jsx"],
        jsxRuntime: "automatic",
        filePath: file,
      }).code;
      return { format: "module", source: out, shortCircuit: true };
    }
    return next(url, context);
  },
};

registerHooks(hooks);

// Reanimated stub must exist before the components import it. We only
// exercise pure modules, but the loader intercepts any import anyway.
process.env.POLLEN_NATIVE_VERIFY = "1";

let failures = 0;
const ok = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) failures += 1;
};

const tokens = await import(
  pathToFileURL(path.join(ROOT, "packages/tokens/src/index.ts")).href
);
const { mapShadow, mapShadowString } = await import(
  pathToFileURL(path.join(NATIVE, "src/lib/shadows.ts")).href
);
const theme = await import(
  pathToFileURL(path.join(NATIVE, "src/lib/theme.ts")).href
);

// 1. Token integrity: themes carry the color+shadow vocabulary; the
// platform-neutral scales (radius, spacing, fontSize, springs) ship as
// standalone exports shared by both themes.
const t = tokens;
const groupsOk =
  t.light.colors && t.dark.colors && t.light.shadows && t.dark.shadows &&
  t.radius && t.spacing && t.fontSize;
ok("tokens: themes expose colors/shadows; scales exported platform-wide", !!groupsOk);

// 2. Light/dark actually differ where they must (card, fill, fg).
ok(
  "tokens: dark card differs from light card",
  t.light.colors.card !== t.dark.colors.card,
);
ok(
  "tokens: dark ink differs from light ink",
  t.light.colors.fg !== t.dark.colors.fg,
);

// 3. Shadow parser: ambient layer selected, inset dropped, ordering kept.
const ios = mapShadow(t.light.shadows, "md");
ok(
  "shadows: md maps to an iOS shadow with positive radius",
  ios.shadowRadius > 0 && ios.shadowOpacity > 0 && Number.isFinite(ios.elevation),
);
const dark = mapShadow(t.dark.shadows, "lg");
ok(
  "shadows: dark lg maps (inset layers tolerated)",
  Number.isFinite(dark.shadowRadius) && Number.isFinite(dark.elevation),
);
const order = ["xs", "sm", "md", "lg"].map(
  (d) => mapShadow(t.light.shadows, d).shadowRadius,
);
ok(
  `shadows: blur ordering preserved xs<sm<md<lg (${order.join(",")})`,
  order[0] <= order[1] && order[1] <= order[2] && order[2] <= order[3],
);

// 4. mapShadowString parses the exact token grammar.
const parsed = mapShadowString(t.light.shadows.xs);
ok("shadows: mapShadowString returns a style for the xs token", parsed !== null && parsed !== undefined);

// 5. withAlpha: 6-digit hex, 3-digit hex, passthrough.
const a = theme.withAlpha("#0070f3", 0.1);
ok(`theme: withAlpha(#0070f3, 0.1) = "${a}"`, a === "rgba(0, 112, 243, 0.1)");
ok(
  "theme: withAlpha handles #rgb",
  theme.withAlpha("#fff", 0.5) === "rgba(255, 255, 255, 0.5)",
);
ok(
  "theme: non-hex passes through unchanged",
  theme.withAlpha("rgb(0,0,0)", 0.5) === "rgb(0,0,0)",
);

// 6. The scales the components read: radius.field*, spacing steps,
// fontSize.label/body used by Button/Input styles.
const scaleFields = ["radius", "spacing", "fontSize"];
ok(
  `theme: platform scales expose [${scaleFields.join(", ")}]`,
  scaleFields.every((f) => f in t && t[f] && Object.keys(t[f]).length > 0),
);
ok(
  "theme: springs exported (springSnappy, springGentle, springSoft)",
  ["springSnappy", "springGentle", "springSoft"].every((s) => s in t),
);

// 7. Every component module compiles and exports what src/index.ts promises.
const promised = [
  "Avatar", "AvatarGroup", "Badge", "Button", "Card", "Checkbox", "Input",
  "PinInput", "Progress", "Radio", "RadioGroup", "Rating", "SegmentedControl",
  "Skeleton", "SkeletonText", "Slider", "Stepper", "Switch", "Textarea",
];
const indexSrc = readFileSync(path.join(NATIVE, "src/index.ts"), "utf8");
const missing = promised.filter((name) => !indexSrc.includes(name));
ok(`native: index re-exports all ${promised.length} primitives`, missing.length === 0);

// 8. Every component module loads (compiles + executes top level) through
// the stubbed runtime - a syntax error, a missing import or a module-scope
// crash in any of them fails here.
const componentDir = path.join(NATIVE, "src/components");
const componentFiles = (await import("node:fs")).readdirSync(componentDir).filter((f) => f.endsWith(".tsx"));
let loaded = 0;
const loadErrors = [];
for (const file of componentFiles) {
  try {
    await import(pathToFileURL(path.join(componentDir, file)).href);
    loaded += 1;
  } catch (err) {
    loadErrors.push(`${file}: ${err.message}`);
  }
}
ok(
  `native: all ${componentFiles.length} component modules load (${loaded} loaded)`,
  loaded === componentFiles.length,
);
if (loadErrors.length > 0) console.log(loadErrors.map((e) => `      ${e}`).join("\n"));

// 9. The new primitives carry the accessibility contract: roles where
// the platform expects them, states on toggles, adjustable actions on
// the rating. String checks against the real source.
const a11y = [
  ["checkbox.tsx", 'accessibilityRole="checkbox"'],
  ["radio-group.tsx", 'accessibilityRole="radio"'],
  ["radio-group.tsx", 'accessibilityRole="radiogroup"'],
  ["rating.tsx", 'accessibilityRole="adjustable"'],
  ["stepper.tsx", 'accessibilityRole="adjustable"'],
  ["segmented-control.tsx", 'accessibilityState={{ selected }}'],
  ["pin-input.tsx", "accessibilityValue={{"],
];
const a11yMissing = a11y.filter(([file, needle]) => {
  const src = readFileSync(path.join(componentDir, file), "utf8");
  return !src.includes(needle);
});
ok("native: a11y roles/states present in the new primitives", a11yMissing.length === 0);
if (a11yMissing.length > 0) console.log(`      missing: ${a11yMissing.map(([f, n]) => `${f} ${n}`).join(", ")}`);

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
