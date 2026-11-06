/**
 * @pollen/tokens — the Pollen design language as plain data.
 *
 * One vocabulary shared by the web library (pollen-ui) and the React
 * Native sibling (@pollen/native). There are no runtime dependencies
 * and no platform imports: every value is a string or a number, so the
 * same module runs in a browser, in Node, and inside a React Native
 * bundle.
 *
 * The web stylesheet packages/pollen-ui/src/css/pollen.css is the
 * visual source of truth. The values below mirror it, and
 * scripts/check-tokens-sync.mjs fails when the two drift apart.
 *
 * Shadows are CSS box-shadow strings. React Native cannot read those
 * directly; @pollen/native maps the depths to shadowColor/shadowOffset/
 * shadowOpacity/elevation in one place (src/lib/shadows.ts).
 */

/** Every color a surface can be painted with, in one theme. */
export interface PollenColors {
  /** Page background behind everything. */
  bg: string;
  /** Elevated card surface. */
  card: string;
  /** Quiet fill for inputs, hover states, tracks. */
  fill: string;
  /** One step louder than fill, for hover on filled surfaces. */
  fillStrong: string;
  /** Primary ink. */
  fg: string;
  /** Secondary ink for descriptions. */
  fgMuted: string;
  /** Faintest ink, for placeholders and watermarks. */
  fgFaint: string;
  /** Hairline separators, 7 percent ink. */
  separator: string;
  /** Border token, kept for custom themes that want outlines. */
  border: string;
  /** Louder border token for hoverable outlines. */
  borderStrong: string;
  /** The one accent, used like punctuation. */
  accent: string;
  success: string;
  successInk: string;
  warning: string;
  warningInk: string;
  danger: string;
  dangerInk: string;
  /** Code surfaces stay dark in both themes. */
  codeBg: string;
  codeFg: string;
  codeMuted: string;
}

/** Elevation depths. One tight contact layer, one wide depth layer. */
export interface PollenShadows {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface PollenTheme {
  colors: PollenColors;
  shadows: PollenShadows;
}

export const light: PollenTheme = {
  colors: {
    bg: "#f7f7f8",
    card: "#ffffff",
    fill: "#f0f0f2",
    fillStrong: "#e8e8eb",
    fg: "#17171a",
    fgMuted: "#61616c",
    fgFaint: "#8d8d98",
    separator: "rgba(20, 20, 30, 0.07)",
    border: "#eaeaea",
    borderStrong: "#d4d4d4",
    accent: "#0070f3",
    success: "#29a383",
    successInk: "#157f56",
    warning: "#f5a623",
    warningInk: "#b45309",
    danger: "#e5484d",
    dangerInk: "#d3252b",
    codeBg: "#16161a",
    codeFg: "#e6edf3",
    codeMuted: "#8b949e",
  },
  shadows: {
    xs: "0 1px 2px rgba(18, 18, 26, 0.06)",
    sm: "0 1px 2px rgba(18, 18, 26, 0.04), 0 2px 8px rgba(18, 18, 26, 0.05)",
    md: "0 2px 4px rgba(18, 18, 26, 0.04), 0 10px 28px -6px rgba(18, 18, 26, 0.1)",
    lg: "0 4px 12px rgba(18, 18, 26, 0.06), 0 28px 68px -12px rgba(18, 18, 26, 0.2)",
  },
};

export const dark: PollenTheme = {
  colors: {
    bg: "#0a0a0c",
    card: "#161619",
    fill: "#1f1f24",
    fillStrong: "#2a2a30",
    fg: "#f4f4f6",
    fgMuted: "#a4a4b0",
    fgFaint: "#70707c",
    separator: "rgba(255, 255, 255, 0.07)",
    border: "#262626",
    borderStrong: "#343434",
    accent: "#3291ff",
    success: "#3dd68c",
    successInk: "#3dd68c",
    warning: "#ffc163",
    warningInk: "#ffc163",
    danger: "#ff6369",
    dangerInk: "#ff6369",
    codeBg: "#101014",
    codeFg: "#e6edf3",
    codeMuted: "#8b949e",
  },
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.5)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    md: "0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    lg: "0 16px 56px -8px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  },
};

/**
 * Corner radii, in pixels, matching the values the web components use:
 * 9/10/11 are the three field sizes, 12 is the command-icon radius,
 * 16 is the panel radius.
 */
export const radius = {
  fieldSm: 9,
  fieldMd: 10,
  fieldLg: 11,
  control: 12,
  panel: 16,
  full: 9999,
} as const;

/**
 * The spacing step used across the components, in pixels.
 * Tailwind's 4px grid.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/**
 * Type sizes the field and display components use, in pixels:
 * captions (helper lines), labels, small controls, and body text.
 */
export const fontSize = {
  caption: 12.5,
  label: 13,
  small: 14,
  body: 15,
} as const;

/**
 * Motion presets. Springs are plain stiffness/damping/mass objects:
 * framer-motion accepts them as Transition, react-native-reanimated
 * accepts them as SpringConfig. Entrances are ease-out and never
 * longer than max.
 */
export const springSoft = { stiffness: 120, damping: 20, mass: 0.9 };
export const springSnappy = { stiffness: 400, damping: 32 };
export const springGentle = { stiffness: 70, damping: 16 };
export const easeOut = [0.21, 0.47, 0.32, 0.98] as const;
export const durations = { fast: 0.15, entrance: 0.3 } as const;

/** Every token under one object for quick passthrough. */
export const pollen = {
  light,
  dark,
  radius,
  spacing,
  fontSize,
  springSoft,
  springSnappy,
  springGentle,
  easeOut,
  durations,
} as const;
