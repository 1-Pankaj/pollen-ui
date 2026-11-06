"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * True once the component has hydrated on the client. Server render and
 * the hydration pass read the server snapshot (false), so locale- or
 * DOM-dependent output stays consistent and hydration mismatches cannot
 * occur. Same timing as the classic mounted-state gate, without
 * calling setState inside an effect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
