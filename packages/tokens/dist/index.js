// src/index.ts
var light = {
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
    codeMuted: "#8b949e"
  },
  shadows: {
    xs: "0 1px 2px rgba(18, 18, 26, 0.06)",
    sm: "0 1px 2px rgba(18, 18, 26, 0.04), 0 2px 8px rgba(18, 18, 26, 0.05)",
    md: "0 2px 4px rgba(18, 18, 26, 0.04), 0 10px 28px -6px rgba(18, 18, 26, 0.1)",
    lg: "0 4px 12px rgba(18, 18, 26, 0.06), 0 28px 68px -12px rgba(18, 18, 26, 0.2)"
  }
};
var dark = {
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
    codeMuted: "#8b949e"
  },
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.5)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    md: "0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    lg: "0 16px 56px -8px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
  }
};
var radius = {
  fieldSm: 9,
  fieldMd: 10,
  fieldLg: 11,
  control: 12,
  panel: 16,
  full: 9999
};
var spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
};
var fontSize = {
  caption: 12.5,
  label: 13,
  small: 14,
  body: 15
};
var springSoft = { stiffness: 120, damping: 20, mass: 0.9 };
var springSnappy = { stiffness: 400, damping: 32 };
var springGentle = { stiffness: 70, damping: 16 };
var easeOut = [0.21, 0.47, 0.32, 0.98];
var durations = { fast: 0.15, entrance: 0.3 };
var pollen = {
  light,
  dark,
  radius,
  spacing,
  fontSize,
  springSoft,
  springSnappy,
  springGentle,
  easeOut,
  durations
};
var index_default = pollen;

export { dark, index_default as default, durations, easeOut, fontSize, light, pollen, radius, spacing, springGentle, springSnappy, springSoft };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map