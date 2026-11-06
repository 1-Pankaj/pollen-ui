"use client";

/**
 * Accent persistence shared by the inline pre-paint script in the root
 * layout and the AccentPicker UI. All localStorage access is guarded:
 * private-mode Safari and blocked storage throw on access.
 */

export const ACCENT_STORAGE_KEY = "pollen-accent";

/** Fired on window after the saved accent changes in this tab. */
export const ACCENT_CHANGE_EVENT = "pollen-accent-change";

/** Reads the saved accent id ("" = Pollen Blue default). */
export function getSavedAccent(): string {
  try {
    return window.localStorage.getItem(ACCENT_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Writes <html data-accent> so every token retints at once. */
export function applyAccent(id: string): void {
  const root = document.documentElement;
  if (id) {
    root.setAttribute("data-accent", id);
  } else {
    root.removeAttribute("data-accent");
  }
}

/** Persists the accent, applies it, and notifies subscribers. */
export function saveAccent(id: string): void {
  try {
    window.localStorage.setItem(ACCENT_STORAGE_KEY, id);
  } catch {
    // Storage unavailable: still apply so the session reflects the choice.
  }
  applyAccent(id);
  window.dispatchEvent(new Event(ACCENT_CHANGE_EVENT));
}

/**
 * Subscribe to accent changes from this tab (custom event) and other
 * tabs (storage event). Companion to useSyncExternalStore.
 */
export function subscribeToAccent(onChange: () => void): () => void {
  window.addEventListener(ACCENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ACCENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
