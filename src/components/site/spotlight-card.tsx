"use client";

import { useRef, type ReactNode } from "react";

/**
 * A card that lights up under the cursor. No borders, no gimmicks:
 * a soft accent glow follows the pointer so large grids feel alive
 * without a single pixel of extra chrome.
 */
export function SpotlightCard({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      className={`group relative ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--sx, 50%) var(--sy, 50%), color-mix(in srgb, var(--pollen-accent) 7%, transparent), transparent 72%)",
        }}
      />
      {children}
    </div>
  );
}
