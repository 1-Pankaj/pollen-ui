"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * A phone-sized viewport with device chrome: dark bezel, Dynamic
 * Island, status bar and home indicator. The content area is a real
 * 375px-wide viewport - components render exactly as they would on a
 * phone, clipped and scrolling inside the screen, not stretched to
 * the pane. When the pane is narrower than the frame, the whole
 * device scales down instead of overflowing.
 */

const FRAME_W = 399; // 375 screen + 2 x 12 bezel
const FRAME_H = 780;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const update = () => {
      const avail = el.clientWidth;
      setScale(avail < FRAME_W ? Math.max(0.55, avail / FRAME_W) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={holderRef} className="flex w-full justify-center">
      <div
        style={{
          width: FRAME_W * scale,
          height: FRAME_H * scale,
        }}
        className="shrink-0"
      >
        <div
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="rounded-[54px] bg-[#0b0b0f] p-[12px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_2px_rgba(255,255,255,0.06)]"
          aria-label="Mobile preview"
          role="region"
        >
          {/* Screen */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-background">
            {/* Status bar */}
            <div className="relative z-10 flex h-[52px] shrink-0 items-center justify-between pl-8 pr-7 pt-[10px] text-foreground">
              <span className="w-14 text-[15px] font-semibold tracking-tight">
                9:41
              </span>
              <span className="flex items-center gap-1.5">
                {/* Cellular bars */}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="8" width="3" height="4" rx="0.8" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                  <rect x="10" y="3" width="3" height="9" rx="0.8" />
                  <rect x="15" y="0.5" width="3" height="11.5" rx="0.8" />
                </svg>
                {/* Wi-Fi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                  <path d="M8 9.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  <path d="M8 5.4c1.7 0 3.2.7 4.3 1.8l-1.4 1.4A4.1 4.1 0 0 0 8 7.4c-1.1 0-2.1.4-2.9 1.2L3.7 7.2A6.1 6.1 0 0 1 8 5.4Z" />
                  <path d="M8 1.2c2.8 0 5.4 1.1 7.3 3l-1.4 1.4A8.3 8.3 0 0 0 8 3.2c-2.3 0-4.4.9-5.9 2.4L.7 4.2a10.3 10.3 0 0 1 7.3-3Z" />
                </svg>
                {/* Battery */}
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
                  <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
                  <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
                </svg>
              </span>
              {/* Dynamic Island */}
              <span className="absolute left-1/2 top-[11px] h-[32px] w-[112px] -translate-x-1/2 rounded-full bg-black" />
            </div>

            {/* App viewport: the component renders here, phone-width */}
            <div className="slim-scroll flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </div>

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-10 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
