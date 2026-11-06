import type { Transition } from "framer-motion";

/**
 * Shared motion vocabulary for the whole library.
 *
 * Every component animates with one of these presets (or accepts a
 * custom `transition` prop) so products built with Pollen feel
 * coherent out of the box.
 */

/** Smooth, slightly bouncy - cards, reveals, layout shifts. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.9,
};

/** Tight and quick - buttons, tabs, toggles, small controls. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
};

/** Slow and floaty - large surfaces, ambient motion. */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 70,
  damping: 16,
};

/** Signature cubic-bezier for non-spring tweens (opacity, blur, color). */
export const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export const tween = (duration = 0.5, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_OUT,
});
