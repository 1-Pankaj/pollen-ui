"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "../../lib/utils";

export type ScramblePreset = "latin" | "hex" | "katakana" | "blocks" | "binary";

export interface ScrambleTextProps {
  /** Final text to decode into. */
  text: string;
  /** Characters used while scrambling. */
  charset?: string;
  /** Named character set; ignored when `charset` is set. */
  preset?: ScramblePreset;
  /** Milliseconds between scramble frames. Lower = faster. */
  speed?: number;
  /** Milliseconds to wait before decoding starts. */
  revealDelay?: number;
  /** What starts the effect. */
  trigger?: "mount" | "view" | "hover";
  /** Re-decode forever, pausing `loop` ms at the settled text. */
  loop?: number;
  /** Shuffle the real characters of the text instead of foreign glyphs. */
  useRealChars?: boolean;
  /** Called once the full text is revealed. */
  onScrambleComplete?: () => void;
  className?: string;
}

const PRESETS: Record<ScramblePreset, string> = {
  latin: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789ABCDEF",
  katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノ",
  blocks: "░▒▓█▄▀▌▐■□",
  binary: "01",
};

/**
 * ScrambleText - decode effect.
 *
 * Characters resolve left to right while the not-yet-decided tail
 * keeps cycling through a character set (five presets or your own
 * glyphs, or `useRealChars` to shuffle the text's own letters).
 * Runs on a rAF loop that pauses automatically when the tab is
 * hidden. With trigger="view" it decodes once as you arrive and
 * replays on hover; `loop` re-decodes forever; reduced motion
 * skips straight to the final text. An invisible sizer holds the
 * final width, so nothing reflows mid-scramble.
 *
 * @example
 * <ScrambleText text="Spring physics inside" trigger="view" />
 * <ScrambleText text="0x5F3759DF" preset="hex" loop={4000} />
 */
export function ScrambleText({
  text,
  charset,
  preset = "latin",
  speed = 32,
  revealDelay = 0,
  trigger = "view",
  loop,
  useRealChars = false,
  onScrambleComplete,
  className,
}: ScrambleTextProps) {
  const glyphs = charset ?? PRESETS[preset];
  const [output, setOutput] = useState(
    () => text.replace(/\S/g, "\u00a0"), // blank until started, keeps layout
  );
  const raf = useRef<number | null>(null);
  const running = useRef(false);
  const decoded = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const run = useCallback(() => {
    if (running.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Skip straight to the truth, no glyphs left behind.
      setOutput(text);
      decoded.current = true;
      onScrambleComplete?.();
      return;
    }
    running.current = true;

    let tick = 0;
    const ticksPerChar = Math.max(1, Math.round(46 / speed));
    const startAt = performance.now() + revealDelay;

    const step = (now: number) => {
      if (document.hidden) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      if (now < startAt) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      const revealed = Math.floor(tick / ticksPerChar);
      if (revealed >= text.length) {
        raf.current = null;
        running.current = false;
        decoded.current = true;
        setOutput(text);
        onScrambleComplete?.();
        return;
      }
      let next = text.slice(0, revealed);
      for (let i = revealed; i < text.length; i++) {
        if (text[i] === " ") {
          next += " ";
        } else if (i < revealed + 3) {
          if (useRealChars && text[i] !== " ") {
            next += text[(Math.random() * text.length) | 0] ?? glyphs[0];
          } else {
            next += glyphs[(Math.random() * glyphs.length) | 0];
          }
        } else {
          next += "\u00a0";
        }
      }
      setOutput(next);
      tick++;
      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
  }, [text, glyphs, speed, revealDelay, onScrambleComplete, useRealChars]);

  useEffect(() => {
    // rAF keeps the reduced-motion shortcut inside run() out of the
    // effect body: setOutput fires from the animation callback, not
    // synchronously during the effect.
    if (trigger === "mount") raf.current = requestAnimationFrame(() => run());
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      running.current = false;
    };
  }, [run, trigger]);

  useEffect(() => {
    if (trigger === "view" && inView) raf.current = requestAnimationFrame(() => run());
  }, [inView, run, trigger]);

  /* Forever mode: re-decode on a fixed cadence once settled. */
  useEffect(() => {
    if (!loop || trigger === "hover") return;
    const id = setInterval(() => {
      if (!running.current && !document.hidden) run();
    }, loop);
    return () => clearInterval(id);
  }, [loop, run, trigger]);

  /* "view" decodes as you arrive, then every hover replays it. */
  const replay = () => {
    if (trigger === "hover" || (trigger === "view" && decoded.current)) run();
  };

  return (
    <span
      ref={ref}
      className={cn("relative inline-block whitespace-pre", className)}
      onMouseEnter={trigger === "mount" ? undefined : replay}
    >
      <span className="sr-only">{text}</span>
      {/* Invisible sizer reserves the final text width so the
          scramble never pushes surrounding layout around. */}
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0">
        {output}
      </span>
    </span>
  );
}

ScrambleText.displayName = "ScrambleText";
