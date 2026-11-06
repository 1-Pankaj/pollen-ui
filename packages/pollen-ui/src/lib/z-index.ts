/**
 * The overlay z-index ladder.
 *
 * One vertical order for every floating surface in the library.
 * Components consume these constants as inline zIndex styles; the
 * numbers match the historical Tailwind classes so rendering is
 * unchanged:
 *
 *   0-30   in-component layering (sheens, thumbs, hover actions,
 *          tooltips, the emoji picker)
 *   40     ToastPile stack chrome (badge, dragged card)
 *   50     Modal and Drawer overlays and panels
 *   60     Portaled floating panels — Popover, DropdownMenu, Select
 *          and Combobox listboxes, Tooltip, ContextMenu (lib/floating.ts)
 *   70     Command palette (must paint above modals it may open from)
 *   80     ScrollProgress (fixed top bar)
 *   90     Toaster region; individual cards run 100 - depth so the
 *          front card always wins inside the stack
 *   110    ToastPile fixed stage
 *
 * Rule of thumb: later rungs may cover earlier ones; nothing in a
 * lower rung may cover a higher one. Site chrome (header z-40)
 * stays under every package overlay.
 */

/** Modal and Drawer. */
export const Z_MODAL = 50;

/** Portaled floating panels (lib/floating.ts applies this). */
export const Z_FLOATING = 60;

/** Command palette. */
export const Z_COMMAND = 70;

/** ScrollProgress bar. */
export const Z_SCROLL_PROGRESS = 80;

/** Toaster fixed region. */
export const Z_TOASTER = 90;

/** Front-of-stack toast card; deeper cards decrement by depth. */
export const Z_TOAST_CARD_BASE = 100;

/** ToastPile fixed stage. */
export const Z_TOAST_PILE = 110;
