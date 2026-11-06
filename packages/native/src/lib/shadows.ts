import type { PollenShadows } from "@pollen/tokens";

/**
 * Mapping the token shadows to React Native.
 *
 * @pollen/tokens stores shadows as CSS box-shadow strings, the same
 * strings the web stylesheet uses. React Native cannot read those:
 * iOS wants shadowColor/shadowOffset/shadowOpacity/shadowRadius and
 * Android only exposes a single elevation number. This module parses
 * the token strings once and maps them, so the shadow vocabulary
 * stays the tokens instead of a second set of hard-coded values.
 *
 * The CSS model allows several layers per shadow; iOS supports one.
 * The mapping picks the non-inset layer with the widest blur (the
 * ambient layer, which is what gives a shadow its depth) and uses it
 * as the single iOS shadow. Inset highlights, which the dark theme
 * uses for edge lighting, have no native equivalent and are dropped.
 * Android elevation is a coarse approximation derived from the blur
 * radius; it preserves the ordering xs < sm < md < lg but cannot
 * reproduce the exact geometry.
 */

export type ShadowDepth = keyof PollenShadows;

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

interface ShadowLayer {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** r, g, b channels 0-255 and alpha 0-1. */
  color: { r: number; g: number; b: number; a: number };
}

const fallback: ShadowStyle = {
  shadowColor: "rgb(0, 0, 0)",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 1,
};

/** Split on top-level commas only; rgba(...) commas are inside parens. */
function splitLayers(css: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css.charAt(i);
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      parts.push(css.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(css.slice(start).trim());
  return parts.filter((p) => p.length > 0);
}

const px = (value: string | undefined): number => {
  if (value === undefined) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

function parseLayer(layer: string): ShadowLayer | null {
  const openParen = layer.indexOf("(");
  let geometry = layer;
  let colorToken = "";
  if (openParen > -1) {
    // Color function form: the token starting at the function name
    // is the color; geometry is whatever comes before it.
    const nameStart = layer.lastIndexOf(" ", openParen);
    colorToken = layer.slice(nameStart + 1).trim();
    geometry = layer.slice(0, Math.max(nameStart, 0)).trim();
  } else {
    // Space separated with the color as the last token (hex form).
    const lastSpace = layer.lastIndexOf(" ");
    if (lastSpace === -1) return null;
    colorToken = layer.slice(lastSpace + 1).trim();
    geometry = layer.slice(0, lastSpace).trim();
  }

  const parts = geometry.split(/\s+/);
  const inset = parts[0] === "inset";
  const coords = inset ? parts.slice(1) : parts;
  if (coords.length < 2) return null;

  const color = parseColor(colorToken);
  if (!color) return null;

  return {
    inset,
    x: px(coords[0]),
    y: px(coords[1]),
    blur: px(coords[2]),
    spread: px(coords[3]),
    color,
  };
}

function parseColor(token: string): ShadowLayer["color"] | null {
  const fn = /^rgba?\(([^)]+)\)$/i.exec(token);
  if (fn && fn[1]) {
    const channels = fn[1].split(",").map((c) => Number.parseFloat(c.trim()));
    if (channels.length < 3) return null;
    const [r, g, b] = channels;
    if (r === undefined || g === undefined || b === undefined) return null;
    const a = channels[3] ?? 1;
    return { r, g, b, a };
  }
  if (token.startsWith("#")) {
    const hex = token.slice(1);
    if (hex.length !== 6 && hex.length !== 8) return null;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
    if ([r, g, b].some((c) => Number.isNaN(c))) return null;
    return { r, g, b, a };
  }
  return null;
}

const cache = new Map<string, ShadowStyle>();

/**
 * Map one token shadow string to the React Native shadow props.
 * Results are cached; the token strings are static, so each string
 * is parsed at most once per app run.
 */
export function mapShadowString(css: string): ShadowStyle {
  const cached = cache.get(css);
  if (cached) return cached;

  const layers = splitLayers(css)
    .map(parseLayer)
    .filter((l): l is ShadowLayer => l !== null && !l.inset);
  if (layers.length === 0) return fallback;

  // The ambient layer: widest blur wins, later layers break ties.
  let chosen: ShadowLayer | undefined;
  for (const layer of layers) {
    if (chosen === undefined || layer.blur >= chosen.blur) chosen = layer;
  }
  if (!chosen) return fallback;

  // Android elevation: monotonic in blur + spread, clamped to the
  // range Android renders sensibly for a card-sized surface.
  const elevation = Math.min(
    24,
    Math.max(1, Math.round((chosen.blur + Math.max(chosen.spread, 0)) / 6)),
  );

  const style: ShadowStyle = {
    shadowColor: `rgb(${Math.round(chosen.color.r)}, ${Math.round(chosen.color.g)}, ${Math.round(chosen.color.b)})`,
    shadowOffset: { width: chosen.x, height: chosen.y },
    shadowOpacity: chosen.color.a,
    shadowRadius: chosen.blur,
    elevation,
  };
  cache.set(css, style);
  return style;
}

/** Map a shadow depth from a PollenTheme to the native shadow props. */
export function mapShadow(
  shadows: PollenShadows,
  depth: ShadowDepth,
): ShadowStyle {
  return mapShadowString(shadows[depth]);
}
