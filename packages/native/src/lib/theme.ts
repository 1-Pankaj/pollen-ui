import { useColorScheme } from "react-native";
import { dark, light, type PollenTheme } from "@pollen/tokens";

/**
 * Theme resolution for the native primitives.
 *
 * Every component calls this hook and reads colors, shadows and
 * spacing from the returned PollenTheme, so light and dark mode
 * follow the OS setting exactly like the web library follows
 * `prefers-color-scheme`. The tokens carry both themes as plain
 * data; nothing here is platform specific.
 */
export function usePollenTheme(): PollenTheme {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}

/**
 * The web stylesheet paints ink directly over accent and colored
 * fills with a literal white (`text-white` on the accent button,
 * the badge counter, the switch thumb, the checkbox check) and the
 * token file has no contrast-ink token. This is that one color,
 * kept in a single place instead of being scattered through the
 * components.
 */
export const white = "#ffffff";

/**
 * Blend alpha into a token color. Badge and field states on the web
 * use Tailwind opacity modifiers (`bg-accent/10`); on native the
 * same effect is an rgba() string. Handles the hex forms the tokens
 * ship (#rgb, #rrggbb, #rrggbbaa); anything else is returned
 * unchanged so a future rgba token still renders.
 */
export function withAlpha(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;
  const hex = color.slice(1);
  if (hex.length !== 3 && hex.length !== 6 && hex.length !== 8) return color;

  let r = 0;
  let g = 0;
  let b = 0;
  if (hex.length === 3) {
    r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
    g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
    b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return color;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
