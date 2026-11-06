import type { Transition, Variants } from "framer-motion";

/**
 * Motion presets shared across the library.
 *
 * Rules this library follows:
 * - Entrances and exits use ease-out. Nothing on screen should
 *   start slow.
 * - UI motion stays under 300ms. Springs are reserved for things
 *   that can be interrupted mid-flight (drag, toggle, stack).
 * - Popovers scale from their trigger edge, modals from center.
 * - Nothing animates from scale(0). 0.96 plus opacity reads as
 *   physical; 0 reads as synthetic.
 */

/** Energetic ease-out for entrances. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Smooth ease-out for movement that is already on screen. */
export const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/** Spring presets. Snappy is the default for interactive surfaces. */
export const spring = {
  snappy: { type: "spring", stiffness: 560, damping: 42, mass: 0.9 },
  soft: { type: "spring", stiffness: 320, damping: 32 },
  gentle: { type: "spring", duration: 0.5, bounce: 0.1 },
} satisfies Record<string, Transition>;

export type SpringName = keyof typeof spring;

/** Standard entrance used by reveals and mounted content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

/** Overlay entrance: scale 0.96 plus opacity, never from zero. */
export const overlayIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.12, ease: "easeOut" } },
};
