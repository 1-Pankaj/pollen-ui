"use client";

import { CompareSlider } from "pollen-ui";

/**
 * The before layer is the same portrait desaturated and dimmed, so
 * the divider's reveal is the edit itself - the classic retouch
 * comparison, running entirely on bundled assets.
 */
export function CompareSliderDemo() {
  return (
    <CompareSlider
      className="h-[280px] w-full max-w-[420px] rounded-2xl ring-1 ring-[var(--pollen-border)]"
      before={
        <img
          src="/avatars/grace.jpg"
          alt="Before: the portrait in grayscale"
          className="h-full w-full object-cover grayscale brightness-90"
          draggable={false}
        />
      }
      after={
        <img
          src="/avatars/grace.jpg"
          alt="After: the portrait in full color"
          className="h-full w-full object-cover"
          draggable={false}
        />
      }
    />
  );
}

/**
 * Hover mode: the divider follows the mouse with no press, so the
 * comparison scans fast. Touch still drags, and the grip stays a
 * keyboard slider either way.
 */
export function CompareSliderHoverDemo() {
  return (
    <CompareSlider
      mode="hover"
      defaultValue={35}
      className="h-[240px] w-full max-w-[420px] rounded-2xl ring-1 ring-[var(--pollen-border)]"
      before={
        <div className="flex h-full w-full flex-col gap-2.5 bg-card p-5">
          <div className="h-3 w-24 rounded bg-fill" />
          <div className="h-3 w-40 rounded bg-fill" />
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            <div className="h-16 rounded-xl bg-fill" />
            <div className="h-16 rounded-xl bg-fill" />
            <div className="h-16 rounded-xl bg-fill" />
          </div>
          <div className="h-8 w-32 rounded-[10px] bg-fill-strong" />
        </div>
      }
      after={
        <div className="flex h-full w-full flex-col gap-2.5 bg-card p-5">
          <div className="h-3 w-24 rounded bg-accent/25" />
          <div className="h-3 w-40 rounded bg-fill-strong" />
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            <div className="h-16 rounded-xl bg-accent/10 ring-1 ring-accent/30" />
            <div className="h-16 rounded-xl bg-fill" />
            <div className="h-16 rounded-xl bg-accent/10 ring-1 ring-accent/30" />
          </div>
          <div className="h-8 w-32 rounded-[10px] bg-accent" />
        </div>
      }
      ariaLabel="Divider between the flat wireframe and the themed card"
    />
  );
}
