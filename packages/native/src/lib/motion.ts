import { Easing, type WithSpringConfig, type WithTimingConfig } from "react-native-reanimated";
import { easeOut, springGentle, springSnappy, springSoft } from "@pollen/tokens";

/**
 * Motion presets for the native primitives.
 *
 * @pollen/tokens defines the spring presets as plain
 * stiffness/damping/mass objects, which is exactly the shape
 * react-native-reanimated's SpringConfig takes. The typed aliases
 * below keep components consistent: they pass tokens, not ad-hoc
 * configs. The web library's ease-out cubic-bezier is carried over
 * through Easing.bezier for the few tweens that are not springs
 * (progress fills, skeleton pulse, check fade).
 */

/** Tight and quick - buttons, tabs, toggles, small controls. */
export const springSnappyConfig: WithSpringConfig = springSnappy;

/** Smooth, slightly bouncy - cards, reveals, layout shifts. */
export const springSoftConfig: WithSpringConfig = springSoft;

/** Slow and floaty - large surfaces, ambient motion. */
export const springGentleConfig: WithSpringConfig = springGentle;

/** The shared ease-out curve, built from the tokens' bezier. */
export const pollenEaseOut = Easing.bezier(
  easeOut[0],
  easeOut[1],
  easeOut[2],
  easeOut[3],
);

/** Tween config for the short non-spring transitions (150ms ease-out). */
export function fastTween(duration = 150): WithTimingConfig {
  return { duration, easing: pollenEaseOut };
}
